import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import LandingPage from "./pages/LandingPage";
import { AuthProvider } from "./context/AuthContext";
import RoleGuard from "./components/RoleGuard";
import BussinessDashboard from "./layout/Bussiness/BusinessLayout";
import DashboardController from "./page-controller/DashboardController";
import NotFound from "./components/404/NotFound";
import OrderController from "./page-controller/OrderController";
import SellerProducts from "./pages/SellerPages/products/SellerProducts";
import EditProduct from "./components/Edit-Product/EditProduct";
import SellerProductView from "./components/ProductViewModal/SellerProductView";
import BusinessMarketPlace from "./pages/BusinessPages/Marketplace/BusinessMarketPlace";
import UserList from "./pages/AdminPages/admin users/UserList";
import AdminLayout from "./layout/Admin/AdminLayout";
import PlaceOrder from "./components/PlaceOrder/PlaceOrder";
import { ShoppingCartProvider } from "./context/ShoppingCartContext";
import SettingsController from "./page-controller/SettingsController";
import AdminProducts from "./pages/AdminPages/admin products/AdminProducts";
import ProductsController from "./page-controller/ProductsController";
import PaymentSucces from "./components/404/PaymentSucces";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Register />} />
            <Route path="register" element={<Register />} />
            <Route path="success" element={<PaymentSucces />} />
            <Route path="cancel" element={<div>un</div>} />
            <Route path="login" element={<Login />} />
            <Route path="404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route element={<RoleGuard allowedRoles={["supplier"]} />}>
            <Route path="/edit" element={<EditProduct />} />
            <Route path="/report" element={<SellerProducts />} />
            <Route path="/analytics" element={<SellerProducts />} />
            <Route path="/view-product" element={<SellerProductView />} />
          </Route>

          <Route element={<RoleGuard allowedRoles={["business"]} />}>
            {/* <Route path="/admin-list-students" element={<BussinessDashboard />}/> */}
            <Route path="/marketplace" element={<BusinessMarketPlace />} />
            <Route path="/place-order" element={<PlaceOrder />} />
          </Route>

          <Route element={<RoleGuard allowedRoles={["admin"]} />}>
            {/* <Route path="/admin-list-students" element={<BussinessDashboard />}/> */}
            <Route element={<AdminLayout />}>
              <Route path="/user-list" element={<UserList />} />
              {/* <Route path="/products" element={<AdminProducts />}/>                             */}
            </Route>
          </Route>

          <Route
            element={
              <RoleGuard allowedRoles={["business", "admin", "supplier"]} />
            }
          >
            <Route path="/dashboard" element={<DashboardController />} />
            <Route path="/order" element={<OrderController />} />
            <Route path="/settings" element={<SettingsController />} />
            <Route path="/products" element={<ProductsController />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
