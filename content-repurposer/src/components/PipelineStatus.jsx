import { STEP_LABELS } from "../agent/pipeline";
import { THEME } from "../styles/theme";

const styles = {
  container: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    margin: "24px 0",
  },
  pill: {
    padding: "6px 16px",
    borderRadius: THEME.radius.badge,
    fontFamily: THEME.font.body,
    fontSize: 13,
    fontWeight: 500,
    whiteSpace: "nowrap",
  },
};

function pillStyle(status) {
  if (status === "done") {
    return {
      background: THEME.success + "22",
      color: THEME.success,
      border: `1px solid ${THEME.success}44`,
    };
  }
  if (status === "active") {
    return {
      background: THEME.accent + "22",
      color: THEME.accentLight,
      border: `1px solid ${THEME.accent}44`,
    };
  }
  if (status === "error") {
    return {
      background: THEME.error + "22",
      color: THEME.error,
      border: `1px solid ${THEME.error}44`,
    };
  }
  return {
    background: THEME.surface,
    color: THEME.dim,
    border: `1px solid ${THEME.border}`,
  };
}

export default function PipelineStatus({ steps }) {
  return (
    <div style={styles.container}>
      {STEP_LABELS.map((label, i) => (
        <div
          key={i}
          style={{ ...styles.pill, ...pillStyle(steps[i] || "idle") }}
        >
          {steps[i] === "active" && "\u25CF "}
          {label}
          {steps[i] === "done" && " \u2713"}
        </div>
      ))}
    </div>
  );
}
