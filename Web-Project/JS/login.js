const form = document.querySelector("form");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const storedUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!storedUser) {
    alert("No account found!");
    return;
  }

  if (email === storedUser.email && password === storedUser.password) {
    alert("Login successful!");
  } else {
    alert("Invalid email or password!");
  }

  localStorage.setItem("CurrentUser", JSON.stringify(currentUser));

  alert("Log in successful!");
  window.location.href = "profile-page.html";
});