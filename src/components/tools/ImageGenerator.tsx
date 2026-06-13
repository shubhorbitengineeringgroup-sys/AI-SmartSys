import React from "react";
import { Image as ImageIcon, Sparkles, Layers, Wand2 } from "lucide-react";

const ImageGenerator = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="premium-card p-8 mb-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                        <ImageIcon size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-heading font-bold">AI Image Generator</h2>
                        <p className="text-muted-foreground text-sm">Turn your imagination into high-quality visuals.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <p className="text-foreground leading-relaxed">
                        Transform text prompts into stunning, high-resolution visuals with our advanced image generation capabilities. This powerful engine interprets complex descriptions and renders them with incredible accuracy and artistic style.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                        <div className="glass border-border/40 p-4 rounded-2xl flex flex-col gap-2">
                            <Layers size={20} className="text-cyan-400" />
                            <h3 className="font-heading font-semibold text-sm">High Resolution</h3>
                            <p className="text-xs text-muted-foreground">Generates pristine, detailed 4K images perfect for professional use.</p>
                        </div>
                        <div className="glass border-border/40 p-4 rounded-2xl flex flex-col gap-2">
                            <Wand2 size={20} className="text-cyan-400" />
                            <h3 className="font-heading font-semibold text-sm">Smart Refinement</h3>
                            <p className="text-xs text-muted-foreground">Automatically enhances simple prompts for better results.</p>
                        </div>
                        <div className="glass border-border/40 p-4 rounded-2xl flex flex-col gap-2">
                            <Sparkles size={20} className="text-cyan-400" />
                            <h3 className="font-heading font-semibold text-sm">Multiple Styles</h3>
                            <p className="text-xs text-muted-foreground">Supports photorealistic, artistic, and abstract generation styles.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass border-border/40 rounded-3xl overflow-hidden p-6 bg-muted/10 text-center flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4">
                    <ImageIcon size={32} className="text-cyan-400" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-2">Showcase Mode</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                    This interface serves as a feature preview. The full working image generation suite is available in our deployed production environments.
                </p>
            </div>
        </div>
    );
};

export default ImageGenerator;
