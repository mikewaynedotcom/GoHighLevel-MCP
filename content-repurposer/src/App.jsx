import { useState, useCallback } from "react";
import { THEME } from "./styles/theme";
import { runPipeline } from "./agent/pipeline";
import { getApiKey, setApiKey } from "./agent/claude";
import InputPane from "./components/InputPane";
import PipelineStatus from "./components/PipelineStatus";
import OutputCard from "./components/OutputCard";
import FoldSection from "./components/FoldSection";

const appStyle = {
  minHeight: "100vh",
  background: THEME.bg,
  color: THEME.text,
  fontFamily: THEME.font.body,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "40px 20px",
};

const titleStyle = {
  fontFamily: THEME.font.display,
  fontSize: 28,
  fontWeight: 700,
  marginBottom: 4,
  color: THEME.text,
};

const subtitleStyle = {
  fontFamily: THEME.font.body,
  fontSize: 14,
  color: THEME.dim,
  marginBottom: 32,
};

const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 100,
};

const modalBox = {
  background: THEME.card,
  border: `1px solid ${THEME.border}`,
  borderRadius: THEME.radius.card,
  padding: 32,
  width: "100%",
  maxWidth: 440,
};

const modalInput = {
  width: "100%",
  padding: 12,
  marginTop: 12,
  background: THEME.surface,
  border: `1px solid ${THEME.border}`,
  borderRadius: THEME.radius.button,
  color: THEME.text,
  fontFamily: THEME.font.mono,
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};

const modalBtn = {
  marginTop: 16,
  padding: "10px 28px",
  background: THEME.accent,
  color: "#fff",
  border: "none",
  borderRadius: THEME.radius.button,
  fontFamily: THEME.font.display,
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};

const errorStyle = {
  margin: "12px 0",
  padding: "10px 16px",
  background: THEME.error + "18",
  border: `1px solid ${THEME.error}44`,
  borderRadius: THEME.radius.button,
  color: THEME.error,
  fontFamily: THEME.font.body,
  fontSize: 13,
};

const resetBtn = {
  marginTop: 24,
  padding: "10px 28px",
  background: "transparent",
  border: `1px solid ${THEME.border}`,
  borderRadius: THEME.radius.button,
  color: THEME.dim,
  fontFamily: THEME.font.display,
  fontSize: 14,
  cursor: "pointer",
};

const contentArea = {
  width: "100%",
  maxWidth: 720,
};

export default function App() {
  const [showKeyModal, setShowKeyModal] = useState(!getApiKey());
  const [keyInput, setKeyInput] = useState("");
  const [content, setContent] = useState("");
  const [running, setRunning] = useState(false);
  const [steps, setSteps] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [intermediates, setIntermediates] = useState({});

  function saveKey() {
    const trimmed = keyInput.trim();
    if (trimmed) {
      setApiKey(trimmed);
      setShowKeyModal(false);
    }
  }

  const handleStepUpdate = useCallback((update) => {
    setSteps((prev) => ({ ...prev, [update.step]: update.status }));
    if (update.data) {
      setIntermediates((prev) => ({ ...prev, [update.step]: update.data }));
    }
  }, []);

  async function handleRun() {
    if (!getApiKey()) {
      setShowKeyModal(true);
      return;
    }
    setRunning(true);
    setError(null);
    setResult(null);
    setSteps({});
    setIntermediates({});

    try {
      const res = await runPipeline(content, handleStepUpdate);
      setResult(res);
    } catch (err) {
      setError(err.message);
      setSteps((prev) => {
        const updated = { ...prev };
        for (const key of Object.keys(updated)) {
          if (updated[key] === "active") updated[key] = "error";
        }
        return updated;
      });
    } finally {
      setRunning(false);
    }
  }

  function handleReset() {
    setContent("");
    setRunning(false);
    setSteps({});
    setResult(null);
    setError(null);
    setIntermediates({});
  }

  return (
    <div style={appStyle}>
      {showKeyModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <div
              style={{
                fontFamily: THEME.font.display,
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              Anthropic API Key
            </div>
            <div style={{ fontSize: 13, color: THEME.dim }}>
              Your key stays in localStorage. Never sent anywhere except the
              Anthropic API.
            </div>
            <input
              style={modalInput}
              type="password"
              placeholder="sk-ant-..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveKey()}
            />
            <button style={modalBtn} onClick={saveKey}>
              Save Key
            </button>
          </div>
        </div>
      )}

      <div style={titleStyle}>Content Repurposer</div>
      <div style={subtitleStyle}>
        Paste content. Get platform-ready versions. Powered by an agentic AI
        loop.
      </div>

      <InputPane
        value={content}
        onChange={setContent}
        onRun={handleRun}
        disabled={running}
      />

      {(running || result || error) && (
        <div style={contentArea}>
          <PipelineStatus steps={steps} />

          {error && <div style={errorStyle}>{error}</div>}

          {intermediates[0] && (
            <FoldSection title="Key Points" defaultOpen={!result}>
              {intermediates[0]}
            </FoldSection>
          )}

          {intermediates[1] && (
            <FoldSection title="Initial Drafts">
              {Object.entries(intermediates[1]).map(([name, text]) => (
                <div key={name} style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      color: THEME.accentLight,
                      fontWeight: 600,
                      marginBottom: 6,
                    }}
                  >
                    {name}
                  </div>
                  {text}
                </div>
              ))}
            </FoldSection>
          )}

          {intermediates[2] && (
            <FoldSection title="Self-Critique">
              {intermediates[2].critique}
              <div
                style={{
                  marginTop: 12,
                  color: intermediates[2].needsRevision
                    ? THEME.warn
                    : THEME.success,
                  fontWeight: 600,
                }}
              >
                Verdict:{" "}
                {intermediates[2].needsRevision ? "REVISE" : "APPROVED"}
              </div>
            </FoldSection>
          )}

          {result && (
            <>
              <div
                style={{
                  fontFamily: THEME.font.display,
                  fontSize: 18,
                  fontWeight: 600,
                  margin: "24px 0 12px",
                }}
              >
                Final Versions
              </div>
              {Object.entries(result.finals).map(([platform, text]) => (
                <OutputCard
                  key={platform}
                  platform={platform}
                  content={text}
                  revised={result.revised}
                />
              ))}
              <button style={resetBtn} onClick={handleReset}>
                Start Over
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
