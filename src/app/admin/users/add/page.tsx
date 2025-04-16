import { AddUser } from "./components/AddUser";
import { getCurrentAdmin } from "../../actions";
import { redirect } from "next/navigation";

export default async function AddUserPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }
 

  return <AddUser />;
}
