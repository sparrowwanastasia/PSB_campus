from django.contrib import admin
from .models import Person, Course, CourseStudent, Assignment, Submission

admin.site.register(Person)
admin.site.register(Course)
admin.site.register(CourseStudent)
admin.site.register(Assignment)
admin.site.register(Submission)

# Register your models here.
