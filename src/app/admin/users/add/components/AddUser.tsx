'use client';
import { useState } from "react";
import {addUser } from "../../actions";
import { useRouter } from "next/navigation";

export function AddUser() {
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const data = new FormData();
    data.set("name", formData.name);
    data.set("email", formData.email);
    data.set("password", formData.password);

    const response = await addUser(data);
    setMessage(response.error || response.success || "");
    if (response.success) {
      router.push("/admin/users");
    }
  }
  
  const handleCancel = () => {
    router.push("/admin/users");
  }


  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Add User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Name" value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required className="w-full px-4 py-2 border rounded" />

        <input type="email" name="email" placeholder="Email" value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required className="w-full px-4 py-2 border rounded" />

        <input type="password" name="password" placeholder="Password" value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required className="w-full px-4 py-2 border rounded" />

        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          required className="w-full px-4 py-2 border rounded" />

        <button type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
          Add
        </button>

        <button type="button"
        onClick={handleCancel}
          className="w-full bg-red-600 hover:bg-blue-700 text-white py-2 rounded">
          Cancel
        </button>

        {message && <p className="text-red-500 text-center text-sm">{message}</p>}
      </form>
    </div>
  );
}
