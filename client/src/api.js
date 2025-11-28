// client/src/api.js
import axios from "axios";

// Все запросы идут к Django по префиксу /app
const api = axios.create({
  baseURL: "/app",
});

// ---------- Пользователи ----------

// Все пользователи (студенты + преподаватели)
export const fetchPersons = () => api.get("/persons/");

// Только студенты
export const fetchStudents = () =>
  api.get("/persons/", { params: { role: "student" } });

// ---------- Курсы ----------

// Курсы, связанные с конкретным человеком (студент или преподаватель)
export const fetchCoursesByPerson = (personId) =>
  api.get("/courses/by_person/", { params: { person_id: personId } });

// Один курс (для заголовка на странице курса, если захочешь)
export const fetchCourseById = (courseId) =>
  api.get(`/courses/${courseId}/`);

// Создать курс
export const createCourse = (payload) => api.post("/courses/", payload);

// Назначить студента на курс
export const addStudentToCourse = (courseId, studentId) =>
  api.post(`/courses/${courseId}/add_student/`, { student_id: studentId });

// ---------- Материалы курса ----------

// Материалы по курсу
export const fetchMaterialsByCourse = (courseId) =>
  api.get("/materials/by_course/", { params: { course_id: courseId } });

// ---------- Задания ----------

// Задания по курсу
export const fetchAssignmentsByCourse = (courseId) =>
  api.get("/assignments/by_course/", { params: { course_id: courseId } });

// ---------- Решения студентов ----------

// Решения по заданию (для преподавателя)
export const fetchSubmissionsByAssignment = (assignmentId) =>
  api.get("/submissions/by_assignment/", {
    params: { assignment_id: assignmentId },
  });

// Отправить решение (студент) — с поддержкой файла
export const createSubmission = (payload) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  return api.post("/submissions/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Оценить решение (преподаватель)
export const gradeSubmission = (submissionId, payload) =>
  api.post(`/submissions/${submissionId}/grade/`, payload);

export default api;
