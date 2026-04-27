from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0010_education_experience'),
    ]

    operations = [
        migrations.AddField(
            model_name='job',
            name='platform',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='job',
            name='salary_range',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='referral',
            name='linkedin',
            field=models.URLField(blank=True, null=True),
        ),
    ]
