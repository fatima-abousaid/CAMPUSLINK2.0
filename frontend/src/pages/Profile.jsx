import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

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
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Mon Profil</h1>

        {success && <div style={styles.success}>{success}</div>}
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label>Nom complet</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              disabled
              style={{ ...styles.input, background: "#f0f0f0" }}
            />
            <small style={{ color: "#777" }}>L'email ne peut pas être modifié</small>
          </div>

          <div style={styles.field}>
            <label>Date de naissance (optionnel)</label>
            <input
              type="date"
              value={form.date_of_birth}
              onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
              style={styles.input}
            />
          </div>

          <hr style={{ margin: "30px 0", border: "1px solid #eee" }} />

          <h3 style={{ margin: "20px 0 10px" }}>Changer le mot de passe</h3>

          <div style={styles.field}>
            <label>Mot de passe actuel</label>
            <input
              type="password"
              value={form.current_password}
              onChange={(e) => setForm({ ...form, current_password: e.target.value })}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label>Nouveau mot de passe</label>
            <input
              type="password"
              value={form.new_password}
              onChange={(e) => setForm({ ...form, new_password: e.target.value })}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label>Confirmer le nouveau mot de passe</label>
            <input
              type="password"
              value={form.new_password_confirmation}
              onChange={(e) => setForm({ ...form, new_password_confirmation: e.target.value })}
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </form>
      </div>
    </div>
  );
}

// STYLE ÉLÉGANT (même look que le reste de l’app)
const styles = {
  container: { maxWidth: "700px", margin: "3rem auto", padding: "0 1rem" },
  card: { background: "white", borderRadius: "20px", padding: "40px", boxShadow: "0 15px 40px rgba(0,0,0,0.1)" },
  title: { fontSize: "2.4rem", textAlign: "center", marginBottom: "30px", color: "#2c3e50" },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  field: { display: "flex", flexDirection: "column" },
  label: { fontWeight: "bold", marginBottom: "8px", color: "#34495e" },
  input: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: "2px solid #ddd",
    fontSize: "1rem",
    transition: "0.3s",
  },
  submitBtn: {
    marginTop: "20px",
    padding: "16px",
    background: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    cursor: "pointer",
  },
  success: { background: "#d4edda", color: "#155724", padding: "14px", borderRadius: "12px", textAlign: "center" },
  error: { background: "#f8d7da", color: "#721c24", padding: "14px", borderRadius: "12px", textAlign: "center" },
};