// client/src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000/api",
});

// Получить всех людей (студент/препод)
export const fetchPersons = () => api.get("/persons/");

// Курсы для конкретного человека
export const fetchCoursesByPerson = (personId) =>
  api.get("/courses/by_person/", { params: { person_id: personId } });

// Задания по курсу
export const fetchAssignmentsByCourse = (courseId) =>
  api.get("/assignments/by_course/", { params: { course_id: courseId } });

// Решения по заданию
export const fetchSubmissionsByAssignment = (assignmentId) =>
  api.get("/submissions/by_assignment/", { params: { assignment_id: assignmentId } });

// Отправить решение (студент)
export const createSubmission = (payload) =>
  api.post("/submissions/", payload);

// Оценить решение (преподаватель)
export const gradeSubmission = (submissionId, payload) =>
  api.post(`/submissions/${submissionId}/grade/`, payload);

export default api;
