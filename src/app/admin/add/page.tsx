
import { AddAdmin } from "./components/AddAdmin";
import { getCurrentAdmin } from "../actions";
import { redirect } from "next/navigation";


export default async function AddAdminPage() {
   const admin = await getCurrentAdmin();
    if (!admin) {
      redirect("/admin/login");
    }
  return (


    
      <AddAdmin />

  )

}

