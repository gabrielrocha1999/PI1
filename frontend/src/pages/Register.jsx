import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", senha: "", confirma: "", tipo: "patient" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.senha !== form.confirma) return setError("As senhas não coincidem.");
    if (form.senha.length < 6) return setError("A senha deve ter pelo menos 6 caracteres.");

    setLoading(true);
    try {
      await register(form.name, form.email, form.senha, form.tipo);
      setSuccess("Cadastro realizado com sucesso! Redirecionando para o login...");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err.response?.data?.detail || "Erro ao realizar cadastro.");
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
        </div>

        <h2 style={styles.title}>Criar conta</h2>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nome completo</label>
            <input className="form-input" placeholder="Seu nome" value={form.name} onChange={set("name")} required autoFocus />
          </div>

          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input type="email" className="form-input" placeholder="seu@email.com" value={form.email} onChange={set("email")} required />
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <input type="password" className="form-input" placeholder="Mínimo 6 caracteres" value={form.senha} onChange={set("senha")} required />
          </div>

          <div className="form-group">
            <label className="form-label">Confirmar senha</label>
            <input type="password" className="form-input" placeholder="Repita a senha" value={form.confirma} onChange={set("confirma")} required />
          </div>

          <div className="form-group">
            <label className="form-label">Tipo de conta</label>
            <div style={styles.tipoGroup}>
              {[
                { value: "patient", label: "🧍 Paciente", desc: "Registro e acompanhamento de atividades" },
                { value: "psychologist", label: "👨‍⚕️ Psicólogo(a)", desc: "Acompanhamento de pacientes" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, tipo: opt.value }))}
                  style={{
                    ...styles.tipoBtn,
                    ...(form.tipo === opt.value ? styles.tipoBtnActive : {}),
                  }}
                >
                  <span style={styles.tipoBtnLabel}>{opt.label}</span>
                  <span style={styles.tipoBtnDesc}>{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? <span className="spinner" /> : "Criar conta"}
          </button>
        </form>

        <p style={styles.footer}>
          Já tem conta?{" "}
          <Link to="/login" style={styles.link}>Entrar</Link>
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
    maxWidth: 460,
    position: "relative",
    zIndex: 1,
  },
  brand: { textAlign: "center", marginBottom: 20 },
  brandIcon: { fontSize: "2rem" },
  brandName: { fontSize: "1.5rem", fontWeight: 800, color: "var(--primary)", marginTop: 4 },
  title: { fontSize: "1.1rem", fontWeight: 700, color: "var(--text)", marginBottom: 20 },
  tipoGroup: { display: "flex", gap: 10 },
  tipoBtn: {
    flex: 1,
    padding: "12px",
    borderRadius: "var(--radius-md)",
    border: "2px solid var(--border)",
    background: "var(--bg)",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.2s",
  },
  tipoBtnActive: {
    border: "2px solid var(--primary)",
    background: "var(--primary-light)",
  },
  tipoBtnLabel: { display: "block", fontWeight: 700, fontSize: "0.88rem", color: "var(--text)" },
  tipoBtnDesc: { display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 3, lineHeight: 1.3 },
  footer: { textAlign: "center", marginTop: 24, fontSize: "0.88rem", color: "var(--text-sec)" },
  link: { color: "var(--primary)", fontWeight: 700 },
  decoration: { position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 },
  blob1: { position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "rgba(74,144,217,0.08)", top: -200, right: -150 },
  blob2: { position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "rgba(102,187,106,0.08)", bottom: -150, left: -100 },
};
