import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const { user, login } = useAuth();  
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    date_of_birth: "",
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        date_of_birth: user.date_of_birth || "",
      }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);

    try {
      const res = await axiosClient.put("/user/update", form);

      login(user.email, form.current_password); 

      setSuccess("Profil mis à jour avec succès !");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="avatar-icon">👤</span>
          </div>
          <h1 className="profile-title">Mon Profil</h1>
          <p className="profile-subtitle">Gérez vos informations personnelles</p>
        </div>

        {success && (
          <div className="alert alert-success">
            <span className="alert-icon">✓</span>
            {success}
          </div>
        )}
        
        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <h2 className="section-title">Informations personnelles</h2>
            
            <div className="form-group">
              <label className="form-label">Nom complet</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="form-input"
                placeholder="Votre nom complet"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                value={form.email}
                disabled
                className="form-input form-input-disabled"
              />
              <small className="form-helper">L'email ne peut pas être modifié</small>
            </div>

            <div className="form-group">
              <label className="form-label">Date de naissance (optionnel)</label>
              <input
                type="date"
                value={form.date_of_birth}
                onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-divider"></div>

          <div className="form-section">
            <h2 className="section-title">Changer le mot de passe</h2>
            
            <div className="form-group">
              <label className="form-label">Mot de passe actuel</label>
              <input
                type="password"
                value={form.current_password}
                onChange={(e) => setForm({ ...form, current_password: e.target.value })}
                className="form-input"
                placeholder="••••••••"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nouveau mot de passe</label>
              <input
                type="password"
                value={form.new_password}
                onChange={(e) => setForm({ ...form, new_password: e.target.value })}
                className="form-input"
                placeholder="••••••••"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirmer le nouveau mot de passe</label>
              <input
                type="password"
                value={form.new_password_confirmation}
                onChange={(e) => setForm({ ...form, new_password_confirmation: e.target.value })}
                className="form-input"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className={`submit-btn ${loading ? 'loading' : ''}`}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Enregistrement...
              </>
            ) : (
              'Enregistrer les modifications'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}