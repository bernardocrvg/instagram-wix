import React from 'react';
import { Github, Instagram } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white">
            <Instagram size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight">InstaWix Feed</span>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => window.open('https://github.com/bernardocrvg/instagram-wix', '_blank')}
          >
            <Github size={16} />
            <span>Ver no GitHub</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
