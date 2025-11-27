from rest_framework import serializers
from .models import Person, Course, CourseStudent, Assignment, Submission


class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ['id', 'name', 'email', 'role']


class CourseSerializer(serializers.ModelSerializer):
    teacher = PersonSerializer(read_only=True)
    teacher_id = serializers.PrimaryKeyRelatedField(
        queryset=Person.objects.filter(role='teacher'),
        source='teacher',
        write_only=True
    )

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'teacher', 'teacher_id']


class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = ['id', 'course', 'title', 'description', 'deadline', 'max_grade']


class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = [
            'id',
            'assignment',
            'student',
            'answer_text',
            'submitted_at',
            'status',
            'grade',
            'feedback',
        ]
        read_only_fields = ['submitted_at', 'status']


class SubmissionGradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ['grade', 'feedback', 'status']
