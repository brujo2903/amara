import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';

interface SliderProps {
  max?: number;
  step?: number;
  orientation?: "horizontal" | "vertical";
  classNameTrack?: string;
  classNameRange?: string;
  classNameThumb?: string;
  className?: string;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & SliderProps
>(({ 
  className,
  classNameTrack,
  classNameRange,
  classNameThumb,
  orientation = "horizontal",
  ...props
}, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    orientation={orientation}
    className={cn(
      "relative flex touch-none select-none",
      orientation === "horizontal" ? "h-2 w-full" : "flex-col h-full w-2",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track
      className={cn(
        "relative grow rounded-full",
        orientation === "horizontal" ? "h-2" : "w-2",
        classNameTrack || "bg-black/60 border border-white/10",
      )}
    >
      <SliderPrimitive.Range
        className={cn(
          "absolute rounded-full",
          orientation === "horizontal" ? "h-full" : "w-full",
          classNameRange || "bg-white/20"
        )}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        "block rounded-full border",
        orientation === "horizontal" ? "h-4 w-4" : "h-4 w-4",
        classNameThumb || [
          "border-white/10 bg-white/20",
          "hover:bg-white/30 focus-visible:outline-none",
          "disabled:pointer-events-none disabled:opacity-50"
        ]
      )}
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };