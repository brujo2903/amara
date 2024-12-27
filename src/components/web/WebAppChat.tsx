import { type FC, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useWebApp } from '@/hooks/use-webapp';
import { supabase } from '@/lib/supabase';
import { slideUpAnimation } from '@/lib/animations';
import type { WebApp } from '@/types/webapp';
import { Save, X } from 'lucide-react';
import { WebAppSandbox } from './WebAppSandbox';
import { WebAppChatInterface } from './WebAppChatInterface';
import { useToast } from '@/hooks/use-toast';

interface WebAppChatProps {
  webApp: WebApp;
  onClose: () => void;
}

export const WebAppChat: FC<WebAppChatProps> = ({ webApp, onClose }) => {
  const { updateWebApp, isOwner } = useWebApp(webApp.id);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      await updateWebApp(webApp.code);
      toast({
        title: "Changes saved!",
        description: "Your creation sparkles with new possibilities.",
        className: cn(
          "z-[100]",
          "bg-black/95 border-violet-500/30 backdrop-blur-md",
          "font-['VT323'] text-violet-400",
          "shadow-[0_0_20px_rgba(139,92,246,0.3)]"
        )
      });
    } catch (err) {
      toast({
        title: "Failed to save...",
        description: err instanceof Error ? err.message : "Something went wrong. Let's try again with a sprinkle of magic!",
        className: cn(
          "z-[100]",
          "bg-black/95 border-violet-500/30 backdrop-blur-md",
          "font-['VT323'] text-violet-400",
          "shadow-[0_0_20px_rgba(139,92,246,0.3)]"
        )
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className={cn(
        "flex items-center justify-between px-4 py-3",
        "border-b border-red-600/30",
        "bg-gradient-to-r from-black/60 via-red-950/20 to-transparent"
      )}>
        <span className="text-2xl text-red-200 font-['VT323'] tracking-wider">
          {webApp.original_name}
        </span>
        {!isOwner && (
          <div className={cn(
            "px-3 py-1 rounded",
            "bg-black/40 border border-violet-500/30",
            "text-violet-300/70 font-['VT323'] text-sm"
          )}>
            Another creator's vision... Let's admire their imagination.
          </div>
        )}
        <div className="flex items-center gap-4">
          {isOwner && (
            <button
              onClick={handleSave}
              className={cn(
                "p-1 hover:bg-red-900/20 rounded transition-colors",
                "text-violet-400 hover:text-violet-300",
                "[image-rendering:pixelated]"
              )}
            >
              <Save className="w-6 h-6" />
            </button>
          )}
          <button
            onClick={onClose}
            className={cn(
              "p-1 hover:bg-red-900/20 rounded transition-colors",
              "text-violet-400 hover:text-violet-300",
              "[image-rendering:pixelated]"
            )}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
      {/* Chat Interface - Left Side */}
      <div className="w-[350px] border-r border-red-600/30 bg-gradient-to-r from-black/60 to-transparent">
        <WebAppChatInterface webApp={webApp} onClose={onClose} />
      </div>

      {/* Sandbox Preview - Right Side */}
      <div className="flex-1 overflow-hidden bg-black/40">
        <WebAppSandbox webApp={webApp} />
      </div>
      </div>
    </div>
  );
};