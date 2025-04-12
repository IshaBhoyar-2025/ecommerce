"use client"
import { useState } from "react";
import { loginAdmin } from "../../actions";

export function Login() {
  //add redirect if logged in
  const [message, setMessage] = useState("");

  //move to component

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const response = await loginAdmin(formData);
    setMessage(response.error || "");
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
