import { Input } from "@/components/ui/input";
import { Lock, X } from "lucide-react";
import { useState } from "react";

interface PasswordModalProps {
  eventTitle: string;
  isDark: boolean;
  onConfirm: (password: string) => void;
  onCancel: () => void;
}

export function PasswordModal({
  eventTitle,
  isDark,
  onConfirm,
  onCancel,
}: PasswordModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const handleSubmit = () => {
    if (!password.trim()) {
      setError("Please enter the password");
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    setError("");
    onConfirm(password);
  };

  const overlayStyle = {
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(4px)",
  };
  const modalStyle = isDark
    ? {
        background: "rgba(25, 30, 45, 0.95)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }
    : {
        background: "rgba(255, 255, 255, 0.97)",
        border: "1px solid rgba(0,0,0,0.1)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
      };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={overlayStyle}
      data-ocid="password.modal"
    >
      <div
        className={`rounded-2xl p-6 w-full max-w-sm slide-in ${shake ? "shake" : ""}`}
        style={modalStyle}
        aria-label="Unlock Surprise"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #6FA8FF, #B98CFF)",
              }}
            >
              <Lock size={14} className="text-white" />
            </div>
            <h3
              className="font-semibold text-base"
              style={{ color: isDark ? "#F2F4FF" : "#1a1a2e" }}
            >
              Unlock Surprise
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 rounded-full hover:opacity-60 transition-opacity"
            data-ocid="password.close_button"
          >
            <X size={16} style={{ color: isDark ? "#AEB6D0" : "#888" }} />
          </button>
        </div>

        <p
          className="text-sm mb-4"
          style={{ color: isDark ? "#AEB6D0" : "#666" }}
        >
          Enter the password to reveal{" "}
          <strong style={{ color: isDark ? "#F2F4FF" : "#1a1a2e" }}>
            "{eventTitle}"
          </strong>
        </p>

        <label htmlFor="unlock-password" className="sr-only">
          Password
        </label>
        <Input
          id="unlock-password"
          type="password"
          placeholder="Enter password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="mb-3"
          style={{
            background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.04)",
            border: isDark
              ? "1px solid rgba(255,255,255,0.12)"
              : "1px solid rgba(0,0,0,0.1)",
            color: isDark ? "#F2F4FF" : "#1a1a2e",
          }}
          autoFocus
          data-ocid="password.input"
        />

        {error && (
          <p
            className="text-xs mb-3"
            style={{ color: "#ff6b6b" }}
            data-ocid="password.error_state"
          >
            {error}
          </p>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
            style={{
              background: isDark
                ? "rgba(255,255,255,0.07)"
                : "rgba(0,0,0,0.06)",
              color: isDark ? "#AEB6D0" : "#666",
              border: isDark
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(0,0,0,0.08)",
            }}
            data-ocid="password.cancel_button"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 py-2 rounded-xl text-sm font-semibold text-white transition-all gradient-btn"
            data-ocid="password.confirm_button"
          >
            Unlock 🔓
          </button>
        </div>
      </div>
    </div>
  );
}
