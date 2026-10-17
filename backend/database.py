
import os
from urllib.parse import parse_qsl, unquote, urlsplit

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is missing from the .env file")

parsed_database_url = urlsplit(DATABASE_URL)
database_url = URL.create(
    drivername=parsed_database_url.scheme,
    username=unquote(parsed_database_url.username) if parsed_database_url.username else None,
    password=unquote(parsed_database_url.password) if parsed_database_url.password else None,
    host=parsed_database_url.hostname,
    port=parsed_database_url.port,
    database=unquote(parsed_database_url.path.lstrip('/')) or None,
    query=dict(parse_qsl(parsed_database_url.query)),
)

engine = create_engine(
    database_url,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()
