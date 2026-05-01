// app/components/Alert.jsx
'use client';
import { useEffect, useState } from 'react';

export default function Alert({ message, type, onConfirm, onCancel, isConfirm = false }) {
  const [show, setShow] = useState(true);

  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  const handleClose = () => {
    setShow(false);
    if (onCancel) onCancel();
  };

  const handleConfirm = () => {
    setShow(false);
    if (onConfirm) onConfirm();
  };

  if (!show) return null;

  return (
    <div id="customAlert" className="alert-overlay show" style={{ display: 'flex' }}>
      <div className={`alert-box ${type}`}>
        <span id="alertIcon" className="alert-icon">{icons[type] || "ℹ️"}</span>
        <p id="alertMessage">{message}</p>
        {isConfirm ? (
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button 
              onClick={handleConfirm}
              style={{ background: "#f44336" }}
            >
              Delete
            </button>
            <button 
              onClick={handleClose}
              style={{ background: "#888" }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={handleClose}>OK</button>
        )}
      </div>
    </div>
  );
}