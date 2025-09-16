import { useParams } from "react-router-dom";
import EditForm from "../../components/Forms/EditForm";

function AdminEditUser() {
    const { userId } = useParams();
    
    return (
        <div className="admin-edit-user">
            <EditForm 
                route={`/api/users/account/manage/admin/${userId}/`}
                changePasswordRoute="/auth/change-password/"
                isAdminEdit={true}
            />
        </div>
    );
}

export default AdminEditUser;