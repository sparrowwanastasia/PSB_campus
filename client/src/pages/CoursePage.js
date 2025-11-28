import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchAssignmentsByCourse,
  createSubmission,
  fetchSubmissionsByAssignment,
} from "../api";

function CoursePage({ currentUser }) {
  const { courseId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetchAssignmentsByCourse(courseId)
      .then((res) => setAssignments(res.data))
      .catch((err) => console.error(err));
  }, [courseId]);

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

  return (
    <div style={{ padding: 24 }}>
      <h2>Курс #{courseId}</h2>

      <div style={{ display: "flex", gap: 32 }}>
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
      </div>
    </div>
  );
}

export default CoursePage;
