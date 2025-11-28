import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import CoursePage from "./pages/CoursePage";

function App() {
  const [currentUser, setCurrentUser] = useState(null); // {id, name, role, ...}

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<LoginPage onLogin={setCurrentUser} currentUser={currentUser} />}
        />
        <Route
          path="/student"
          element={
            currentUser && currentUser.role === "student" ? (
              <StudentDashboard currentUser={currentUser} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/teacher"
          element={
            currentUser && currentUser.role === "teacher" ? (
              <TeacherDashboard currentUser={currentUser} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/course/:courseId"
          element={
            currentUser ? (
              <CoursePage currentUser={currentUser} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
