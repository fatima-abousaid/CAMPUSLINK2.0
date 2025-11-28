import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("stats");

    useEffect(() => {
        if (!user?.is_admin) {
            navigate("/");
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            const [statsRes, usersRes, announcementsRes] = await Promise.all([
                axiosClient.get("/admin/dashboard"),
                axiosClient.get("/admin/users"),
                axiosClient.get("/admin/announcements"),
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
            setAnnouncements(announcementsRes.data);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 403) {
                alert("Accès non autorisé");
                navigate("/");
            }
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
        try {
            await axiosClient.delete(`/admin/users/${id}`);
            setUsers(users.filter((u) => u.id !== id));
            fetchData(); // Refresh stats
        } catch (err) {
            alert(err.response?.data?.message || "Erreur lors de la suppression");
        }
    };

    const deleteAnnouncement = async (id) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette annonce ?")) return;
        try {
            await axiosClient.delete(`/admin/announcements/${id}`);
            setAnnouncements(announcements.filter((a) => a.id !== id));
            fetchData(); // Refresh stats
        } catch (err) {
            alert("Erreur lors de la suppression");
        }
    };

    if (loading) {
        return <div style={styles.loading}>Chargement...</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>🛡️ Admin Dashboard</h1>

            <div style={styles.tabs}>
                <button
                    onClick={() => setActiveTab("stats")}
                    style={{
                        ...styles.tab,
                        ...(activeTab === "stats" ? styles.activeTab : {}),
                    }}
                >
                    Statistiques
                </button>
                <button
                    onClick={() => setActiveTab("users")}
                    style={{
                        ...styles.tab,
                        ...(activeTab === "users" ? styles.activeTab : {}),
                    }}
                >
                    Utilisateurs ({users.length})
                </button>
                <button
                    onClick={() => setActiveTab("announcements")}
                    style={{
                        ...styles.tab,
                        ...(activeTab === "announcements" ? styles.activeTab : {}),
                    }}
                >
                    Annonces ({announcements.length})
                </button>
            </div>

            {activeTab === "stats" && (
                <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <div style={styles.statIcon}>👥</div>
                        <div style={styles.statNumber}>{stats.total_users}</div>
                        <div style={styles.statLabel}>Utilisateurs</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statIcon}>📢</div>
                        <div style={styles.statNumber}>{stats.total_announcements}</div>
                        <div style={styles.statLabel}>Annonces</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statIcon}>💬</div>
                        <div style={styles.statNumber}>{stats.total_comments}</div>
                        <div style={styles.statLabel}>Commentaires</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statIcon}>❤️</div>
                        <div style={styles.statNumber}>{stats.total_likes}</div>
                        <div style={styles.statLabel}>Likes</div>
                    </div>
                </div>
            )}

            {activeTab === "users" && (
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>Nom</th>
                                <th style={styles.th}>Email</th>
                                <th style={styles.th}>Annonces</th>
                                <th style={styles.th}>Commentaires</th>
                                <th style={styles.th}>Likes</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id} style={styles.tr}>
                                    <td style={styles.td}>{u.id}</td>
                                    <td style={styles.td}>{u.name}</td>
                                    <td style={styles.td}>{u.email}</td>
                                    <td style={styles.td}>{u.announcements_count || 0}</td>
                                    <td style={styles.td}>{u.comments_count || 0}</td>
                                    <td style={styles.td}>{u.likes_count || 0}</td>
                                    <td style={styles.td}>
                                        <button
                                            onClick={() => deleteUser(u.id)}
                                            style={styles.deleteBtn}
                                            disabled={u.id === user.id}
                                        >
                                            🗑️ Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === "announcements" && (
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>Titre</th>
                                <th style={styles.th}>Auteur</th>
                                <th style={styles.th}>Catégorie</th>
                                <th style={styles.th}>Commentaires</th>
                                <th style={styles.th}>Likes</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {announcements.map((a) => (
                                <tr key={a.id} style={styles.tr}>
                                    <td style={styles.td}>{a.id}</td>
                                    <td style={styles.td}>{a.title}</td>
                                    <td style={styles.td}>{a.user.name}</td>
                                    <td style={styles.td}>{a.category}</td>
                                    <td style={styles.td}>{a.comments_count || 0}</td>
                                    <td style={styles.td}>{a.likes_count || 0}</td>
                                    <td style={styles.td}>
                                        <button
                                            onClick={() => deleteAnnouncement(a.id)}
                                            style={styles.deleteBtn}
                                        >
                                            🗑️ Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: "1200px",
        margin: "2rem auto",
        padding: "0 1rem",
    },
    loading: {
        textAlign: "center",
        padding: "100px",
        fontSize: "1.5rem",
    },
    title: {
        fontSize: "2.5rem",
        color: "#2c3e50",
        fontWeight: "bold",
        marginBottom: "2rem",
    },
    tabs: {
        display: "flex",
        gap: "1rem",
        marginBottom: "2rem",
        borderBottom: "2px solid #eee",
    },
    tab: {
        padding: "12px 24px",
        background: "none",
        border: "none",
        borderBottom: "3px solid transparent",
        cursor: "pointer",
        fontSize: "1rem",
        fontWeight: "600",
        color: "#7f8c8d",
        transition: "0.2s",
    },
    activeTab: {
        color: "#3498db",
        borderBottom: "3px solid #3498db",
    },
    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "2rem",
        marginTop: "2rem",
    },
    statCard: {
        background: "white",
        borderRadius: "16px",
        padding: "2rem",
        textAlign: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    statIcon: {
        fontSize: "3rem",
        marginBottom: "1rem",
    },
    statNumber: {
        fontSize: "2.5rem",
        fontWeight: "bold",
        color: "#2c3e50",
        marginBottom: "0.5rem",
    },
    statLabel: {
        fontSize: "1rem",
        color: "#7f8c8d",
    },
    tableContainer: {
        background: "white",
        borderRadius: "12px",
        padding: "1.5rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        overflowX: "auto",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    th: {
        textAlign: "left",
        padding: "12px",
        borderBottom: "2px solid #eee",
        fontWeight: "bold",
        color: "#2c3e50",
    },
    tr: {
        borderBottom: "1px solid #f0f0f0",
    },
    td: {
        padding: "12px",
    },
    deleteBtn: {
        padding: "8px 16px",
        background: "#e74c3c",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
    },
};
