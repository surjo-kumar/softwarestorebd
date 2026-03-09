
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout';
import ShopLayout from '@/layouts/ShopLayout';
import AdminLayout from '@/layouts/AdminLayout';
import HomePage from '@/pages/Home';
import ProductsPage from '@/pages/Products';
import ProductDetailsPage from '@/pages/ProductDetail';
import CheckoutPage from '@/pages/Checkout';
import CheckoutSuccessPage from '@/pages/CheckoutSuccess';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import UserDashboard from '@/pages/user/Dashboard';
import StaticPage from '@/pages/StaticPage';
import CartPage from '@/pages/Cart';
import { CartProvider } from '@/contexts/CartContext';

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
        <CartProvider>
            <Router>
                <RootLayout>
                    <Routes>
                    {/* Shop Routes */}
                    <Route element={<ShopLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/products/:id" element={<ProductDetailsPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={<UserDashboard />} />
                        <Route path="/contact" element={<StaticPage />} />
                        <Route path="/faq" element={<StaticPage />} />
                        <Route path="/terms" element={<StaticPage />} />
                        <Route path="/privacy" element={<StaticPage />} />
                        <Route path="/refund" element={<StaticPage />} />
                    </Route>

                    {/* Admin Routes - No Login Required */}
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
        </CartProvider>
    );
}

export default App;
