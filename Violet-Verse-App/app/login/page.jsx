// app/login/page.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "../AuthenticateUser";
import { useAlert } from "../hooks/useAlert";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUser();
  const { showAlert, AlertComponent } = useAlert();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      showAlert("Login successful!", "success", () => {
        router.push("/");
      });
    } else {
      showAlert(result.error, "error");
    }
    setLoading(false);
  };

  return (
    <>
      <div className="form-container">
        <h2 className="h2F">Login</h2>
        <form onSubmit={handleSubmit}>
          <fieldset className="fieldsetF">
            <legend className="legendF">Login</legend>

            <label className="labelF" htmlFor="email">
              Email<span className="requiredF"> *</span>
            </label>
            <input
              className="inputF"
              id="email"
              type="email"
              placeholder="Enter Your Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </fieldset>

          <button className="buttonF" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="switch">
            Don't have an account?{" "}
            <Link href="/register">Register</Link>
          </p>
        </form>
      </div>
      <AlertComponent />
    </>
  );
}