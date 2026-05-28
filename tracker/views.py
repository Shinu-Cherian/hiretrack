from django.shortcuts import render,redirect, get_object_or_404
from .models import Job,Referral,Profile,Education,Experience
from django.db.models import Q,Count
from datetime import datetime, timedelta
from datetime import date
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages
from .forms import ProfileForm
from django.http import JsonResponse
from .models import Job, Referral
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.csrf import csrf_exempt
from .utils_pdf import render_to_pdf


from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from datetime import date, timedelta
from django.http import FileResponse, Http404, JsonResponse, HttpResponse
import re
from io import BytesIO
from collections import Counter
from html import unescape
from zipfile import ZipFile
from xml.etree import ElementTree


def api_user(request):
    if request.user.is_authenticated:
        return request.user
    return None


def login_required_json(user):
    if user is None:
            return JsonResponse({
        "status": "Success",
        "id": note.id,
        "title": note.title,
        "content": note.content,
        "color": note.color,
        "font_family": note.font_family,
        "font_size": note.font_size,
        "attached_file": note.attached_file.url if note.attached_file else None,
        "updated_at": note.updated_at.isoformat() if note.updated_at else "",
    })


@csrf_exempt
def update_note_api(request, id):
    user = api_user(request)
    auth_error = login_required_json(user)
    if auth_error:
        return auth_error

    if request.method != "POST":
            return JsonResponse({
        "status": "Success",
        "id": note.id,
        "title": note.title,
        "content": note.content,
        "color": note.color,
        "font_family": note.font_family,
        "font_size": note.font_size,
        "attached_file": note.attached_file.url if note.attached_file else None,
        "updated_at": note.updated_at.isoformat() if note.updated_at else "",
    })


@csrf_exempt
def delete_note_api(request, id):
    user = api_user(request)
    auth_error = login_required_json(user)
    if auth_error:
        return auth_error

    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    from .models import Scribble
    note = Scribble.objects.filter(user=user, id=id).first()
    if not note:
        return JsonResponse({"error": "Note not found"}, status=404)

    note.delete()
    return JsonResponse({"status": "Success"})


