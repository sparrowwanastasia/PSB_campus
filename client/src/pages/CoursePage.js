// client/src/pages/CoursePage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate  } from "react-router-dom";
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
  fetchTopicsByCourse,
} from "../api";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TopBar from "../components/TopBar";
import "./CoursePage.css";

const DEMO_MATERIALS = [
  {
    id: "demo-m-1",
    title: "Лекция 1. Введение в квантовую механику (конспект)",
    material_type: "text",
    text:
      "В этой лекции рассматриваем понятия волновой функции, принцип неопределённости и отличие классического и квантового описания.\n\n" +
      "Основные тезисы:\n" +
      "• частица описывается не траекторией, а волновой функцией;\n" +
      "• вероятность найти частицу в области пространства задаётся квадратом модуля волновой функции;\n" +
      "• измерение всегда влияет на систему.\n\n" +
      "Дополнительные материалы:\n" +
      "Волновая функция — это комплекснозначная функция, которая описывает квантовое состояние системы. " +
      "Её квадрат модуля определяет плотность вероятности нахождения частицы в определённой точке пространства. " +
      "Принцип неопределённости Гейзенберга утверждает, что невозможно одновременно точно измерить координату и импульс частицы. " +
      "Это фундаментальное свойство квантовых систем, а не ограничение измерительных приборов.\n\n" +
      "Историческая справка:\n" +
      "Квантовая механика зародилась в начале XX века благодаря работам Планка, Эйнштейна, Бора, Шрёдингера, Гейзенберга и других учёных. " +
      "Она радикально изменила наше понимание микромира и привела к созданию новых технологий, включая лазеры, транзисторы и квантовые компьютеры." +
      "В этой лекции рассматриваем понятия волновой функции, принцип неопределённости и отличие классического и квантового описания.\n\n" +
      "Основные тезисы:\n" +
      "• частица описывается не траекторией, а волновой функцией;\n" +
      "• вероятность найти частицу в области пространства задаётся квадратом модуля волновой функции;\n" +
      "• измерение всегда влияет на систему.\n\n" +
      "Дополнительные материалы:\n" +
      "Волновая функция — это комплекснозначная функция, которая описывает квантовое состояние системы. " +
      "Её квадрат модуля определяет плотность вероятности нахождения частицы в определённой точке пространства. " +
      "Принцип неопределённости Гейзенберга утверждает, что невозможно одновременно точно измерить координату и импульс частицы. " +
      "Это фундаментальное свойство квантовых систем, а не ограничение измерительных приборов.\n\n" +
      "Историческая справка:\n" +
      "Квантовая механика зародилась в начале XX века благодаря работам Планка, Эйнштейна, Бора, Шрёдингера, Гейзенберга и других учёных. " +
      "Она радикально изменила наше понимание микромира и привела к созданию новых технологий, включая лазеры, транзисторы и квантовые компьютеры." +
      "В этой лекции рассматриваем понятия волновой функции, принцип неопределённости и отличие классического и квантового описания.\n\n" +
      "Основные тезисы:\n" +
      "• частица описывается не траекторией, а волновой функцией;\n" +
      "• вероятность найти частицу в области пространства задаётся квадратом модуля волновой функции;\n" +
      "• измерение всегда влияет на систему.\n\n" +
      "Дополнительные материалы:\n" +
      "Волновая функция — это комплекснозначная функция, которая описывает квантовое состояние системы. " +
      "Её квадрат модуля определяет плотность вероятности нахождения частицы в определённой точке пространства. " +
      "Принцип неопределённости Гейзенберга утверждает, что невозможно одновременно точно измерить координату и импульс частицы. " +
      "Это фундаментальное свойство квантовых систем, а не ограничение измерительных приборов.\n\n" +
      "Историческая справка:\n" +
      "Квантовая механика зародилась в начале XX века благодаря работам Планка, Эйнштейна, Бора, Шрёдингера, Гейзенберга и других учёных. " +
      "Она радикально изменила наше понимание микромира и привела к созданию новых технологий, включая лазеры, транзисторы и квантовые компьютеры." +
      "В этой лекции рассматриваем понятия волновой функции, принцип неопределённости и отличие классического и квантового описания.\n\n" +
      "Основные тезисы:\n" +
      "• частица описывается не траекторией, а волновой функцией;\n" +
      "• вероятность найти частицу в области пространства задаётся квадратом модуля волновой функции;\n" +
      "• измерение всегда влияет на систему.\n\n" +
      "Дополнительные материалы:\n" +
      "Волновая функция — это комплекснозначная функция, которая описывает квантовое состояние системы. " +
      "Её квадрат модуля определяет плотность вероятности нахождения частицы в определённой точке пространства. " +
      "Принцип неопределённости Гейзенберга утверждает, что невозможно одновременно точно измерить координату и импульс частицы. " +
      "Это фундаментальное свойство квантовых систем, а не ограничение измерительных приборов.\n\n" +
      "Историческая справка:\n" +
      "Квантовая механика зародилась в начале XX века благодаря работам Планка, Эйнштейна, Бора, Шрёдингера, Гейзенберга и других учёных. " +
      "Она радикально изменила наше понимание микромира и привела к созданию новых технологий, включая лазеры, транзисторы и квантовые компьютеры." +
      "В этой лекции рассматриваем понятия волновой функции, принцип неопределённости и отличие классического и квантового описания.\n\n" +
      "Основные тезисы:\n" +
      "• частица описывается не траекторией, а волновой функцией;\n" +
      "• вероятность найти частицу в области пространства задаётся квадратом модуля волновой функции;\n" +
      "• измерение всегда влияет на систему.\n\n" +
      "Дополнительные материалы:\n" +
      "Волновая функция — это комплекснозначная функция, которая описывает квантовое состояние системы. " +
      "Её квадрат модуля определяет плотность вероятности нахождения частицы в определённой точке пространства. " +
      "Принцип неопределённости Гейзенберга утверждает, что невозможно одновременно точно измерить координату и импульс частицы. " +
      "Это фундаментальное свойство квантовых систем, а не ограничение измерительных приборов.\n\n" +
      "Историческая справка:\n" +
      "Квантовая механика зародилась в начале XX века благодаря работам Планка, Эйнштейна, Бора, Шрёдингера, Гейзенберга и других учёных. " +
      "Она радикально изменила наше понимание микромира и привела к созданию новых технологий, включая лазеры, транзисторы и квантовые компьютеры.",
      
  },
  {
    id: "demo-m-2",
    title: "Видео: Введение в квантовую механику (YouTube)",
    material_type: "video",
    url: "https://www.youtube.com/watch?v=Usu9xZfabPM",
  },
  {
    id: "demo-m-3",
    title: "Полезная ссылка: конспекты по физике МФТИ",
    material_type: "link",
    url: "https://mipt.ru/education/chair/physics/materials/",
  },
];

const DEMO_ASSIGNMENTS = [
  {
    id: "demo-a-1",
    title: "Домашнее задание 1: базовые понятия",
    description:
      "1) В двух абзацах опишите, что такое квантовая механика.\n" +
      "2) Приведите пример из жизни, где вероятностное описание полезнее классического.\n" +
      "3) Сформулируйте три вопроса по лекции.",
    due_date: "2025-12-01",
  },
  {
    id: "demo-a-2",
    title: "Домашнее задание 2: практическая задача",
    description:
      "Решите задачу на частицу в потенциальной яме. Можно приложить PDF/DOCX/изображение или архив с кодом.\n\n" +
      "Формат сдачи: текстовое пояснение + прикреплённый файл.",
    due_date: "2025-12-05",
  },
];

const MAX_NOTES_WIDGETS = 2;

// Модальное окно для лекций
function LectureModal({ material, isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEsc = (e) => {
      if (e.keyCode === 27) onClose();
    };
    
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !material) return null;

  return (
    <div className="cp-modal-overlay" onClick={handleOverlayClick}>
      <div className="cp-modal">
        <button className="cp-modal-close" onClick={onClose}>
          ×
        </button>
        <h3 className="cp-modal-title">{material.title}</h3>
        <div className="cp-modal-content">
          <pre className="cp-modal-text">{material.text}</pre>
        </div>
      </div>
    </div>
  );
}

function CoursePage({ currentUser }) {
  const { courseId, topicId } = useParams();

  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [topics, setTopics] = useState([]);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(-1);
  const [assignments, setAssignments] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [answerText, setAnswerText] = useState("");
  const [file, setFile] = useState(null);
  const [mySubmission, setMySubmission] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const [submissions, setSubmissions] = useState([]);
  const [gradeBySubmission, setGradeBySubmission] = useState({});
  const [commentBySubmission, setCommentBySubmission] = useState({});

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [widgetsOrder, setWidgetsOrder] = useState(["progress", "center", "chat"]);

  const [notesById, setNotesById] = useState({});
  const [notesCounter, setNotesCounter] = useState(0);

  useEffect(() => {
    fetchCourseById(courseId)
      .then((res) => setCourse(res.data))
      .catch((err) => console.error(err));
  }, [courseId]);

  useEffect(() => {
  fetchMaterialsByCourse(courseId)
    .then((res) => {
      let materials = res.data;
      // Если есть topicId, фильтруем материалы по теме
      if (topicId) {
        materials = materials.filter(material => material.topic === parseInt(topicId));
      }
      setMaterials(materials);
    })
    .catch((err) => console.error(err));
}, [courseId, topicId]);

  useEffect(() => {
    fetchMessagesByCourse(courseId)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error(err));
  }, [courseId]);

    // Загрузка тем курса
  useEffect(() => {
    if (!courseId) return;
    
    // Загрузка информации о курсе
    fetchCourseById(courseId)
      .then((res) => setCourse(res.data))
      .catch((err) => console.error(err));
    
    // Загрузка всех тем курса
    fetchTopicsByCourse(courseId)
      .then((res) => {
        const topicsData = res.data;
        setTopics(topicsData);
        
        // Найти текущую тему
        if (topicId) {
          const topicIndex = topicsData.findIndex(t => t.id === parseInt(topicId));
          if (topicIndex !== -1) {
            setCurrentTopic(topicsData[topicIndex]);
            setCurrentTopicIndex(topicIndex);
          } else if (topicsData.length > 0) {
            // Если тема не найдена, перейти к первой теме
            navigate(`/course/${courseId}/topic/${topicsData[0].id}`);
          }
        } else if (topicsData.length > 0) {
          // Если topicId не указан, перейти к первой теме
          navigate(`/course/${courseId}/topic/${topicsData[0].id}`);
        }
      })
      .catch((err) => console.error(err));
  }, [courseId, topicId, navigate]);

  const loadSubmissions = (assignmentId) => {
    fetchSubmissionsByAssignment(assignmentId)
      .then((res) => setSubmissions(res.data))
      .catch((err) => console.error(err));
  };

    // Функции для навигации между темами
  const goToPreviousTopic = () => {
    if (currentTopicIndex > 0) {
      const prevTopic = topics[currentTopicIndex - 1];
      navigate(`/course/${courseId}/topic/${prevTopic.id}`);
    }
  };

  const goToNextTopic = () => {
    if (currentTopicIndex < topics.length - 1) {
      const nextTopic = topics[currentTopicIndex + 1];
      navigate(`/course/${courseId}/topic/${nextTopic.id}`);
    }
  };

  const goToTopicsList = () => {
    navigate(`/course/${courseId}/topics`);
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

  const handleOpenLecture = (material) => {
    setSelectedLecture(material);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLecture(null);
  };

  const handleSubmit = async () => {
    if (!selectedAssignment || (!answerText && !file)) return;

    if (typeof selectedAssignment.id === "string") {
      alert("Это демо-задание. Для реального курса используйте настоящее.");
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

  const handleAddNotesWidget = () => {
    const existingNotesCount = Object.keys(notesById).length;
    if (existingNotesCount >= MAX_NOTES_WIDGETS) {
      alert("Можно добавить не более двух виджетов «Заметки».");
      return;
    }

    const nextIndex = notesCounter + 1;
    const id = `notes-${nextIndex}`;

    setNotesCounter(nextIndex);
    setNotesById((prev) => ({
      ...prev,
      [id]: {
        title: `Заметки ${nextIndex}`,
        text: "",
      },
    }));
    setWidgetsOrder((prev) => [...prev, id]);
  };

  const updateNote = (id, patch) => {
    setNotesById((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || { title: "Заметки", text: "" }),
        ...patch,
      },
    }));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(widgetsOrder);
    const [removed] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, removed);
    setWidgetsOrder(items);
  };

  const displayMaterials =
    materials && materials.length > 0 ? materials : DEMO_MATERIALS;

  const displayAssignments =
    assignments && assignments.length > 0 ? assignments : DEMO_ASSIGNMENTS;

  const progress = course?.progress ?? 0;
  const progressStatus =
    progress === 0 ? "Не начат" : progress >= 100 ? "Завершён" : "В процессе";
  const totalAssignments = displayAssignments.length;
  const approxDone =
    totalAssignments > 0
      ? Math.round((progress / 100) * totalAssignments)
      : 0;

  const notesCount = Object.keys(notesById).length;
  const notesLimitReached = notesCount >= MAX_NOTES_WIDGETS;

  return (
    <div className="cp-root">
      <TopBar currentUser={currentUser} notificationsCount={1} />

      {/* геометрия фона */}
      <div className="cp-geo cp-geo-1" />
      <div className="cp-geo cp-geo-2" />
      <div className="cp-geo cp-geo-3" />

      <main className="cp-main">
        <div className="cp-content">
          {/* Навигационная панель */}
          {topics.length > 0 && (
            <div className="course-topic-navigation">
              <button 
                onClick={goToTopicsList}
                className="nav-button back-to-topics"
              >
                ← К списку тем
              </button>
              
              <div className="topic-nav-controls">
                <button 
                  onClick={goToPreviousTopic}
                  disabled={currentTopicIndex <= 0}
                  className="nav-button prev-topic"
                >
                  ← Предыдущая тема
                </button>
                
                <span className="topic-counter">
                  Тема {currentTopicIndex + 1} из {topics.length}
                </span>
                
                <button 
                  onClick={goToNextTopic}
                  disabled={currentTopicIndex >= topics.length - 1}
                  className="nav-button next-topic"
                >
                  Следующая тема →
                </button>
              </div>
            </div>
          )}

          {/* Заголовок с названием темы */}
          <div className="course-page-header">
            <h2 className="cp-page-title">
              {currentTopic ? currentTopic.title : (course ? course.title : `Курс #${courseId}`)}
            </h2>
            {currentTopic && currentTopic.description && (
              <p className="cp-page-subtitle">
                {currentTopic.description}
              </p>
            )}
          </div>

          {/* Материалы */}
          <section className="cp-card" style={{ marginBottom: 12 }}>
            <h3 className="cp-section-subtitle">Материалы курса</h3>
            <ul className="cp-materials-list">
              {displayMaterials.map((m) => (
                <li key={m.id} className="cp-material-item">
                  <div className="cp-material-title">{m.title}</div>
                  {m.material_type === "text" && m.text && (
                    <div 
                      className="cp-material-body"
                      onClick={() => handleOpenLecture(m)}
                    >
                      {m.text.length > 200 ? (
                        <>
                          {m.text.slice(0, 200)}...
                          <button className="cp-read-more">Читать далее</button>
                        </>
                      ) : (
                        m.text
                      )}
                    </div>
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

          {/* Тулбар + виджеты */}
          <div className="cp-toolbar">
            <span className="cp-toolbar-label">
              Рабочее пространство курса (виджеты можно перетаскивать)
            </span>
            <button
              type="button"
              className={
                "cp-add-widget-btn" +
                (notesLimitReached ? " cp-add-widget-btn--disabled" : "")
              }
              onClick={handleAddNotesWidget}
              disabled={notesLimitReached}
            >
              <span className="cp-add-widget-plus">＋</span>
              <span>
                {notesLimitReached
                  ? "Максимум 2 виджета «Заметки»"
                  : "Добавить виджет «Заметки»"}
              </span>
            </button>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="columns" direction="horizontal">
              {(provided) => (
                <div
                  className="cp-layout"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {widgetsOrder.map((key, index) => (
                    <Draggable key={key} draggableId={key} index={index}>
                      {(dragProvided) => (
                        <div
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          {...dragProvided.dragHandleProps}
                        >
                          {key === "progress" && (
                            <aside className="cp-progress-sidebar">
                              <h3 className="cp-sidebar-title">
                                Моя успеваемость
                              </h3>
                              <div className="cp-progress-circle">
                                <div
                                  className="cp-progress-circle-inner"
                                  style={{ "--cp-progress": `${progress}%` }}
                                >
                                  <span className="cp-progress-circle-value">
                                    {progress}%
                                  </span>
                                </div>
                              </div>
                              <div className="cp-progress-status">
                                {progressStatus}
                              </div>
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
                          )}

                          {key === "center" && (
                            <div className="cp-center">
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
                                        onClick={() =>
                                          handleSelectAssignment(a)
                                        }
                                      >
                                        {a.title}
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </aside>

                              <section className="cp-main-panel">
                                {!selectedAssignment && (
                                  <div className="cp-card">
                                    <p className="cp-empty-text">
                                      Выберите задание слева, чтобы посмотреть
                                      детали.
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

                                    {currentUser.role === "student" && (
                                      <>
                                        <div className="cp-card cp-student-submit-card">
                                          <h4 className="cp-section-subtitle">
                                            Моё решение
                                          </h4>
                                          <textarea
                                            className="cp-textarea cp-chat-textarea"
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
                                              setFile(
                                                e.target.files[0] || null
                                              )
                                            }
                                            style={{
                                              marginTop: 8,
                                              marginBottom: 8,
                                            }}
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
                                                Пока нет комментариев. Можно
                                                задать вопрос преподавателю.
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
                                              className="cp-textarea cp-chat-textarea"
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
                                                        gradeBySubmission[
                                                          s.id
                                                        ] ?? (s.grade ?? "")
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
                                                      className="cp-input cp-chat-textarea"
                                                      type="text"
                                                      placeholder="Комментарий"
                                                      value={
                                                        commentBySubmission[
                                                          s.id
                                                        ] ??
                                                        (s.teacher_comment ??
                                                          "")
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
                                                        handleGradeSubmission(
                                                          s.id
                                                        )
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
                          )}

                          {key === "chat" && (
                            <aside className="cp-chat-panel">
                              <h3 className="cp-sidebar-title">
                                Чат с преподавателем
                              </h3>
                              <div className="cp-chat-messages">
                                {messages.length === 0 && (
                                  <div className="cp-empty-text">
                                    Пока нет сообщений. Напишите
                                    преподавателю вопрос.
                                  </div>
                                )}
                                {messages.map((m) => {
                                  const isMine =
                                    String(m.author) ===
                                    String(currentUser.id);
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
                                        {new Date(
                                          m.created_at
                                        ).toLocaleString()}
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
                                  onChange={(e) =>
                                    setNewMessage(e.target.value)
                                  }
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
                          )}

                          {key.startsWith("notes-") && (
                            <aside className="cp-notes-panel">
                              {(() => {
                                const note = notesById[key] || {
                                  title: "Заметки",
                                  text: "",
                                };
                                return (
                                  <>
                                    <input
                                      className="cp-notes-input"
                                      type="text"
                                      value={note.title}
                                      onChange={(e) =>
                                        updateNote(key, {
                                          title: e.target.value,
                                        })
                                      }
                                      placeholder="Заголовок заметок"
                                    />
                                    <textarea
                                      className="cp-textarea cp-notes-textarea"
                                      rows={6}
                                      value={note.text}
                                      onChange={(e) =>
                                        updateNote(key, {
                                          text: e.target.value,
                                        })
                                      }
                                      placeholder="Напишите свои заметки по курсу..."
                                    />
                                  </>
                                );
                              })()}
                            </aside>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </main>

      <footer className="cp-footer">
        Платформа реализации учебного процесса для ПСБ
      </footer>

      <LectureModal
        material={selectedLecture}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default CoursePage;