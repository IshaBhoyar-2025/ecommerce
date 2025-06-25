import Link from "next/link";
import { LogoutButton } from "./components/LogoutButton";



import { getCurrentAdmin } from "../actions";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
    const admin = await getCurrentAdmin();
    if (!admin) {
        redirect("/admin/login");
    }


    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>


            <LogoutButton />
            <br />
            <button className="bg-blue-500 text-white px-4 py-2 mt-2 bottom-2 rounded mb-4">
                <Link href="/admin/manage">Manage Admins</Link>
            </button>
            <br />
            <button className="bg-blue-500 text-white px-4 py-2  bottom-2 rounded mb-4">
                <Link href="/admin/users"> Manage Users</Link>
            </button>
            <br />
            <button className="bg-blue-500 text-white px-4 py-2  bottom-2 rounded mb-4">
                <Link href="/admin/categories"> Manage Categories</Link>
            </button>
            <br />
            <button className="bg-blue-500 text-white px-4 py-2  bottom-2 rounded mb-4">
                <Link href="/admin/subcategory"> Manage Sub Categories</Link>
            </button>
            <br />
            <button className="bg-blue-500 text-white px-4 py-2  bottom-2 rounded mb-4">
                <Link href="/admin/products"> Manage Product</Link>
            </button>

            <br />

            <button className="bg-blue-500 text-white px-4 py-2  bottom-2 rounded mb-4">
                <Link href="/admin/orders">
                    Manage Orders
                </Link>
            </button>

        </div>
    );
}


