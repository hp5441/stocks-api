
from django.http import HttpResponse
import os
from app import settings


def index(request):
    try:
        with open(os.path.join(settings.REACT_APP_DIR,
                               'build', 'index.html')) as f:
            return HttpResponse(f.read())
    except FileNotFoundError:
        return HttpResponse(
            "Please build front end using react", status=501
        )
