import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
<<<<<<< HEAD
import axiosClient from "../api/axiosClient";
=======
>>>>>>> 51dfc8b9df3a6d096f5476827fc51edbb9a4367a
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
<<<<<<< HEAD
  const [unreadCount, setUnreadCount] = useState(0);
=======
>>>>>>> 51dfc8b9df3a6d096f5476827fc51edbb9a4367a
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

<<<<<<< HEAD
  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const res = await axiosClient.get("/notifications/unread-count");
      setUnreadCount(res.data.count);
    } catch (err) {
      console.error(err);
    }
  };

=======
>>>>>>> 51dfc8b9df3a6d096f5476827fc51edbb9a4367a
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navLinks = [
    { to: "/", label: "Accueil" },
    { to: "/dashboard", label: "Mes annonces" },
    { to: "/create-announcement", label: "Publier" },
  ];

<<<<<<< HEAD
  const notificationLink = { to: "/notifications", label: "🔔 Notifications" };

=======
>>>>>>> 51dfc8b9df3a6d096f5476827fc51edbb9a4367a
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img src="/logo.png" alt="CampusLink" className="logo-img" />
          <span className="logo-text">CampusLink</span>
        </Link>

        <button
          className={`nav-toggle ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`nav-link ${location.pathname === link.to ? "active" : ""}`}
              >
                {link.label}
              </Link>
            </li>
          ))}

<<<<<<< HEAD
          {user && (
            <li key={notificationLink.to}>
              <Link
                to={notificationLink.to}
                className={`nav-link ${location.pathname === notificationLink.to ? "active" : ""}`}
                style={{ position: "relative" }}
              >
                {notificationLink.label}
                {unreadCount > 0 && (
                  <span style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-10px",
                    background: "#e74c3c",
                    color: "white",
                    borderRadius: "50%",
                    padding: "2px 6px",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                  }}>
                    {unreadCount}
                  </span>
                )}
              </Link>
            </li>
          )}

          {(user?.is_admin === true || user?.is_admin === 1) && (
            <li key="/admin">
              <Link
                to="/admin"
                className={`nav-link ${location.pathname === "/admin" ? "active" : ""}`}
              >
                🛡️ Admin
              </Link>
            </li>
          )}

=======
>>>>>>> 51dfc8b9df3a6d096f5476827fc51edbb9a4367a
          {user ? (
            <li className="user-section">
              <div className="user-info">
                <span className="welcome-msg">
                  Bonjour, <strong>{user.name.split(" ")[0]}</strong>
                </span>

                <div className="user-actions">
                  <Link to="/profile" className="profile-btn">
                    👤 Profil
                  </Link>
                  <button onClick={handleLogout} className="logout-btn">
                    Déconnexion
                  </button>
                </div>
              </div>
            </li>
          ) : (
            <li className="auth-buttons">
              <Link to="/login" className="login-btn">
                Se connecter
              </Link>
              <Link to="/register" className="register-btn">
                S'inscrire
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;