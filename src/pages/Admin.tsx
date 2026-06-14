import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminInquiries } from "@/components/tools/AdminInquiries";
import { GlowOrb } from "@/components/TechPattern";
import { Lock, Mail, ShieldAlert, LogOut, ArrowRight, Bot } from "lucide-react";
import { toast } from "sonner";

// Authorized administrator email list
// Edit this array to add or remove authorized administrator accounts!
const ADMIN_EMAILS = [
  "shubh.orbitengineering.group@gmail.com", 
  "vijaytiwari@orbitengineerings.com"
];

const Admin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check current auth session on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsChecking(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all credentials.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      toast.success("Admin authenticated successfully!");
    } catch (err: any) {
      console.error("Admin Login Error:", err);
      toast.error(err.message || "Invalid credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Admin logged out.");
  };

  // 1. Initial Loading Spinner
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const userEmail = session?.user?.email;
  const isAdmin = userEmail && ADMIN_EMAILS.includes(userEmail);

  // 2. Render Login Screen if not authenticated
  if (!session) {
    return (
      <div className="min-h-screen bg-background relative flex flex-col justify-between overflow-hidden">
        <Navbar />
        <GlowOrb className="w-[500px] h-[500px] top-10 -left-60" color="primary" />
        <GlowOrb className="w-[400px] h-[400px] bottom-10 -right-40" color="secondary" />

        <div className="flex-grow flex items-center justify-center px-4 pt-32 pb-20 relative z-10">
          <div className="w-full max-w-[440px] rounded-3xl glass border border-white/10 p-8 shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-primary rounded-t-3xl" />
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-inner">
                <Lock className="text-primary" size={26} />
              </div>
              <h1 className="text-2xl font-heading font-bold text-foreground">Secure Admin Portal</h1>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Authorized access only. Sign in with your administrator credentials.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                <Input
                  type="email"
                  placeholder="Admin Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-muted/30 border-border/50 h-12 pl-12 rounded-2xl focus:border-primary/50 text-foreground placeholder:text-muted-foreground/60"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                <Input
                  type="password"
                  placeholder="Admin Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-muted/30 border-border/50 h-12 pl-12 rounded-2xl focus:border-primary/50 text-foreground placeholder:text-muted-foreground/60"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-sm sm:text-base font-semibold bg-gradient-button hover:opacity-90 rounded-2xl shadow-lg shadow-primary/20 transition-all duration-300 mt-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 justify-center">
                    Sign In as Admin <ArrowRight size={16} />
                  </span>
                )}
              </Button>
            </form>
            
            <div className="mt-6 border-t border-white/5 pt-4 text-center">
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Registration is closed. Admin accounts must be created inside the Supabase Auth panel by the system owner.
              </p>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  // 3. Render Access Denied if email is not in authorized list
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background relative flex flex-col justify-between overflow-hidden">
        <Navbar />
        <GlowOrb className="w-[500px] h-[500px] top-10 -left-60" color="destructive" />

        <div className="flex-grow flex items-center justify-center px-4 pt-32 pb-20 relative z-10">
          <div className="w-full max-w-[450px] rounded-3xl glass border border-red-500/20 p-8 shadow-2xl relative text-center">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500 rounded-t-3xl" />
            
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4 border border-red-500/20 text-red-400">
              <ShieldAlert size={28} className="animate-bounce" />
            </div>

            <h1 className="text-xl sm:text-2xl font-heading font-bold text-red-400">Access Denied</h1>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              You are authenticated as <span className="font-semibold text-foreground break-all">{userEmail}</span>, but this account is not in the authorized administrator whitelist.
            </p>

            <div className="bg-red-500/5 border border-red-500/15 p-4 rounded-2xl text-[11px] text-muted-foreground text-left mt-6 space-y-2 leading-relaxed font-mono">
              <div className="font-bold text-foreground">How to fix:</div>
              <div>1. Log out and sign in with an approved admin email.</div>
              <div>2. Or open <code className="bg-red-500/25 px-1 py-0.5 rounded text-white">src/pages/Admin.tsx</code> in code and add <code className="text-white">"{userEmail}"</code> to the whitelisted <code className="text-primary">ADMIN_EMAILS</code> array.</div>
            </div>

            <Button
              onClick={handleAdminLogout}
              variant="outline"
              className="mt-6 rounded-2xl w-full border-red-500/20 hover:bg-red-500/10 hover:text-red-400 text-xs h-11"
            >
              <LogOut size={14} className="mr-2" /> Log Out / Switch Account
            </Button>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  // 4. Render Authorized Admin Dashboard (Inquiries & Chat Logs)
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20 container mx-auto px-4 relative">
        <GlowOrb className="w-[500px] h-[500px] top-0 -left-60" color="primary" />
        <GlowOrb className="w-[400px] h-[400px] bottom-0 -right-40" color="secondary" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 relative z-10 border-b border-border/40 pb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-widest font-mono mb-1 select-none">
              <Bot size={13} className="text-primary animate-pulse" />
              <span>SmartSys Console</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold">
              Admin Portal
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Logged in as authorized administrator: <span className="text-foreground font-semibold">{userEmail}</span>
            </p>
          </div>

          <Button 
            variant="outline" 
            onClick={handleAdminLogout} 
            className="glass border-border/40 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 rounded-2xl h-11 select-none"
          >
            <LogOut size={16} className="mr-2" /> Log Out Console
          </Button>
        </div>

        <div className="relative z-10 animate-fade-in-up">
          <AdminInquiries />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
