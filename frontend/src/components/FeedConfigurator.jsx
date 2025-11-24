import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { RefreshCw, Settings2 } from 'lucide-react';

export default function FeedConfigurator({ config, setConfig, onGenerate }) {
  return (
    <Card className="h-full border-none shadow-xl bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-primary" />
          Configuration
        </CardTitle>
        <CardDescription>
          Connect your account and customize the layout.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Source Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Source</h3>
          
          <div className="space-y-2">
            <Label htmlFor="username">Instagram Username</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
              <Input 
                id="username" 
                placeholder="username" 
                className="pl-8"
                value={config.username}
                onChange={(e) => setConfig({...config, username: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hashtag">Filter by Hashtag (Optional)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">#</span>
              <Input 
                id="hashtag" 
                placeholder="travel" 
                className="pl-8"
                value={config.hashtag}
                onChange={(e) => setConfig({...config, hashtag: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Layout Settings */}
        <div className="space-y-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Layout</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label>Columns</Label>
              <span className="text-sm text-muted-foreground">{config.columns}</span>
            </div>
            <Slider 
              value={[config.columns]} 
              min={2} 
              max={5} 
              step={1} 
              onValueChange={(val) => setConfig({...config, columns: val[0]})}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <Label>Gap (px)</Label>
              <span className="text-sm text-muted-foreground">{config.gap}px</span>
            </div>
            <Slider 
              value={[config.gap]} 
              min={0} 
              max={40} 
              step={4} 
              onValueChange={(val) => setConfig({...config, gap: val[0]})}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-captions" className="cursor-pointer">Show Captions</Label>
            <Switch 
              id="show-captions" 
              checked={config.showCaptions}
              onCheckedChange={(val) => setConfig({...config, showCaptions: val})}
            />
          </div>
        </div>

        <Button className="w-full bg-gradient-primary text-white shadow-lg shadow-primary/20 mt-4" onClick={onGenerate}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Update Preview
        </Button>

      </CardContent>
    </Card>
  );
}
