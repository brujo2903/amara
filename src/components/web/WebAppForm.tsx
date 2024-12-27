import { type FC, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useWebApp } from '@/hooks/use-webapp';
import { useToast } from '@/hooks/use-toast';
import { getOrCreateSession } from '@/lib/auth/session';
import { slideUpAnimation } from '@/lib/animations';
import type { WebAppFormData } from '@/types/webapp';

const formSections = [
  {
    id: 'name',
    label: 'Name your creation',
    placeholder: 'Enter a name for your web app...',
    required: true
  },
  {
    id: 'description',
    label: 'Speak your vision',
    placeholder: 'Describe what you want to create in detail. Include features, layout, and functionality...',
    required: true
  }
];

export const WebAppForm: FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState<WebAppFormData>({
    name: '',
    description: '',
    code: { html: '', css: '', js: '' }
  });
  
  const { toast } = useToast();
  const { createWebApp, isLoading } = useWebApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const session = localStorage.getItem('session') ? JSON.parse(localStorage.getItem('session')!) : null;
      // Get or create session if needed
      if (!session) {
        const { session: newSession } = await getOrCreateSession();
        localStorage.setItem('session', JSON.stringify(newSession));
      }


      if (!formData.name?.trim()) {
        throw new Error('Name your creation first');
      }
      if (!formData.description?.trim()) {
        throw new Error('Speak your vision before proceeding');
      }


      await createWebApp(formData);
      
      toast({
        title: "Your creation is complete!",
        description: "Let's bring your vision to life with colors and imagination.",
        className: cn(
          "bg-black/95 border-violet-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(139,92,246,0.3)]",
          "font-['VT323'] text-violet-400",
          "animate-in slide-in-from-bottom-5 duration-300"
        )
      });
      
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Failed to create web app:', err);
      toast({
        title: "Creation failed...",
        description: err instanceof Error ? err.message : "Dark forces intervened. Try again.",
        className: cn(
          "bg-black/95 border-violet-500/30 backdrop-blur-md",
          "font-['VT323'] text-violet-400",
          "shadow-[0_0_20px_rgba(139,92,246,0.3)]"
        )
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col overflow-y-auto scrollbar-custom">
      <div className="flex-1 overflow-y-auto scrollbar-custom p-6 space-y-6">
        <motion.div {...slideUpAnimation} className="space-y-6">
          {formSections.map((section, index) => (
            <motion.div
              key={section.id}
              {...slideUpAnimation}
              transition={{ delay: index * 0.1 }}
              className="space-y-3"
            >
              <label 
                htmlFor={section.id}
                className={cn(
                  "block text-2xl font-['VT323']",
                  "bg-gradient-to-r from-pink-400 to-violet-400",
                  "bg-clip-text text-transparent",
                  "px-3 py-1 rounded"
                )}
              >
                {section.label}
                {section.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
              <textarea
                id={section.id}
                value={formData[section.id as keyof typeof formData]}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  [section.id]: e.target.value
                }))}
                rows={section.id === 'name' ? 1 : 6}
                placeholder={section.placeholder}
                required={section.required}
                className={cn(
                  "w-full bg-black/60 border-2 border-violet-500/30 rounded p-3",
                  "text-violet-200 font-['VT323'] text-lg placeholder:text-violet-400/50",
                  "focus:outline-none focus:border-violet-400/50",
                  "focus:shadow-[0_0_20px_rgba(139,92,246,0.3)]",
                  "focus:bg-violet-900/40 hover:bg-violet-900/20",
                  "transition-all duration-200",
                  "scrollbar-custom"
                )}
              />
              {section.id === 'description' && (
                <p className="text-red-400/70 font-['VT323'] text-sm">
                  Let your imagination flow freely. The more detailed your description, the more precise your creation will be.
                </p>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div className={cn(
        "p-6 border-t border-violet-500/30",
        "bg-gradient-to-t from-violet-900/80 to-transparent"
      )}>
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "w-full p-4 rounded-lg",
            "bg-gradient-to-r from-violet-900/60 via-fuchsia-900/40 to-purple-900/60",
            "border border-violet-500/40",
            "text-violet-100 font-['VT323'] text-2xl tracking-wider",
            "transition-all duration-200",
            "hover:bg-violet-800/50 hover:border-violet-400/60",
            "hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]",
            "active:scale-[0.98] active:shadow-[0_0_15px_rgba(139,92,246,0.3)]",
            "focus:outline-none focus:ring-2 focus:ring-violet-500/50",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "shadow-[0_0_25px_rgba(139,92,246,0.25)]"
          )}
        >
          {isLoading ? "Creating..." : "Create Web App"}
        </button>
      </div>
    </form>
  );
};