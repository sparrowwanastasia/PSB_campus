import React, { useEffect, useState } from "react";
import { fetchCoursesByPerson } from "../api";
import { Link } from "react-router-dom";

function StudentDashboard({ currentUser }) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    fetchCoursesByPerson(currentUser.id)
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err));
  }, [currentUser]);

  return (
    <div style={{ padding: 24 }}>
      <h2>Кабинет студента: {currentUser.name}</h2>
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

export default StudentDashboard;
