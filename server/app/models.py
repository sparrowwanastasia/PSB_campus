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
    color = models.CharField(max_length=7, default='#6c5ce7') 

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


# ДОБАВИТЬ МОДЕЛЬ Topic ПЕРЕД CourseMaterial
class Topic(models.Model):
    course = models.ForeignKey(
        Course, 
        related_name="topics", 
        on_delete=models.CASCADE
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default='#6c5ce7')
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        return f"{self.course.title} - {self.title}"

    @property
    def materials_count(self):
        return self.materials.count()


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
    topic = models.ForeignKey(  # Теперь Topic объявлен выше
        Topic,
        related_name="materials", 
        on_delete=models.CASCADE,
        null=True,
        blank=True
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
    answer_text = models.TextField(blank=True)
    file = models.FileField(upload_to='submissions/', blank=True, null=True)
    grade = models.IntegerField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="submitted")
    teacher_comment = models.TextField(blank=True)

    def __str__(self):
        return f"Submission #{self.id} by {self.student} for {self.assignment}"


class SubmissionComment(models.Model):
    submission = models.ForeignKey(
        "Submission",
        related_name="comments",
        on_delete=models.CASCADE,
    )
    author = models.ForeignKey("Person", on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"Comment by {self.author} on submission {self.submission_id}"


class CourseMessage(models.Model):
    course = models.ForeignKey(
        Course,
        related_name="messages",
        on_delete=models.CASCADE,
    )
    author = models.ForeignKey(Person, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"Msg by {self.author} in {self.course_id}"
    
