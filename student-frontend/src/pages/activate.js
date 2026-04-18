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

      alert("Account activated!");
    } catch (err) {
      console.log(err.response);
      alert(err.response?.data?.detail || "Activation failed");
    }
  };

  return (
    <div>
      <h2>Activate Account</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleActivate}>Activate</button>
    </div>
  );
}

export default Activate;