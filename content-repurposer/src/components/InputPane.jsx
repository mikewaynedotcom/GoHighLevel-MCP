import { THEME } from "../styles/theme";

const styles = {
  container: {
    width: "100%",
    maxWidth: 720,
  },
  textarea: {
    width: "100%",
    minHeight: 200,
    padding: 16,
    background: THEME.surface,
    border: `1px solid ${THEME.border}`,
    borderRadius: THEME.radius.card,
    color: THEME.text,
    fontFamily: THEME.font.body,
    fontSize: 15,
    lineHeight: 1.6,
    resize: "vertical",
    outline: "none",
    boxSizing: "border-box",
  },
  button: {
    marginTop: 16,
    padding: "12px 32px",
    background: THEME.accent,
    color: "#fff",
    border: "none",
    borderRadius: THEME.radius.button,
    fontFamily: THEME.font.display,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
  },
  buttonDisabled: {
    opacity: 0.4,
    cursor: "not-allowed",
  },
};

export default function InputPane({ value, onChange, onRun, disabled }) {
  const canRun = value.trim().length > 0 && !disabled;

  return (
    <div style={styles.container}>
      <textarea
        style={styles.textarea}
        placeholder="Paste your content here (blog post, transcript, raw idea)..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      <button
        style={{ ...styles.button, ...(canRun ? {} : styles.buttonDisabled) }}
        onClick={onRun}
        disabled={!canRun}
      >
        {disabled ? "Running..." : "Repurpose Content"}
      </button>
    </div>
  );
}
