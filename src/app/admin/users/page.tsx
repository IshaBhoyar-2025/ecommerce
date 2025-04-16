import React from 'react';
import Link from 'next/link';
import { getAllUsers, UserType } from "./actions";
import { DeleteUserButton } from "./components/DeleteUserButton";
import {redirect} from "next/navigation";
import { getCurrentAdmin } from "../actions";

export default async function UsersPage() {
  // Check if the user is an admin  
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }



  const users = await getAllUsers();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

      <Link
       href="/admin/users/add"
        className="mb-4 inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
      >
        Add User
      </Link>

      <Link
       href="/admin/dashboard"
        className="mb-4 inline-block bg-blue-600 hover:bg-green-700 ml-2 text-white px-4 py-2 rounded-md"
      >
        Go To Dashboard
      </Link>

      <table className="w-full border-collapse mt-4">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: UserType, index: number) => (
            <tr key={index} className="border-t">
              <td className="p-2 border">{user.name}</td>
              <td className="p-2 border">{user.email}</td>
              <td className="p-2 border space-x-2">
                <Link
                  href={`/admin/users/edit/${user._id}`}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                >
                  Edit
                </Link>


                <DeleteUserButton userId={user._id.toString()} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
