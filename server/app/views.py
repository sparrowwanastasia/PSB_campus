from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Person, Course, Assignment, Submission, CourseStudent

from .models import Person, Course, Assignment, Submission
from .serializers import (
    PersonSerializer,
    CourseSerializer,
    AssignmentSerializer,
    SubmissionSerializer,
    SubmissionGradeSerializer,
)


class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer

    # ?role=student / ?role=teacher
    def get_queryset(self):
        qs = super().get_queryset()
        role = self.request.query_params.get('role')
        if role in ['student', 'teacher']:
            qs = qs.filter(role=role)
        return qs



class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    # GET /app/courses/by_person/?person_id=1
    @action(detail=False, methods=['get'])
    def by_person(self, request):
        person_id = request.query_params.get('person_id')
        if not person_id:
            return Response({'detail': 'person_id is required'}, status=400)

        person = Person.objects.filter(id=person_id).first()
        if not person:
            return Response({'detail': 'Person not found'}, status=404)

        if person.role == 'teacher':
            qs = Course.objects.filter(teacher=person)
        else:  # student
            qs = Course.objects.filter(enrollments__student=person).distinct()

        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    # POST /app/courses/{id}/add_student/
    @action(detail=True, methods=['post'])
    def add_student(self, request, pk=None):
        course = self.get_object()
        student_id = request.data.get('student_id')
        if not student_id:
            return Response({'detail': 'student_id is required'}, status=400)
        try:
            student = Person.objects.get(id=student_id, role='student')
        except Person.DoesNotExist:
            return Response({'detail': 'Student not found'}, status=404)

        obj, created = CourseStudent.objects.get_or_create(
            course=course,
            student=student
        )
        if created:
            msg = 'student_added'
        else:
            msg = 'already_enrolled'
        return Response({'detail': msg}, status=200)



class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer

    # GET /api/assignments/by_course/?course_id=1
    @action(detail=False, methods=['get'])
    def by_course(self, request):
        course_id = request.query_params.get('course_id')
        if not course_id:
            return Response({'detail': 'course_id is required'}, status=400)
        qs = Assignment.objects.filter(course_id=course_id)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer

    # GET /api/submissions/by_assignment/?assignment_id=1
    @action(detail=False, methods=['get'])
    def by_assignment(self, request):
        assignment_id = request.query_params.get('assignment_id')
        if not assignment_id:
            return Response({'detail': 'assignment_id is required'}, status=400)
        qs = Submission.objects.filter(assignment_id=assignment_id)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    # POST /api/submissions/{id}/grade/
    @action(detail=True, methods=['post'])
    def grade(self, request, pk=None):
        submission = self.get_object()
        serializer = SubmissionGradeSerializer(submission, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(SubmissionSerializer(submission).data)
