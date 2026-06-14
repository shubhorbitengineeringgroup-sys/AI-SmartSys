import { useState, useEffect } from "react";
import { 
  Database, FileText, MessageSquare, Calendar, User, Mail, Phone, 
  Trash2, CheckCircle2, RefreshCw, AlertCircle, Eye, Search, ChevronRight 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface Submission {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  source: string;
  status: string;
}

interface ChatMessage {
  id: string;
  session_id: string;
  created_at: string;
  sender: string;
  message: string;
  user_name: string | null;
  user_email: string | null;
}

interface ChatSession {
  session_id: string;
  user_name: string;
  user_email: string;
  message_count: number;
  last_interaction: string;
  messages: ChatMessage[];
}

// Mock Submissions for Demo mode
const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: "sub-1",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    name: "Rohan Sharma",
    email: "rohan@example.com",
    phone: "+91 98765 43210",
    message: "I need a custom AI agent built for automating our customer support queries.",
    source: "classic_form",
    status: "new"
  },
  {
    id: "sub-2",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    name: "Aanya Verma",
    email: "aanya.v@example.com",
    phone: "+91 91234 56789",
    message: "Looking for a smart robotic web app integrating Gemini API for our school.",
    source: "onboarding_bot",
    status: "reviewed"
  },
  {
    id: "sub-3",
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    name: "Vikram Malhotra",
    email: "vikram@example.com",
    phone: "Not provided",
    message: "[Submitted via Chatbot Form]\nProject Requirements: We want a dashboard where we can view analytics data and sync with Salesforce.",
    source: "ai_chatbot",
    status: "new"
  }
];

// Mock Chat Sessions for Demo mode
const MOCK_CHAT_SESSIONS: ChatSession[] = [
  {
    session_id: "sess-1",
    user_name: "Vikram Malhotra",
    user_email: "vikram@example.com",
    message_count: 5,
    last_interaction: new Date(Date.now() - 3600000 * 48).toISOString(),
    messages: [
      { id: "m1", session_id: "sess-1", created_at: new Date(Date.now() - 48.1 * 3600000).toISOString(), sender: "bot", message: "Beep boop! Welcome! I am Smarty, your AI technology buddy. How can I help you?", user_name: "Vikram Malhotra", user_email: "vikram@example.com" },
      { id: "m2", session_id: "sess-1", created_at: new Date(Date.now() - 48.08 * 3600000).toISOString(), sender: "user", message: "Hi, do you build custom dashboards?", user_name: "Vikram Malhotra", user_email: "vikram@example.com" },
      { id: "m3", session_id: "sess-1", created_at: new Date(Date.now() - 48.06 * 3600000).toISOString(), sender: "bot", message: "Beep boop! Yes, we do! AI-SmartSys builds premium custom dashboards and web systems with automated workflows. *spins head*", user_name: "Vikram Malhotra", user_email: "vikram@example.com" },
      { id: "m4", session_id: "sess-1", created_at: new Date(Date.now() - 48.04 * 3600000).toISOString(), sender: "user", message: "I want to submit my requirements", user_name: "Vikram Malhotra", user_email: "vikram@example.com" },
      { id: "m5", session_id: "sess-1", created_at: new Date(Date.now() - 48.02 * 3600000).toISOString(), sender: "bot", message: "Perfect! Let's get your details. *antenna blinks green* I will record your submission.", user_name: "Vikram Malhotra", user_email: "vikram@example.com" }
    ]
  },
  {
    session_id: "sess-2",
    user_name: "Anonymous User",
    user_email: "N/A",
    message_count: 3,
    last_interaction: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    messages: [
      { id: "m6", session_id: "sess-2", created_at: new Date(Date.now() - 1.55 * 3600000).toISOString(), sender: "bot", message: "Welcome! I am Smarty, your AI technology buddy. 🤖 Let me know if you have questions.", user_name: null, user_email: null },
      { id: "m7", session_id: "sess-2", created_at: new Date(Date.now() - 1.52 * 3600000).toISOString(), sender: "user", message: "What model do you use?", user_name: null, user_email: null },
      { id: "m8", session_id: "sess-2", created_at: new Date(Date.now() - 1.5 * 3600000).toISOString(), sender: "bot", message: "Beep boop! I run on Google's advanced Gemini model, optimized for speed and quality! *happy beep*", user_name: null, user_email: null }
    ]
  }
];

export const AdminInquiries = () => {
  const [activeTab, setActiveTab] = useState("submissions");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Contact Submissions
      const { data: subData, error: subError } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (subError) throw subError;

      // 2. Fetch Chat Messages
      const { data: chatData, error: chatError } = await supabase
        .from("chat_messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (chatError) throw chatError;

      // Map submissions
      setSubmissions(subData || []);

      // Group chat messages by session_id
      const sessionsMap: Record<string, ChatMessage[]> = {};
      chatData?.forEach((msg) => {
        if (!sessionsMap[msg.session_id]) {
          sessionsMap[msg.session_id] = [];
        }
        sessionsMap[msg.session_id].push(msg);
      });

      const processedSessions: ChatSession[] = Object.keys(sessionsMap).map((sid) => {
        const msgs = sessionsMap[sid];
        // Extract names/emails if user provided them
        const userMsgWithName = msgs.find(m => m.user_name);
        const userMsgWithEmail = msgs.find(m => m.user_email);

        return {
          session_id: sid,
          user_name: userMsgWithName?.user_name || "Anonymous User",
          user_email: userMsgWithEmail?.user_email || "N/A",
          message_count: msgs.length,
          last_interaction: msgs[msgs.length - 1]?.created_at || new Date().toISOString(),
          messages: msgs
        };
      }).sort((a, b) => new Date(b.last_interaction).getTime() - new Date(a.last_interaction).getTime());

      setChatSessions(processedSessions);
      setIsDemoMode(false);
    } catch (err: any) {
      console.warn("Could not load from Supabase database. Using local mock dataset.", err.message);
      // Fallback to Mock Data
      setSubmissions(MOCK_SUBMISSIONS);
      setChatSessions(MOCK_CHAT_SESSIONS);
      setIsDemoMode(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "new" ? "reviewed" : "new";
    if (isDemoMode) {
      setSubmissions(prev => 
        prev.map(s => s.id === id ? { ...s, status: nextStatus } : s)
      );
      toast.success("Status updated (Demo Mode)");
      return;
    }

    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ status: nextStatus })
        .eq("id", id);
      if (error) throw error;
      toast.success(`Inquiry status updated to ${nextStatus}!`);
      fetchData();
    } catch (err: any) {
      toast.error("Could not update status: " + err.message);
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    if (isDemoMode) {
      setSubmissions(prev => prev.filter(s => s.id !== id));
      toast.success("Submission deleted (Demo Mode)");
      return;
    }

    try {
      const { error } = await supabase
        .from("contact_submissions")
        .delete()
        .eq("id", id);
      if (error) throw error;
      toast.success("Submission deleted!");
      fetchData();
    } catch (err: any) {
      toast.error("Could not delete: " + err.message);
    }
  };

  const formatDate = (isoStr: string) => {
    const date = new Date(isoStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const filteredSubmissions = submissions.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Demo Warning / Guide Banner */}
      {isDemoMode && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm">
          <AlertCircle className="shrink-0" size={18} />
          <div className="leading-relaxed">
            <span className="font-bold">Offline / Demo Mode:</span> You are currently viewing mock inquiry database records. To connect your live Supabase database, run the SQL script in <code className="bg-amber-500/20 px-1.5 py-0.5 rounded text-white font-mono">supabase_schema.sql</code> and configure your environment variables in <code className="bg-amber-500/20 px-1.5 py-0.5 rounded text-white font-mono">.env</code>.
          </div>
        </div>
      )}

      {/* Main Admin Section */}
      <Card className="premium-card p-6 md:p-8 bg-card/65 backdrop-blur-xl border border-border/50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40 pb-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500 border border-pink-500/20 shadow-inner">
              <Database size={22} />
            </div>
            <div>
              <CardTitle className="text-xl md:text-2xl font-heading font-bold">Admin Inquiry Center</CardTitle>
              <CardDescription className="text-xs md:text-sm text-muted-foreground mt-0.5">
                Inspect customer form leads and review AI chatbot history logs.
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
              <Input
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-10 w-full sm:w-[220px] rounded-xl bg-muted/40 border-border/50 text-xs sm:text-sm focus:border-pink-500/50"
              />
            </div>
            <Button
              onClick={fetchData}
              variant="outline"
              size="icon"
              disabled={isLoading}
              className="h-10 w-10 rounded-xl border-border/50 bg-muted/30 text-muted-foreground hover:text-foreground shrink-0"
            >
              <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-[400px] mb-6 bg-muted/40 p-1 rounded-xl h-11 border border-border/30">
            <TabsTrigger value="submissions" className="rounded-lg data-[state=active]:bg-gradient-primary data-[state=active]:text-white transition-all text-xs font-semibold uppercase tracking-wider">
              <FileText size={13} className="mr-1.5" /> Customer Leads
            </TabsTrigger>
            <TabsTrigger value="chats" className="rounded-lg data-[state=active]:bg-gradient-primary data-[state=active]:text-white transition-all text-xs font-semibold uppercase tracking-wider">
              <MessageSquare size={13} className="mr-1.5" /> Chat Transcripts
            </TabsTrigger>
          </TabsList>

          {/* 1. Customer Submissions Tab */}
          <TabsContent value="submissions" className="space-y-4 outline-none">
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-muted-foreground gap-3">
                <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                <span className="text-xs font-mono">Loading data records...</span>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border/50 rounded-2xl text-muted-foreground text-sm">
                No customer requirements found matching your search.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-5 rounded-2xl glass border border-border/40 hover:border-pink-500/30 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
                  >
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-heading font-semibold text-foreground text-sm sm:text-base">{sub.name}</h4>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          sub.source === "classic_form" 
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                            : sub.source === "onboarding_bot" 
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        }`}>
                          {sub.source.replace("_", " ")}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          sub.status === "new"
                            ? "bg-pink-500/15 text-pink-400 border border-pink-500/20"
                            : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                        }`}>
                          {sub.status}
                        </span>
                      </div>
                      
                      <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed bg-muted/20 p-3.5 rounded-xl border border-border/30 font-mono break-words">
                        {sub.message}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5"><Mail size={13} /> {sub.email}</span>
                        {sub.phone && <span className="flex items-center gap-1.5"><Phone size={13} /> {sub.phone}</span>}
                        <span className="flex items-center gap-1.5"><Calendar size={13} /> {formatDate(sub.created_at)}</span>
                      </div>
                    </div>

                    <div className="flex md:flex-col items-center justify-end gap-2 md:self-stretch select-none">
                      <Button
                        onClick={() => handleUpdateStatus(sub.id, sub.status)}
                        variant="outline"
                        size="sm"
                        className="rounded-xl text-xs gap-1.5 h-9 bg-muted/20 border-border/50 hover:bg-muted"
                      >
                        <CheckCircle2 size={13} className={sub.status === "reviewed" ? "text-emerald-400" : "text-muted-foreground"} />
                        {sub.status === "new" ? "Mark Reviewed" : "Mark New"}
                      </Button>
                      <Button
                        onClick={() => handleDeleteSubmission(sub.id)}
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-xl"
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* 2. Chat Transcripts Tab */}
          <TabsContent value="chats" className="outline-none">
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-muted-foreground gap-3">
                <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                <span className="text-xs font-mono">Loading transcripts...</span>
              </div>
            ) : chatSessions.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border/50 rounded-2xl text-muted-foreground text-sm">
                No AI chatbot transcripts found in the database.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Chat list */}
                <div className="lg:col-span-1 space-y-3.5 border-r border-border/20 pr-0 lg:pr-4">
                  <h3 className="font-heading font-semibold text-sm text-muted-foreground mb-3">Recent Chats</h3>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                    {chatSessions.map((sess) => (
                      <div
                        key={sess.session_id}
                        onClick={() => setSelectedSession(sess)}
                        className={`p-3.5 rounded-xl border cursor-pointer text-left transition-all ${
                          selectedSession?.session_id === sess.session_id
                            ? "bg-pink-500/10 border-pink-500/50 shadow-sm"
                            : "glass border-border/40 hover:border-border"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-foreground truncate max-w-[150px]">{sess.user_name}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">{sess.message_count} msgs</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate mb-1">{sess.user_email}</div>
                        <div className="text-[9px] text-muted-foreground flex items-center gap-1 font-mono">
                          <Calendar size={9} /> {formatDate(sess.last_interaction)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Transcript view */}
                <div className="lg:col-span-2 min-h-[350px] flex flex-col bg-muted/10 border border-border/30 rounded-2xl overflow-hidden p-4 relative justify-between">
                  {selectedSession ? (
                    <div className="flex flex-col h-full justify-between gap-4">
                      {/* Transcript Header */}
                      <div className="flex justify-between items-center border-b border-border/30 pb-3 mb-2">
                        <div>
                          <h4 className="text-sm font-bold text-foreground">{selectedSession.user_name}</h4>
                          <p className="text-[10px] text-muted-foreground font-mono mt-0.5">Session: {selectedSession.session_id}</p>
                        </div>
                        <div className="text-[10px] text-muted-foreground text-right font-mono">
                          <div>Email: {selectedSession.user_email}</div>
                        </div>
                      </div>

                      {/* Transcripts dialogue stream */}
                      <div className="flex-1 overflow-y-auto pr-1 max-h-[300px] space-y-3 text-xs sm:text-sm">
                        {selectedSession.messages.map((m) => (
                          <div
                            key={m.id}
                            className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"} items-start gap-2`}
                          >
                            <div
                              className={`px-3 py-2.5 rounded-xl max-w-[85%] leading-relaxed ${
                                m.sender === "user"
                                  ? "bg-pink-500/20 text-foreground border border-pink-500/30 rounded-tr-none"
                                  : "bg-slate-900/60 border border-white/5 text-slate-200 rounded-tl-none"
                              }`}
                            >
                              <div className="text-[9px] text-muted-foreground font-mono mb-1 font-semibold uppercase">
                                {m.sender === "user" ? "User" : "AI Mascot"}
                              </div>
                              <p className="whitespace-pre-wrap">{m.message}</p>
                              <span className="text-[8px] text-muted-foreground/60 font-mono mt-1 block text-right">
                                {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center flex-grow text-muted-foreground p-6 text-center">
                      <MessageSquare size={36} className="text-muted-foreground/40 mb-3" />
                      <h4 className="text-sm font-semibold mb-1">Select a Conversation</h4>
                      <p className="text-xs text-muted-foreground max-w-[250px] mx-auto">
                        Click on any chat session from the list on the left to read its complete messaging history with Smarty.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
export default AdminInquiries;
