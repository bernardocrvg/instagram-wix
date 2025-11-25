import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Settings2, LayoutGrid, StretchHorizontal, Search, BookOpen, AlignLeft, AlignCenter, AlignRight, Type } from 'lucide-react';

const GOOGLE_FONTS = [
  "Inter", "Montserrat", "Roboto", "Open Sans", "Lato", "Poppins", 
  "Playfair Display", "Merriweather", "Nunito", "Raleway", "Oswald"
];

export default function FeedConfigurator({ config, setConfig, onGenerate, isLoading }) {
  
  const handleTypeChange = (value) => {
    if (value === 'fixed') {
      setConfig({ ...config, feedType: 'fixed', columns: 5, rows: 1 });
    } else if (value === 'custom') {
      setConfig({ ...config, feedType: 'custom', columns: 3, rows: 2 });
    } else {
      setConfig({ ...config, feedType: 'paginated', columns: 3, rows: 3, itemsPerPage: 9 });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onGenerate();
    }
  };

  return (
    <Card className="h-full border-none shadow-xl bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-primary" />
          Configuração
        </CardTitle>
        <CardDescription>
          Personalize o layout e comportamento do feed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Fonte */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Fonte</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">@</span>
                <Input 
                    id="username" 
                    placeholder="usuario" 
                    className="pl-7 h-9"
                    value={config.username}
                    onChange={(e) => setConfig({...config, username: e.target.value})}
                    onKeyDown={handleKeyDown}
                />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="hashtag">Hashtag {config.feedType === 'paginated' && <span className="text-red-500">*</span>}</Label>
                <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">#</span>
                <Input 
                    id="hashtag" 
                    placeholder="viagem" 
                    className="pl-7 h-9"
                    value={config.hashtag}
                    onChange={(e) => setConfig({...config, hashtag: e.target.value})}
                    onKeyDown={handleKeyDown}
                />
                </div>
            </div>
          </div>
          
          <Button 
            className="w-full bg-secondary/10 text-secondary-foreground hover:bg-secondary/20 border-0" 
            variant="outline"
            onClick={onGenerate}
            disabled={isLoading}
          >
            {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
                <Search className="w-4 h-4 mr-2" />
            )}
            {isLoading ? 'Atualizando...' : 'Atualizar Preview'}
          </Button>
        </div>

        <div className="h-px bg-border" />

        {/* Tipo de Feed */}
        <div className="space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tipo de Feed</h3>
            <Tabs value={config.feedType} onValueChange={handleTypeChange} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="fixed" className="flex items-center gap-2 text-xs">
                        <StretchHorizontal className="w-3 h-3" />
                        Faixa
                    </TabsTrigger>
                    <TabsTrigger value="custom" className="flex items-center gap-2 text-xs">
                        <LayoutGrid className="w-3 h-3" />
                        Grade
                    </TabsTrigger>
                    <TabsTrigger value="paginated" className="flex items-center gap-2 text-xs">
                        <BookOpen className="w-3 h-3" />
                        Páginas
                    </TabsTrigger>
                </TabsList>
                
                <div className="mt-4 p-3 bg-muted/50 rounded-md text-xs text-muted-foreground border">
                    {config.feedType === 'fixed' && <p>Mostra exatamente <strong>5 posts</strong>. 1 linha no PC, 5 linhas no celular.</p>}
                    {config.feedType === 'custom' && <p>Grade fixa. Você define quantas linhas e colunas quer mostrar.</p>}
                    {config.feedType === 'paginated' && <p>Mostra todos os posts com a hashtag escolhida, divididos em várias páginas.</p>}
                </div>
            </Tabs>
        </div>

        {/* Estilo e Layout */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Estilo</h3>

          {/* Alinhamento */}
          <div className="space-y-2">
            <Label>Alinhamento do Feed</Label>
            <Tabs value={config.alignment} onValueChange={(val) => setConfig({...config, alignment: val})} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="start"><AlignLeft className="w-4 h-4" /></TabsTrigger>
                    <TabsTrigger value="center"><AlignCenter className="w-4 h-4" /></TabsTrigger>
                    <TabsTrigger value="end"><AlignRight className="w-4 h-4" /></TabsTrigger>
                </TabsList>
            </Tabs>
          </div>

          {/* Proporção */}
          <div className="space-y-2">
            <Label>Proporção da Imagem</Label>
            <Select 
                value={config.aspectRatio} 
                onValueChange={(val) => setConfig({...config, aspectRatio: val})}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="1/1">1:1 (Quadrado)</SelectItem>
                    <SelectItem value="3/4">3:4 (Retrato)</SelectItem>
                    <SelectItem value="4/5">4:5 (Instagram)</SelectItem>
                    <SelectItem value="9/16">9:16 (Stories)</SelectItem>
                </SelectContent>
            </Select>
          </div>

          {/* Tipografia */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-muted-foreground" />
                <Label>Tipografia da Legenda</Label>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Select 
                    value={config.fontFamily} 
                    onValueChange={(val) => setConfig({...config, fontFamily: val})}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Fonte" />
                    </SelectTrigger>
                    <SelectContent>
                        {GOOGLE_FONTS.map(font => (
                            <SelectItem key={font} value={font}>{font}</SelectItem>
                        ))}
                        <SelectItem value="custom">Outra (Link)</SelectItem>
                    </SelectContent>
                </Select>

                <Select 
                    value={config.fontWeight} 
                    onValueChange={(val) => setConfig({...config, fontWeight: val})}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Peso" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="300">Leve (300)</SelectItem>
                        <SelectItem value="400">Normal (400)</SelectItem>
                        <SelectItem value="500">Médio (500)</SelectItem>
                        <SelectItem value="700">Negrito (700)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            {config.fontFamily === 'custom' && (
                <Input 
                    placeholder="URL da fonte (ex: .woff2) ou Nome" 
                    value={config.customFontUrl}
                    onChange={(e) => setConfig({...config, customFontUrl: e.target.value})}
                    className="text-xs"
                />
            )}
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label>Arredondamento (Radius)</Label>
              <span className="text-sm text-muted-foreground">{config.borderRadius}px</span>
            </div>
            <Slider 
              value={[config.borderRadius]} 
              min={0} 
              max={50} 
              step={1} 
              onValueChange={(val) => setConfig({...config, borderRadius: val[0]})}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <Label>Espaçamento (Gap)</Label>
              <span className="text-sm text-muted-foreground">{config.gap}px</span>
            </div>
            <Slider 
              value={[config.gap]} 
              min={0} 
              max={50} 
              step={1} 
              onValueChange={(val) => setConfig({...config, gap: val[0]})}
            />
          </div>

          {(config.feedType === 'custom' || config.feedType === 'paginated') && (
            <>
                <div className="space-y-4">
                    <div className="flex justify-between">
                    <Label>Colunas (PC)</Label>
                    <span className="text-sm text-muted-foreground">{config.columns}</span>
                    </div>
                    <Slider 
                    value={[config.columns]} 
                    min={1} 
                    max={6} 
                    step={1} 
                    onValueChange={(val) => setConfig({...config, columns: val[0]})}
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between">
                    <Label>{config.feedType === 'paginated' ? 'Posts por Página' : 'Linhas'}</Label>
                    <span className="text-sm text-muted-foreground">
                        {config.feedType === 'paginated' ? config.itemsPerPage : config.rows}
                    </span>
                    </div>
                    <Slider 
                    value={[config.feedType === 'paginated' ? config.itemsPerPage : config.rows]} 
                    min={1} 
                    max={20} 
                    step={1} 
                    onValueChange={(val) => {
                        if (config.feedType === 'paginated') {
                            setConfig({...config, itemsPerPage: val[0]});
                        } else {
                            setConfig({...config, rows: val[0]});
                        }
                    }}
                    />
                </div>
            </>
          )}

          <div className="flex items-center justify-between pt-2">
            <Label htmlFor="show-captions" className="cursor-pointer">Mostrar Legendas</Label>
            <Switch 
              id="show-captions" 
              checked={config.showCaptions}
              onCheckedChange={(val) => setConfig({...config, showCaptions: val})}
            />
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
