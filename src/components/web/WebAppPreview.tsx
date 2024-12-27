import { type FC, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import type { WebAppFormData } from '@/types/webapp';

interface WebAppPreviewProps {
  code: WebAppFormData['code'];
}

export const WebAppPreview: FC<WebAppPreviewProps> = ({ code }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${code.css}</style>
        </head>
        <body>
          ${code.html}
          <script>${code.js}</script>
        </body>
      </html>
    `;

    iframeRef.current.srcdoc = html;
  }, [code]);

  return (
    <div className="space-y-2">
      <h3 className="text-xl text-red-400 font-['VT323']">Preview</h3>
      <div className={cn(
        "w-full h-64 bg-white rounded overflow-hidden",
        "border-2 border-red-600/30",
        "shadow-[0_0_15px_rgba(220,38,38,0.15)]"
      )}>
        <iframe
          ref={iframeRef}
          title="Web App Preview"
          className="w-full h-full"
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
};