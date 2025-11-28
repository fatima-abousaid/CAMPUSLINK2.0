import React, { useState } from "react";
import axiosClient from "../api/axiosClient";
import "./Register.css";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    return /@(edu|ac)\.ma$/i.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");

    if (!validateEmail(form.email)) {
      return setErrors("Veuillez utiliser un email académique (@edu.ma ou @ac.ma)");
    }

    if (form.password !== form.password_confirmation) {
      return setErrors("Les mots de passe ne correspondent pas.");
    }

    try {
      setLoading(true);
      const response = await axiosClient.post("/register", form);
      console.log(response.data);

      alert("Compte créé avec succès !");
      window.location.href = "/login";
    } catch (error) {
      if (error.response?.data?.message) {
        setErrors(error.response.data.message);
      } else {
        setErrors("Une erreur s'est produite.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-card" onSubmit={handleSubmit}>
        
        {/* Logo */}
        <img src="/logo.png" alt="CampusLink Logo" className="register-logo" />

        <h2 className="register-title">Créer un compte</h2>

        {errors && <p className="error-msg">{errors}</p>}

        {/* Nom complet */}
        <div className="form-group">
          <label>Nom complet</label>
          <input
            type="text"
            name="name"
            placeholder="Ex: Fatima El Moudenne"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email académique */}
        <div className="form-group">
          <label>Email académique</label>
          <input
            type="email"
            name="email"
            placeholder="nom.prenom@edu.uiz.ac.ma"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Mot de passe */}
        <div className="form-group">
          <label>Mot de passe</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
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

        {/* Confirmation */}
        <div className="form-group">
          <label>Confirmer le mot de passe</label>
          <div className="password-wrapper">
            <input
              type={showPassword2 ? "text" : "password"}
              name="password_confirmation"
              placeholder="••••••••"
              value={form.password_confirmation}
              onChange={handleChange}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword2(!showPassword2)}
            >
              👁
            </span>
          </div>
        </div>

        <button className="register-btn" disabled={loading}>
          {loading ? "Création..." : "Créer le compte"}
        </button>

        <p className="login-text">
          Vous avez déjà un compte ? <a href="/login">Se connecter</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
