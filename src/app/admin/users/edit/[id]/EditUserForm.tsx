"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditUserForm({
  user,
  updateUser,
}: {
  user: { id: string; name: string; email: string };
  updateUser: (formData: FormData) => Promise<{ error?: string; success?: string }>;
}) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    const formData = new FormData();
    formData.set("id", user.id);
    formData.set("name", name);
    formData.set("email", email);
    if (password) {
      formData.set("password", password);
    }

    const result = await updateUser(formData);
    if (result.error) {
      setMessage(result.error);
    } else {
      router.push("/admin/users");
    }
  }
  const handleCancel = () => {  
    router.push("/admin/users");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Name"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Create Password (optional)"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
      >
        Update
      </button>
      <button
        type="button"
        onClick={handleCancel}
        className="w-full bg-red-600 hover:bg-blue-700 text-white py-2 rounded-lg"
      >
        Cancel
      </button>
      {message && <p className="text-red-500 text-sm text-center">{message}</p>}
    </form>
  );
}
