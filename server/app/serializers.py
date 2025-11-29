from rest_framework import serializers
from .models import Person, Course, CourseStudent, Assignment, Submission, CourseMaterial,SubmissionComment,CourseMessage, Topic


class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ['id', 'name', 'email', 'role']


class CourseSerializer(serializers.ModelSerializer):
    # дополнительное поле только для чтения
    progress = serializers.SerializerMethodField()
    # ДОБАВИТЬ студентов в сериализатор
    students = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ["id", "title", "description", "teacher", "progress", "color", "students"]  # ДОБАВИТЬ color и students

    def get_progress(self, obj):
        # сколько заданий на курсе
        assignments_count = Assignment.objects.filter(course=obj).count()
        if assignments_count == 0:
            return 0

        # сколько студентов записано на курс
        students_count = (
            CourseStudent.objects.filter(course=obj)
            .values("student")
            .distinct()
            .count()
        )
        if students_count == 0:
            return 0

        # сколько пар (задание, студент) уже имеют хотя бы один сабмит
        submitted_pairs_count = (
            Submission.objects.filter(assignment__course=obj)
            .values("assignment", "student")
            .distinct()
            .count()
        )

        total_pairs = assignments_count * students_count
        if total_pairs == 0:
            return 0

        progress = round(100 * submitted_pairs_count / total_pairs)
        return progress

    # ДОБАВИТЬ этот метод для получения списка студентов
    def get_students(self, obj):
        from .serializers import PersonSerializer
        students = Person.objects.filter(
            course_enrollments__course=obj
        ).distinct()
        return PersonSerializer(students, many=True).data

class TopicSerializer(serializers.ModelSerializer):
    materials_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Topic
        fields = ['id', 'course', 'title', 'description', 'color', 'order', 'created_at', 'materials_count']

class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = ['id', 'course', 'title', 'description', 'deadline', 'max_grade']

class CourseMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseMaterial
        fields = "__all__"


class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = "__all__"

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

class SubmissionCommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.name", read_only=True)

    class Meta:
        model = SubmissionComment
        fields = ["id", "submission", "author", "author_name", "text", "created_at"]

class CourseMessageSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.name", read_only=True)

    class Meta:
        model = CourseMessage
        fields = ["id", "course", "author", "author_name", "text", "created_at"]