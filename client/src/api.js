import axios from "axios";

const api = axios.create({
  baseURL: "/app", // ← ключевая строка
});

export const fetchPersons = () => api.get("/persons/");
export const fetchCoursesByPerson = (personId) =>
  api.get("/courses/by_person/", { params: { person_id: personId } });
export const fetchAssignmentsByCourse = (courseId) =>
  api.get("/assignments/by_course/", { params: { course_id: courseId } });
export const fetchSubmissionsByAssignment = (assignmentId) =>
  api.get("/submissions/by_assignment/", { params: { assignment_id: assignmentId } });
export const createSubmission = (payload) =>
  api.post("/submissions/", payload);
export const gradeSubmission = (submissionId, payload) =>
  api.post(`/submissions/${submissionId}/grade/`, payload);
export const fetchStudents = () =>
  api.get("/persons/", { params: { role: "student" } });
export const createCourse = (payload) =>
  api.post("/courses/", payload);
export const addStudentToCourse = (courseId, studentId) =>
  api.post(`/courses/${courseId}/add_student/`, { student_id: studentId });

export default api;
