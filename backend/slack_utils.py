from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
import os

from sqlalchemy.orm import Session

from backend.models import User


slack_client = WebClient(token=os.getenv("SLACK_BOT_TOKEN"))


def fetch_slack_users():
    """
    Fetch all users in the Slack workspace.

    Returns:
        list: A list of Slack users.
    """
    try:
        response = slack_client.users_list()

        if response["ok"]:
            return response["members"]

        raise ValueError("Failed to fetch Slack users")

    except SlackApiError as e:
        print(f"Slack API error fetching users: {e.response['error']}")
        return []


def sync_slack_ids(db: Session):
    """
    Sync Slack user IDs with database users based on email address.

    Args:
        db (Session): The database session.
    """
    slack_users = fetch_slack_users()

    for slack_user in slack_users:
        profile = slack_user.get("profile", {})

        if slack_user.get("is_bot") or not profile.get("email"):
            continue

        slack_email = profile["email"].strip().lower()
        slack_id = slack_user["id"]

        db_user = (
            db.query(User)
            .filter(User.email.ilike(slack_email))
            .first()
        )

        if db_user and not db_user.slack_id:
            db_user.slack_id = slack_id
            db.add(db_user)

    db.commit()


def send_slack_dm(
    user_id: str,
    lead_name: str,
    lead_email: str,
    lead_source: str,
    lead_id: int,
):
    """
    Send a direct message to a Slack user when a lead is assigned.
    """
    message = (
        f"🚨 *New Lead Assigned*\n\n"
        f"👤 *Name:* {lead_name}\n"
        f"📧 *Email:* {lead_email}\n"
        f"🌐 *Source:* {lead_source or 'N/A'}\n\n"
        f"👉 *Next step:* Contact this lead ASAP\n"
        f"🔗 *View lead:* http://localhost:5173/leads/{lead_id}"
    )

    try:
        slack_client.chat_postMessage(
            channel=user_id,
            text=message,
        )

    except SlackApiError as e:
        print(f"Slack API error sending message: {e.response['error']}")
        raise