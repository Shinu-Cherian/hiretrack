from django import forms
from .models import Profile

class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = [
            'profile_pic',
            'age',
            'gender',
            'phone',
            'education',
            'experience',
            'skills',
            'resume'
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields['profile_pic'].required = False
        self.fields['resume'].required = False