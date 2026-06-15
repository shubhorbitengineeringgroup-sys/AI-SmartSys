import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Brain, FileText, Image as ImageIcon, Bot, LogOut, Layout, ArrowLeft } from "lucide-react";
import { Navigate, useSearchParams } from "react-router-dom";
import { GlowOrb } from "@/components/TechPattern";
import { useState, useEffect } from "react";
import CaptionGenerator from "@/components/tools/CaptionGenerator";
import ResumeBuilder from "@/components/tools/ResumeBuilder";
import ImageGenerator from "@/components/tools/ImageGenerator";
import ChatbotBuilder from "@/components/tools/ChatbotBuilder";
import SEO from "@/components/SEO";


const Dashboard = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTool, setActiveTool] = useState<string | null>(searchParams.get("tool"));

    useEffect(() => {
        const tool = searchParams.get("tool");
        if (tool) {
            setActiveTool(tool);
        }
    }, [searchParams]);

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const userTools = [
        { id: "caption", title: "AI Caption Generator", icon: Brain, color: "text-blue-400", component: <CaptionGenerator /> },
        { id: "resume", title: "AI Resume Builder", icon: FileText, color: "text-purple-400", component: <ResumeBuilder /> },
        { id: "image", title: "AI Image Generator", icon: ImageIcon, color: "text-cyan-400", component: <ImageGenerator /> },
        { id: "chatbot", title: "AI Chatbot Builder", icon: Bot, color: "text-blue-500", component: <ChatbotBuilder /> },
    ];

    const renderTool = () => {
        const tool = userTools.find(t => t.id === activeTool);
        return tool ? tool.component : null;
    };

    return (
        <div className="min-h-screen bg-background">
            <SEO noindex={true} title="User Dashboard" />
            <Navbar />

            <main className="pt-32 pb-20 container mx-auto px-4 relative">
                <GlowOrb className="w-[500px] h-[500px] top-0 -left-60" color="primary" />
                <GlowOrb className="w-[400px] h-[400px] bottom-0 -right-40" color="secondary" />

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 relative z-10">
                    <div>
                        {activeTool ? (
                            <Button
                                variant="ghost"
                                onClick={() => setActiveTool(null)}
                                className="mb-4 text-muted-foreground hover:text-foreground p-0 group"
                            >
                                <ArrowLeft size={16} className="mr-2 transition-transform group-hover:-translate-x-1" /> Back to Dashboard
                            </Button>
                        ) : null}
                        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
                            {activeTool ? userTools.find(t => t.id === activeTool)?.title : (
                                <>Welcome, <span className="text-gradient-primary">{user?.name}</span></>
                            )}
                        </h1>
                        <p className="text-muted-foreground">
                            {activeTool ? "Experience the power of SmartSyS AI technology." : "Access all your AI tools and saved projects here."}
                        </p>
                    </div>

                    {!activeTool && (
                        <Button variant="outline" onClick={logout} className="glass border-border/40 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20">
                            <LogOut size={16} className="mr-2" /> Logout
                        </Button>
                    )}
                </div>

                <div className="relative z-10">
                    {activeTool ? (
                        <div className="animate-fade-in-up">
                            {renderTool()}
                        </div>
                    ) : (
                        <>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {userTools.map((tool) => (
                                    <div key={tool.id} className="premium-card p-8 group cursor-pointer hover:-translate-y-2 transition-all duration-300">
                                        <div className={`w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-6 border border-border/40 group-hover:bg-primary/10 transition-colors ${tool.color}`}>
                                            <tool.icon size={28} />
                                        </div>
                                        <h3 className="text-xl font-heading font-semibold mb-2">{tool.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                                            Unlock advanced features with our premium AI model.
                                        </p>
                                        <Button
                                            onClick={() => setActiveTool(tool.id)}
                                            size="sm"
                                            className="w-full bg-muted/40 hover:bg-gradient-primary rounded-xl transition-all duration-500"
                                        >
                                            Launch Tool
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            {/* Stats Section */}
                            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                                {[
                                    { label: "AI Generations", value: "128", icon: Brain },
                                    { label: "Tokens Used", value: "45K", icon: Layout },
                                    { label: "Saved Items", value: "12", icon: Bot },
                                ].map((stat) => (
                                    <div key={stat.label} className="glass border-border/40 p-6 rounded-2xl flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                                            <stat.icon size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                                            <p className="text-2xl font-bold">{stat.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Dashboard;
