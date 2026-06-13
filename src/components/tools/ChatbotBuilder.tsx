import React from "react";
import { Bot, MessageSquare, Wand2, Zap } from "lucide-react";

const ChatbotBuilder = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="premium-card p-8 mb-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Bot size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-heading font-bold">AI Chatbot Builder</h2>
                        <p className="text-muted-foreground text-sm">Build and deploy intelligent chatbots without code.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <p className="text-foreground leading-relaxed">
                        Design conversational AI agents tailored to your business needs. Our Chatbot Builder utilizes advanced NLP engines to understand user intent, context, and sentiment, providing accurate and human-like interactions without requiring any programming knowledge.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                        <div className="glass border-border/40 p-4 rounded-2xl flex flex-col gap-2">
                            <MessageSquare size={20} className="text-blue-500" />
                            <h3 className="font-heading font-semibold text-sm">Natural Language</h3>
                            <p className="text-xs text-muted-foreground">Advanced NLP understanding for highly natural conversation flows.</p>
                        </div>
                        <div className="glass border-border/40 p-4 rounded-2xl flex flex-col gap-2">
                            <Wand2 size={20} className="text-blue-500" />
                            <h3 className="font-heading font-semibold text-sm">No-Code Setup</h3>
                            <p className="text-xs text-muted-foreground">Easily train and deploy bots completely code-free.</p>
                        </div>
                        <div className="glass border-border/40 p-4 rounded-2xl flex flex-col gap-2">
                            <Zap size={20} className="text-blue-500" />
                            <h3 className="font-heading font-semibold text-sm">Instant Integration</h3>
                            <p className="text-xs text-muted-foreground">Seamlessly connect with your existing platforms and workflows.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass border-border/40 rounded-3xl overflow-hidden p-6 bg-muted/10 text-center flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                    <Bot size={32} className="text-blue-400" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-2">Showcase Mode</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                    This interface serves as a feature preview. The complete interactive chatbot building platform is available in our premium enterprise packages.
                </p>
            </div>
        </div>
    );
};

export default ChatbotBuilder;
