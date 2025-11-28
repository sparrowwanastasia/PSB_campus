// client/src/api.js
import axios from "axios";

// Все запросы идут на тот же хост, где крутится Django, префикс /app
const api = axios.create({
  baseURL: "/app",
});

// --- Пользователи ---

// Все пользователи (студенты + преподаватели)
export const fetchPersons = () => api.get("/persons/");

// Только студенты (используем role=student)
export const fetchStudents = () =>
  api.get("/persons/", { params: { role: "student" } });

// --- Курсы ---

// Курсы, связанные с конкретным человеком (студент или преподаватель)
export const fetchCoursesByPerson = (personId) =>
  api.get("/courses/by_person/", { params: { person_id: personId } });

// Создать курс
export const createCourse = (payload) =>
  api.post("/courses/", payload);

// Назначить студента на курс
export const addStudentToCourse = (courseId, studentId) =>
  api.post(`/courses/${courseId}/add_student/`, { student_id: studentId });

// --- Задания ---

// Задания по курсу
export const fetchAssignmentsByCourse = (courseId) =>
  api.get("/assignments/by_course/", { params: { course_id: courseId } });

// --- Отправка решений ---

// Решения по заданию (для преподавателя)
export const fetchSubmissionsByAssignment = (assignmentId) =>
  api.get("/submissions/by_assignment/", { params: { assignment_id: assignmentId } });

// Отправить решение (студент)
export const createSubmission = (payload) =>
  api.post("/submissions/", payload);

// Оценить решение (преподаватель)
export const gradeSubmission = (submissionId, payload) =>
  api.post(`/submissions/${submissionId}/grade/`, payload);

export default api;
