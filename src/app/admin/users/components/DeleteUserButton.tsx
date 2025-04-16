'use client'
import { deleteUserById } from "../actions"; // Adjust the path and module name as needed


interface DeleteUserButtonProps {
    userId: string;
}

export const DeleteUserButton: React.FC<DeleteUserButtonProps> = ({ userId }) => {
    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this user?")) {
            return;
        }

        try {
            await deleteUserById(userId);

        } catch (error) {
            alert("An error occurred while deleting the user." + error);
        }
    };

    return (
        <input
            type="button"
            value="Delete"
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
        />
    );
};
