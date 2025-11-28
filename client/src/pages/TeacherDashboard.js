// client/src/pages/TeacherDashboard.js
import React, { useEffect, useState } from "react";
import {
  fetchCoursesByPerson,
  createCourse,
  fetchStudents,
  addStudentToCourse,
} from "../api";
import { Link } from "react-router-dom";
import "./TeacherDashboard.css";

const COLOR_PRESETS = [
  { id: "pink", label: "Розовый", value: "#f8c4c4" },
  { id: "beige", label: "Бежевый", value: "#e8e1b8" },
  { id: "blue", label: "Голубой", value: "#c7dbff" },
];

function TeacherDashboard({ currentUser }) {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [colorId, setColorId] = useState(COLOR_PRESETS[0].id);

  const [students, setStudents] = useState([]);
  // для каждого курса храним выбранного студента
  const [selectedStudentByCourse, setSelectedStudentByCourse] = useState({});

  const loadCourses = () => {
    if (!currentUser) return;
    fetchCoursesByPerson(currentUser.id)
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err));
  };

  const loadStudents = () => {
    fetchStudents()
      .then((res) => setStudents(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadCourses();
    loadStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const handleCreateCourse = async () => {
    if (!title) return;
    try {
      await createCourse({
        title,
        description,
        teacher: currentUser.id, // ВАЖНО: именно teacher
      });
      setTitle("");
      setDescription("");
      setColorId(COLOR_PRESETS[0].id);
      loadCourses();
    } catch (e) {
      console.error(e);
      alert("Ошибка при создании курса");
    }
  };

  const getCardColorByIndex = (index) => {
    const preset = COLOR_PRESETS[index % COLOR_PRESETS.length];
    return preset.value;
  };

  const handleSelectStudentForCourse = (courseId, studentId) => {
    setSelectedStudentByCourse((prev) => ({
      ...prev,
      [courseId]: studentId,
    }));
  };

  const handleAssignStudentToCourse = async (courseId) => {
    const studentId = selectedStudentByCourse[courseId];
    if (!studentId) return;

    try {
      await addStudentToCourse(courseId, studentId);
      alert("Студент назначен на курс");
      // после назначения студент увидит курс в своём кабинете автоматически
    } catch (e) {
      console.error(e);
      alert("Ошибка при назначении студента");
    }
  };

  return (
    <div className="td-root">
      {/* Верхняя фиолетовая полоса */}
      <header className="td-header">
        <div className="td-header-title">PSB Campus</div>
        <div className="td-header-subtitle">
          Заходи не бойся, выходи не плачь
        </div>
      </header>

      {/* Основной контент */}
      <main className="td-main">
        <div className="td-content">
          <h2 className="td-page-title">
            Кабинет преподавателя: {currentUser?.name ?? "..."}
          </h2>

          {/* Карточка добавления курса */}
          <section className="td-add-card">
            <h3 className="td-add-title">Добавить новый курс</h3>

            <div className="td-add-field">
              <input
                type="text"
                placeholder="Название курса"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="td-input"
              />
            </div>

            <div className="td-add-field">
              <input
                placeholder="Описание курса"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="td-input"
              />
            </div>

            <div className="td-add-field">
              <select
                className="td-select"
                value={colorId}
                onChange={(e) => setColorId(e.target.value)}
              >
                <option value="">Цвет курса</option>
                {COLOR_PRESETS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="td-add-button"
              onClick={handleCreateCourse}
              disabled={!title}
            >
              Добавить курс
            </button>
          </section>

          {/* Список курсов */}
          <section className="td-courses-section">
            <h3 className="td-section-title">Ваши курсы:</h3>

            {courses.length === 0 && (
              <p className="td-empty-text">Пока нет курсов</p>
            )}

            <div className="td-courses-grid">
              {courses.map((course, index) => {
                const bgColor = getCardColorByIndex(index);
                const progress = course.progress ?? 0;

                return (
                  <div key={course.id} className="td-course-card-wrapper">
                    <Link
                      to={`/course/${course.id}`}
                      className="td-course-card-link"
                    >
                      <div
                        className="td-course-card"
                        style={{ backgroundColor: bgColor }}
                      >
                        <div className="td-course-header">
                          <span className="td-course-title">
                            {course.title}
                          </span>
                        </div>

                        <div className="td-course-description">
                          {course.description &&
                          course.description.trim().length > 0
                            ? course.description
                            : "Описание не задано"}
                        </div>

                        <div className="td-course-progress">
                          <div className="td-course-progress-row">
                            <span className="td-course-progress-perc">
                              {progress}%
                            </span>
                            <span className="td-course-progress-label">
                              Прогресс
                            </span>
                          </div>
                          <div className="td-course-progress-bar">
                            <div
                              className="td-course-progress-bar-fill"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* Блок назначения студента под карточкой */}
                    <div className="td-course-assign">
                      <select
                        className="td-input"
                        value={selectedStudentByCourse[course.id] || ""}
                        onChange={(e) =>
                          handleSelectStudentForCourse(
                            course.id,
                            e.target.value
                          )
                        }
                      >
                        <option value="">
                          Назначить студенту...
                        </option>
                        {students.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                      <button
                        className="td-add-button"
                        style={{ marginLeft: 8, padding: "9px 16px" }}
                        onClick={() => handleAssignStudentToCourse(course.id)}
                        disabled={!selectedStudentByCourse[course.id]}
                      >
                        Назначить
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      {/* Нижняя фиолетовая полоса */}
      <footer className="td-footer">
        Платформа реализации учебного процесса для ПСБ
      </footer>
    </div>
  );
}

export default TeacherDashboard;
