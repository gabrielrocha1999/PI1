import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleHome = () => {
    navigate(user?.tipo === "patient" ? "/dashboard" : "/psychologist");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <button onClick={handleHome} style={styles.logo}>
          <span style={styles.logoIcon}>🧠</span>
          <span style={styles.logoText}>MindTrack</span>
        </button>

        <div style={styles.right}>
          {user && (
            <>
              <div style={styles.userInfo}>
                <div style={styles.avatar}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div style={styles.userDetails}>
                  <span style={styles.userName}>{user.name}</span>
                  <span
                    className={`badge badge-${user.tipo}`}
                    style={{ fontSize: "0.7rem" }}
                  >
                    {user.tipo === "patient" ? "Paciente" : "Psicólogo(a)"}
                  </span>
                </div>
              </div>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm" style={{ marginLeft: 8 }}>
                Sair
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "var(--surface)",
    borderBottom: "1.5px solid var(--border)",
    boxShadow: "0 2px 12px rgba(74,144,217,0.07)",
  },
  inner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 24px",
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
  },
  logoIcon: { fontSize: "1.6rem" },
  logoText: {
    fontSize: "1.25rem",
    fontWeight: 800,
    color: "var(--primary)",
    letterSpacing: "-0.5px",
  },
  right: { display: "flex", alignItems: "center", gap: 8 },
  userInfo: { display: "flex", alignItems: "center", gap: 10 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    background: "var(--primary)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "1rem",
    flexShrink: 0,
  },
  userDetails: { display: "flex", flexDirection: "column", gap: 1 },
  userName: { fontWeight: 700, fontSize: "0.9rem", color: "var(--text)", lineHeight: 1.2 },
};
