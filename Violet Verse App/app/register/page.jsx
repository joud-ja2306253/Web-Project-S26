// app/register/page.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "../AuthenticateUser";
import { useAlert } from "../hooks/useAlert";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useUser();
  const { showAlert, AlertComponent } = useAlert();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { firstName, lastName, username, email, password, confirmPassword } =
      formData;

    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      showAlert("Please fill all fields", "warning");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      showAlert("Password does not match!", "warning");
      setLoading(false);
      return;
    }

    const result = await register({
      firstName,
      lastName,
      username,
      email,
      password,
    });

    if (result.success) {
      showAlert("Registration successful!", "success", () => {
        router.push("/profile");
      });
    } else {
      showAlert(result.error, "error");
    }
    setLoading(false);
  };

  return (
    <>
      <div className="form-container">
        <h2 className="h2F">Registration</h2>
        <form onSubmit={handleSubmit}>
          <fieldset className="fieldsetF">
            <legend className="legendF">Create Account</legend>

            <label className="labelF" htmlFor="firstName">
              First Name<span className="requiredF"> *</span>
            </label>
            <input
              className="inputF"
              id="firstName"
              type="text"
              placeholder="Enter Your First Name"
              required
              value={formData.firstName}
              onChange={handleChange}
            />

            <label className="labelF" htmlFor="lastName">
              Last Name<span className="requiredF"> *</span>
            </label>
            <input
              className="inputF"
              id="lastName"
              type="text"
              placeholder="Enter Your Last Name"
              required
              value={formData.lastName}
              onChange={handleChange}
            />

            <label className="labelF" htmlFor="username">
              User Name<span className="requiredF"> *</span>
            </label>
            <input
              className="inputF"
              id="username"
              type="text"
              placeholder="Enter Your User Name"
              required
              value={formData.username}
              onChange={handleChange}
            />

            <label className="labelF" htmlFor="email">
              Email<span className="requiredF"> *</span>
            </label>
            <input
              className="inputF"
              id="email"
              type="email"
              placeholder="Enter Your Email"
              required
              value={formData.email}
              onChange={handleChange}
            />

            <label className="labelF" htmlFor="password">
              Password<span className="requiredF"> *</span>
            </label>
            <input
              className="inputF"
              id="password"
              type="password"
              placeholder="Enter Your Password"
              required
              value={formData.password}
              onChange={handleChange}
            />

            <label className="labelF" htmlFor="confirmPassword">
              Confirm Password<span className="requiredF"> *</span>
            </label>
            <input
              className="inputF"
              id="confirmPassword"
              type="password"
              placeholder="Enter Your Password Again"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </fieldset>

          <button className="buttonF" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="switch">
            Already have an account? <Link href="/login">Login</Link>
          </p>
        </form>
      </div>
      <AlertComponent />
    </>
  );
}