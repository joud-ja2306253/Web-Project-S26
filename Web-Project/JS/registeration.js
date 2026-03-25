form.addEventListener("submit", function (event) {
  event.preventDefault();

  const firstName = document.getElementById("fname").value.trim();
  const lastName = document.getElementById("lname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("conf_password").value;
  
  //const passwordPattern = ;
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    alert("Please fill all fields!");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  const user = {
    firstName,
    lastName,
    email,
    password,
  };
});
