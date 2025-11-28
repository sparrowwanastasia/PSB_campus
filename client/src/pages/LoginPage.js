// client/src/pages/LoginPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPersons } from "../api";

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
    <div style={{ padding: 24 }}>
      <h1>PSB Campus</h1>
      <p>Выберите пользователя для входа:</p>

      <select
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

      <div style={{ marginTop: 16 }}>
        <button onClick={handleLogin} disabled={!selectedId}>
          Войти
        </button>
      </div>

      {currentUser && (
        <p style={{ marginTop: 16 }}>
          Текущий пользователь: {currentUser.name} ({currentUser.role})
        </p>
      )}
    </div>
  );
}

export default LoginPage;
