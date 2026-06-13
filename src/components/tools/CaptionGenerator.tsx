import React from "react";
import { Brain, Sparkles, Hash, TrendingUp } from "lucide-react";

const CaptionGenerator = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="premium-card p-8 mb-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Brain size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-heading font-bold">AI Caption Generator</h2>
                        <p className="text-muted-foreground text-sm">Create engaging social media content in seconds.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <p className="text-foreground leading-relaxed">
                        Our AI Caption Generator is a powerful engine designed to help you create engaging, platform-specific social media captions instantly. This capability demonstrates our advanced language models' ability to understand context, tone, and audience to deliver the perfect message.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                        <div className="glass border-border/40 p-4 rounded-2xl flex flex-col gap-2">
                            <Sparkles size={20} className="text-primary" />
                            <h3 className="font-heading font-semibold text-sm">Context Aware</h3>
                            <p className="text-xs text-muted-foreground">Understands your topic and generates relevant, creative content.</p>
                        </div>
                        <div className="glass border-border/40 p-4 rounded-2xl flex flex-col gap-2">
                            <Hash size={20} className="text-primary" />
                            <h3 className="font-heading font-semibold text-sm">Smart Formatting</h3>
                            <p className="text-xs text-muted-foreground">Automatically includes appropriate hashtags, emojis, and styling.</p>
                        </div>
                        <div className="glass border-border/40 p-4 rounded-2xl flex flex-col gap-2">
                            <TrendingUp size={20} className="text-primary" />
                            <h3 className="font-heading font-semibold text-sm">Engagement Focused</h3>
                            <p className="text-xs text-muted-foreground">Crafted to maximize interactions and reach across platforms.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass border-border/40 rounded-3xl overflow-hidden p-6 bg-muted/10 text-center flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <Brain size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-2">Showcase Mode</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                    This interface is a feature showcase. The fully functional caption generator is available in our live deployment environments.
                </p>
            </div>
        </div>
    );
};

export default CaptionGenerator;
