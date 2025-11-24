import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero({ scrollToConfig }) {
  return (
    <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          <Sparkles size={14} />
          <span>New: Filter by Hashtags</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
          Embed Instagram Feeds on <span className="text-gradient-primary">Wix</span> in Seconds
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Create beautiful, responsive Instagram feeds for your Wix website without coding. 
          Filter by user and hashtag, customize the look, and copy the code.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="h-12 px-8 text-base bg-gradient-primary hover:opacity-90 transition-opacity shadow-lg shadow-primary/25" onClick={scrollToConfig}>
            Create My Feed
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-8 text-base">
            View Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
