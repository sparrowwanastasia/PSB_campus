from django.db import models


class Person(models.Model):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('teacher', 'Teacher'),
    )

    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.name} ({self.role})"


class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    teacher = models.ForeignKey(
        Person,
        on_delete=models.CASCADE,
        related_name='courses_teaching',
        limit_choices_to={'role': 'teacher'}
    )

    def __str__(self):
        return self.title


class CourseStudent(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    student = models.ForeignKey(
        Person,
        on_delete=models.CASCADE,
        related_name='course_enrollments',
        limit_choices_to={'role': 'student'}
    )

    class Meta:
        unique_together = ('course', 'student')

    def __str__(self):
        return f"{self.course} - {self.student}"


class Assignment(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='assignments')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    deadline = models.DateTimeField(null=True, blank=True)
    max_grade = models.FloatField(default=100.0)

    def __str__(self):
        return f"{self.title} ({self.course})"


class Submission(models.Model):
    STATUS_CHOICES = (
        ('submitted', 'Submitted'),
        ('graded', 'Graded'),
        ('requires_changes', 'Requires changes'),
    )

    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey(
        Person,
        on_delete=models.CASCADE,
        related_name='submissions',
        limit_choices_to={'role': 'student'}
    )
    submitted_at = models.DateTimeField(auto_now_add=True)
    feedback = models.TextField(null=True, blank=True)
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)
    student = models.ForeignKey(Person, on_delete=models.CASCADE)
    answer_text = models.TextField(blank=True)
    file = models.FileField(upload_to='submissions/', blank=True, null=True)  # ← НОВОЕ
    grade = models.IntegerField(blank=True, null=True)
    status = models.CharField(max_length=20, default="submitted")
    teacher_comment = models.TextField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Submission #{self.id} by {self.student} for {self.assignment}"
class CourseMaterial(models.Model):
    MATERIAL_TYPES = [
        ('text', 'Текст'),
        ('video', 'Видео'),
        ('file', 'Файл'),
        ('link', 'Ссылка'),
    ]

    course = models.ForeignKey(
        Course,
        related_name="materials",
        on_delete=models.CASCADE,
    )
    title = models.CharField(max_length=255)
    material_type = models.CharField(
        max_length=10,
        choices=MATERIAL_TYPES,
        default='text',
    )

    # разные варианты контента, используем то, что нужно
    text = models.TextField(blank=True)
    file = models.FileField(upload_to='materials/', blank=True, null=True)
    url = models.URLField(blank=True)

    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.course.title} – {self.title}"