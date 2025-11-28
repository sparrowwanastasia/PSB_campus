// client/src/pages/LoginPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPersons } from "../api";
import "./LoginPage.css";

function LoginPage({ onLogin, currentUser }) {
  const [persons, setPersons] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPersons()
      .then((res) => setPersons(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleLogin = () => {
    const person = persons.find((p) => String(p.id) === String(selectedId));
    if (!person) return;
    onLogin(person);
    if (person.role === "student") {
      navigate("/student");
    } else {
      navigate("/teacher");
    }
  };

   return (
    <div className="login-root">
      <header className="login-header">
        <div className="login-header-title">PSB Campus</div>
        <div className="login-header-subtitle">
          Заходи не бойся, выходи не плачь
        </div>
      </header>

      <main className="login-main">
        <div className="login-card">
          <h2 className="login-card-title">Вход</h2>

          <label className="login-label">
            Выберите пользователя:
            <select
              className="login-select"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              <option value="">-- выберите --</option>
              {persons.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.role})
                </option>
              ))}
            </select>
          </label>

          <button
            className="login-button"
            onClick={handleLogin}
            disabled={!selectedId}
          >
            Войти в систему
          </button>

          {currentUser && (
            <p className="login-current-user">
              Текущий пользователь: {currentUser.name} ({currentUser.role})
            </p>
          )}
        </div>
      </main>

      {/* Геометрические элементы фона */}
      <div className="login-geometric-element geometric-1"></div>
      <div className="login-geometric-element geometric-2"></div>
      <div className="login-geometric-element geometric-3"></div>
      <div className="login-geometric-element geometric-4"></div>

      <footer className="login-footer">
        Платформа реализации учебного процесса для ПСБ
      </footer>
    </div>
  );
}

export default LoginPage;
