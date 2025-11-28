// client/src/App.js
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import CoursePage from "./pages/CoursePage";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const requireUser = (element, role = null) => {
    if (!currentUser) return <Navigate to="/" replace />;
    if (role && currentUser.role !== role) return <Navigate to="/" replace />;
    return element;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <LoginPage onLogin={handleLogin} currentUser={currentUser} />
          }
        />
        <Route
          path="/student"
          element={requireUser(
            <StudentDashboard currentUser={currentUser} />,
            "student"
          )}
        />
        <Route
          path="/teacher"
          element={requireUser(
            <TeacherDashboard currentUser={currentUser} />,
            "teacher"
          )}
        />
        <Route
          path="/course/:courseId"
          element={requireUser(
            <CoursePage currentUser={currentUser} />,
            null // и студент, и преподаватель
          )}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
