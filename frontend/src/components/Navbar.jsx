import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navLinks = [
    { to: "/", label: "Accueil" },
    { to: "/dashboard", label: "Mes annonces" },
    { to: "/create-announcement", label: "Publier" },
  ];

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