from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('add-job/', views.add_job, name='add_job'),
    path('jobs/', views.job_list, name='job_list'),
]