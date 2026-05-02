"use client";

export default function Alert({
  message,
  type,
  onConfirm,
  onCancel,
  isConfirm = false,
  isLogout = false,
}) {
  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  return (
    <div
      id="customAlert"
      className="alert-overlay show"
      style={{
        display: "flex",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        className={`alert-box ${type}`}
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "20px",
          minWidth: "300px",
          textAlign: "center",
        }}
      >
        <span
          id="alertIcon"
          className="alert-icon"
          style={{ fontSize: "32px", display: "block" }}
        >
          {icons[type] || "ℹ️"}
        </span>
        <p id="alertMessage">{message}</p>
        {isConfirm ? (
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              marginTop: "15px",
            }}
          >
            <button
              onClick={onConfirm}
              style={{
                background: "#f44336",
                color: "white",
                border: "none",
                padding: "8px 20px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              {isLogout ? "Logout" : "Delete"}
            </button>
            <button
              onClick={onCancel}
              style={{
                background: "#888",
                color: "white",
                border: "none",
                padding: "8px 20px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={onConfirm}
            style={{
              marginTop: "15px",
              padding: "8px 20px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            OK
          </button>
        )}
      </div>
    </div>
  );
}
