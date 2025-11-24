import React, { useState, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeedConfigurator from './components/FeedConfigurator';
import FeedPreview from './components/FeedPreview';
import CodeGenerator from './components/CodeGenerator';
import { Button } from "./components/ui/button";
import { Code2, CheckCircle2, Zap, Layout, RefreshCw } from 'lucide-react';
import { Toaster } from "./components/ui/sonner";

export default function App() {
  // Enhanced state to support two feed types
  const [config, setConfig] = useState({
    username: 'natgeo',
    hashtag: 'nature',
    feedType: 'fixed', // 'fixed' (5 posts) or 'custom' (NxM)
    columns: 5,        // Used for custom, locked to 5 for fixed (desktop)
    rows: 1,           // Used for custom
    gap: 12,
    showCaptions: true,
    refreshInterval: 300 // in seconds (5 minutes default)
  });
  
  const [isCodeOpen, setIsCodeOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const configSectionRef = useRef(null);

  const scrollToConfig = () => {
    configSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Simulate fetching new data when "Update" is clicked
  const handleUpdatePreview = () => {
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setRefreshTrigger(prev => prev + 1);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20">
      <Navbar />
      
      <main>
        <Hero scrollToConfig={scrollToConfig} />
        
        {/* Main App Section */}
        <section ref={configSectionRef} className="py-16 bg-muted/30 relative">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              
              {/* Left: Config */}
              <div className="w-full lg:w-1/3 lg:sticky lg:top-24 z-10">
                <FeedConfigurator 
                  config={config} 
                  setConfig={setConfig} 
                  onGenerate={handleUpdatePreview}
                  isLoading={isLoading}
                />
                
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-lg flex gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full h-fit">
                    <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100">Auto-Update Active</h4>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      Your feed is configured to check for new posts every {config.refreshInterval / 60} minutes automatically.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Preview */}
              <div className="w-full lg:w-2/3">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold tracking-tight">Live Preview</h2>
                  <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="hidden sm:flex"
                        onClick={handleUpdatePreview}
                        disabled={isLoading}
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh Preview
                    </Button>
                    <Button onClick={() => setIsCodeOpen(true)} className="bg-gradient-primary shadow-lg shadow-primary/20">
                        <Code2 className="w-4 h-4 mr-2" />
                        Get Embed Code
                    </Button>
                  </div>
                </div>
                
                <FeedPreview 
                    config={config} 
                    isLoading={isLoading} 
                    refreshTrigger={refreshTrigger}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white dark:bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">Why use InstaWix?</h2>
              <p className="text-muted-foreground">Everything you need to showcase your social proof effectively.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Layout className="w-6 h-6 text-primary" />,
                  title: "Smart Layouts",
                  desc: "Choose between a fixed 5-post strip or a fully custom grid up to 10x10."
                },
                {
                  icon: <RefreshCw className="w-6 h-6 text-primary" />,
                  title: "Auto-Updates",
                  desc: "Feeds automatically refresh in the background to show your latest content."
                },
                {
                  icon: <CheckCircle2 className="w-6 h-6 text-primary" />,
                  title: "GitHub Pages Ready",
                  desc: "This generator runs entirely in the browser. Host it anywhere, including GitHub Pages."
                }
              ].map((feature, i) => (
                <div key={i} className="p-6 rounded-2xl bg-muted/30 border hover:border-primary/50 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-background shadow-sm flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t bg-muted/20">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>&copy; 2024 InstaWix Feed Generator. Built for creators.</p>
        </div>
      </footer>

      <CodeGenerator 
        open={isCodeOpen} 
        onOpenChange={setIsCodeOpen} 
        config={config} 
      />
      <Toaster />
    </div>
  );
}
