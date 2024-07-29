import os
from twilio.rest import Client
from your_database_module import update_employee_status, get_employee_details  # Replace with your actual module

# Set up Twilio client
account_sid = os.environ['AC986bb24dde9c1eaaf6d6bb7923240348']
auth_token = os.environ['332e52aa7fd0aed3e79242c24b468dc8']
whatsapp_service_sid = os.environ['WHATSAPP_SERVICE_SID']
client = Client(account_sid, auth_token)

def check_whatsapp_availability(phone_number):
    try:
        # Check if the number is registered on WhatsApp (using Twilio Lookup API)
        response = client.lookups.phone_numbers(phone_number).fetch(type=['carrier'])
        return response.carrier['type'] == 'mobile'
    except Exception as e:
        print(f"Error checking WhatsApp availability: {e}")
        return False

def send_whatsapp_message(phone_number, message):
    try:
        message = client.messages.create(
            body=message,
            from_='whatsapp:+14155238886',  # Your Twilio WhatsApp number
            to=f'whatsapp:{phone_number}'
        )
        return message.sid
    except Exception as e:
        print(f"Error sending WhatsApp message: {e}")
        return None

def handle_employee_addition(employee_id):
    employee = get_employee_details(employee_id)
    phone_number = employee['phone_number']

    if check_whatsapp_availability(phone_number):
        message_content = f"Hello {employee['full_name']}, you have been added to the system."
        message_sid = send_whatsapp_message(phone_number, message_content)

        if message_sid:
            update_employee_status(employee_id, added=True)
            return True
    return False

# Example usage
if __name__ == "__main__":
    employee_id = 123  # Replace with actual employee ID
    if handle_employee_addition(employee_id):
        print("Employee added and notified successfully.")
    else:
        print("Failed to notify employee.")