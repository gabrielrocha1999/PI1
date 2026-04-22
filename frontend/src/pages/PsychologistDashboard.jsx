import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import Navbar from "../components/Navbar";

export default function PsychologistDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/psychologist/patients")
      .then(({ data }) => setPatients(data))
      .catch(() => setError("Erro ao carregar pacientes."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Olá, {user?.name?.split(" ")[0]} 👋</h1>
            <p style={styles.subtitle}>Acompanhe o progresso dos seus pacientes.</p>
          </div>
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={{ ...styles.statCard, background: "var(--primary-light)" }}>
            <span style={styles.statIcon}>👥</span>
            <div>
              <div style={{ ...styles.statValue, color: "var(--primary-dark)" }}>{patients.length}</div>
              <div style={styles.statLabel}>Pacientes ativos</div>
            </div>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Search */}
        <div style={styles.searchRow}>
          <div style={styles.searchWrap}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              className="form-input"
              style={{ paddingLeft: 38, border: "none", background: "transparent", width: "100%" }}
              placeholder="Buscar paciente por nome ou e-mail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div style={styles.loading}>
            <span className="spinner spinner-primary" /> Carregando pacientes...
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <div className="empty-state-text">
              {search ? "Nenhum paciente encontrado" : "Nenhum paciente cadastrado ainda"}
            </div>
            <div className="empty-state-sub">
              {search ? "Tente outro termo de busca" : "Pacientes aparecerão aqui após se cadastrarem"}
            </div>
          </div>
        ) : (
          <div style={styles.grid}>
            {filtered.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                onClick={() => navigate(`/psychologist/patients/${patient.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PatientCard({ patient, onClick }) {
  const initials = patient.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <button onClick={onClick} style={styles.patientCard}>
      <div style={styles.patientAvatar}>{initials}</div>
      <div style={styles.patientInfo}>
        <span style={styles.patientName}>{patient.name}</span>
        <span style={styles.patientEmail}>{patient.email}</span>
      </div>
      <div style={styles.chevron}>›</div>
    </button>
  );
}

const styles = {
  container: { maxWidth: 900, margin: "0 auto", padding: "32px 24px" },
  header: { marginBottom: 28 },
  title: { fontSize: "1.7rem", fontWeight: 800, color: "var(--text)" },
  subtitle: { fontSize: "0.92rem", color: "var(--text-sec)", marginTop: 4 },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 28 },
  statCard: { borderRadius: "var(--radius-md)", padding: "16px", display: "flex", alignItems: "center", gap: 12 },
  statIcon: { fontSize: "1.8rem" },
  statValue: { fontSize: "1.8rem", fontWeight: 800, lineHeight: 1 },
  statLabel: { fontSize: "0.78rem", color: "var(--text-sec)", fontWeight: 600, marginTop: 2 },
  searchRow: { marginBottom: 20 },
  searchWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    background: "var(--surface)",
    borderRadius: "var(--radius-md)",
    boxShadow: "var(--shadow)",
    border: "1.5px solid var(--border)",
    overflow: "hidden",
  },
  searchIcon: { position: "absolute", left: 12, fontSize: "1rem", pointerEvents: "none" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 },
  patientCard: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    background: "var(--surface)",
    borderRadius: "var(--radius-lg)",
    boxShadow: "var(--shadow)",
    padding: "18px 20px",
    border: "1.5px solid var(--border)",
    cursor: "pointer",
    textAlign: "left",
    width: "100%",
    transition: "all 0.2s",
    animation: "slideUp 0.2s ease",
  },
  patientAvatar: {
    width: 46,
    height: 46,
    borderRadius: "50%",
    background: "linear-gradient(135deg, var(--primary), var(--secondary))",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: "1rem",
    flexShrink: 0,
  },
  patientInfo: { flex: 1, display: "flex", flexDirection: "column", gap: 3, overflow: "hidden" },
  patientName: { fontWeight: 700, fontSize: "0.95rem", color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  patientEmail: { fontSize: "0.8rem", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  chevron: { fontSize: "1.4rem", color: "var(--text-muted)", fontWeight: 300 },
  loading: { display: "flex", alignItems: "center", gap: 10, justifyContent: "center", padding: "40px", color: "var(--text-muted)", fontWeight: 600 },
};
