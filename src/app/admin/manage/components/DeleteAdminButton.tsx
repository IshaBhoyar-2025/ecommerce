'use client'
// DeleteAdminButton.tsx
import { deleteAdminById } from "../../actions";

interface DeleteAdminButtonProps {
    adminId: string;
}

export const DeleteAdminButton: React.FC<DeleteAdminButtonProps> = ({ adminId }) => {
    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this admin?")) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append("id", adminId);

            // Call the delete function
            await deleteAdminById(formData);

        } catch (error) {
            alert("An error occurred while deleting the admin." + error);
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
