// File: src/app/admin/login/page.tsx
import LoginForm from "./LoginForm";
import { getCurrentUser } from "../actions";
import { redirect } from "next/navigation";

export default async function LoginPage() {

    const user = await getCurrentUser();
    if (user) {
      redirect("/"); // Redirect to home if user is already logged in
      return null;
    }
    return <LoginForm />;
}
