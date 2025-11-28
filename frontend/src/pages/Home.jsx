// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export default function Home() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get("/announcements")
      .then((res) => setAnnouncements(res.data.slice(0, 6)))
      .catch(() => setAnnouncements([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.container}>
      {/* HERO SECTION */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Bienvenue sur <span style={styles.highlight}>CampusLink</span> 🎓
          </h1>
          <p style={styles.heroText}>
            Trouvez, vendez ou échangez livres, matériel, logement et bien plus encore avec les étudiants de votre campus !
          </p>
          <Link to="/create-announcement" style={styles.heroBtn}>
            Publier une annonce
          </Link>
        </div>
       
      </section>

      <section style={styles.latestSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Dernières annonces</h2>
          <Link to="/dashboard" style={styles.seeAll}>
            Voir toutes les annonces →
          </Link>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", padding: "60px", fontSize: "1.2rem" }}>Chargement...</p>
        ) : announcements.length === 0 ? (
          <p style={{ textAlign: "center", padding: "60px", color: "#777" }}>Aucune annonce pour le moment.</p>
        ) : (
          <div style={styles.cardsGrid}>
            {announcements.map((a) => (
              <Link
                key={a.id}
                to={`/announcements/${a.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div style={styles.card}>
                  {a.image ? (
                    <img
                      src={`http://localhost:8000/storage/${a.image}`}
                      alt={a.title}
                      style={styles.cardImage}
                    />
                  ) : (
                    <div style={styles.placeholder}>
                      {a.category === "Livres" && "📚"}
                      {a.category === "Matériel" && "🖥️"}
                      {a.category === "Partenaires d’étude" && "👥"}
                      {a.category === "Logement" && "🏠"}
                      {a.category === "Divers" && "📦"}
                    </div>
                  )}

                  <div style={styles.cardBody}>
                    <h3 style={styles.cardTitle}>{a.title}</h3>
                    <p style={styles.cardCategory}>📂 {a.category}</p>
                    <p style={styles.cardPrice}>
                      {a.price ? `${a.price} DH` : "Gratuit"}
                    </p>

                    <div style={styles.cardFooter}>
                      <span style={styles.cardUser}>par {a.user.name}</span>
                      <div style={styles.cardStats}>
                        <span>❤️ {a.likes_count || 0}</span>
                        <span style={{ marginLeft: "12px" }}>💬 {a.comments_count || 0}</span>
                      </div>
                    </div>

                    <span style={styles.detailsBtn}>Voir les détails →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const styles = {
  container: { background: "#f8fafc", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" },

  hero: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "80px 5%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    borderRadius: "0 0 50px 50px",
    flexWrap: "wrap",
    gap: "40px",
  },
  heroContent: { flex: 1, minWidth: "300px" },
  heroTitle: { fontSize: "3.5rem", margin: "0 0 20px", fontWeight: "bold" },
  highlight: { color: "#ffd700" },
  heroText: { fontSize: "1.3rem", marginBottom: "30px", opacity: 0.95 },
  heroBtn: {
    background: "#fff",
    color: "#667eea",
    padding: "16px 36px",
    borderRadius: "50px",
    fontWeight: "bold",
    fontSize: "1.2rem",
    textDecoration: "none",
    display: "inline-block",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    transition: "0.3s",
  },
  heroImage: { flex: 1, minWidth: "300px", textAlign: "center" },

  // LATEST SECTION
  latestSection: { padding: "80px 5%", maxWidth: "1400px", margin: "0 auto" },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" },
  sectionTitle: { fontSize: "2.4rem", color: "#2c3e50", fontWeight: "bold" },
  seeAll: { color: "#3498db", fontWeight: "bold", textDecoration: "none", fontSize: "1.1rem" },

  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: "30px",
  },

  card: {
    background: "white",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    transition: "0.4s",
    cursor: "pointer",
  },
  cardImage: { width: "100%", height: "220px", objectFit: "cover" },
  placeholder: {
    height: "220px",
    background: "#f0f2f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "80px",
  },

  cardBody: { padding: "1.5rem" },
  cardTitle: { fontSize: "1.35rem", margin: "0 0 8px", fontWeight: "bold", color: "#2c3e50" },
  cardCategory: { color: "#3498db", fontWeight: "bold", marginBottom: "8px" },
  cardPrice: {
    fontSize: "1.4rem",
    fontWeight: "bold",
    color: "#27ae60",
    margin: "8px 0",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "12px",
    color: "#7f8c8d",
    fontSize: "0.95rem",
  },
  cardUser: { fontWeight: "600" },
  cardStats: { fontWeight: "bold" },

  detailsBtn: {
    display: "block",
    marginTop: "16px",
    color: "#3498db",
    fontWeight: "bold",
    textAlign: "center",
  },
};