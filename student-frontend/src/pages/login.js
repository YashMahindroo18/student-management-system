import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = process.env.REACT_APP_API_URL;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API}/auth/login`, {
        email,
        password,
      });

      const token = res.data.access_token;

      localStorage.setItem("token", token);

      const payload = JSON.parse(atob(token.split(".")[1]));

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
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;