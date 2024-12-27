import { type FC, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEntity } from '@/hooks/use-entity';
import { useToast } from '@/hooks/use-toast';
import { slideUpAnimation } from '@/lib/animations';
import { ImageUpload } from './ImageUpload';

const presets = [
  {
    name: "Rainbow Dreamer",
    description: "A creative spirit with vibrant rainbow hair and expressive eyes",
    personality: "Creative, empathetic, introspective yet optimistic",
    instruction: "Guides through artistic expression and emotional understanding",
    knowledge: "Art, emotions, dreams, self-expression"
  },
  {
    name: "Pixel Mystic",
    description: "A gentle soul with a deep connection to digital realms",
    personality: "Curious, sensitive, balancing logic and emotion",
    instruction: "Bridges the gap between technology and human experience",
    knowledge: "Digital art, pixel aesthetics, emotional resonance"
  },
  {
    name: "Chromatic Guardian",
    description: "A protector of creativity with kaleidoscopic energy",
    personality: "Free-spirited, adventurous, deeply caring",
    instruction: "Nurtures imagination while maintaining emotional balance",
    knowledge: "Color theory, creative expression, emotional healing"
  }
];
const formSections = [
  {
    id: 'name',
    label: 'Name',
    placeholder: 'Enter entity name...',
    required: true
  },
  {
    id: 'description',
    label: 'Description',
    placeholder: 'Describe your entity...',
    required: true
  },
  {
    id: 'personality',
    label: 'Personality',
    placeholder: 'Define entity personality traits...',
    required: false
  },
  {
    id: 'instruction',
    label: 'Instructions',
    placeholder: 'Specific instructions for behavior...',
    required: false
  },
  {
    id: 'knowledge',
    label: 'Knowledge',
    placeholder: 'Specialized knowledge domains...',
    required: false
  }
];

export const EntityForm: FC = () => {
  const [formData, setFormData] = useState({
    mode: 'neutral' as const,
    name: '',
    description: '',
    avatar: '',
    personality: '',
    instruction: '',
    knowledge: ''
  });
  const { createEntity, isLoading, error } = useEntity();
  const { toast } = useToast();

  const applyPreset = useCallback((preset: typeof presets[0]) => {
    setFormData(prev => ({
      ...prev,
      ...preset
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEntity(formData);
      toast({
        title: "Your creation lives...", 
        description: "Your creation is complete.",
        className: cn(
          "bg-black/95 border-violet-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(139,92,246,0.15)]",
          "font-['VT323'] text-violet-400",
          "font-['VT323'] text-violet-300",
          "animate-in slide-in-from-bottom-5 duration-300"
        )
      });
    } catch (err) {
      console.error('Failed to create entity:', err);
      toast({
        title: "Creation failed...",
        description: err instanceof Error ? err.message : "Dark forces intervened. Try again.",
        className: cn(
          "bg-black/95 border-red-600/30 backdrop-blur-md",
          "font-['VT323'] text-red-500",
          "animate-in slide-in-from-bottom-5 duration-300"
        )
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 h-[calc(85vh-8rem)] overflow-y-auto scrollbar-custom">
      <div className="space-y-4 mb-8">
        <h3 className="text-2xl text-red-400 font-['VT323'] mb-4">Choose a Preset</h3>
        <div className="grid grid-cols-3 gap-4">
          {presets.map((preset, index) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => applyPreset(preset)}
              className={cn(
                "p-5 rounded-lg text-left group",
                "border border-violet-500/30 bg-black/60",
                "hover:bg-violet-900/40 hover:border-violet-400/50",
                "hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]",
                "focus:outline-none focus:ring-2 focus:ring-violet-500/50",
                "transition-all duration-300"
              )}
            >
              <h4 className={cn(
                "text-xl font-['VT323'] mb-2",
                "bg-gradient-to-r from-pink-400 to-violet-400",
                "bg-clip-text text-transparent",
                "group-hover:from-pink-300 group-hover:to-violet-300"
              )}>
                {preset.name}
              </h4>
              <p className={cn(
                "text-base text-violet-300/80 line-clamp-2",
                "group-hover:text-violet-200/90 transition-colors"
              )}>
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      <motion.div {...slideUpAnimation} className="mb-8">
        <label className="block text-xl text-red-400 font-['VT323'] mb-4">
          Avatar
        </label>
        <ImageUpload
          value={formData.avatar}
          onChange={(avatar) => setFormData(prev => ({ ...prev, avatar }))}
        />
      </motion.div>

      <motion.div {...slideUpAnimation} className="space-y-6">
        <div className="space-y-4">
          <label className="block text-xl text-red-400 font-['VT323']">
            Mode
          </label>
          <div className="grid grid-cols-3 gap-6">
            {(['safe', 'neutral', 'wild'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, mode }))}
                className={cn(
                  "p-4 rounded-lg text-xl font-['VT323'] capitalize",
                  "border transition-all duration-300",
                  "transition-all duration-200",
                  formData.mode === mode ? [
                    "bg-violet-900/40 border-violet-400/50",
                    "text-violet-200 shadow-[0_0_20px_rgba(139,92,246,0.3)]",
                    "bg-gradient-to-r from-violet-900/40 to-fuchsia-900/40"
                  ] : [
                    "bg-black/60 border-violet-500/30",
                    "text-violet-300 hover:bg-violet-900/30",
                    "hover:border-violet-400/50"
                  ]
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {formSections.map((section, index) => (
          <motion.div
            key={section.id}
            {...slideUpAnimation}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            <label 
              htmlFor={section.id}
              className={cn(
                "block text-xl font-['VT323']",
                "bg-gradient-to-r from-pink-400 to-violet-400",
                "bg-clip-text text-transparent"
              )}
            >
              {section.label}
              {section.required && (
                <span className="text-pink-500 ml-1">*</span>
              )}
            </label>
            <textarea
              id={section.id}
              value={formData[section.id as keyof typeof formData]}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                [section.id]: e.target.value
              }))}
              rows={section.id === 'name' ? 1 : 4}
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
          </motion.div>
        ))}

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 font-['VT323'] text-lg"
          >
            {error}
          </motion.p>
        )}

        <motion.button
          type="submit"
          disabled={isLoading}
          {...slideUpAnimation}
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
          {isLoading ? "Forging..." : "Unleash Creation"}
        </motion.button>
      </motion.div>
    </form>
  );
};