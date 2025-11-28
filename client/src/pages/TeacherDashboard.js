import React, { useEffect, useState } from "react";
import { fetchCoursesByPerson, createCourse } from "../api";
import { Link } from "react-router-dom";

function TeacherDashboard({ currentUser }) {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const loadCourses = () => {
    fetchCoursesByPerson(currentUser.id)
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadCourses();
  }, [currentUser]);

  const handleCreateCourse = async () => {
    try {
      await createCourse({
        title,
        description,
        teacher_id: currentUser.id,
      });
      setTitle("");
      setDescription("");
      loadCourses();
    } catch (e) {
      console.error(e);
      alert("Ошибка при создании курса");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Кабинет преподавателя: {currentUser.name}</h2>

      {/* Форма добавления курса */}
      <div
        style={{
          marginBottom: 24,
          padding: 16,
          border: "1px solid #ccc",
          borderRadius: 8,
        }}
      >
        <h3>Добавить новый курс</h3>
        <div style={{ marginBottom: 8 }}>
          <input
            type="text"
            placeholder="Название курса"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <textarea
            placeholder="Описание курса"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <button onClick={handleCreateCourse} disabled={!title}>
          Создать курс
        </button>
      </div>

      {/* Список курсов */}
      <h3>Мои курсы</h3>
      {courses.length === 0 && <p>Пока нет курсов</p>}
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            <Link to={`/course/${course.id}`}>{course.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TeacherDashboard;
