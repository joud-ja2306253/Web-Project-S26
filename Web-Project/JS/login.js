const form = document.querySelector("form");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const message = document.getElementById("loginMessage");

  // match the email with one the emails in allUsers

  // Get all registered users
  const allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];

  // Find user by email, case in-sensitive
  const matchedUser = allUsers.find(
    (user) => user.email.toLowerCase() === email.toLowerCase(),
  );

  if (!matchedUser) {
    message.textContent = "Login failed: No account found with this email!";
    message.style.color = "red";
    alert("No account found with this email!");
    return;
  }

  if (password === matchedUser.password) {
    //save current user id in the currentUser key if the email matches 1 from the allUsers
    localStorage.setItem("currentUser", JSON.stringify(matchedUser));

    alert("Log in successful!");
    window.location.href = "profile-page.html";
  } else {
    message.textContent = "Login failed: Invalid password!";
    message.style.color = "red";
    alert("Invalid password!");
  }
});
