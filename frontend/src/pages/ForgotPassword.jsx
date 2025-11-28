import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email envoyé:", email);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <img
          src="/logo.png"
          alt="CampusLink Logo"
          style={styles.logo}
        />

        <h2 style={styles.title}>Mot de passe oublié ?</h2>

        <p style={styles.subtitle}>
          Entrez votre adresse email pour recevoir un lien de réinitialisation.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Envoyer le lien
          </button>
        </form>

        <a href="/login" style={styles.back}>
          ← Retour à la connexion
        </a>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f5f7",
  },
  card: {
    width: "420px",
    padding: "35px",
    background: "white",
    borderRadius: "18px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  logo: {
    width: "90px",
    marginBottom: "10px",
  },
  title: {
    fontSize: "26px",
    fontWeight: "600",
    marginBottom: "5px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "25px",
  },
  form: {
    marginTop: "10px",
  },
  input: {
    width: "100%",
    padding: "14px",
    fontSize: "15px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    marginBottom: "20px",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "#2563eb",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
  },
  back: {
    display: "inline-block",
    marginTop: "20px",
    color: "#2563eb",
    fontSize: "14px",
    textDecoration: "none",
  },
};
