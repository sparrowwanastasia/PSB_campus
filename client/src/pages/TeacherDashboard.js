// client/src/pages/TeacherDashboard.js
import React, { useEffect, useState, useRef } from "react";
import {
  fetchCoursesByPerson,
  createCourse,
  fetchStudents,
  addStudentToCourse,
} from "../api";
import { Link } from "react-router-dom";
import "./TeacherDashboard.css";

const COLOR_PRESETS = [
  { id: "coral", label: "Коралловый", value: "#FF6B6B" },
  { id: "gold", label: "Золотой", value: "#FFD93D" },
  { id: "mint", label: "Мятный", value: "#6BCF7F" },
  { id: "lavender", label: "Лавандовый", value: "#9B7EDE" },
];

// Кастомный компонент Select
const CustomSelect = ({ options, value, onChange, placeholder, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const selectedOption = options.find(opt => opt.id === value) || { label: placeholder };

  const handleOptionClick = (option) => {
    onChange(option.id);
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (selectRef.current && !selectRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`td-custom-select ${className}`} ref={selectRef}>
      <div 
        className={`td-custom-select-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption.label}</span>
        <div className={`td-custom-select-arrow ${isOpen ? 'open' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="td-custom-select-options open">
          {options.map((option) => (
            <div
              key={option.id}
              className={`td-custom-option ${value === option.id ? 'selected' : ''}`}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Кастомный компонент StudentSelect
const StudentSelect = ({ students, value, onChange, placeholder, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const selectedStudent = students.find(s => s.id === value);
  const displayValue = selectedStudent ? selectedStudent.name : placeholder;

  const handleOptionClick = (student) => {
    onChange(student.id);
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (selectRef.current && !selectRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`td-custom-select ${className}`} ref={selectRef}>
      <div 
        className={`td-custom-select-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{displayValue}</span>
        <div className={`td-custom-select-arrow ${isOpen ? 'open' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="td-custom-select-options open">
          {students.map((student) => (
            <div
              key={student.id}
              className={`td-custom-option ${value === student.id ? 'selected' : ''}`}
              onClick={() => handleOptionClick(student)}
            >
              {student.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function TeacherDashboard({ currentUser }) {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [colorId, setColorId] = useState(COLOR_PRESETS[0].id);
  const [showForm, setShowForm] = useState(false);

  const [students, setStudents] = useState([]);
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
  }, [currentUser]);

  const handleCreateCourse = async () => {
    if (!title) return;
    try {
      // Получаем выбранный цвет
      const selectedColor = COLOR_PRESETS.find(preset => preset.id === colorId);
      
      await createCourse({
        title,
        description,
        teacher: currentUser.id,
        color: selectedColor ? selectedColor.value : COLOR_PRESETS[0].value, // Передаем цвет на сервер
      });
      setTitle("");
      setDescription("");
      setColorId(COLOR_PRESETS[0].id);
      setShowForm(false);
      loadCourses();
    } catch (e) {
      console.error(e);
      alert("Ошибка при создании курса");
    }
  };

  // Функция для получения цвета карточки из данных курса
  const getCardColor = (course) => {
    // Если цвет сохранен в курсе, используем его (теперь с сервера приходит поле color)
    if (course.color) {
      return course.color;
    }
    
    // На всякий случай оставляем старую логику для обратной совместимости
    const index = courses.findIndex(c => c.id === course.id);
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
      setSelectedStudentByCourse((prev) => ({
        ...prev,
        [courseId]: "",
      }));
    } catch (e) {
      console.error(e);
      alert("Ошибка при назначении студента");
    }
  };

  return (
    <div className="td-root">
      <header className="td-header">
        <div className="td-header-title">PSB Campus</div>
        <div className="td-header-right">
          <div className="td-header-subtitle">
            Кабинет преподавателя
          </div>
        </div>
      </header>

      <main className="td-main">
        <div className="td-content">
          <h1 className="td-page-title">
            Добро пожаловать, {currentUser?.name ?? "Преподаватель"}!
          </h1>
          <p className="td-page-subtitle">
            Управляйте вашими курсами и назначайте задания студентам
          </p>

          {!showForm && (
            <div className="td-create-course-button-container">
              <button 
                className="td-create-course-button"
                onClick={() => setShowForm(true)}
              >
                <span className="td-create-course-icon">+</span>
                Создать новый курс
              </button>
            </div>
          )}

          {showForm && (
            <section className="td-add-card">
              <div className="td-add-card-header">
                <h3 className="td-add-title">Создать новый курс</h3>
                <button 
                  className="td-close-form-button"
                  onClick={() => setShowForm(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="td-add-form">
                <div className="td-add-field">
                  <input
                    type="text"
                    placeholder="Название курса *"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="td-input"
                  />
                </div>

                <div className="td-add-field">
                  <textarea
                    placeholder="Описание курса"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="td-input td-textarea"
                    rows="3"
                  />
                </div>

                <div className="td-add-field">
                  <label className="td-label">Цвет курса</label>
                  <CustomSelect
                    options={COLOR_PRESETS}
                    value={colorId}
                    onChange={setColorId}
                    placeholder="Выберите цвет"
                  />
                </div>

                <div className="td-form-actions">
                  <button
                    className="td-cancel-button"
                    onClick={() => setShowForm(false)}
                  >
                    Отмена
                  </button>
                  <button
                    className="td-add-button"
                    onClick={handleCreateCourse}
                    disabled={!title}
                  >
                    Создать курс
                  </button>
                </div>
              </div>
            </section>
          )}

          <section className="td-courses-section">
            <h2 className="td-section-title">Мои курсы</h2>

            {courses.length === 0 ? (
              <div className="td-empty-state">
                <p className="td-empty-text">У вас пока нет курсов</p>
                <p className="td-empty-subtext">Создайте первый курс, чтобы начать работу</p>
              </div>
            ) : (
              <div className="td-courses-grid">
                {courses.map((course) => {
                  const bgColor = getCardColor(course); // Используем новую функцию
                  const progress = course.progress ?? 0;
                  const studentCount = course.students?.length || 0;

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
                            <h3 className="td-course-title">
                              {course.title}
                            </h3>
                            <div className="td-course-meta">
                              <span className="td-course-students">
                                {studentCount} студентов
                              </span>
                            </div>
                          </div>

                          <p className="td-course-description">
                            {course.description && course.description.trim().length > 0
                              ? course.description
                              : "Описание курса пока не добавлено..."}
                          </p>

                          <div className="td-course-progress">
                            <div className="td-course-progress-row">
                              <span className="td-course-progress-perc">
                                {progress}%
                              </span>
                              <span className="td-course-progress-label">
                                Прогресс курса
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

                      <div className="td-course-assign">
                        <StudentSelect
                          students={students}
                          value={selectedStudentByCourse[course.id] || ""}
                          onChange={(studentId) => handleSelectStudentForCourse(course.id, studentId)}
                          placeholder="Выберите студента..."
                        />
                        <button
                          className="td-assign-button"
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
            )}
          </section>
        </div>
      </main>

      <footer className="td-footer">
        <div className="td-footer-content">
          Платформа реализации учебного процесса для ПСБ
          <span className="td-footer-separator">•</span>
          {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}

export default TeacherDashboard;