from django.shortcuts import render


def handler403(request, *args, **kwargs):
    return render(request, '403.html', status=404)


def handler404(request, *args, **kwargs):
    return render(request, '404.html', status=404)


def handler500(request, *args, **kwargs):
    return render(request, '500.html', status=500)


from django.conf import settings
from django.http import JsonResponse, HttpResponse
import json


def pusher_authentication(request):
    channel = request.GET.get('channel_name', None)
    socket_id = request.GET.get('socket_id', None)
    auth = settings.PUSHER_CLIENT.authenticate(
        channel=channel,
        socket_id=socket_id
    )
    return JsonResponse(json.dumps(auth), safe=False)


# from multiprocessing import Pool
#
#
# def square(number):
#     return number * number


# def my_view_multiprocess(request):
#     pool = Pool(50)
#     numbers = [1, 3, 5]
#     results = pool.map(square, numbers)
#     return HttpResponse(results)
