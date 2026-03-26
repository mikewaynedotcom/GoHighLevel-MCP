import { useState } from "react";
import { THEME } from "../styles/theme";

const styles = {
  card: {
    background: THEME.card,
    border: `1px solid ${THEME.border}`,
    borderRadius: THEME.radius.card,
    padding: 20,
    marginBottom: 16,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontFamily: THEME.font.display,
    fontSize: 14,
    fontWeight: 600,
    color: THEME.accentLight,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  copyBtn: {
    padding: "4px 14px",
    background: "transparent",
    border: `1px solid ${THEME.border}`,
    borderRadius: THEME.radius.button,
    color: THEME.dim,
    fontFamily: THEME.font.body,
    fontSize: 12,
    cursor: "pointer",
  },
  body: {
    fontFamily: THEME.font.body,
    fontSize: 15,
    lineHeight: 1.7,
    color: THEME.text,
    whiteSpace: "pre-wrap",
  },
  revised: {
    marginTop: 8,
    fontSize: 12,
    fontFamily: THEME.font.body,
    color: THEME.success,
  },
};

export default function OutputCard({ platform, content, revised }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.label}>{platform}</span>
        <button
          style={{
            ...styles.copyBtn,
            ...(copied
              ? { color: THEME.success, borderColor: THEME.success }
              : {}),
          }}
          onClick={handleCopy}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div style={styles.body}>{content}</div>
      {revised && <div style={styles.revised}>Revised after self-critique</div>}
    </div>
  );
}
