import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
        withCredentials: true
      });

      const result = await login(email, password);
      
      if (result.success) {
        window.location.href = "/dashboard";
      } else {
        alert(result.error || "Identifiants incorrects");
      }

    } catch (err) {
      console.error(err);
      alert("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src="/logo.png" alt="CampusLink Logo" className="login-logo" />
        <h2 className="login-title">Connexion</h2>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email académique</label>
            <input
              type="email"
              placeholder="Nom.prenom@edu.uiz.ac.ma"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                👁
              </span>
            </div>
          </div>

          <div className="options-row">
            <label className="remember-me">
              <input type="checkbox" />
              Se souvenir de moi
            </label>

            <a href="/forgot-password" className="forgot-link">
              Mot de passe oublié ?
            </a>
          </div>

          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="separator">
          <span>Ou</span>
        </div>

        <p className="signup-text">
          Pas de compte ? <a href="/register">Créer un compte</a>
        </p>
      </div>
    </div>
  );
};

export default Login;