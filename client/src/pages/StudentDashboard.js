// client/src/pages/StudentDashboard.js
import React, { useEffect, useState } from "react";
import { fetchCoursesByPerson } from "../api";
import { Link } from "react-router-dom";
import "./StudentDashboard.css";

const COLOR_PRESETS = [
  { id: "pink", value: "#f8c4c4" },
  { id: "beige", value: "#e8e1b8" },
  { id: "blue", value: "#c7dbff" },
];

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

  const getCardColorByIndex = (index) => {
    const preset = COLOR_PRESETS[index % COLOR_PRESETS.length];
    return preset.value;
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
      <header className="sd-header">
        <div className="sd-header-title">PSB Campus</div>

        <div className="sd-header-right">
          <div className="sd-header-subtitle">
            Заходи не бойся, выходи не плачь
          </div>

          <div className="sd-notifications">
            <button
              className="sd-notify-button"
              onClick={() => setShowNotifications((v) => !v)}
            >
              🔔
              {notifications.length > 0 && (
                <span className="sd-notify-badge">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="sd-notify-popup">
                {notifications.length === 0 && (
                  <div className="sd-notify-empty">
                    Новых курсов нет
                  </div>
                )}
                {notifications.map((n) => (
                  <div key={n.id} className="sd-notify-item">
                    {n.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

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
              {filteredCourses.map((course, index) => {
                const bgColor = getCardColorByIndex(index);
                const progress = course.progress ?? 0;

                return (
                  <Link
                    to={`/course/${course.id}`}
                    key={course.id}
                    className="sd-course-card-link"
                  >
                    <div
                      className="sd-course-card"
                      style={{ backgroundColor: bgColor }}
                    >
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

      <footer className="sd-footer">
        Платформа реализации учебного процесса для ПСБ
      </footer>
    </div>
  );
}

export default StudentDashboard;
