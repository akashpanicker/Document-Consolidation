"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "./utils";

const UnderlineTabs = TabsPrimitive.Root;

const UnderlineTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn("flex items-center", className)}
    {...props}
  />
));
UnderlineTabsList.displayName = TabsPrimitive.List.displayName;

const UnderlineTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & { hideSeparator?: boolean; fullWidth?: boolean }
>(({ className, hideSeparator, fullWidth, children, ...props }, ref) => (
  <div className={cn("flex items-center", fullWidth && "flex-1")}>
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "px-4 py-3 text-[12px] font-bold uppercase tracking-wider relative transition-colors duration-200 outline-none w-full",
        "text-[var(--text-muted)] data-[state=active]:text-[var(--color-brand)] disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      style={{
        fontFamily: "Inter, sans-serif",
        background: "none",
        border: "none",
        cursor: "pointer",
      }}
      {...props}
    >
      <div className="flex items-center justify-center gap-1.5 w-full">
        {children}
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] hidden data-[state=active]:block .group-data-[state=active]:block peer-data-[state=active]:block [data-state=active]>&:block"
        style={{ backgroundColor: "var(--color-brand)", display: props.value === undefined ? undefined : undefined }}
      />
      {/* We use inline styles conditionally above if tailwind group hack is problematic, but Radix adds data-state="active" to the Trigger */}
      <style>{`
        [data-state="active"] > .underline-indicator {
          display: block;
        }
      `}</style>
      <div 
        className="absolute bottom-0 left-0 right-0 h-[2px] hidden underline-indicator" 
        style={{ backgroundColor: "var(--color-brand)" }} 
      />
    </TabsPrimitive.Trigger>
    
    {!hideSeparator && (
      <div className="h-4 w-[1px] shrink-0" style={{ backgroundColor: "var(--border-default)" }} />
    )}
  </div>
));
UnderlineTabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const UnderlineTabsContent = TabsPrimitive.Content;

export { UnderlineTabs, UnderlineTabsList, UnderlineTabsTrigger, UnderlineTabsContent };
