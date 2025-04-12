import { logoutAdmin } from "../../actions";

export  function  LogoutButton() {
    
    return (
    <button type="submit" onClick={logoutAdmin} className="bg-red-500 hover:bg-red-700 text-white font-bold  ml-2 py-2 px-4 rounded">
        Logout
    </button>);
}