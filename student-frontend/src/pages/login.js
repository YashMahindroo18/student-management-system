import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/auth/login", {
        email: email,
        password: password,
      });

      const token = res.data.access_token;

      // store token
      localStorage.setItem("token", token);
      console.log("Token saved:", token);
      // decode token to get role
      const payload = JSON.parse(atob(token.split(".")[1]));

      // redirect based on role
      if (payload.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }

    } catch (err) {
      console.log(err.response);
      alert(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: "10px" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: "10px" }}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;