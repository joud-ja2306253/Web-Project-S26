const form = document.querySelector("form");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const message = document.getElementById("loginMessage");

  // joud you have match the email with one the emails in allUsers

  // Get all registered users
  const allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];

  // Find user by email
  const matchedUser = allUsers.find((user) => user.email === email);

  if (!matchedUser) {
    message.textContent = "Login failed: No account found with this email!";
    message.style.color = "red";
    
    return;
  }

  // const storedUser = JSON.parse(localStorage.getItem("currentUser"));

  // if (!storedUser) {
  //   alert("No account found!");
  //   return;
  // }

  if (email === matchedUser.email && password === matchedUser.password) {
    //save current user id in the currentUser key if the email matches 1 from the allUsers
    localStorage.setItem("currentUser", JSON.stringify(matchedUser));

    //joud, this alert is duplicate?
    alert("Log in successful!");
    window.location.href = "profile-page.html";
  } else {
    message.textContent = "Login failed: Invalid password!!";
    message.style.color = "red";
    alert("Invalid password!");
  }

});
