import { useState } from "react";
import axios from "axios";

function Activate() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleActivate = async () => {
  try {
    const res = await axios.post("http://127.0.0.1:8000/auth/activate", {
      email,
      password,
    });

    alert("Account activated!");
  } catch (err) {
    console.log(err.response);   // 👈 ADD THIS
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