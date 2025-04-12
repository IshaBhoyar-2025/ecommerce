import { AdminEdit } from "./components/AdminEdit";
import { getCurrentAdmin } from "../../actions";
import { redirect } from "next/navigation";

export default  async function AddEditPage() {

  const admin = await getCurrentAdmin();
      if (!admin) {
        redirect("/admin/login");
      }
  return (
    
      <AdminEdit />
  
  );
}