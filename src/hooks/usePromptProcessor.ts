import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProcessResult {
  original: string;
  refined: string;
  corrections: string[];
}

export function usePromptProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);

  const processPrompt = useCallback(
    async (prompt: string, context: string): Promise<string> => {
      if (!prompt.trim()) return prompt;

      setIsProcessing(true);
      try {
        const { data, error } = await supabase.functions.invoke("process-prompt", {
          body: { prompt: prompt.trim(), context },
        });

        if (error) {
          console.error("Prompt processing error:", error);
          // Gracefully fallback to original prompt
          toast.info("Using original prompt");
          return prompt;
        }

        const result = data as ProcessResult;

        if (result.corrections && result.corrections.length > 0) {
          toast.success(`Smart prompt: ${result.corrections.length} improvement(s) applied`, {
            description: result.refined.slice(0, 80) + (result.refined.length > 80 ? "..." : ""),
          });
        }

        return result.refined || prompt;
      } catch (err) {
        console.error("Prompt processor failed:", err);
        return prompt; // fallback
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  return { processPrompt, isProcessing };
}
