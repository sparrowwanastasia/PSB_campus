// client/src/pages/CoursePage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchAssignmentsByCourse,
  createSubmission,
  fetchSubmissionsByAssignment,
  gradeSubmission,
  fetchMaterialsByCourse,
  fetchCommentsBySubmission,
  createComment,
  fetchCourseById,
  fetchMessagesByCourse,
  createCourseMessage,
} from "../api";
import "./CoursePage.css";

// ДЕМО-материалы и задания, если с бэка пришло пусто
const DEMO_MATERIALS = [
  {
    id: "demo-m-1",
    title: "Лекция 1. Введение в тему курса",
    material_type: "text",
    text:
      "Краткий конспект первой лекции. Здесь студент видит основные определения, " +
      "ключевые формулы и примеры.\n\n" +
      "• Определение 1\n• Определение 2\n• Пример задачи.",
  },
  {
    id: "demo-m-2",
    title: "Видео: популярное объяснение темы",
    material_type: "video",
    url: "https://www.youtube.com/watch?v=Usu9xZfabPM",
  },
  {
    id: "demo-m-3",
    title: "Полезная ссылка: конспекты и задачи",
    material_type: "link",
    url: "https://mipt.ru/education/chair/physics/materials/",
  },
];

const DEMO_ASSIGNMENTS = [
  {
    id: "demo-a-1",
    title: "Домашнее задание 1: базовые понятия",
    description:
      "1) В двух абзацах опишите, что такое основная тема курса.\n" +
      "2) Приведите пример из жизни, где это знание пригодится.\n" +
      "3) Сформулируйте три вопроса по материалам.",
    due_date: "2025-12-01",
  },
  {
    id: "demo-a-2",
    title: "Домашнее задание 2: практическая задача",
    description:
      "Решите практическую задачу по теме курса. Можно приложить решение " +
      "в PDF, DOCX, картинку или архив с кодом.\n\n" +
      "Формат сдачи: текстовое описание + прикреплённый файл.",
    due_date: "2025-12-05",
  },
];

function CoursePage({ currentUser }) {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // для студента
  const [answerText, setAnswerText] = useState("");
  const [file, setFile] = useState(null);
  const [mySubmission, setMySubmission] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // для преподавателя
  const [submissions, setSubmissions] = useState([]);
  const [gradeBySubmission, setGradeBySubmission] = useState({});
  const [commentBySubmission, setCommentBySubmission] = useState({});

  // чат по курсу
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // курс и прогресс
  useEffect(() => {
    fetchCourseById(courseId)
      .then((res) => setCourse(res.data))
      .catch((err) => console.error(err));
  }, [courseId]);

  // задания и материалы
  useEffect(() => {
    fetchAssignmentsByCourse(courseId)
      .then((res) => setAssignments(res.data))
      .catch((err) => console.error(err));

    fetchMaterialsByCourse(courseId)
      .then((res) => setMaterials(res.data))
      .catch((err) => console.error(err));
  }, [courseId]);

  // чат
  useEffect(() => {
    fetchMessagesByCourse(courseId)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error(err));
  }, [courseId]);

  const loadSubmissions = (assignmentId) => {
    fetchSubmissionsByAssignment(assignmentId)
      .then((res) => setSubmissions(res.data))
      .catch((err) => console.error(err));
  };

  const loadMySubmissionAndComments = (assignmentId) => {
    fetchSubmissionsByAssignment(assignmentId)
      .then((res) => {
        const mine = res.data.filter(
          (s) => String(s.student) === String(currentUser.id)
        );
        const last = mine[mine.length - 1] || null;
        setMySubmission(last);

        if (last) {
          fetchCommentsBySubmission(last.id)
            .then((r) => setComments(r.data))
            .catch((e) => console.error(e));
        } else {
          setComments([]);
        }
      })
      .catch((err) => console.error(err));
  };

  const handleSelectAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setAnswerText("");
    setFile(null);
    setSubmissions([]);
    setMySubmission(null);
    setComments([]);
    setNewComment("");

    if (currentUser.role === "teacher" && typeof assignment.id !== "string") {
      loadSubmissions(assignment.id);
    }

    if (currentUser.role === "student" && typeof assignment.id !== "string") {
      loadMySubmissionAndComments(assignment.id);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAssignment || (!answerText && !file)) return;

    // демо-задания (string id) нельзя отправить на бэк
    if (typeof selectedAssignment.id === "string") {
      alert(
        "Это демо-задание (для демонстрации интерфейса). Для реального курса отправьте задание, созданное преподавателем."
      );
      return;
    }

    try {
      const res = await createSubmission({
        assignment: selectedAssignment.id,
        student: currentUser.id,
        answer_text: answerText,
        file: file || undefined,
      });

      alert("Решение отправлено!");
      setAnswerText("");
      setFile(null);

      const created = res.data;
      setMySubmission(created);
      setComments([]);
      setNewComment("");
    } catch (e) {
      console.error(e);
      alert("Ошибка при отправке решения");
    }
  };

  const handleAddComment = async () => {
    if (!mySubmission || !newComment.trim()) return;
    try {
      await createComment({
        submission: mySubmission.id,
        author: currentUser.id,
        text: newComment.trim(),
      });
      setNewComment("");
      const r = await fetchCommentsBySubmission(mySubmission.id);
      setComments(r.data);
    } catch (e) {
      console.error(e);
      alert("Ошибка при отправке комментария");
    }
  };

  const handleChangeGrade = (submissionId, value) => {
    setGradeBySubmission((prev) => ({
      ...prev,
      [submissionId]: value,
    }));
  };

  const handleChangeTeacherComment = (submissionId, value) => {
    setCommentBySubmission((prev) => ({
      ...prev,
      [submissionId]: value,
    }));
  };

  const handleGradeSubmission = async (submissionId) => {
    const gradeVal = gradeBySubmission[submissionId];
    const commentVal = commentBySubmission[submissionId] || "";

    try {
      await gradeSubmission(submissionId, {
        grade: gradeVal || null,
        status: "graded",
        teacher_comment: commentVal,
      });
      alert("Оценка сохранена");
      if (selectedAssignment && typeof selectedAssignment.id !== "string") {
        loadSubmissions(selectedAssignment.id);
      }
    } catch (e) {
      console.error(e);
      alert("Ошибка при сохранении оценки");
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await createCourseMessage({
        course: courseId,
        author: currentUser.id,
        text: newMessage.trim(),
      });
      setNewMessage("");
      const res = await fetchMessagesByCourse(courseId);
      setMessages(res.data);
    } catch (e) {
      console.error(e);
      alert("Ошибка при отправке сообщения");
    }
  };

  const displayMaterials =
    materials && materials.length > 0 ? materials : DEMO_MATERIALS;

  const displayAssignments =
    assignments && assignments.length > 0 ? assignments : DEMO_ASSIGNMENTS;

  // прогресс для левой панели
  const progress = course?.progress ?? 0;
  const progressStatus =
    progress === 0 ? "Не начат" : progress >= 100 ? "Завершён" : "В процессе";
  const totalAssignments = displayAssignments.length;
  const approxDone =
    totalAssignments > 0
      ? Math.round((progress / 100) * totalAssignments)
      : 0;

  return (
    <div className="cp-root">
      <header className="cp-header">
        <div className="cp-header-title">PSB Campus</div>
        <div className="cp-header-subtitle">
          Заходи не бойся, выходи не плачь
        </div>
      </header>

      <main className="cp-main">
        <div className="cp-content">
          <h2 className="cp-page-title">
            {course ? course.title : `Курс #${courseId}`}
          </h2>

          {/* Материалы курса */}
          <section className="cp-card" style={{ marginBottom: 16 }}>
            <h3 className="cp-section-subtitle">Материалы курса</h3>
            <ul className="cp-materials-list">
              {displayMaterials.map((m) => (
                <li key={m.id} className="cp-material-item">
                  <div className="cp-material-title">{m.title}</div>
                  {m.material_type === "text" && m.text && (
                    <div className="cp-material-body">{m.text}</div>
                  )}
                  {m.material_type === "video" && m.url && (
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noreferrer"
                      className="cp-material-link"
                    >
                      Смотреть видео
                    </a>
                  )}
                  {m.material_type === "link" && m.url && (
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noreferrer"
                      className="cp-material-link"
                    >
                      Перейти по ссылке
                    </a>
                  )}
                  {m.material_type === "file" && m.file && (
                    <a
                      href={m.file}
                      target="_blank"
                      rel="noreferrer"
                      className="cp-material-link"
                    >
                      Скачать файл
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* Триколоночный layout: слева прогресс, центр — задания, справа — чат */}
          <div className="cp-layout">
            {/* ЛЕВАЯ ПАНЕЛЬ: успеваемость */}
            <aside className="cp-progress-sidebar">
              <h3 className="cp-sidebar-title">Моя успеваемость</h3>
              <div className="cp-progress-circle">
                <div className="cp-progress-circle-inner">
                  <span className="cp-progress-circle-value">
                    {progress}%
                  </span>
                </div>
              </div>
              <div className="cp-progress-status">{progressStatus}</div>
              <div className="cp-progress-details">
                <div className="cp-progress-row">
                  <span>Заданий всего</span>
                  <span>{totalAssignments}</span>
                </div>
                <div className="cp-progress-row">
                  <span>Примерно выполнено</span>
                  <span>{approxDone}</span>
                </div>
              </div>
            </aside>

            {/* ЦЕНТР: задания + отправка решения + работа препода */}
            <div className="cp-center">
              {/* список заданий */}
              <aside className="cp-sidebar">
                <h3 className="cp-sidebar-title">Задания</h3>
                <ul className="cp-assignment-list">
                  {displayAssignments.map((a) => (
                    <li key={a.id}>
                      <button
                        className={`cp-assignment-item ${
                          selectedAssignment?.id === a.id
                            ? "cp-assignment-item--active"
                            : ""
                        }`}
                        onClick={() => handleSelectAssignment(a)}
                      >
                        {a.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </aside>

              {/* основная часть выбранного задания */}
              <section className="cp-main-panel">
                {!selectedAssignment && (
                  <div className="cp-card">
                    <p className="cp-empty-text">
                      Выберите задание слева, чтобы посмотреть детали.
                    </p>
                  </div>
                )}

                {selectedAssignment && (
                  <>
                    <div className="cp-card cp-assignment-card">
                      <h3 className="cp-assignment-title">
                        {selectedAssignment.title}
                      </h3>
                      <p className="cp-assignment-description">
                        {selectedAssignment.description ||
                          "Описание задания пока не заполнено"}
                      </p>
                      <p className="cp-assignment-deadline">
                        Срок сдачи:{" "}
                        {selectedAssignment.due_date
                          ? selectedAssignment.due_date
                          : "не задан"}
                      </p>
                    </div>

                    {/* Студент: сдача решения + комментарии к решению */}
                    {currentUser.role === "student" && (
                      <>
                        <div className="cp-card cp-student-submit-card">
                          <h4 className="cp-section-subtitle">
                            Моё решение
                          </h4>
                          <textarea
                            className="cp-textarea"
                            value={answerText}
                            onChange={(e) =>
                              setAnswerText(e.target.value)
                            }
                            rows={5}
                            placeholder="Текстовое решение или ссылка на репозиторий"
                          />
                          <input
                            className="cp-input"
                            type="file"
                            onChange={(e) =>
                              setFile(e.target.files[0] || null)
                            }
                            style={{ marginTop: 8, marginBottom: 8 }}
                          />
                          <button
                            className="cp-primary-button"
                            onClick={handleSubmit}
                            disabled={!answerText && !file}
                          >
                            Отправить решение
                          </button>
                        </div>

                        {mySubmission && (
                          <div className="cp-card cp-comments-card">
                            <h4 className="cp-section-subtitle">
                              Комментарии к моему решению
                            </h4>
                            {comments.length === 0 && (
                              <p className="cp-empty-text">
                                Пока нет комментариев. Можно задать вопрос
                                преподавателю.
                              </p>
                            )}
                            {comments.length > 0 && (
                              <ul className="cp-comments-list">
                                {comments.map((c) => (
                                  <li
                                    key={c.id}
                                    className="cp-comment-item"
                                  >
                                    <div className="cp-comment-author">
                                      {c.author_name}
                                    </div>
                                    <div className="cp-comment-text">
                                      {c.text}
                                    </div>
                                    <div className="cp-comment-date">
                                      {new Date(
                                        c.created_at
                                      ).toLocaleString()}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                            <textarea
                              className="cp-textarea"
                              rows={3}
                              placeholder="Новый комментарий или вопрос"
                              value={newComment}
                              onChange={(e) =>
                                setNewComment(e.target.value)
                              }
                            />
                            <button
                              className="cp-secondary-button"
                              onClick={handleAddComment}
                              disabled={!newComment.trim()}
                            >
                              Отправить комментарий
                            </button>
                          </div>
                        )}
                      </>
                    )}

                    {/* Преподаватель: работы студентов */}
                    {currentUser.role === "teacher" &&
                      submissions &&
                      submissions.length > 0 && (
                        <div className="cp-card cp-teacher-submissions-card">
                          <h4 className="cp-section-subtitle">
                            Работы студентов
                          </h4>
                          <table className="cp-submissions-table">
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Студент</th>
                                <th>Ответ</th>
                                <th>Файл</th>
                                <th>Оценка</th>
                                <th>Комментарий</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {submissions.map((s) => (
                                <tr key={s.id}>
                                  <td>{s.id}</td>
                                  <td>{s.student}</td>
                                  <td className="cp-submission-answer-cell">
                                    {s.answer_text}
                                  </td>
                                  <td>
                                    {s.file && (
                                      <a
                                        href={s.file}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        файл
                                      </a>
                                    )}
                                  </td>
                                  <td>
                                    <input
                                      className="cp-input cp-input-small"
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={
                                        gradeBySubmission[s.id] ??
                                        (s.grade ?? "")
                                      }
                                      onChange={(e) =>
                                        handleChangeGrade(
                                          s.id,
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <input
                                      className="cp-input"
                                      type="text"
                                      placeholder="Комментарий"
                                      value={
                                        commentBySubmission[s.id] ??
                                        (s.teacher_comment ?? "")
                                      }
                                      onChange={(e) =>
                                        handleChangeTeacherComment(
                                          s.id,
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <button
                                      className="cp-secondary-button"
                                      onClick={() =>
                                        handleGradeSubmission(s.id)
                                      }
                                    >
                                      Сохранить
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                  </>
                )}
              </section>
            </div>

            {/* ПРАВАЯ ПАНЕЛЬ: чат с преподавателем */}
            <aside className="cp-chat-panel">
              <h3 className="cp-sidebar-title">Чат с преподавателем</h3>
              <div className="cp-chat-messages">
                {messages.length === 0 && (
                  <div className="cp-empty-text">
                    Пока нет сообщений. Напишите преподавателю вопрос.
                  </div>
                )}
                {messages.map((m) => {
                  const isMine =
                    String(m.author) === String(currentUser.id);
                  return (
                    <div
                      key={m.id}
                      className={`cp-chat-message ${
                        isMine ? "cp-chat-message--mine" : ""
                      }`}
                    >
                      <div className="cp-chat-message-author">
                        {m.author_name}
                      </div>
                      <div className="cp-chat-message-text">
                        {m.text}
                      </div>
                      <div className="cp-chat-message-date">
                        {new Date(m.created_at).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="cp-chat-input-block">
                <textarea
                  className="cp-textarea cp-chat-textarea"
                  rows={3}
                  placeholder="Сообщение преподавателю"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                  className="cp-primary-button cp-chat-send"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  Отправить
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <footer className="cp-footer">
        Платформа реализации учебного процесса для ПСБ
      </footer>
    </div>
  );
}

export default CoursePage;
