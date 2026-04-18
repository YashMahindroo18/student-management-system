import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import bg from "../assets/bg.png";
import logo from "../assets/logo.png";

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
      alert(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]"></div>

      {/* Card */}
      <div className="relative bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-[100px] text-center">

        {/* Logo */}
        <img src={logo} alt="IILM Logo" className="w-20 mx-auto mb-3" />

        <h2 className="text-xl font-semibold text-gray-700">
          IILM University
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          Greater Noida
        </p>

        {/* Inputs */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-400 hover:bg-blue-500 text-white py-2 rounded-lg transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;