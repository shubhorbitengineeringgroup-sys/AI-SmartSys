import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Mail, UserCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [activeTab, setActiveTab] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const { login } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const isLogin = activeTab === "login";

        if (!email || !password || (!isLogin && !name)) {
            toast.error("Please fill in all fields");
            return;
        }

        // Simulate auth
        login(email, name);
        toast.success(isLogin ? "Welcome back!" : "Account created successfully!");
        onSuccess?.();
        onClose();
    };

    const handleGoogleAuth = async () => {
        const { lovable } = await import("@/integrations/lovable/index");
        const { error } = await lovable.auth.signInWithOAuth("google", {
            redirect_uri: window.location.origin,
        });
        if (error) {
            toast.error("Google sign-in failed. Please try again.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[420px] glass border-border/50 bg-background/90 backdrop-blur-2xl p-0 overflow-hidden rounded-3xl animate-in fade-in zoom-in duration-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary" />

                <div className="p-8">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-3xl font-heading font-bold text-center mb-2">
                            {activeTab === "login" ? "Login" : "Join Us"}
                        </DialogTitle>
                        <DialogDescription className="text-center text-muted-foreground">
                            {activeTab === "login"
                                ? "Sign in to access your AI SmartSyS dashboard"
                                : "Create an account to start your AI journey"}
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid grid-cols-2 w-full mb-8 bg-muted/30 p-1.5 rounded-2xl h-12">
                            <TabsTrigger
                                value="login"
                                className="rounded-xl data-[state=active]:bg-gradient-primary data-[state=active]:text-white transition-all duration-300"
                            >
                                Login
                            </TabsTrigger>
                            <TabsTrigger
                                value="signup"
                                className="rounded-xl data-[state=active]:bg-gradient-primary data-[state=active]:text-white transition-all duration-300"
                            >
                                Sign Up
                            </TabsTrigger>
                        </TabsList>

                        <div className="space-y-6">
                            <Button
                                variant="outline"
                                className="w-full h-12 glass border-border/40 hover:bg-muted/50 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300"
                                onClick={handleGoogleAuth}
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Continue with Google
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-border/40" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-3 text-muted-foreground font-medium">Or Use Email</span>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {activeTab === "signup" && (
                                    <div className="relative group">
                                        <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                        <Input
                                            type="text"
                                            placeholder="Full Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="bg-muted/30 border-border/50 h-12 pl-12 rounded-2xl focus:border-primary/50"
                                            required={activeTab === "signup"}
                                        />
                                    </div>
                                )}
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                    <Input
                                        type="email"
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-muted/30 border-border/50 h-12 pl-12 rounded-2xl focus:border-primary/50"
                                        required
                                    />
                                </div>
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-muted/30 border-border/50 h-12 rounded-2xl"
                                    required
                                />
                                <Button type="submit" className="w-full h-12 text-base font-semibold bg-gradient-button hover:opacity-90 rounded-2xl shadow-lg shadow-primary/20 transition-all duration-300">
                                    {activeTab === "login" ? "Sign In" : "Create Account"}
                                </Button>
                            </form>
                        </div>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AuthModal;
