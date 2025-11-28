import React, { useEffect, useState } from "react";
import { fetchCoursesByPerson } from "../api";
import { Link } from "react-router-dom";

function TeacherDashboard({ currentUser }) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCoursesByPerson(currentUser.id)
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err));
  }, [currentUser]);

  return (
    <div style={{ padding: 24 }}>
      <h2>Кабинет преподавателя: {currentUser.name}</h2>
      <h3>Мои курсы</h3>
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
