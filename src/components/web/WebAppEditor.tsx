import { type FC } from 'react';
import { cn } from '@/lib/utils';
import type { WebAppFormData } from '@/types/webapp';

interface WebAppEditorProps {
  value: WebAppFormData['code'];
  onChange: (code: WebAppFormData['code']) => void;
}

export const WebAppEditor: FC<WebAppEditorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-xl text-red-400 font-['VT323']">
            HTML
          </label>
          <textarea
            value={value.html}
            onChange={(e) => onChange({ ...value, html: e.target.value })}
            className={cn(
              "w-full h-64 bg-black/60 border-2 border-red-600/30 rounded p-3",
              "text-red-200 font-['VT323'] text-lg placeholder:text-red-400/50",
              "focus:outline-none focus:border-red-500/50 focus:bg-red-950/40",
              "transition-all duration-200",
              "scrollbar-custom"
            )}
            placeholder="<div>Your HTML here...</div>"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-xl text-red-400 font-['VT323']">
            CSS
          </label>
          <textarea
            value={value.css}
            onChange={(e) => onChange({ ...value, css: e.target.value })}
            className={cn(
              "w-full h-64 bg-black/60 border-2 border-red-600/30 rounded p-3",
              "text-red-200 font-['VT323'] text-lg placeholder:text-red-400/50",
              "focus:outline-none focus:border-red-500/50 focus:bg-red-950/40",
              "transition-all duration-200",
              "scrollbar-custom"
            )}
            placeholder=".your-css { color: red; }"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-xl text-red-400 font-['VT323']">
          JavaScript
        </label>
        <textarea
          value={value.js}
          onChange={(e) => onChange({ ...value, js: e.target.value })}
          className={cn(
            "w-full h-48 bg-black/60 border-2 border-red-600/30 rounded p-3",
            "text-red-200 font-['VT323'] text-lg placeholder:text-red-400/50",
            "focus:outline-none focus:border-red-500/50 focus:bg-red-950/40",
            "transition-all duration-200",
            "scrollbar-custom"
          )}
          placeholder="// Your JavaScript code here..."
        />
      </div>
    </div>
  );
};