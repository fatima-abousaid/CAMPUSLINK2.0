import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = [
    { nom: "Livres" },
    { nom: "Matériel" },
    { nom: "Partenaires d’étude" },
    { nom: "Logement" },
    { nom: "Divers" },
  ];

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axiosClient.get("/announcements");
        setAnnouncements(res.data);
      } catch (err) {
        console.error("Error fetching announcements:", err);
        alert("Impossible de charger les annonces. Vérifiez votre connexion.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const filtered = announcements.filter((ann) => {
    const matchesSearch =
      ann.title.toLowerCase().includes(search.toLowerCase()) ||
      ann.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? ann.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("fr-MA", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px", fontSize: "1.4rem" }}>
        Chargement des annonces...
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.logo}>CampusLink</h2>
        <Link to="/create-announcement" style={styles.createBtn}>
          + Nouvelle annonce
        </Link>
      </header>

      <div style={styles.layout}>
        <aside style={styles.sidebar}>
          <h3 style={styles.sidebarTitle}>Catégories</h3>
          <ul style={styles.categoryList}>
            <li
              onClick={() => setSelectedCategory("")}
              style={selectedCategory === "" ? styles.activeCat : styles.catItem}
            >
              Toutes les annonces ({announcements.length})
            </li>
            {categories.map((cat) => {
              const count = announcements.filter(a => a.category === cat.nom).length;
              return (
                <li
                  key={cat.nom}
                  onClick={() => setSelectedCategory(cat.nom)}
                  style={selectedCategory === cat.nom ? styles.activeCat : styles.catItem}
                >
                  {cat.nom} ({count})
                </li>
              );
            })}
          </ul>
        </aside>

        <main style={styles.mainContent}>
          <input
            type="text"
            placeholder="Rechercher par titre ou description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />

          <div style={styles.grid}>
            {filtered.length === 0 ? (
              <p style={styles.noResults}>Aucune annonce trouvée.</p>
            ) : (
              filtered.map((ann) => (
                <Link
                  key={ann.id}
                  to={`/announcements/${ann.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div style={styles.card}>
                    {ann.image ? (
                      <img
                        src={`http://localhost:8000/storage/${ann.image}`}
                        alt={ann.title}
                        style={styles.cardImg}
                        onError={(e) => (e.target.src = "/placeholder.jpg")}
                      />
                    ) : (
                      <div style={styles.placeholder}>
                        {ann.category === "Livres" && "📚"}
                        {ann.category === "Matériel" && "🖥️"}
                        {ann.category === "Partenaires d’étude" && "👥"}
                        {ann.category === "Logement" && "🏠"}
                        {ann.category === "Divers" && "📦"}
                      </div>
                    )}

                    <div style={styles.cardBody}>
                      <h3 style={styles.cardTitle}>{ann.title}</h3>
                      <p style={styles.cardDesc}>
                        {ann.description.substring(0, 100)}...
                      </p>

                      <div style={styles.cardFooter}>
                        <div>
                          <small style={{ color: "#666" }}>
                            par <strong>{ann.user.name}</strong>
                            <br />
                            {formatDate(ann.created_at)}
                          </small>
                        </div>
                        <div style={styles.tags}>
                          {ann.price ? (
                            <span style={styles.price}>{ann.price} DH</span>
                          ) : (
                            <span style={styles.free}>Gratuit</span>
                          )}
                          <span style={styles.likes}>❤️ {ann.likes_count || ann.likes?.length || 0}</span>  
                        <span style={styles.comments}>💬 {ann.comments_count || 0}</span>                       
                          </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

const styles = {
  container: { background: "#f8fafc", minHeight: "100vh", fontFamily: "system-ui, sans-serif" },
  header: { background: "white", padding: "1rem 2rem", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" },
  logo: { fontSize: "1.8rem", fontWeight: "bold", color: "#2c3e50" },
  createBtn: { background: "#3498db", color: "white", padding: "12px 24px", borderRadius: "50px", fontWeight: "bold", textDecoration: "none" },

  layout: { display: "flex" },
  sidebar: { width: "280px", background: "white", padding: "2rem", borderRight: "1px solid #eee" },
  sidebarTitle: { fontSize: "1.4rem", marginBottom: "1.5rem", color: "#2c3e50" },
  categoryList: { listStyle: "none", padding: 0 },
  catItem: { padding: "12px 16px", margin: "8px 0", borderRadius: "12px", cursor: "pointer", transition: "0.2s" },
  activeCat: { background: "#e3f2fd", color: "#1976d2", fontWeight: "bold", padding: "12px 16px", margin: "8px 0", borderRadius: "12px", cursor: "pointer" },

  mainContent: { flex: 1, padding: "2rem" },
  searchInput: { width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid #ddd", fontSize: "1.1rem", marginBottom: "2rem" },

  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" },
  card: { background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 8px 25px rgba(0,0,0,0.1)", transition: "0.3s", ":hover": { transform: "translateY(-8px)", boxShadow: "0 16px 35px rgba(0,0,0,0.15)" } },
  cardImg: { width: "100%", height: "200px", objectFit: "cover" },
  placeholder: { height: "200px", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "70px" },
  cardBody: { padding: "1.2rem" },
  cardTitle: { fontSize: "1.3rem", fontWeight: "bold", margin: "0 0 0.5rem" },
  cardDesc: { color: "#555", fontSize: "0.95rem", lineHeight: "1.5" },
  cardFooter: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "1rem" },
  tags: { display: "flex", gap: "12px", alignItems: "center" },
  price: { background: "#d4edda", color: "#155724", padding: "6px 14px", borderRadius: "20px", fontWeight: "bold" },
  free: { background: "#fff3cd", color: "#856404", padding: "6px 14px", borderRadius: "20px", fontWeight: "bold" },
  likes: { fontSize: "1.3rem" },
  comments: { fontSize: "1.3rem" },
  noResults: { textAlign: "center", fontSize: "1.4rem", color: "#777", gridColumn: "1 / -1", padding: "4rem" },
};