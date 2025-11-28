import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await axiosClient.get("/notifications");
            setNotifications(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationClick = async (notification) => {
        try {
            await axiosClient.put(`/notifications/${notification.id}/read`);
            navigate(`/announcements/${notification.data.announcement_id}`);
        } catch (err) {
            console.error(err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axiosClient.put("/notifications/read-all");
            fetchNotifications();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return <div style={styles.loading}>Chargement...</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>🔔 Notifications</h1>
                {notifications.some(n => !n.read_at) && (
                    <button onClick={markAllAsRead} style={styles.markAllBtn}>
                        Tout marquer comme lu
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div style={styles.empty}>
                    <p style={styles.emptyText}>Aucune notification pour le moment</p>
                </div>
            ) : (
                <div style={styles.list}>
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            style={{
                                ...styles.notification,
                                background: notification.read_at ? "#fff" : "#e3f2fd",
                            }}
                        >
                            <div style={styles.notificationIcon}>
                                {notification.data.type === "like" ? "❤️" : notification.data.type === "reply" ? "↩️" : "💬"}
                            </div>
                            <div style={styles.notificationContent}>
                                <p style={styles.notificationMessage}>
                                    {notification.data.message}
                                </p>
                                <small style={styles.notificationTime}>
                                    {new Date(notification.created_at).toLocaleString("fr-MA", {
                                        day: "numeric",
                                        month: "short",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </small>
                            </div>
                            {!notification.read_at && <div style={styles.unreadDot}></div>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: "800px",
        margin: "2rem auto",
        padding: "0 1rem",
    },
    loading: {
        textAlign: "center",
        padding: "100px",
        fontSize: "1.5rem",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "2rem",
    },
    title: {
        fontSize: "2.5rem",
        color: "#2c3e50",
        fontWeight: "bold",
    },
    markAllBtn: {
        padding: "12px 24px",
        background: "#3498db",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
    },
    empty: {
        textAlign: "center",
        padding: "60px 20px",
    },
    emptyText: {
        fontSize: "1.2rem",
        color: "#95a5a6",
    },
    list: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    notification: {
        display: "flex",
        alignItems: "center",
        padding: "1.5rem",
        borderRadius: "12px",
        cursor: "pointer",
        transition: "0.2s",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        position: "relative",
    },
    notificationIcon: {
        fontSize: "2rem",
        marginRight: "1rem",
    },
    notificationContent: {
        flex: 1,
    },
    notificationMessage: {
        margin: "0 0 0.5rem",
        fontSize: "1rem",
        color: "#2c3e50",
    },
    notificationTime: {
        color: "#7f8c8d",
        fontSize: "0.9rem",
    },
    unreadDot: {
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        background: "#3498db",
        position: "absolute",
        top: "1.5rem",
        right: "1.5rem",
    },
};
