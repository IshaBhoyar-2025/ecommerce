import {Login} from "./components/Login";
import { getCurrentAdmin } from "../actions";
import { redirect } from "next/navigation";

export default  async function LoginPage() {

  const admin = await getCurrentAdmin();
      if (admin) {
        redirect("/admin/dashboard");
      } 
  return (
    
      <Login />
  
  );
}