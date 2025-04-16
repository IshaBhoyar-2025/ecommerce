import React from 'react';
import Link from 'next/link';
import { DeleteAdminButton } from "./components/DeleteAdminButton";
import { getAllAdmins, AdminType } from "@/app/admin/actions";
import { getCurrentAdmin } from "@/app/admin/actions";
import { redirect } from 'next/navigation';


export default async function ManageAdminsPage() {
     const adminLoggedIn = await getCurrentAdmin();
    if (!adminLoggedIn) {
        redirect("/admin/login");
    }
    
        const admins = await getAllAdmins();
        
    return (
           <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Manage Admins</h1>

            {/* Admin Profile */}



            {/* Add Admin Button */}

            <Link
                href="/admin/add"
                className="mb-4 inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            >
                Add Admin
            </Link>
            <Link
                href="/admin/dashboard"
                className="mb-4 inline-block bg-blue-600 hover:bg-green-700 text-white ml-2 px-4 py-2 rounded-md"
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
                    {admins.map((admin: AdminType, index: number) => (
                        <tr key={index} className="border-t">
                            <td className="p-2 border">{admin.name}</td>
                            <td className="p-2 border">{admin.email}</td>
                            <td className="p-2 border space-x-2">
                                <Link
                                    href={`/admin/edit/${admin.id}`}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                                >
                                    Edit
                                </Link>

                                {
                                    adminLoggedIn.id !== admin.id && (
                                        <DeleteAdminButton
                                        adminId={admin.id}
                                    />
                                    )
                                }

                               


                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    
    )
}