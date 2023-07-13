import { Outlet } from "react-router-dom";
import GoToTop from "../GoToTop";
import Footer from "../components/layouts/Footer";
import Header from "../components/layouts/Header";

const Pages = () => {
	// const { username } = useSelector((state) => state)

	// if (!username) return <Navigate to="/login" replace />;

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
