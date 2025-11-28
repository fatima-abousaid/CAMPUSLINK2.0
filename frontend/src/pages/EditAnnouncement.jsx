import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

export default function EditAnnouncement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    image: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);

  const categories = ["Livres", "Matériel", "Partenaires d’étude", "Logement", "Divers"];

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosClient.get(`/announcements/${id}`);
        const ann = res.data;
        if (ann.user.id !== user.id) {
          alert("Ce n’est pas votre annonce !");
          navigate("/dashboard");
          return;
        }
        setForm({
          title: ann.title,
          description: ann.description,
          category: ann.category,
          price: ann.price || "",
          image: null,
        });
        setPreview(ann.image ? `http://localhost:8000/storage/${ann.image}` : null);
      } catch (err) {
        alert("Annonce introuvable");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("price", form.price || "");
    if (form.image) formData.append("image", form.image);
    formData.append("_method", "PUT"); 

    try {
      await axiosClient.post(`/announcements/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(`/announcements/${id}`);
    } catch (err) {
      alert("Erreur lors de la modification");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: "100px", textAlign: "center" }}>Chargement...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Modifier l'annonce</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label>Titre *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label>Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={6}
              required
              style={styles.textarea}
            />
          </div>

          <div style={styles.field}>
            <label>Catégorie *</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
              style={styles.select}
            >
              <option value="">Choisir...</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <label>Prix (DH) – laissez vide si gratuit</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label>Image actuelle</label>
            {preview ? (
              <img src={preview} alt="Current" style={styles.previewImg} />
            ) : (
              <p style={{ color: "#777" }}>Aucune image</p>
            )}
          </div>

          <div style={styles.field}>
            <label>Nouvelle image (optionnel)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setForm({ ...form, image: e.target.files[0] });
                setPreview(URL.createObjectURL(e.target.files[0]));
              }}
              style={styles.fileInput}
            />
          </div>

          <div style={styles.buttons}>
            <button type="button" onClick={() => navigate(-1)} style={styles.cancelBtn}>
              Annuler
            </button>
            <button type="submit" disabled={saving} style={styles.saveBtn}>
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { background: "#f5f6fa", minHeight: "100vh", padding: "40px 20px", display: "flex", justifyContent: "center" },
  card: { background: "white", width: "100%", maxWidth: "680px", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.12)", padding: "40px" },
  title: { fontSize: "2rem", fontWeight: "bold", color: "#2c3e50", textAlign: "center", marginBottom: "30px" },
  form: { display: "flex", flexDirection: "column", gap: "22px" },
  field: { display: "flex", flexDirection: "column" },
  label: { marginBottom: "8px", fontWeight: "bold", color: "#34495e" },
  input: { padding: "14px 16px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "1rem" },
  textarea: { padding: "14px 16px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "1rem", resize: "vertical" },
  select: { padding: "14px 16px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "1rem", background: "white" },
  previewImg: { width: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: "12px", marginTop: "10px" },
  fileInput: { padding: "10px 0" },
  buttons: { display: "flex", justifyContent: "space-between", marginTop: "20px" },
  cancelBtn: { padding: "14px 28px", background: "#95a5a6", color: "white", border: "none", borderRadius: "10px", cursor: "pointer" },
  saveBtn: { padding: "14px 32px", background: "#27ae60", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" },
};