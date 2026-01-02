from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
import os
from sqlalchemy.orm import Session
from backend.models import User

slack_client = WebClient(token="xoxb-10205113633895-10233504596209-ePDmhuNhhy0aUHogfhUCHVrG")

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
        else:
            raise ValueError("Failed to fetch Slack users")
    except SlackApiError as e:
        print(f"Error fetching Slack users: {e.response['error']}")
        return []


def sync_slack_ids(db: Session):
    """
    Sync Slack User IDs with the database users based on email.

    Args:
        db (Session): The database session.
    """
    slack_users = fetch_slack_users()
    # Log all Slack users fetched
    print("Fetched Slack users:")
    for slack_user in slack_users:
        email = slack_user.get("profile", {}).get("email", "N/A")
        slack_id = slack_user.get("id", "N/A")
        print(f"Slack user: email={email}, id={slack_id}")

    for slack_user in slack_users:
        # Skip bots and deactivated users
        if slack_user.get("is_bot") or not slack_user.get("profile", {}).get("email"):
            continue

        slack_email = slack_user["profile"]["email"].strip().lower()
        slack_id = slack_user["id"]

        # Log the Slack user being processed
        print(f"Processing Slack user: email={slack_email}, id={slack_id}")

        # Find the user in the database by normalized email
        db_user = db.query(User).filter(User.email.ilike(slack_email)).first()
        if db_user:
            print(f"Found matching database user: email={db_user.email}, current_slack_id={db_user.slack_id}")
        else:
            print(f"No matching database user found for email: {slack_email}")

        if db_user and not db_user.slack_id:
            # Update the slack_id field
            db_user.slack_id = slack_id
            db.add(db_user)
            print(f"Updated Slack ID for user {db_user.email}")
        elif db_user and db_user.slack_id:
            print(f"Slack ID already set for user {db_user.email}: {db_user.slack_id}")

        # Add specific debugging for jaydenwoffenden57@gmail.com
        if slack_email == "jaydenwoffenden57@gmail.com":
            print("Debugging: Processing jaydenwoffenden57@gmail.com")
            db_user = db.query(User).filter(User.email == slack_email).first()
            if db_user:
                print(f"Debugging: Found database user for jaydenwoffenden57@gmail.com: {db_user}")
            else:
                print("Debugging: No database user found for jaydenwoffenden57@gmail.com")

    db.commit()

def send_slack_dm(user_id: str, lead_name: str, lead_email: str, lead_source: str, lead_id: int):
    """
    Sends a direct message to a Slack user about a new lead assignment.

    Args:
        user_id (str): The Slack User ID of the recipient.
        lead_name (str): The name of the lead.
        lead_email (str): The email of the lead.
        lead_source (str): The source of the lead.
        lead_id (int): The ID of the lead.
    """
    try:
        print(f"Preparing to send Slack DM to user_id: {user_id}")
        message = (
            f"🚨 *New Lead Assigned*\n\n"
            f"👤 *Name:* {lead_name}\n"
            f"📧 *Email:* {lead_email}\n"
            f"🌐 *Source:* {lead_source or 'N/A'}\n\n"
            f"👉 *Next step:* Contact this lead ASAP\n"
            f"🔗 *View lead:* https://your-dashboard-url/leads/{lead_id}"
        )
        response = slack_client.chat_postMessage(channel=user_id, text=message)
        print(f"Message sent successfully to {user_id}: {response['message']['text']}")
    except SlackApiError as e:
        print(f"Slack API error sending message: {e.response['error']}")
        print(f"Full error response: {e.response}")
        raise
    except SlackApiError as e:
        print(f"Error sending message: {e.response['error']}")