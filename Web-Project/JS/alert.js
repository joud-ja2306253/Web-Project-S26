function showAlert(message, type = "info", callback = null) {
  const overlay = document.getElementById("customAlert");
  const box = overlay.querySelector(".alert-box");
  const icon = document.getElementById("alertIcon");
  const msg = document.getElementById("alertMessage");

  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  msg.textContent = message;
  box.className = "alert-box " + type;
  icon.textContent = icons[type] || "ℹ️";

  overlay.classList.add("show");

  // Store callback to run after OK is clicked
  overlay._callback = callback;
}

function closeAlert() {
  const overlay = document.getElementById("customAlert");
  overlay.classList.remove("show");

  // Run callback if one was set (example: redirect after success)
  if (overlay._callback) {
    overlay._callback();
    overlay._callback = null;
  }
}

function showConfirm(message, onConfirm) {
  const overlay = document.getElementById("customAlert");
  const box = overlay.querySelector(".alert-box");
  const icon = document.getElementById("alertIcon");
  const msg = document.getElementById("alertMessage");
  const okBtn = overlay.querySelector("button");

  msg.textContent = message;
  box.className = "alert-box warning";
  icon.textContent = "⚠️";

  // Change OK button to Confirm + add Cancel
  okBtn.textContent = "Delete";
  okBtn.style.background = "#f44336";
  okBtn.onclick = () => {
    closeAlert();
    onConfirm();
    // Reset button after
    okBtn.textContent = "OK";
    okBtn.style.background = "";
    okBtn.onclick = closeAlert;
  };

  // Add cancel button temporarily
  let cancelBtn = overlay.querySelector(".cancel-btn");
  if (!cancelBtn) {
    cancelBtn = document.createElement("button");
    cancelBtn.className = "cancel-btn";
    cancelBtn.style.cssText = "background:#888; margin-left:10px;";
    box.appendChild(cancelBtn);
  }
  cancelBtn.textContent = "Cancel";
  cancelBtn.style.display = "inline-block";
  cancelBtn.onclick = () => {
    closeAlert();
    okBtn.textContent = "OK";
    okBtn.style.background = "";
    okBtn.onclick = closeAlert;
    cancelBtn.style.display = "none";
  };

  overlay.classList.add("show");
}