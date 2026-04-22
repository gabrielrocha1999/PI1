import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, senha);
      navigate(user.tipo === "patient" ? "/dashboard" : "/psychologist", { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || "Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.brand}>
          <span style={styles.brandIcon}>🧠</span>
          <h1 style={styles.brandName}>MindTrack</h1>
          <p style={styles.brandSub}>Acompanhamento em Terapia Cognitivo-Comportamental</p>
        </div>

        <h2 style={styles.title}>Entrar na conta</h2>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input
              type="email"
              className="form-input"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? <span className="spinner" /> : "Entrar"}
          </button>
        </form>

        <p style={styles.footer}>
          Não tem conta?{" "}
          <Link to="/register" style={styles.link}>
            Cadastre-se
          </Link>
        </p>
      </div>

      <div style={styles.decoration} aria-hidden>
        <div style={styles.blob1} />
        <div style={styles.blob2} />
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #E8F4FD 0%, #E8F5E9 100%)",
    padding: 16,
    position: "relative",
    overflow: "hidden",
  },
  card: {
    background: "var(--surface)",
    borderRadius: "var(--radius-xl)",
    boxShadow: "0 20px 60px rgba(74,144,217,0.15)",
    padding: "40px 36px",
    width: "100%",
    maxWidth: 420,
    position: "relative",
    zIndex: 1,
  },
  brand: {
    textAlign: "center",
    marginBottom: 28,
  },
  brandIcon: { fontSize: "2.5rem" },
  brandName: {
    fontSize: "1.7rem",
    fontWeight: 800,
    color: "var(--primary)",
    letterSpacing: "-0.5px",
    marginTop: 4,
  },
  brandSub: {
    fontSize: "0.82rem",
    color: "var(--text-muted)",
    marginTop: 4,
    lineHeight: 1.4,
  },
  title: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "var(--text)",
    marginBottom: 20,
  },
  footer: {
    textAlign: "center",
    marginTop: 24,
    fontSize: "0.88rem",
    color: "var(--text-sec)",
  },
  link: { color: "var(--primary)", fontWeight: 700 },
  decoration: { position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 },
  blob1: {
    position: "absolute",
    width: 500,
    height: 500,
    borderRadius: "50%",
    background: "rgba(74,144,217,0.08)",
    top: -200,
    right: -150,
  },
  blob2: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: "50%",
    background: "rgba(102,187,106,0.08)",
    bottom: -150,
    left: -100,
  },
};
