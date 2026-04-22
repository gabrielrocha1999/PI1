import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import StarRating from "../components/StarRating";

export default function PatientTasks() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    Promise.all([
      api.get(`/psychologist/patients/${patientId}`),
      api.get(`/psychologist/patients/${patientId}/tasks`),
    ])
      .then(([pRes, tRes]) => {
        setPatient(pRes.data);
        setTasks(tRes.data);
      })
      .catch(() => setError("Erro ao carregar dados do paciente."))
      .finally(() => setLoading(false));
  }, [patientId]);

  const filtered = tasks.filter((t) => {
    if (filter === "pending") return !t.concluida;
    if (filter === "done") return t.concluida;
    return true;
  });

  const completedTasks = tasks.filter((t) => t.concluida);
  const ratedTasks = completedTasks.filter((t) => t.satisfacao);
  const avgSat = ratedTasks.length
    ? (ratedTasks.reduce((a, t) => a + t.satisfacao, 0) / ratedTasks.length).toFixed(1)
    : null;

  const satDistribution = [1, 2, 3, 4, 5].map((star) => ({
    star,
    count: ratedTasks.filter((t) => t.satisfacao === star).length,
  }));
  const maxCount = Math.max(...satDistribution.map((s) => s.count), 1);

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate("/psychologist")} style={{ marginBottom: 20 }}>
          ← Voltar
        </button>

        {loading ? (
          <div style={styles.loading}><span className="spinner spinner-primary" /> Carregando...</div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : (
          <>
            {/* Patient header */}
            <div style={styles.patientHeader}>
              <div style={styles.patientAvatar}>
                {patient?.name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()}
              </div>
              <div>
                <h1 style={styles.patientName}>{patient?.name}</h1>
                <p style={styles.patientEmail}>{patient?.email}</p>
              </div>
            </div>

            {/* Stats row */}
            <div style={styles.statsRow}>
              {[
                { label: "Total de tarefas", value: tasks.length, bg: "var(--primary-light)", color: "var(--primary-dark)", icon: "📋" },
                { label: "Concluídas", value: completedTasks.length, bg: "var(--success-light)", color: "var(--success)", icon: "✅" },
                { label: "Pendentes", value: tasks.length - completedTasks.length, bg: "var(--pending-light)", color: "var(--pending)", icon: "⏳" },
                { label: "Satisfação média", value: avgSat ? `${avgSat} ⭐` : "—", bg: "var(--secondary-light)", color: "var(--secondary-dark)", icon: "📊" },
              ].map((s) => (
                <div key={s.label} style={{ ...styles.statCard, background: s.bg }}>
                  <span style={{ fontSize: "1.5rem" }}>{s.icon}</span>
                  <div>
                    <div style={{ ...styles.statValue, color: s.color }}>{s.value}</div>
                    <div style={styles.statLabel}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Satisfaction distribution */}
            {ratedTasks.length > 0 && (
              <div style={styles.satSection}>
                <h3 style={styles.sectionTitle}>Distribuição de satisfação</h3>
                <div style={styles.satChart}>
                  {satDistribution.map(({ star, count }) => (
                    <div key={star} style={styles.satRow}>
                      <StarRating value={star} readonly size={16} />
                      <div style={styles.satBarTrack}>
                        <div
                          style={{
                            ...styles.satBar,
                            width: `${(count / maxCount) * 100}%`,
                            opacity: count === 0 ? 0.15 : 1,
                          }}
                        />
                      </div>
                      <span style={styles.satCount}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Filter tabs */}
            <div style={styles.tabs}>
              {[
                { key: "all", label: "Todas", count: tasks.length },
                { key: "pending", label: "Pendentes", count: tasks.filter((t) => !t.concluida).length },
                { key: "done", label: "Concluídas", count: completedTasks.length },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  style={{ ...styles.tab, ...(filter === f.key ? styles.tabActive : {}) }}
                >
                  {f.label}
                  <span style={{ ...styles.tabCount, background: filter === f.key ? "rgba(255,255,255,0.35)" : "var(--border)" }}>
                    {f.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Tasks */}
            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📭</div>
                <div className="empty-state-text">Nenhuma tarefa aqui</div>
              </div>
            ) : (
              <div style={styles.taskList}>
                {filtered.map((task) => (
                  <TaskCard key={task.id} task={task} readonly />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 860, margin: "0 auto", padding: "32px 24px" },
  loading: { display: "flex", alignItems: "center", gap: 10, justifyContent: "center", padding: "40px", color: "var(--text-muted)", fontWeight: 600 },
  patientHeader: { display: "flex", alignItems: "center", gap: 16, marginBottom: 28 },
  patientAvatar: {
    width: 56, height: 56,
    borderRadius: "50%",
    background: "linear-gradient(135deg, var(--primary), var(--secondary))",
    color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 800, fontSize: "1.2rem", flexShrink: 0,
  },
  patientName: { fontSize: "1.5rem", fontWeight: 800, color: "var(--text)" },
  patientEmail: { fontSize: "0.88rem", color: "var(--text-sec)", marginTop: 2 },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 28 },
  statCard: { borderRadius: "var(--radius-md)", padding: "16px", display: "flex", alignItems: "center", gap: 12 },
  statValue: { fontSize: "1.5rem", fontWeight: 800, lineHeight: 1 },
  statLabel: { fontSize: "0.78rem", color: "var(--text-sec)", fontWeight: 600, marginTop: 2 },
  satSection: {
    background: "var(--surface)",
    borderRadius: "var(--radius-lg)",
    boxShadow: "var(--shadow)",
    padding: 20,
    marginBottom: 24,
  },
  sectionTitle: { fontSize: "1rem", fontWeight: 700, color: "var(--text)", marginBottom: 16 },
  satChart: { display: "flex", flexDirection: "column", gap: 10 },
  satRow: { display: "flex", alignItems: "center", gap: 10 },
  satBarTrack: {
    flex: 1,
    height: 10,
    background: "var(--border)",
    borderRadius: 10,
    overflow: "hidden",
  },
  satBar: {
    height: "100%",
    background: "linear-gradient(90deg, var(--primary), var(--secondary))",
    borderRadius: 10,
    transition: "width 0.5s ease",
    minWidth: 4,
  },
  satCount: { fontSize: "0.82rem", fontWeight: 700, color: "var(--text-sec)", width: 20, textAlign: "right" },
  tabs: { display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" },
  tab: {
    display: "flex", alignItems: "center", gap: 7,
    padding: "8px 16px",
    borderRadius: "var(--radius-md)",
    border: "none",
    background: "var(--surface)",
    color: "var(--text-sec)",
    fontWeight: 600, fontSize: "0.9rem",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "var(--shadow)",
  },
  tabActive: { background: "var(--primary)", color: "#fff" },
  tabCount: { borderRadius: "20px", padding: "1px 7px", fontSize: "0.75rem", fontWeight: 700 },
  taskList: { display: "flex", flexDirection: "column", gap: 14 },
};
