import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchAssignmentsByCourse,
  createSubmission,
  fetchSubmissionsByAssignment,
  fetchStudents,
  addStudentToCourse,
} from "../api";

function CoursePage({ currentUser }) {
  const { courseId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [submissions, setSubmissions] = useState([]);

  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");

  useEffect(() => {
    fetchAssignmentsByCourse(courseId)
      .then((res) => setAssignments(res.data))
      .catch((err) => console.error(err));

    if (currentUser.role === "teacher") {
      fetchStudents()
        .then((res) => setStudents(res.data))
        .catch((err) => console.error(err));
    }
  }, [courseId, currentUser.role]);

  const loadSubmissions = (assignmentId) => {
    fetchSubmissionsByAssignment(assignmentId)
      .then((res) => setSubmissions(res.data))
      .catch((err) => console.error(err));
  };

  const handleSelectAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    if (currentUser.role === "teacher") {
      loadSubmissions(assignment.id);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAssignment) return;
    try {
      await createSubmission({
        assignment: selectedAssignment.id,
        student: currentUser.id,
        answer_text: answerText,
      });
      alert("Решение отправлено!");
      setAnswerText("");
    } catch (e) {
      console.error(e);
      alert("Ошибка при отправке");
    }
  };

  const handleAddStudentToCourse = async () => {
    if (!selectedStudentId) return;
    try {
      await addStudentToCourse(courseId, selectedStudentId);
      alert("Студент назначен на курс");
    } catch (e) {
      console.error(e);
      alert("Ошибка при назначении студента");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Курс #{courseId}</h2>

      <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
        {/* Список заданий */}
        <div style={{ flex: 1 }}>
          <h3>Задания</h3>
          <ul>
            {assignments.map((a) => (
              <li key={a.id}>
                <button onClick={() => handleSelectAssignment(a)}>
                  {a.title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Детали выбранного задания */}
        <div style={{ flex: 2 }}>
          {selectedAssignment ? (
            <>
              <h3>{selectedAssignment.title}</h3>
              <p>{selectedAssignment.description}</p>

              {currentUser.role === "student" && (
                <div style={{ marginTop: 16 }}>
                  <h4>Мой ответ</h4>
                  <textarea
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    rows={5}
                    style={{ width: "100%" }}
                    placeholder="Вставь сюда текст ответа или ссылку на репозиторий"
                  />
                  <br />
                  <button onClick={handleSubmit} disabled={!answerText}>
                    Отправить
                  </button>
                </div>
              )}

              {currentUser.role === "teacher" && (
                <div style={{ marginTop: 16 }}>
                  <h4>Работы студентов</h4>
                  {submissions.length === 0 ? (
                    <p>Пока нет решений</p>
                  ) : (
                    <ul>
                      {submissions.map((s) => (
                        <li key={s.id}>
                          #{s.id} студент {s.student} — статус {s.status} —{" "}
                          оценка {s.grade ?? "—"}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </>
          ) : (
            <p>Выберите задание слева</p>
          )}
        </div>

        {/* Панель назначения студентов — только для преподавателя */}
        {currentUser.role === "teacher" && (
          <div style={{ flex: 1 }}>
            <h3>Назначить курс студенту</h3>
            <select
              style={{ width: "100%", padding: 8 }}
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
            >
              <option value="">-- выберите студента --</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <button
              style={{ marginTop: 8 }}
              onClick={handleAddStudentToCourse}
              disabled={!selectedStudentId}
            >
              Назначить на курс
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CoursePage;
