from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('api/add-job/', views.add_job_api),
    path('jobs/', views.job_list, name='job_list'),
    path('api/add-referral/', views.add_referral_api),
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
    path('api/jobs/', views.get_jobs_api),
    path('api/referrals/', views.get_referrals_api),

    path('api/job/star/<int:id>/', views.toggle_star_job_api),
    path('api/job/delete/<int:id>/', views.delete_job_api),
    path('api/job/update/<int:id>/', views.update_job_api),

    path('api/referral/star/<int:id>/', views.toggle_star_referral_api),
    path('api/referral/delete/<int:id>/', views.delete_referral_api),
    path('api/referral/update/<int:id>/', views.update_referral_api),

    path('api/starred/', views.starred_api),
    path('api/notifications/', views.notifications_api),
    path('api/profile/', views.profile_api),
    path('api/profile/update/', views.update_profile_api),
    path('api/change-password/', views.change_password_api),
    path('api/resume-analyze/', views.resume_analyze_api),
    path('api/generate-cover-letter/', views.generate_cover_letter_api),
    path('api/career-vault/', views.career_vault_api),
    path('api/job/document/<int:id>/<str:kind>/', views.job_document_download_api),
    path('api/streaks/', views.streak_api),
    
]
