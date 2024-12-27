import { useState, useEffect, useRef } from 'react';
import { PixelPlay, PixelPause, PixelVolume, PixelMute, PixelHome } from './PixelIcons';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface MusicPlayerProps {
  onHomeClick: () => void;
}

export const MusicPlayer = ({ onHomeClick }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoId = '4Tr0otuiQuU';
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<any>(null);
  const progressInterval = useRef<number>();
  const initialVolume = 20; // Even lower initial volume for better UX
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(initialVolume);

  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          mute: 0,
          disablekb: 1,
          playsinline: 1,
          origin: window.location.origin
        },
        events: {
          onReady: () => {
            setIsReady(true);
            playerRef.current?.setVolume(initialVolume);
            playerRef.current?.unMute(); // Ensure not muted
            playerRef.current?.playVideo();
            setIsPlaying(true);
          },
          onStateChange: (event: any) => {
            setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
            if (event.data === window.YT.PlayerState.ENDED) {
              playerRef.current?.seekTo(0);
              playerRef.current?.playVideo();
            }
          },
        },
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = window.setInterval(() => {
        if (playerRef.current?.getCurrentTime && playerRef.current?.getDuration) {
          const currentTime = playerRef.current.getCurrentTime();
          const duration = playerRef.current.getDuration();
          setProgress((currentTime / duration) * 100);
        }
      }, 1000);
    } else {
      clearInterval(progressInterval.current);
    }

    return () => clearInterval(progressInterval.current);
  }, [isPlaying]);

  const togglePlay = () => {
    if (playerRef.current && isReady) {
      if (isPlaying) {
        playerRef.current?.pauseVideo();
      } else {
        playerRef.current?.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (playerRef.current && isReady) {
      if (isMuted) {
        playerRef.current.unMute();
        playerRef.current.setVolume(volume);
      } else {
        playerRef.current.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (value: number[]) => {
    if (playerRef.current && isReady) {
      const duration = playerRef.current.getDuration();
      const seekTime = (duration * value[0]) / 100;
      playerRef.current.seekTo(seekTime);
      setProgress(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (playerRef.current && isReady) {
      const newVolume = value[0];
      setVolume(newVolume);
      playerRef.current.setVolume(newVolume);
      
      if (newVolume === 0) {
        if (!isMuted) {
          playerRef.current.mute();
          setIsMuted(true);
        }
      } else if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      }
    }
  };

  const handleHomeClick = () => {
    const fadeOut = document.createElement('div');
    fadeOut.className = cn(
      "fixed inset-0 bg-black z-[60]",
      "transition-opacity duration-500 ease-in-out opacity-0"
    );
    fadeOut.style.pointerEvents = 'none';
    document.body.appendChild(fadeOut);

    requestAnimationFrame(() => {
      fadeOut.style.opacity = '1';
      setTimeout(() => {
        onHomeClick();
        setTimeout(() => {
          fadeOut.style.opacity = '0';
          setTimeout(() => fadeOut.remove(), 500);
        }, 100);
      }, 500);
    });
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div id="youtube-player" className="hidden" />
      <div className="relative">
        <div className="flex items-center justify-center gap-2 bg-black/90 backdrop-blur-sm p-2 rounded-full border border-white/10 font-['VT323']">
          <button
            onClick={togglePlay}
            className="p-1 hover:bg-white/10 rounded-full transition-colors focus:outline-none text-white"
            style={{ imageRendering: 'pixelated' }}
          >
            {isPlaying ? <PixelPause /> : <PixelPlay />}
          </button>
          <button
            className="p-1 hover:bg-white/10 rounded-full transition-colors focus:outline-none text-white"
            style={{ imageRendering: 'pixelated' }}
            onClick={handleHomeClick}
          >
            <PixelHome />
          </button>
          {isReady && (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  onClick={toggleMute}
                  disabled={!isReady}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors focus:outline-none text-white"
                  style={{ imageRendering: 'pixelated' }}
                >
                  {isMuted ? <PixelMute /> : <PixelVolume />}
                </button>
              </PopoverTrigger>
              <PopoverContent 
                side="top"
                className={cn(
                  "w-8 h-32 p-1 bg-black/90 backdrop-blur-sm border-red-600/30",
                  "rounded-lg shadow-[0_0_20px_rgba(220,38,38,0.2)]",
                  "overflow-visible z-[100]"
                )}
              >
                <Slider
                  value={[isMuted ? 0 : volume]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  orientation="vertical"
                  className={cn(
                    "cursor-pointer relative w-1",
                    "data-[orientation=vertical]:h-full",
                    "[&_[role=slider]]:h-2 [&_[role=slider]]:w-4",
                    "[&_[role=slider]]:border [&_[role=slider]]:border-red-600/50",
                    "[&_[role=slider]]:bg-black/80 [&_[role=slider]]:rounded",
                    "[&_[role=slider]]:shadow-[0_0_10px_rgba(220,38,38,0.2)]",
                    "[&_[role=slider]]:transition-all [&_[role=slider]]:duration-200",
                    "[&_[role=slider]]:backdrop-blur-sm",
                    "[&_[role=slider]:hover]:border-red-500/70",
                    "[&_[role=slider]:hover]:shadow-[0_0_15px_rgba(220,38,38,0.3)]",
                    "[&_[role=slider]:hover]:bg-red-950/40"
                  )}
                  classNameTrack={cn(
                    "bg-gradient-to-b from-red-950/20 to-red-600/30",
                    "border border-red-600/30 rounded-full",
                    "shadow-[0_0_10px_rgba(220,38,38,0.2)]"
                  )}
                  classNameRange={cn(
                    "bg-gradient-to-b from-red-600/40 to-red-500/60",
                    "rounded-full"
                  )}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};