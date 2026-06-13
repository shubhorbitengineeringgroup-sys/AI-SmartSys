import React from "react";
import { FileText, Sparkles, Briefcase, Code } from "lucide-react";

const ResumeBuilder = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="premium-card p-8 mb-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-heading font-bold">AI Resume Builder</h2>
                        <p className="text-muted-foreground text-sm">Professional resumes crafted by AI.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <p className="text-foreground leading-relaxed">
                        Create ATS-optimized, professional resumes in minutes. Our AI understands industry requirements and helps articulate your experience, skills, and achievements in the most impactful way possible, significantly increasing your chances of landing interviews.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                        <div className="glass border-border/40 p-4 rounded-2xl flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                                <Briefcase size={18} />
                            </div>
                            <div>
                                <h3 className="font-heading font-semibold text-sm">Experience Refinement</h3>
                                <p className="text-xs text-muted-foreground">AI automatically rewrites job duties into compelling bullet points.</p>
                            </div>
                        </div>
                        <div className="glass border-border/40 p-4 rounded-2xl flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                                <Code size={18} />
                            </div>
                            <div>
                                <h3 className="font-heading font-semibold text-sm">ATS Optimization</h3>
                                <p className="text-xs text-muted-foreground">Ensures formatting and keywords pass applicant tracking systems.</p>
                            </div>
                        </div>
                        <div className="glass border-border/40 p-4 rounded-2xl flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                                <Sparkles size={18} />
                            </div>
                            <div>
                                <h3 className="font-heading font-semibold text-sm">Smart Summaries</h3>
                                <p className="text-xs text-muted-foreground">Generates powerful professional summaries tailored to your profile.</p>
                            </div>
                        </div>
                        <div className="glass border-border/40 p-4 rounded-2xl flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                                <FileText size={18} />
                            </div>
                            <div>
                                <h3 className="font-heading font-semibold text-sm">PDF Export</h3>
                                <p className="text-xs text-muted-foreground">Renders pixel-perfect, beautifully formatted PDF resumes seamlessly.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass border-border/40 rounded-3xl overflow-hidden p-6 bg-muted/10 text-center flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                    <FileText size={32} className="text-purple-400" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-2">Showcase Mode</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                    This interface is an informational showcase. The full interactive resume building capability is available in our deployed production environments.
                </p>
            </div>
        </div>
    );
};

export default ResumeBuilder;
