import { useState } from "react";
import axiosClient from "../api/axiosClient";
import "./ResetPassword.css";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    try {
      await axiosClient.post("/reset-password", { password });
      alert("Mot de passe réinitialisé avec succès !");
    } catch (err) {
      alert("Une erreur est survenue !");
    }
  };

  return (
    <div className="reset-container">

      {/* LOGO */}
      <img src="/logo.png" alt="CampusLink" className="logo" />

      <h2>Créer un nouveau mot de passe</h2>
      <p className="subtitle">
        Votre nouveau mot de passe doit être différent de l'ancien.
      </p>

      <form onSubmit={handleSubmit}>

        {/* PASSWORD */}
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Nouveau mot de passe"
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="eye" onClick={() => setShowPassword(!showPassword)}>
            👁️
          </span>
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirmer le mot de passe"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="reset-btn">
          Réinitialiser
        </button>

      </form>

      <a href="/login" className="back-login">
        ← Retour à la connexion
      </a>

    </div>
  );
}
