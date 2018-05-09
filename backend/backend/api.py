import os
import json
import threading
from django.http import *
from . import settings


BASE_DIR = module_dir = os.path.dirname(__file__) + '/'


def validate_get_request(request, func, accept_params=None, args=None):
    """Check if method of request is GET and request params is legal

    Args:
         request: request data given by django
         func: function type, get request and return HTTP response
         accept_params: list type, acceptable parameter list

    Returns:
         HTTP response
    """
    if accept_params is None:
        accept_params = []
    if args is None:
        args = []
    if request.method != 'GET':
        return HttpResponseNotAllowed(['GET'])
    elif set(accept_params).issubset(set(request.GET)) or not request.GET:
        return func(request, *args)
    return HttpResponseBadRequest('parameter lost!')


def read_json_file(filepath):
    try:
        with open(filepath, encoding='utf-8') as fp:
            return json.load(fp)
    except EnvironmentError:
        return {'error' : 'File not found!'}


def get_trace(request):
    return validate_get_request(request, _get_trace, [''])


def _get_trace(request):
    settings.THREAD_LOCK.acquire()
    data = settings.TRACE_DATA
    settings.THREAD_LOCK.release()
    return JsonResponse({
        'data': data
    })


def start_simulate(request):
    return validate_get_request(request, _start_simulate, [''])


def _start_simulate(request):
    settings.THREAD_LOCK.acquire()
    settings.START = 1
    settings.THREAD_LOCK.release()
    return JsonResponse({'data': 'ok'})
