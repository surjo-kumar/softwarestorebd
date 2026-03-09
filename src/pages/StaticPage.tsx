import { useLocation, Link } from "react-router-dom";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function StaticPage() {
    const { pathname } = useLocation();
    
    // Determine page title based on route
    const getPageTitle = () => {
        switch (pathname) {
            case '/contact': return 'Contact Us';
            case '/faq': return 'Frequently Asked Questions';
            case '/terms': return 'Terms of Service';
            case '/privacy': return 'Privacy Policy';
            case '/refund': return 'Refund Policy';
            default: return 'Page Information';
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30 px-4 py-12">
            <div className="max-w-3xl w-full text-center space-y-8">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-xl shadow-primary/30 transform hover:scale-105 transition-all">
                    <Sparkles className="h-10 w-10 text-white" />
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
                    {getPageTitle()}
                </h1>
                
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/40 max-w-2xl mx-auto">
                    <p className="text-lg text-slate-600 font-medium leading-relaxed">
                        We are currently updating our <span className="text-primary font-bold">{getPageTitle()}</span>. 
                        Please check back soon. If you need immediate assistance, please use our floating chat button to contact support via WhatsApp, Messenger, or Telegram.
                    </p>
                </div>
                
                <Link to="/" className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 hover:text-primary transition-all shadow-sm">
                    <ArrowLeft className="h-5 w-5" />
                    Return to Homepage
                </Link>
            </div>
        </div>
    );
}
