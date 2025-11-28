# server/app/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    PersonViewSet,
    CourseViewSet,
    AssignmentViewSet,
    SubmissionViewSet,
    CourseMaterialViewSet,
)

router = DefaultRouter()
router.register(r'persons', PersonViewSet, basename='person')
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'assignments', AssignmentViewSet, basename='assignment')
router.register(r'submissions', SubmissionViewSet, basename='submission')
router.register(r'materials', CourseMaterialViewSet, basename='material')

urlpatterns = [
    path('', include(router.urls)),
]
