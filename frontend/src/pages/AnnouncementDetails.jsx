import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

export default function AnnouncementDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ann, setAnn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    fetchAnnouncement();
  }, [id]);

  const fetchAnnouncement = async () => {
    try {
      const res = await axiosClient.get(`/announcements/${id}`);
      setAnn(res.data);
    } catch (err) {
      alert("Annonce introuvable");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

const toggleLike = async (e) => {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  if (!user || isLiking) return;
  setIsLiking(true);

  try {
    const res = await axiosClient.post("/likes/toggle", {
      announcement_id: Number(id)  
    });

    console.log("LIKE SUCCESS:", res.data); 
    setAnn(res.data.announcement);
  } catch (err) {
    console.error("LIKE ERROR:", err.response || err); 
    alert("Vous devez être connecté pour liker");
  } finally {
    setIsLiking(false);
  }
};

  const addComment = async () => {
    if (!comment.trim()) return;
    try {
      const res = await axiosClient.post("/comments", {
        announcement_id: id,
        content: comment,
      });
      setAnn(prev => ({
        ...prev,
        comments: [...prev.comments, res.data],
        comments_count: prev.comments_count + 1
      }));
      setComment("");
    } catch (err) {
      alert("Erreur commentaire");
    }
  };

  if (loading) return <div style={styles.loading}>Chargement...</div>;
  if (!ann) return null;

  const isOwner = user && user.id === ann.user.id;
const isLiked = user && ann.likes?.some(l => l.user_id === user.id || (l.user && l.user.id === user.id));  const likesCount = ann.likes_count || ann.likes?.length || 0;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Image */}
        {ann.image ? (
          <img src={`http://localhost:8000/storage/${ann.image}`} alt={ann.title} style={styles.image} />
        ) : (
          <div style={styles.placeholder}>
            {ann.category === "Livres" && "📚"}
            {ann.category === "Matériel" && "🖥️"}
            {ann.category === "Partenaires d’étude" && "👥"}
            {ann.category === "Logement" && "🏠"}
            {ann.category === "Divers" && "📦"}
          </div>
        )}

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>{ann.title}</h1>
            <p style={styles.category}>📂 {ann.category}</p>
          </div>
          <div style={styles.priceTag}>
            {ann.price ? `${ann.price} DH` : "Gratuit"}
          </div>
        </div>

        <p style={styles.description}>{ann.description}</p>

        <div style={styles.userInfo}>
          <strong>{ann.user.name}</strong> • {new Date(ann.created_at).toLocaleDateString("fr-MA", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          })}
        </div>

        <div style={styles.actions}>
<button
  onClick={toggleLike}
  disabled={!user || isLiking}
  style={{
    ...styles.likeBtn,
    background: isLiked ? "#e74c3c" : "#3498db",
    opacity: (!user || isLiking) ? 0.6 : 1,
  }}
>
  ❤️ {likesCount} {isLiked ? "Aimé" : "J’aime"}
</button>

          {isOwner && (
            <div style={styles.ownerActions}>
          <Link to={`/edit-announcement/${ann.id}`} style={styles.editBtn}>
  ✏️ Modifier
</Link>
            </div>
          )}
        </div>

        <div style={styles.commentsSection}>
          <h3 style={styles.commentsTitle}>
            Commentaires ({ann.comments?.length || 0})
          </h3>

          <div style={styles.commentsList}>
            {ann.comments?.length === 0 ? (
              <p style={styles.noComments}>Aucun commentaire pour l'instant.</p>
            ) : (
              ann.comments?.map(c => (
                <div key={c.id} style={styles.comment}>
                  <strong style={styles.commentAuthor}>{c.user.name}</strong>
                  <p style={styles.commentText}>{c.content || c.contenu}</p>
                  <small style={styles.commentDate}>
                    {new Date(c.created_at).toLocaleTimeString("fr-MA", { hour: "2-digit", minute: "2-digit" })}
                  </small>
                </div>
              ))
            )}
          </div>

          {user && (
            <div style={styles.commentForm}>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Écrivez un commentaire..."
                style={styles.textarea}
                rows={3}
              />
              <button onClick={addComment} style={styles.sendBtn}>
                Envoyer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: "900px", margin: "2rem auto", padding: "0 1rem" },
  loading: { textAlign: "center", padding: "100px", fontSize: "1.5rem" },
  card: { background: "white", borderRadius: "20px", overflow: "hidden", boxShadow: "0 15px 40px rgba(0,0,0,0.12)" },
  image: { width: "100%", height: "450px", objectFit: "cover" },
  placeholder: { width: "100%", height: "450px", background: "#f0f2f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "100px" },
  header: { padding: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  title: { fontSize: "2.4rem", margin: "0 0 0.5rem", color: "#2c3e50", fontWeight: "bold" },
  category: { color: "#3498db", fontWeight: "bold", fontSize: "1.1rem", margin: 0 },
  priceTag: { background: "#27ae60", color: "white", padding: "12px 28px", borderRadius: "50px", fontSize: "1.4rem", fontWeight: "bold" },
  description: { padding: "0 2rem", fontSize: "1.15rem", lineHeight: "1.8", color: "#444" },
  userInfo: { padding: "0 2rem 1rem", color: "#7f8c8d", fontSize: "1rem" },
  actions: { padding: "1.5rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #eee" },
  likeBtn: { padding: "14px 32px", border: "none", borderRadius: "50px", color: "white", fontSize: "1.2rem", fontWeight: "bold", cursor: "pointer", transition: "0.3s", boxShadow: "0 6px 20px rgba(52,152,219,0.4)" },
  ownerActions: { display: "flex", gap: "1rem" },
  editBtn: { padding: "12px 24px", background: "#f39c12", color: "white", borderRadius: "50px", textDecoration: "none", fontWeight: "bold" },
  commentsSection: { padding: "2rem", borderTop: "1px solid #eee" },
  commentsTitle: { fontSize: "1.6rem", margin: "0 0 1.5rem", color: "#2c3e50" },
  commentsList: { marginBottom: "2rem" },
  noComments: { color: "#95a5a6", fontStyle: "italic" },
  comment: { background: "#f8f9fa", padding: "1.2rem", borderRadius: "16px", marginBottom: "1rem" },
  commentAuthor: { color: "#3498db", fontWeight: "bold" },
  commentText: { margin: "0.5rem 0 0", color: "#333" },
  commentDate: { color: "#95a5a6", fontSize: "0.85rem" },
  commentForm: { display: "flex", gap: "1rem", marginTop: "1.5rem" },
  textarea: { flex: 1, padding: "1rem", borderRadius: "16px", border: "2px solid #ddd", fontSize: "1rem", resize: "vertical" },
  sendBtn: { padding: "1rem 2rem", background: "#3498db", color: "white", border: "none", borderRadius: "16px", fontWeight: "bold", cursor: "pointer" },
};