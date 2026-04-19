import { useState } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

function Activate() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleActivate = async () => {
    try {
      await axios.post(`${API}/auth/activate`, {
        email,
        password,
      });

      alert("Account activated! Now login.");
    } catch (err) {
      alert(err.response?.data?.detail || "Error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-pink-100 to-purple-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Activate Account</h2>

        <input
          className="border p-2 w-full mb-3 rounded"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-3 rounded"
          type="password"
          placeholder="Set Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleActivate}
          className="bg-purple-500 text-white w-full py-2 rounded"
        >
          Activate
        </button>
      </div>
    </div>
  );
}

export default Activate;