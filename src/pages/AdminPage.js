import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../components/layouts/Sidebar";

const AdminPage = () => {
  const { username } = useSelector((state) => state)

  if (!username) return <Navigate to="/login" />

  return (
    <div className="d-flex flex-nowrap">
      <Sidebar />
      <div
        className="p-4"
        style={{ width: "calc(100% - 280px)", backgroundColor: "#f7f8fc" }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPage;
