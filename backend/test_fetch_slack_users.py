import sys
import os

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from slack_utils import fetch_slack_users

def test_fetch_slack_users():
    """
    Test the fetch_slack_users function to ensure it retrieves users correctly.
    """
    slack_users = fetch_slack_users()

    # Print the fetched users for inspection
    print("Fetched Slack Users:")
    for user in slack_users:
        email = user.get("profile", {}).get("email", "N/A")
        slack_id = user.get("id", "N/A")
        print(f"Email: {email}, Slack ID: {slack_id}")

if __name__ == "__main__":
    test_fetch_slack_users()