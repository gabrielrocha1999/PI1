import { useState } from "react";
import StarRating from "./StarRating";

export default function TaskModal({ mode, task, onClose, onSubmit, loading }) {
  const isCreate = mode === "create";

  const [titulo, setTitulo] = useState(task?.titulo || "");
  const [descricao, setDescricao] = useState(task?.descricao || "");
  const [dataPrevista, setDataPrevista] = useState(task?.data_prevista || "");
  const [satisfacao, setSatisfacao] = useState(null);
  const [reflexao, setReflexao] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (isCreate) {
      if (!titulo.trim()) return setError("O título é obrigatório.");
      onSubmit({ titulo: titulo.trim(), descricao: descricao.trim() || null, data_prevista: dataPrevista || null });
    } else {
      if (!satisfacao) return setError("Selecione uma nota de satisfação.");
      onSubmit({ concluida: true, satisfacao, reflexao: reflexao.trim() || null });
    }
  };

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {isCreate ? "📝 Nova Tarefa" : "✅ Concluir Tarefa"}
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Fechar">✕</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {isCreate ? (
            <>
              <div className="form-group">
                <label className="form-label">Título *</label>
                <input
                  className="form-input"
                  placeholder="Ex: Praticar respiração consciente"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descrição</label>
                <textarea
                  className="form-input"
                  placeholder="Descreva a atividade..."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Data prevista</label>
                <input
                  type="date"
                  className="form-input"
                  value={dataPrevista}
                  onChange={(e) => setDataPrevista(e.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              <div style={styles.taskName}>
                <span style={styles.taskNameLabel}>Tarefa:</span>
                <span style={styles.taskNameValue}>{task?.titulo}</span>
              </div>

              <div className="form-group" style={{ marginTop: 20 }}>
                <label className="form-label">Como você se sentiu? *</label>
                <div style={{ marginTop: 4 }}>
                  <StarRating value={satisfacao} onChange={setSatisfacao} size={36} />
                </div>
                {satisfacao && (
                  <span style={styles.satisfacaoLabel}>{satisfacaoTexto[satisfacao]}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Reflexão (opcional)</label>
                <textarea
                  className="form-input"
                  placeholder="O que você aprendeu ou percebeu ao realizar esta atividade?"
                  value={reflexao}
                  onChange={(e) => setReflexao(e.target.value)}
                  rows={4}
                />
              </div>
            </>
          )}

          <div style={styles.footer}>
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : isCreate ? "Criar Tarefa" : "Concluir"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const satisfacaoTexto = {
  1: "😞 Muito insatisfeito",
  2: "😕 Insatisfeito",
  3: "😐 Neutro",
  4: "🙂 Satisfeito",
  5: "😄 Muito satisfeito",
};

const styles = {
  taskName: {
    background: "var(--primary-light)",
    borderRadius: "var(--radius-md)",
    padding: "12px 16px",
    marginBottom: 8,
  },
  taskNameLabel: {
    fontSize: "0.8rem",
    fontWeight: 700,
    color: "var(--primary-dark)",
    display: "block",
    marginBottom: 2,
  },
  taskNameValue: {
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "var(--text)",
  },
  satisfacaoLabel: {
    display: "block",
    marginTop: 6,
    fontSize: "0.88rem",
    fontWeight: 600,
    color: "var(--text-sec)",
  },
  footer: {
    display: "flex",
    gap: 10,
    justifyContent: "flex-end",
    marginTop: 24,
    paddingTop: 16,
    borderTop: "1.5px solid var(--border)",
  },
};
