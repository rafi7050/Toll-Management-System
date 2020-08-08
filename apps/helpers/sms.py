#
# def send_otp_sms(recipient, otp, message_type='TEXT', request_type='SINGLE_SMS'):
#     url = settings.SMS_API_DOMAIN_URL + '/api/v1/secure/send-sms'
#     message = sms_template.get('otp').format(otp_token=otp)
#     params = {
#         'api_key': settings.SMS_API_KEY,
#         'api_secret': settings.SMS_API_SECRET,
#         'request_type': request_type,
#         'message_type': message_type,
#         'mobile': recipient,
#         'message_body': message
#     }
#     response = requests.post(url=url, data=params)
#     return response.json()
#
#
# def send_single_sms(recipient, message, message_type='TEXT', request_type='SINGLE_SMS'):
#     url = settings.SMS_API_DOMAIN_URL + '/api/v1/secure/send-sms'
#     params = {
#         'api_key': settings.SMS_API_KEY,
#         'api_secret': settings.SMS_API_SECRET,
#         'request_type': request_type,
#         'message_type': message_type,
#         'mobile': recipient,
#         'message_body': message
#     }
#     response = requests.post(url=url, data=params)
#     return response.json()