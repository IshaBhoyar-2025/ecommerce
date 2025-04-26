"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ for client-side redirect
import { loginUser } from "../actions";

export default function LoginForm() {
  const [message, setMessage] = useState("");
  const router = useRouter(); // ✅

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const response = await loginUser(formData);
    
    if (response?.error) {
      setMessage(response.error);
    } else {
      router.push("/"); // ✅ redirect to homepage
    }
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
