import { AddProduct } from "./components/AddProduct"; // Import the AddProduct component
import { getCurrentAdmin } from "../../actions"; 
import { redirect } from "next/navigation";

export default async function AddProductPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login"); // Redirect to login if not authenticated
  }

  return <AddProduct />; // Render the AddProduct component
}
