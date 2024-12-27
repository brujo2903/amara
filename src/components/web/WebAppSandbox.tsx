import { type FC, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import type { WebApp } from '@/types/webapp';

interface WebAppSandboxProps {
  webApp: WebApp;
}

export const WebAppSandbox: FC<WebAppSandboxProps> = ({ webApp }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const session = localStorage.getItem('session') ? JSON.parse(localStorage.getItem('session')!) : null;
  const isOwner = session?.id === webApp.session_id;

  useEffect(() => {
    if (!iframeRef.current) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${webApp.code.css}</style>
        </head>
        <body>
          ${webApp.code.html}
          <script>${webApp.code.js}</script>
        </body>
      </html>
    `;

    iframeRef.current.srcdoc = html;
  }, [webApp.code]);

  return (
    <div className={cn(
      "w-full h-full bg-black/40",
      "border-l border-red-600/30",
      "relative",
      "shadow-[inset_0_0_30px_rgba(220,38,38,0.1)]",
      !isOwner && "pointer-events-none"
    )}>
      {!isOwner && (
        <div className={cn(
          "absolute top-0 left-0 right-0 z-10",
          "bg-gradient-to-b from-black/40 to-transparent h-16",
          "pointer-events-none"
        )} />
      )}
      <iframe
        ref={iframeRef}
        title="Web App Preview"
        className={cn(
          "w-full h-full",
          "bg-transparent",
          !isOwner && "opacity-90"
        )}
        sandbox="allow-scripts"
      />
    </div>
  );
};