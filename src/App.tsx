
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout';
import ShopLayout from '@/layouts/ShopLayout';
import AuthLayout from '@/layouts/AuthLayout';
import AdminLayout from '@/layouts/AdminLayout';
import HomePage from '@/pages/Home';
import ProductsPage from '@/pages/Products';
import ProductDetailsPage from '@/pages/ProductDetail';
import UserDashboardPage from '@/pages/Dashboard';
import CheckoutPage from '@/pages/Checkout';
import CheckoutSuccessPage from '@/pages/CheckoutSuccess';
import LoginPage from '@/pages/Login';
import RegisterPage from '@/pages/Register';

// Admin Pages
import AdminDashboardPage from '@/pages/admin/AdminDashboard';
import AdminProductsPage from '@/pages/admin/Products';
import AdminProductForm from '@/pages/admin/ProductForm';
import AdminOrdersPage from '@/pages/admin/Orders';
import AdminUsersPage from '@/pages/admin/Users';
import AdminCategoriesPage from '@/pages/admin/Categories';
import AdminCouponsPage from '@/pages/admin/Coupons';
import AdminPaymentsPage from '@/pages/admin/Payments';
import AdminSettingsPage from '@/pages/admin/Settings';

function App() {
    return (
        <Router>
            <RootLayout>
                <Routes>
                    {/* Shop Routes */}
                    <Route element={<ShopLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/products/:id" element={<ProductDetailsPage />} />
                        <Route path="/dashboard" element={<UserDashboardPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
                    </Route>

                    {/* Auth Routes */}
                    <Route element={<AuthLayout />}>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboardPage />} />
                        <Route path="products" element={<AdminProductsPage />} />
                        <Route path="products/new" element={<AdminProductForm />} />
                        <Route path="products/edit/:id" element={<AdminProductForm />} />
                        <Route path="categories" element={<AdminCategoriesPage />} />
                        <Route path="orders" element={<AdminOrdersPage />} />
                        <Route path="payments" element={<AdminPaymentsPage />} />
                        <Route path="users" element={<AdminUsersPage />} />
                        <Route path="coupons" element={<AdminCouponsPage />} />
                        <Route path="settings" element={<AdminSettingsPage />} />
                    </Route>
                </Routes>
            </RootLayout>
        </Router>
    );
}

export default App;
