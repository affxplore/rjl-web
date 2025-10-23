from fastapi import FastAPI, APIRouter
from motor.motor_asyncio import AsyncIOMotorClient
from starlette.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

import os
import logging
import uuid
from pathlib import Path
from datetime import datetime, timezone

from pydantic import BaseModel, Field, ConfigDict

# === Load environment variables ===
ROOT_DIR = Path(__file__).parent
load_dotenv(dotenv_path=ROOT_DIR / '.env')


# === MongoDB connection ===
mongo_url = os.getenv("MONGO_URL")
client = AsyncIOMotorClient(mongo_url)
db = client[os.getenv("DB_NAME")]


# === FastAPI app and router ===
app = FastAPI()
api_router = APIRouter(prefix="/api")


# === Models ===
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class ContactMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    message: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ContactMessageCreate(BaseModel):
    name: str
    email: str
    message: str


class Registration(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    fullName: str
    email: str
    phone: str
    classType: str
    preferredDate: str
    message: str = ""
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class RegistrationCreate(BaseModel):
    fullName: str
    email: str
    phone: str
    classType: str
    preferredDate: str
    message: str = ""


# === Routes ===
@api_router.get("/")
async def root():
    return {"message": "Hello World"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc["timestamp"] = doc["timestamp"].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=list[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]


@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(input: ContactMessageCreate):
    contact_dict = input.model_dump()
    contact_obj = ContactMessage(**contact_dict)
    await db.contact_messages.insert_one(contact_obj.model_dump())
    return contact_obj


@api_router.get("/contact", response_model=list[ContactMessage])
async def get_contact_messages():
    messages = await db.contact_messages.find().to_list(1000)
    return [ContactMessage(**message) for message in messages]


@api_router.post("/registrations", response_model=Registration)
async def create_registration(input: RegistrationCreate):
    registration_dict = input.model_dump()
    registration_obj = Registration(**registration_dict)
    await db.registrations.insert_one(registration_obj.model_dump())
    return registration_obj

@api_router.get("/registrations", response_model=list[Registration])
async def get_registrations():
    registrations = await db.registrations.find().to_list(1000)
    return [Registration(**registration) for registration in registrations]


# === Include router and middleware ===
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


# === Logging ===
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


# === Shutdown ===
@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

