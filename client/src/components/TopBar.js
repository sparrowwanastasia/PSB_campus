// client/src/components/TopBar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./TopBar.css";

function TopBar({ currentUser, notificationsCount = 1 }) {
  const hasUser = !!currentUser;
  const navigate = useNavigate();

  const roleLabel =
    currentUser?.role === "teacher"
      ? "Преподаватель"
      : currentUser?.role === "student"
      ? "Студент"
      : "";

  // Функция для перехода на дашборд курсов
  const goToDashboard = () => {
    if (!currentUser) {
      navigate("/");
      return;
    }
    
    if (currentUser.role === "teacher") {
      navigate("/teacher");
    } else {
      navigate("/student");
    }
  };

  // Функция для перехода на главную
  const goToHome = () => {
    navigate("/");
  };

  return (
    <header className="topbar-root">
      <div className="topbar-left">
        <button onClick={goToHome} className="topbar-logo-button">
          <div className="topbar-logo">PSB Campus</div>
        </button>
        <div className="topbar-subtitle">
          Единая среда для обучения и контроля прогресса
        </div>
      </div>

      {hasUser && (
        <div className="topbar-right">
          {/* Ссылка "Курсы" */}
          <button 
            onClick={goToDashboard}
            className="topbar-courses-link"
          >
            Курсы
          </button>

          <button className="topbar-bell" type="button">
            <span className="topbar-bell-circle">
              <span className="topbar-bell-emoji">🔔</span>
            </span>
            {notificationsCount > 0 && (
              <span className="topbar-badge">{notificationsCount}</span>
            )}
          </button>

          <div className="topbar-user-pill">
            <span className="topbar-user-name">
              {currentUser?.name || "Пользователь"}
            </span>
            {roleLabel && (
              <span className="topbar-role-chip">{roleLabel}</span>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default TopBar;