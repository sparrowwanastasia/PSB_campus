// client/src/api.js
import axios from "axios";

// Все запросы идут к Django по префиксу /app
const api = axios.create({
  baseURL: "/app",
});

//
// ---------- Пользователи ----------
//

// Все пользователи (студенты + преподаватели)
export const fetchPersons = () => api.get("/persons/");

// Только студенты
export const fetchStudents = () =>
  api.get("/persons/", { params: { role: "student" } });

//
// ---------- Курсы ----------
//

// Курсы, связанные с конкретным человеком (студент или преподаватель)
export const fetchCoursesByPerson = (personId) =>
  api.get("/courses/by_person/", { params: { person_id: personId } });

// Один курс по id
export const fetchCourseById = (courseId) => api.get(`/courses/${courseId}/`);

// Создать курс
export const createCourse = (payload) => api.post("/courses/", payload);

// Назначить студента на курс
export const addStudentToCourse = (courseId, studentId) =>
  api.post(`/courses/${courseId}/add_student/`, { student_id: studentId });


export const deleteCourse = (courseId) => {
  return api.delete(`/courses/${courseId}/`);
};

//
// ---------- Материалы курса ----------
//

// Материалы по курсу
export const fetchMaterialsByCourse = (courseId) =>
  api.get("/materials/by_course/", { params: { course_id: courseId } });

//
// ---------- Задания ----------
//

// Задания по курсу
export const fetchAssignmentsByCourse = (courseId) =>
  api.get("/assignments/by_course/", { params: { course_id: courseId } });

//
// ---------- Решения студентов ----------
//

// Решения по заданию (для преподавателя и для поиска "моего" решения)
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

//
// ---------- Комментарии к решению ----------
//

// Комменты к конкретному submission
export const fetchCommentsBySubmission = (submissionId) =>
  api.get("/comments/by_submission/", {
    params: { submission_id: submissionId },
  });

export const createComment = (payload) => api.post("/comments/", payload);

//
// ---------- Чат по курсу ----------
//

// Сообщения чата по курсу
export const fetchMessagesByCourse = (courseId) =>
  api.get("/messages/by_course/", {
    params: { course_id: courseId },
  });

// Отправить сообщение в чате курса
export const createCourseMessage = (payload) =>
  api.post("/messages/", payload);

export default api;


// ---------- Темы курса ----------
//

// Темы по курсу
export const fetchTopicsByCourse = (courseId) =>
  api.get("/topics/by_course/", { params: { course_id: courseId } });

// Создать тему
export const createTopic = (payload) => api.post("/topics/", payload);

// Удалить тему
export const deleteTopic = (topicId) => api.delete(`/topics/${topicId}/`);