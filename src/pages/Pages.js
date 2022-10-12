import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Footer from "../components/layouts/Footer";
import Header from "../components/layouts/Header";
import GoToTop from "../GoToTop";

const Pages = () => {
  const { username } = useSelector((state) => state)

  if (!username) return <Navigate to="/login" replace />;

  return (
    <>
      <Header />
      <Outlet />
      <GoToTop />
      <Footer />
    </>
  );
};

export default Pages;
