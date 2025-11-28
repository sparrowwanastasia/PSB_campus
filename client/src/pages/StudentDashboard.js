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

  useEffect(() => {
    if (!currentUser) return;
    fetchCoursesByPerson(currentUser.id)
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err));
  }, [currentUser]);

  const getCardColorByIndex = (index) => {
    const preset = COLOR_PRESETS[index % COLOR_PRESETS.length];
    return preset.value;
  };

  return (
    <div className="sd-root">
      <header className="sd-header">
        <div className="sd-header-title">PSB Campus</div>
        <div className="sd-header-subtitle">
          Заходи не бойся, выходи не плачь
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

          <section className="sd-courses-section">
            <h3 className="sd-section-title">Мои курсы</h3>

            {courses.length === 0 && (
              <p className="sd-empty-text">
                Пока нет активных курсов. Обратитесь к преподавателю.
              </p>
            )}

            <div className="sd-courses-grid">
              {courses.map((course, index) => {
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
