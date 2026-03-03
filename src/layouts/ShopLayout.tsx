import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Outlet } from "react-router-dom";

export default function ShopLayout() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-background">
                <Outlet />
            </main>
            <Footer />
        </>
    );
}
