import { type FC, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
}

export const ImageUpload: FC<ImageUploadProps> = ({ value, onChange }) => {
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [onChange]);

  return (
    <div className="space-y-4">
      <div className={cn(
        "relative w-32 h-32 mx-auto",
        "border-2 border-dashed rounded-lg",
        "border-red-600/30 group",
        "transition-all duration-200",
        "hover:border-red-500/50",
        "hover:shadow-[0_0_15px_rgba(220,38,38,0.15)]"
      )}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        {value ? (
          <img
            src={value}
            alt="Entity Avatar"
            className={cn(
              "w-full h-full object-cover rounded-lg",
              "[image-rendering:pixelated]"
            )}
          />
        ) : (
          <div className={cn(
            "absolute inset-0 flex flex-col items-center justify-center",
            "text-red-400/70 group-hover:text-red-300/70",
            "transition-colors duration-200"
          )}>
            <Upload className="w-8 h-8 mb-2" />
            <span className="text-sm font-['VT323']">Upload Avatar</span>
          </div>
        )}
      </div>
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className={cn(
            "w-full px-3 py-1 text-sm",
            "bg-red-950/30 border border-red-600/30 rounded",
            "text-red-400 font-['VT323']",
            "hover:bg-red-900/40 hover:text-red-300",
            "transition-all duration-200"
          )}
        >
          Remove Image
        </button>
      )}
    </div>
  );
};