import { useState } from "react";
import { THEME } from "../styles/theme";

const styles = {
  container: {
    marginBottom: 12,
    border: `1px solid ${THEME.border}`,
    borderRadius: THEME.radius.card,
    overflow: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 16px",
    background: THEME.surface,
    cursor: "pointer",
    userSelect: "none",
  },
  title: {
    fontFamily: THEME.font.display,
    fontSize: 13,
    fontWeight: 600,
    color: THEME.dim,
  },
  arrow: {
    color: THEME.dim,
    fontSize: 12,
  },
  body: {
    padding: 16,
    background: THEME.card,
    fontFamily: THEME.font.mono,
    fontSize: 13,
    lineHeight: 1.6,
    color: THEME.text,
    whiteSpace: "pre-wrap",
  },
};

export default function FoldSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={styles.container}>
      <div style={styles.header} onClick={() => setOpen(!open)}>
        <span style={styles.title}>{title}</span>
        <span style={styles.arrow}>{open ? "\u25B2" : "\u25BC"}</span>
      </div>
      {open && <div style={styles.body}>{children}</div>}
    </div>
  );
}
