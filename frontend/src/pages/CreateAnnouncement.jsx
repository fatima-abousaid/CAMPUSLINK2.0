import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export default function CreateAnnouncement() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    image: null,
  });

  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const categories = [
    "Livres",
    "Matériel",
    "Partenaires d’étude",
    "Logement",
    "Divers",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (!form.title || !form.description || !form.category) {
      setError("Veuillez remplir tous les champs obligatoires.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("category", form.category);
  if (form.price && form.price > 0) {
  formData.append("price", form.price);
}
    if (form.image) formData.append("image", form.image);

    try {
      await axiosClient.post("/announcements", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Annonce publiée avec succès ! Redirection...");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Erreur lors de la publication. Êtes-vous connecté ?"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Publier une nouvelle annonce</h2>

        {success && <div style={styles.success}>{success}</div>}
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Titre */}
          <div style={styles.field}>
            <label style={styles.label}>Titre de l'annonce *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex: Vends livre de maths 3ème année"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Description détaillée *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Décrivez votre annonce..."
              rows="6"
              style={styles.textarea}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Catégorie *</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              style={styles.select}
              required
            >
              <option value="">Choisir une catégorie</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Prix (en DH) - Laissez vide si gratuit</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="Ex: 250"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Photo (optionnel)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
              style={styles.fileInput}
            />
            {form.image && (
              <p style={{ color: "#27ae60", fontSize: "0.9rem", marginTop: "8px" }}>
                ✓ {form.image.name}
              </p>
            )}
          </div>

          <div style={styles.buttons}>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              style={styles.cancelBtn}
            >
              Annuler
            </button>

            <button type="submit" disabled={isLoading} style={styles.submitBtn}>
              {isLoading ? "Publication en cours..." : "Publier l'annonce"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


const styles = {
  container: {
    background: "#f5f6fa",
    minHeight: "100vh",
    padding: "40px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  card: {
    background: "white",
    width: "100%",
    maxWidth: "680px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
    padding: "40px",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: "30px",
  },
  form: { display: "flex", flexDirection: "column", gap: "22px" },
  field: { display: "flex", flexDirection: "column" },
  label: { marginBottom: "8px", fontWeight: "bold", color: "#34495e" },
  input: {
    padding: "14px 16px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontSize: "1rem",
    outline: "none",
  },
  textarea: {
    padding: "14px 16px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontSize: "1rem",
    resize: "vertical",
    outline: "none",
  },
  select: {
    padding: "14px 16px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontSize: "1rem",
    background: "white",
    outline: "none",
  },
  fileInput: { padding: "10px 0" },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  cancelBtn: {
    padding: "14px 28px",
    background: "#95a5a6",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  submitBtn: {
    padding: "14px 32px",
    background: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",

  },
  success: {
    background: "#d4edda",
    color: "#155724",
    padding: "14px",
    borderRadius: "8px",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  error: {
    background: "#f8d7da",
    color: "#721c24",
    padding: "14px",
    borderRadius: "8px",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: "20px",
  },
};