// client/src/pages/CourseTopicsPage.js
import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate  } from "react-router-dom";
import { fetchTopicsByCourse, createTopic, deleteTopic, fetchCourseById } from "../api";
import TopBar from "../components/TopBar";
import "./CourseTopicsPage.css";

const COLOR_PRESETS = [
  { id: "coral", label: "Коралловый", value: "#FF6B6B" },
  { id: "gold", label: "Золотой", value: "#FFD93D" },
  { id: "mint", label: "Мятный", value: "#6BCF7F" },
  { id: "lavender", label: "Лавандовый", value: "#9B7EDE" },
  { id: "sky", label: "Небесный", value: "#4FC0E8" },
  { id: "pink", label: "Розовый", value: "#FF9FF3" },
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
    <div className={`ctp-custom-select ${className}`} ref={selectRef}>
      <div 
        className={`ctp-custom-select-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption.label}</span>
        <div className={`ctp-custom-select-arrow ${isOpen ? 'open' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="ctp-custom-select-options open">
          {options.map((option) => (
            <div
              key={option.id}
              className={`ctp-custom-option ${value === option.id ? 'selected' : ''}`}
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

function CourseTopicsPage({ currentUser }) {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [topics, setTopics] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [colorId, setColorId] = useState(COLOR_PRESETS[0].id);

  useEffect(() => {
    fetchCourseById(courseId)
      .then((res) => setCourse(res.data))
      .catch((err) => console.error(err));
    
    loadTopics();
  }, [courseId]);

  const loadTopics = () => {
    fetchTopicsByCourse(courseId)
      .then((res) => setTopics(res.data))
      .catch((err) => console.error(err));
  };

  const goToCourses = () => {
    if (currentUser?.role === "teacher") {
      navigate("/teacher");
    } else {
      navigate("/student");
    }
  };

  const handleCreateTopic = async () => {
    if (!title) return;
    try {
      const selectedColor = COLOR_PRESETS.find(preset => preset.id === colorId);
      
      await createTopic({
        title,
        description,
        course: courseId,
        color: selectedColor ? selectedColor.value : COLOR_PRESETS[0].value,
      });
      setTitle("");
      setDescription("");
      setColorId(COLOR_PRESETS[0].id);
      setShowForm(false);
      loadTopics();
    } catch (e) {
      console.error(e);
      alert("Ошибка при создании темы");
    }
  };

  const confirmDelete = (topic) => {
    if (window.confirm(`Вы уверены, что хотите удалить тему "${topic.title}"? Это действие нельзя отменить.`)) {
      handleDeleteTopic(topic.id);
    }
  };

  const handleDeleteTopic = async (topicId) => {
    try {
      await deleteTopic(topicId);
      setTopics(topics.filter(topic => topic.id !== topicId));
    } catch (error) {
      console.error("Ошибка при удалении темы:", error);
      alert("Не удалось удалить тему");
    }
  };

  const getCardColor = (topic) => {
    if (topic.color) {
      return topic.color;
    }
    const index = topics.findIndex(t => t.id === topic.id);
    const preset = COLOR_PRESETS[index % COLOR_PRESETS.length];
    return preset.value;
  };

  return (
    <div className="ctp-root">
      <TopBar currentUser={currentUser} />
      
      {/* Геометрические элементы фона */}
      <div className="ctp-geo ctp-geo-1"></div>
      <div className="ctp-geo ctp-geo-2"></div>
      <div className="ctp-geo ctp-geo-3"></div>

      <main className="ctp-main">
        <div className="ctp-content">
          {/* Кнопка возврата к курсам */}
          <div className="ctp-back-to-courses">
            <button 
              onClick={goToCourses}
              className="ctp-back-button"
            >
              ← Вернуться к курсам
            </button>
          </div>

          <div className="ctp-header-section">
            <h1 className="ctp-page-title">
              {course ? course.title : `Курс #${courseId}`}
            </h1>
            <p className="ctp-page-subtitle">
              Управление темами и материалами курса
            </p>
          </div>

          {currentUser?.role === "teacher" && (
            <>
              {!showForm && (
                <div className="ctp-create-topic-button-container">
                  <button 
                    className="ctp-create-topic-button"
                    onClick={() => setShowForm(true)}
                  >
                    <span className="ctp-create-topic-icon">+</span>
                    Создать новую тему
                  </button>
                </div>
              )}

              {showForm && (
                <section className="ctp-add-card">
                  <div className="ctp-add-card-header">
                    <h3 className="ctp-add-title">Создать новую тему</h3>
                    <button 
                      className="ctp-close-form-button"
                      onClick={() => setShowForm(false)}
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="ctp-add-form">
                    <div className="ctp-add-field">
                      <input
                        type="text"
                        placeholder="Название темы *"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="ctp-input"
                      />
                    </div>

                    <div className="ctp-add-field">
                      <textarea
                        placeholder="Описание темы"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="ctp-input ctp-textarea"
                        rows="3"
                      />
                    </div>

                    <div className="ctp-add-field">
                      <label className="ctp-label">Цвет темы</label>
                      <CustomSelect
                        options={COLOR_PRESETS}
                        value={colorId}
                        onChange={setColorId}
                        placeholder="Выберите цвет"
                      />
                    </div>

                    <div className="ctp-form-actions">
                      <button
                        className="ctp-cancel-button"
                        onClick={() => setShowForm(false)}
                      >
                        Отмена
                      </button>
                      <button
                        className="ctp-add-button"
                        onClick={handleCreateTopic}
                        disabled={!title}
                      >
                        Создать тему
                      </button>
                    </div>
                  </div>
                </section>
              )}
            </>
          )}

          <section className="ctp-topics-section">
            <h2 className="ctp-section-title">
              Темы курса {topics.length > 0 && `(${topics.length})`}
            </h2>

            {topics.length === 0 ? (
              <div className="ctp-empty-state">
                <p className="ctp-empty-text">В этом курсе пока нет тем</p>
                <p className="ctp-empty-subtext">
                  {currentUser?.role === "teacher" 
                    ? "Создайте первую тему, чтобы добавить материалы" 
                    : "Темы будут добавлены преподавателем позже"}
                </p>
              </div>
            ) : (
              <div className="ctp-topics-grid">
                {topics.map((topic) => {
                  const bgColor = getCardColor(topic);
                  const materialsCount = topic.materials_count || 0;

                  return (
                    <div key={topic.id} className="ctp-topic-card-wrapper">
                      <div className="ctp-topic-card-header">
                        <Link
                          to={`/course/${courseId}/topic/${topic.id}`}
                          className="ctp-topic-card-link"
                        >
                          <div
                            className="ctp-topic-card"
                            style={{ backgroundColor: bgColor }}
                          >
                            <div className="ctp-topic-header">
                              <h3 className="ctp-topic-title">
                                {topic.title}
                              </h3>
                              <div className="ctp-topic-meta">
                                <span className="ctp-topic-materials">
                                  {materialsCount} материалов
                                </span>
                              </div>
                            </div>

                            <p className="ctp-topic-description">
                              {topic.description && topic.description.trim().length > 0
                                ? topic.description
                                : "Описание темы пока не добавлено..."}
                            </p>

                            <div className="ctp-topic-footer">
                              <span className="ctp-topic-action">
                                Перейти к материалам →
                              </span>
                            </div>
                          </div>
                        </Link>
                        
                        {/* Кнопка удаления для преподавателя */}
                        {currentUser?.role === "teacher" && (
                          <button
                            className="ctp-delete-topic-button"
                            onClick={() => confirmDelete(topic)}
                            title="Удалить тему"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="ctp-footer">
        <div className="ctp-footer-content">
          Платформа реализации учебного процесса для ПСБ
          <span className="ctp-footer-separator">•</span>
          {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}

export default CourseTopicsPage;