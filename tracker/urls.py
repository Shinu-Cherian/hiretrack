from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('add-job/', views.add_job, name='add_job'),
    path('jobs/', views.job_list, name='job_list'),
    path('add-referral/', views.add_referral, name='add_referral'),
    path('referrals/', views.referral_list, name='referral_list'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('delete-job/<int:id>/', views.delete_job, name='delete_job'),
    path('edit-job/<int:id>/', views.edit_job, name='edit_job'),
    path('delete-referral/<int:id>/', views.delete_referral, name='delete_referral'),
    path('edit-referral/<int:id>/', views.edit_referral, name='edit_referral'),
    path('notifications/', views.notifications_page, name='notifications'),
    path('toggle-star-job/<int:id>/', views.toggle_star_job, name='toggle_star_job'),
    path('toggle-star-referral/<int:id>/', views.toggle_star_referral, name='toggle_star_referral'),
    path('starred/', views.starred_list, name='starred'),
    path('profile/', views.view_profile, name='profile'),
    path('profile/edit/', views.edit_profile, name='edit_profile'),
    path('settings/', views.settings_view, name='settings'),
    path('api/dashboard/', views.dashboard_api),
]