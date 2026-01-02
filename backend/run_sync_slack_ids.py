
from backend.slack_utils import sync_slack_ids
from backend.database import SessionLocal
from sqlalchemy import text
import os

if not os.getenv("SLACK_BOT_TOKEN"):
    raise EnvironmentError("SLACK_BOT_TOKEN environment variable is not set!")
# Create a database session
db = SessionLocal()

print("Starting Slack ID sync...")
sync_slack_ids(db)
print("Slack IDs synced successfully!")

# Verify the Slack ID for user ID 7
user = db.execute(text("SELECT id, email, slack_id FROM users WHERE id = 7")).fetchone()
if user:
    print(f"User ID: {user.id}, Email: {user.email}, Slack ID: {user.slack_id}")
else:
    print("User ID 7 not found.")