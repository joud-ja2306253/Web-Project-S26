form.addEventListener("submit", function (event) {
  event.preventDefault();

  const firstName = document.getElementById("fname").value.trim();
  const lastName = document.getElementById("lname").value.trim();
  const UserName = document.getElementById("Uname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("conf_password").value;
  const message = document.getElementById("registerMessage");
  const existingUser = JSON.parse(localStorage.getItem("user"));

 if (!firstName || !lastName || !UserName || !email || !password || !confirmPassword) {
    message.textContent = "Registration failed Please fill all fields";
    message.style.color = "red";
    return
}

  
  if (password !== confirmPassword) {
    message.textContent = "Registration failed Ppassword does not match";
    message.style.color = "red";
    return;
  }
  
  if (existingUser && existingUser.email === email) {
    message.textContent = "You already have an account ⚠️";
    message.style.color = "red";
    return;
  }

  const user = {
    firstName,
    lastName,
    UserName,
    email,
    password,
  };
 

  localStorage.setItem("user", JSON.stringify(user));

  alert("Registration successful!");
  window.location.href = "login-page.html";
});
