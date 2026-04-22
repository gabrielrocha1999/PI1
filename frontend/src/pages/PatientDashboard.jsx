import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";

const FILTERS = [
  { key: "all", label: "Todas" },
  { key: "pending", label: "Pendentes" },
  { key: "done", label: "Concluídas" },
];

export default function PatientDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState(null); // null | { mode: "create" } | { mode: "complete", task }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await api.get("/tasks/");
      setTasks(data);
    } catch {
      setError("Erro ao carregar tarefas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleCreate = async (payload) => {
    setSubmitting(true);
    try {
      const { data } = await api.post("/tasks/", payload);
      setTasks((prev) => [data, ...prev]);
      setModal(null);
    } catch (err) {
      setError(err.response?.data?.detail || "Erro ao criar tarefa.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async (payload) => {
    setSubmitting(true);
    try {
      const { data } = await api.put(`/tasks/${modal.task.id}`, payload);
      setTasks((prev) => prev.map((t) => (t.id === data.id ? data : t)));
      setModal(null);
    } catch (err) {
      setError(err.response?.data?.detail || "Erro ao concluir tarefa.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Excluir esta tarefa?")) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch {
      setError("Erro ao excluir tarefa.");
    }
  };

  const filtered = tasks.filter((t) => {
    if (filter === "pending") return !t.concluida;
    if (filter === "done") return t.concluida;
    return true;
  });

  const stats = {
    total: tasks.length,
    done: tasks.filter((t) => t.concluida).length,
    avgSat: (() => {
      const rated = tasks.filter((t) => t.concluida && t.satisfacao);
      if (!rated.length) return null;
      return (rated.reduce((a, t) => a + t.satisfacao, 0) / rated.length).toFixed(1);
    })(),
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        {/* Welcome */}
        <div style={styles.welcome}>
          <div>
            <h1 style={styles.welcomeTitle}>Olá, {user?.name?.split(" ")[0]} 👋</h1>
            <p style={styles.welcomeSub}>Registre suas atividades e acompanhe seu progresso.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setModal({ mode: "create" })} style={styles.addBtn}>
            + Nova Tarefa
          </button>
        </div>

        {error && <div className="alert alert-error" onClick={() => setError("")}>{error} ✕</div>}

        {/* Stats */}
        <div style={styles.statsRow}>
          {[
            { label: "Total", value: stats.total, icon: "📋", color: "var(--primary-light)", text: "var(--primary-dark)" },
            { label: "Concluídas", value: stats.done, icon: "✅", color: "var(--success-light)", text: "var(--success)" },
            { label: "Pendentes", value: stats.total - stats.done, icon: "⏳", color: "var(--pending-light)", text: "var(--pending)" },
            { label: "Satisfação média", value: stats.avgSat ? `${stats.avgSat} ⭐` : "—", icon: "📊", color: "var(--secondary-light)", text: "var(--secondary-dark)" },
          ].map((s) => (
            <div key={s.label} style={{ ...styles.statCard, background: s.color }}>
              <span style={styles.statIcon}>{s.icon}</span>
              <div>
                <div style={{ ...styles.statValue, color: s.text }}>{s.value}</div>
                <div style={styles.statLabel}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={styles.tabs}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                ...styles.tab,
                ...(filter === f.key ? styles.tabActive : {}),
              }}
            >
              {f.label}
              <span style={{ ...styles.tabCount, background: filter === f.key ? "rgba(255,255,255,0.35)" : "var(--border)" }}>
                {f.key === "all" ? tasks.length : f.key === "pending" ? tasks.filter((t) => !t.concluida).length : tasks.filter((t) => t.concluida).length}
              </span>
            </button>
          ))}
        </div>

        {/* Task list */}
        {loading ? (
          <div style={styles.loadingRow}>
            <span className="spinner spinner-primary" /> Carregando tarefas...
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🌱</div>
            <div className="empty-state-text">Nenhuma tarefa aqui</div>
            <div className="empty-state-sub">
              {filter === "all" ? "Crie sua primeira tarefa clicando em + Nova Tarefa" : "Mude o filtro para ver outras tarefas"}
            </div>
          </div>
        ) : (
          <div style={styles.taskList}>
            {filtered.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={(t) => setModal({ mode: "complete", task: t })}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {modal && (
        <TaskModal
          mode={modal.mode}
          task={modal.task}
          onClose={() => setModal(null)}
          onSubmit={modal.mode === "create" ? handleCreate : handleComplete}
          loading={submitting}
        />
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: 860, margin: "0 auto", padding: "32px 24px" },
  welcome: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
    flexWrap: "wrap",
    gap: 12,
  },
  welcomeTitle: { fontSize: "1.7rem", fontWeight: 800, color: "var(--text)" },
  welcomeSub: { fontSize: "0.92rem", color: "var(--text-sec)", marginTop: 4 },
  addBtn: { flexShrink: 0, borderRadius: "var(--radius-md)", padding: "11px 22px", fontWeight: 700 },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 28 },
  statCard: { borderRadius: "var(--radius-md)", padding: "16px", display: "flex", alignItems: "center", gap: 12 },
  statIcon: { fontSize: "1.6rem" },
  statValue: { fontSize: "1.5rem", fontWeight: 800, lineHeight: 1 },
  statLabel: { fontSize: "0.78rem", color: "var(--text-sec)", fontWeight: 600, marginTop: 2 },
  tabs: { display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" },
  tab: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    padding: "8px 16px",
    borderRadius: "var(--radius-md)",
    border: "none",
    background: "var(--surface)",
    color: "var(--text-sec)",
    fontWeight: 600,
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "var(--shadow)",
  },
  tabActive: { background: "var(--primary)", color: "#fff" },
  tabCount: { borderRadius: "20px", padding: "1px 7px", fontSize: "0.75rem", fontWeight: 700 },
  taskList: { display: "flex", flexDirection: "column", gap: 14 },
  loadingRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    justifyContent: "center",
    padding: "40px",
    color: "var(--text-muted)",
    fontWeight: 600,
  },
};
