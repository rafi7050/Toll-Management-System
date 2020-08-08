from django.shortcuts import render


def send_otp_email(request,recipient, otp):
    from django.core.mail import send_mail
    from django.template.loader import render_to_string

    msg_html = render_to_string('email/otp.html', {'some_params': 'hello'})

    # send_mail(
    #     'email title',
    #     'Hello',
    #     'info@bankcomparebd.com',
    #     ['hrussell310@gmail.com'],
    #     html_message=msg_html,
    # )
    return render(request, 'email/otp.html', {})


from django.core.mail import send_mail

send_mail(
    'Subject here',
    'Here is the message.',
    'from@example.com',
    ['to@example.com'],
    fail_silently=False,
)
# class ContactApiView(APIView):
#     authentication_classes = ()
#     permission_classes = ()
#
#     def post(self, request, format=None):
#         name = request.data.get('name')
#         email = request.data.get('email')
#         receiver = request.data.get('receiver')
#         subject = request.data.get('subject')
#         message = request.data.get('message')
#         success = send_mail(
#             subject,
#             message+'\nThanks\n'+name+'\n'+email,
#             email,
#             [receiver],
#         )
#         return Response(success)