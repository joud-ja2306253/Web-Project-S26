form.addEventListener("submit", function (event) {
  event.preventDefault();

  const firstName = document.getElementById("fname").value.trim();
  const lastName = document.getElementById("lname").value.trim();
  const UserName = document.getElementById("Uname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("conf_password").value;
  const message = document.getElementById("registerMessage");
  const existingUser = JSON.parse(localStorage.getItem("currentUser"));




function generateId() {
    return Date.now() + '-' + Math.random().toString(36).substr(2, 6);
}

function registerUser() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const newUser = {
        id: generateId(),  // ✅ UNIQUE USER ID
        username: username,
        email: email,
        password: password,
        createdAt: new Date().toISOString(),
        posts: [],  // Will store post IDs
        following: [],
        followers: []
    };
    
    // Save user data
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    // Also save to users list (for finding other users)
    const allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
    allUsers.push(newUser);
    localStorage.setItem('allUsers', JSON.stringify(allUsers));
    
    // Redirect to main page
    window.location.href = 'main.html';
}
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

  const currentUser = {
    firstName,
    lastName,
    UserName,
    email,
    password,
  };
 

  localStorage.setItem("user", JSON.stringify(currentUser));

  alert("Registration successful!");
  window.location.href = "login-page.html";
});
