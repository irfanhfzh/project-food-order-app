import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCartItems, setOrderItems } from "./bootstrap/actions";
import swal from "sweetalert";
import Pages from "./pages/Pages";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import MenuPage from "./pages/MenuPage";
import DetailMenuPage from "./pages/DetailMenuPage";
import LoginPage from "./pages/LoginPage";
import UserOrderCartPage from "./pages/UserOrderCartPage";
import UserOrderPage from "./pages/UserOrderPage";
import AdminPage from "./pages/AdminPage";
import AdminMenus from "./components/sections/AdminMenus";
import AdminOrders from "./components/sections/AdminOrders";
import AdminDashboard from "./components/sections/AdminDashboard";
import "./App.css";

function App() {
  const { username, cartItems, orderItems } = useSelector((state) => state);
  const dispatch = useDispatch();

  function newOrder(data, dateTime) {
    const newOrder = {
      user: username,
      status: "Pending",
      dataPesananUser: data,
      dateTime: dateTime,
    };
    dispatch(setOrderItems([...orderItems, newOrder]));
  }

  const handleAddProduct = (product) => {
    const ProductExist = cartItems.find((item) => item.id === product.id);
    if (ProductExist) {
      dispatch(
        setCartItems(
          cartItems.map((item) =>
            item.id === product.id
              ? { ...ProductExist, quantity: ProductExist.quantity + 1 }
              : item
          )
        )
      );
    } else {
      dispatch(setCartItems([...cartItems, { ...product, quantity: 1 }]));
    }
    swal({
      title: "Sukses Masuk Keranjang!",
      text: product.name + " sudah Masuk ke Keranjang",
      icon: "success",
      button: false,
      timer: 1750,
    });
  };

  const handleAddQtyProduct = (product) => {
    const ProductExist = cartItems.find((item) => item.id === product.id);
    if (ProductExist) {
      dispatch(
        setCartItems(
          cartItems.map((item) =>
            item.id === product.id
              ? { ...ProductExist, quantity: ProductExist.quantity + 1 }
              : item
          )
        )
      );
    } else {
      dispatch(setCartItems([...cartItems, { ...product, quantity: 1 }]));
    }
  };

  const handleRemoveProduct = (product) => {
    const ProductExist = cartItems.find((item) => item.id === product.id);
    if (ProductExist.quantity === 1) {
      dispatch(
        setCartItems(cartItems.filter((item) => item.id !== product.id))
      );
    } else {
      dispatch(
        setCartItems(
          cartItems.map((item) =>
            item.id === product.id
              ? { ...ProductExist, quantity: ProductExist.quantity - 1 }
              : item
          )
        )
      );
    }
  };

  const handleCartClearance = () => {
    dispatch(setCartItems([]));
    swal({
      title: "Keranjang sudah Kosong!",
      text: "Sukses Hapus Semua Menu di Keranjang ",
      icon: "success",
      button: false,
      timer: 1750,
    });
  };

  return (
    <Router>
      <Routes>
        <Route exact path="/login" element={<LoginPage />} />
        <Route element={<Pages />}>
          <Route
            exact
            path="/"
            element={<HomePage handleAddProduct={handleAddProduct} />}
          />
          <Route exact path="/tentang-kami" element={<AboutPage />} />
          <Route
            exact
            path="/menu"
            element={<MenuPage handleAddProduct={handleAddProduct} />}
          />
          <Route
            exact
            path="/menu/:menuSlug"
            element={<DetailMenuPage handleAddProduct={handleAddProduct} />}
          />
          <Route
            exact
            path="/:user/keranjang-saya"
            element={
              <UserOrderCartPage
                handleAddQtyProduct={handleAddQtyProduct}
                handleRemoveProduct={handleRemoveProduct}
                handleCartClearance={handleCartClearance}
                newOrder={newOrder}
              />
            }
          />
          <Route exact path="/:user/pesanan-saya" element={<UserOrderPage />} />
        </Route>
        <Route element={<AdminPage />}>
          <Route exact path="/admin" element={<AdminDashboard />} />
          <Route exact path="/admin/daftar-menu" element={<AdminMenus />} />
          <Route exact path="/admin/daftar-pesanan" element={<AdminOrders />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
