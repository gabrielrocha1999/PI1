import StarRating from "./StarRating";

export default function TaskCard({ task, onComplete, onDelete, readonly = false }) {
  const statusColor = task.concluida ? "var(--success)" : "var(--pending)";

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <div style={{ ...styles.card, borderLeftColor: statusColor }}>
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <span style={styles.title}>{task.titulo}</span>
          <span className={`badge ${task.concluida ? "badge-done" : "badge-pending"}`}>
            {task.concluida ? "Concluída" : "Pendente"}
          </span>
        </div>
      </div>

      {task.descricao && (
        <p style={styles.description}>{task.descricao}</p>
      )}

      <div style={styles.meta}>
        {task.data_prevista && (
          <span style={styles.metaItem}>
            📅 {formatDate(task.data_prevista)}
          </span>
        )}
        {task.concluida && task.satisfacao && (
          <StarRating value={task.satisfacao} readonly size={18} />
        )}
      </div>

      {task.reflexao && (
        <div style={styles.reflexaoBox}>
          <span style={styles.reflexaoLabel}>💭 Reflexão</span>
          <p style={styles.reflexaoText}>{task.reflexao}</p>
        </div>
      )}

      {!readonly && (
        <div style={styles.actions}>
          {!task.concluida && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onComplete(task)}
            >
              ✓ Concluir
            </button>
          )}
          <button
            className="btn btn-sm"
            style={{ background: "var(--danger-light)", color: "var(--danger)" }}
            onClick={() => onDelete(task.id)}
          >
            🗑 Excluir
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: "var(--surface)",
    borderRadius: "var(--radius-lg)",
    boxShadow: "var(--shadow)",
    padding: "20px 20px 20px 24px",
    borderLeft: "4px solid",
    transition: "box-shadow 0.2s, transform 0.2s",
    animation: "slideUp 0.2s ease",
  },
  header: { marginBottom: 8 },
  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  title: {
    fontWeight: 700,
    fontSize: "1rem",
    color: "var(--text)",
    flex: 1,
  },
  description: {
    fontSize: "0.88rem",
    color: "var(--text-sec)",
    marginBottom: 10,
    lineHeight: 1.5,
  },
  meta: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 8,
    flexWrap: "wrap",
  },
  metaItem: {
    fontSize: "0.82rem",
    color: "var(--text-muted)",
    fontWeight: 600,
  },
  reflexaoBox: {
    background: "var(--primary-light)",
    borderRadius: "var(--radius-sm)",
    padding: "10px 14px",
    marginBottom: 10,
    marginTop: 4,
  },
  reflexaoLabel: {
    fontSize: "0.78rem",
    fontWeight: 700,
    color: "var(--primary-dark)",
    display: "block",
    marginBottom: 4,
  },
  reflexaoText: {
    fontSize: "0.88rem",
    color: "var(--text-sec)",
    lineHeight: 1.5,
  },
  actions: {
    display: "flex",
    gap: 8,
    marginTop: 12,
    flexWrap: "wrap",
  },
};
