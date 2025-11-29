// client/src/pages/StudentDashboard.js
import React, { useEffect, useState } from "react";
import { fetchCoursesByPerson } from "../api";
import { Link } from "react-router-dom";
import "./StudentDashboard.css";
import TopBar from "../components/TopBar";

// Функция для получения класса статуса
const getStatusClass = (progress) => {
  if (progress >= 100) return "sd-course-status--done";
  if (progress > 0) return "sd-course-status--in-progress";
  return "sd-course-status--not-started";
};

function StudentDashboard({ currentUser }) {
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState("all"); // all, done, in-progress, not-started

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    fetchCoursesByPerson(currentUser.id)
      .then((res) => {
        const cs = res.data;
        setCourses(cs);

        // уведомления — новые курсы (прогресс 0)
        const newCourses = cs.filter((c) => (c.progress ?? 0) === 0);
        if (newCourses.length > 0) {
          setNotifications(
            newCourses.map((c) => ({
              id: c.id,
              text: `Назначен новый курс: «${c.title}»`,
            }))
          );
        } else {
          setNotifications([]);
        }
      })
      .catch((err) => console.error(err));
  }, [currentUser]);

  // Функция для получения цвета карточки из данных курса (как у преподавателя)
  const getCardColor = (course) => {
    // Используем цвет из данных курса с сервера
    if (course.color) {
      return course.color;
    }
    
    // На всякий случай оставляем старую логику для обратной совместимости
    const index = courses.findIndex(c => c.id === course.id);
    const defaultColors = ["#FF6B6B", "#FFD93D", "#6BCF7F", "#9B7EDE"]; // Те же цвета что у преподавателя
    return defaultColors[index % defaultColors.length];
  };

  const filteredCourses = courses.filter((course) => {
    const p = course.progress ?? 0;
    if (filter === "done") return p >= 100;
    if (filter === "in-progress") return p > 0 && p < 100;
    if (filter === "not-started") return p === 0;
    return true; // all
  });

  return (
    <div className="sd-root">
      <TopBar currentUser={currentUser} />

      <main className="sd-main">
        <div className="sd-content">
          <h2 className="sd-page-title">
            Кабинет студента: {currentUser?.name ?? "..."}
          </h2>

          <p className="sd-page-subtitle">
            Здесь собраны все курсы, на которые вы записаны.
          </p>

          {/* Фильтры */}
          <div className="sd-filters">
            <button
              className={`sd-filter-button ${
                filter === "all" ? "sd-filter-button--active" : ""
              }`}
              onClick={() => setFilter("all")}
            >
              Все
            </button>
            <button
              className={`sd-filter-button ${
                filter === "done" ? "sd-filter-button--active" : ""
              }`}
              onClick={() => setFilter("done")}
            >
              Выполнены
            </button>
            <button
              className={`sd-filter-button ${
                filter === "in-progress" ? "sd-filter-button--active" : ""
              }`}
              onClick={() => setFilter("in-progress")}
            >
              В процессе
            </button>
            <button
              className={`sd-filter-button ${
                filter === "not-started" ? "sd-filter-button--active" : ""
              }`}
              onClick={() => setFilter("not-started")}
            >
              Не начаты
            </button>
          </div>

          <section className="sd-courses-section">
            <h3 className="sd-section-title">Мои курсы</h3>

            {filteredCourses.length === 0 && (
              <p className="sd-empty-text">
                Курсов с таким фильтром пока нет.
              </p>
            )}

            <div className="sd-courses-grid">
              {filteredCourses.map((course) => {
                const bgColor = getCardColor(course); // Используем новую функцию
                const progress = course.progress ?? 0;

                return (
                  <Link
                    to={`/course/${course.id}/topics`}
                    key={course.id}
                    className="sd-course-card-link"
                  >
                    <div
                      className="sd-course-card"
                      style={{ backgroundColor: bgColor }}
                    >
                      {/* Статусный индикатор */}
                      <div className={`sd-course-status ${getStatusClass(progress)}`} />
                      
                      <div className="sd-course-header">
                        <span className="sd-course-title">
                          {course.title}
                        </span>
                      </div>

                      <div className="sd-course-description">
                        {course.description &&
                        course.description.trim().length > 0
                          ? course.description
                          : "Описание будет добавлено позже"}
                      </div>

                      <div className="sd-course-progress">
                        <div className="sd-course-progress-row">
                          <span className="sd-course-progress-perc">
                            {progress}%
                          </span>
                          <span className="sd-course-progress-label">
                            Прогресс по курсу
                          </span>
                        </div>
                        <div className="sd-course-progress-bar">
                          <div
                            className="sd-course-progress-bar-fill"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      {/* Геометрические элементы фона */}
      <div className="sd-geometric-element sd-geo-1"></div>
      <div className="sd-geometric-element sd-geo-2"></div>
      <div className="sd-geometric-element sd-geo-3"></div>

      <footer className="sd-footer">
        Платформа реализации учебного процесса для ПСБ
      </footer>
    </div>
  );
}

export default StudentDashboard;