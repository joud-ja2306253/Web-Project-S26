const form = document.querySelector("form");

form.addEventListener(
  "submit",
  function (event) {
    event.preventDefault();

    const firstName = document.getElementById("fname").value.trim();
    const lastName = document.getElementById("lname").value.trim();
    const userName = document.getElementById("Uname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("conf_password").value;

    //a p tag in registration html to add warnings
    const message = document.getElementById("registerMessage");

    function generateId() {
      return Date.now() + "-" + Math.random().toString(36).substr(2, 6);
      //return "user_" + Date.now();
    }

    if (
      !firstName ||
      !lastName ||
      !userName ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      message.textContent = "Registration failed: Please fill all fields";
      message.style.color = "red";
      return;
    }

    //can you fix this? if the password doesnt match i have to reload
    // ============ Check if passwords match ====================
    if (password !== confirmPassword) {
      message.textContent = "Registration failed: Password does not match!";
      message.style.color = "red";
      return;
    }

    //test this
    // ============ Check if email already exists ====================
    // Get all registered users
    const allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];

    // Find user by email
    if (allUsers.find((user) => user.email === email)) {
      message.textContent = "An account with this email already exists ⚠️";
      message.style.color = "red";
      return;
    }

    // --- CREATE NEW USER ---
    const newUser = {
      id: generateId(),
      //default profilepic
      profilePic:
        "https://i.pinimg.com/1200x/28/16/5a/28165aaca2ee560b4a6b760765efe976.jpg",
      username: userName,
      displayName: firstName + " " + lastName,
      bio: "",
      email: email,
      password: password,
      createdAt: new Date().toISOString(), //why do we need this joud?
      posts: [],
      comments: [], //store comment IDs
      following: [],
      followers: [],
    };

    // Save user id
    localStorage.setItem("currentUser", newUser.id);

    // Also save to users list (for finding other users)
    allUsers.push(newUser);
    localStorage.setItem("allUsers", JSON.stringify(allUsers));

    showAlert("Registration successful!", "success", 
      () => { window.location.href = "profile-page.html"; })
  },
  // }
);
