import UserTable from "../../components/Tables/UserTable";

function AdminListUser() {
    return <UserTable route="/api/users/account/viewall/" />;
}
export default AdminListUser;