import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "NorthStar Ops — ApproveFlow AI"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./northstar.db")
    N8N_DISPATCH_WEBHOOK_URL: str = os.getenv(
        "N8N_DISPATCH_WEBHOOK_URL",
        "https://nur527.app.n8n.cloud/webhook-test/northstar-approve-send",
    ).strip()


settings = Settings()