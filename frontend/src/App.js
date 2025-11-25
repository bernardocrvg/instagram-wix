import React, { useState, useEffect, useRef, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeedConfigurator from './components/FeedConfigurator';
import FeedPreview from './components/FeedPreview';
import CodeGenerator from './components/CodeGenerator';
import { Button } from "./components/ui/button";
import { Code2, Zap, Layout, RefreshCw, AlertCircle } from 'lucide-react';
import { Toaster } from "./components/ui/sonner";
import { mockPosts } from './lib/mockData';

export default function App() {
  const [config, setConfig] = useState({
    username: '', 
    hashtag: '',
    feedType: 'fixed',
    columns: 5,
    rows: 1,
    gap: 12,
    showCaptions: true,
    refreshInterval: 300,
    aspectRatio: '1/1',
    itemsPerPage: 12,
    borderRadius: 0,
    alignment: 'center',
    fontFamily: 'Inter',
    fontWeight: '400',
    customFontUrl: '',
    captionColor: '#ffffff',
    overlayColor: '#000000',
    overlayOpacity: 50,
    // Novas configurações de Paginação
    btnTextColor: '#333333',
    btnBgColor: '#ffffff',
    btnFontFamily: 'Inter',
    btnRadius: 4,
    infoTextColor: '#666666',
    infoFontFamily: 'Inter'
  });
  
  const [isCodeOpen, setIsCodeOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [realPosts, setRealPosts] = useState([]);
  const [useRealData, setUseRealData] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  const configSectionRef = useRef(null);

  const scrollToConfig = () => {
    configSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchRealData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('./posts.json?t=' + new Date().getTime()); 
      
      if (!response.ok) throw new Error("Arquivo de posts não encontrado");
      
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        const formattedPosts = data.map(post => ({
          id: post.id,
          imageUrl: post.media_url,
          likes: 0,
          comments: 0,
          caption: post.caption || "",
          date: post.timestamp,
          permalink: post.permalink
        }));
        
        setRealPosts(formattedPosts);
        setUseRealData(true);
        
        if (data[0].username && !config.username) {
            setConfig(prev => ({...prev, username: data[0].username}));
        }
        
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Could not load real data, using mocks:", error);
      setUseRealData(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRealData();
  }, []);

  const handleUpdatePreview = () => {
    fetchRealData();
  };

  const filteredPosts = useMemo(() => {
    const source = useRealData ? realPosts : mockPosts;
    
    if (!config.hashtag) return source;
    
    const tag = config.hashtag.replace('#', '').toLowerCase();
    return source.filter(post => 
      post.caption && post.caption.toLowerCase().includes(tag)
    );
  }, [realPosts, useRealData, config.hashtag]);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20">
      <Navbar />
      
      <main>
        <Hero scrollToConfig={scrollToConfig} />
        
        <section ref={configSectionRef} className="py-16 bg-muted/30 relative">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              
              {/* Configuração */}
              <div className="w-full lg:w-1/3 lg:sticky lg:top-24 z-10">
                <FeedConfigurator 
                  config={config} 
                  setConfig={setConfig} 
                  onGenerate={handleUpdatePreview}
                  isLoading={isLoading}
                />
                
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-lg flex flex-col gap-3">
                  <div className="flex gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full h-fit">
                        <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100">
                            {useRealData ? "Conectado ao Instagram" : "Modo Demonstração"}
                        </h4>
                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                            {useRealData 
                                ? `Mostrando posts reais. Última checagem: ${lastUpdated?.toLocaleTimeString()}` 
                                : "Mostrando dados de exemplo. Configure o GitHub Secret para ver posts reais."}
                        </p>
                    </div>
                  </div>
                  {!useRealData && (
                      <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200 flex gap-2 items-center">
                          <AlertCircle className="w-3 h-3" />
                          <span>Aguardando IG_TOKEN nos Secrets do GitHub</span>
                      </div>
                  )}
                </div>
              </div>

              {/* Preview */}
              <div className="w-full lg:w-2/3">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold tracking-tight">Pré-visualização</h2>
                  <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="hidden sm:flex"
                        onClick={handleUpdatePreview}
                        disabled={isLoading}
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Atualizar
                    </Button>
                    <Button onClick={() => setIsCodeOpen(true)} className="bg-gradient-primary shadow-lg shadow-primary/20">
                        <Code2 className="w-4 h-4 mr-2" />
                        Gerar Código
                    </Button>
                  </div>
                </div>
                
                <FeedPreview 
                    config={config} 
                    isLoading={isLoading} 
                    posts={filteredPosts} 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 bg-white dark:bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">Por que usar o InstaWix?</h2>
              <p className="text-muted-foreground">Tudo o que você precisa para mostrar sua prova social.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Layout className="w-6 h-6 text-primary" />,
                  title: "Layouts Inteligentes",
                  desc: "Escolha entre faixa fixa, grade personalizada ou feed paginado."
                },
                {
                  icon: <RefreshCw className="w-6 h-6 text-primary" />,
                  title: "Atualização Automática",
                  desc: "Seu feed se atualiza sozinho em segundo plano."
                },
                {
                  icon: <Zap className="w-6 h-6 text-primary" />,
                  title: "Hospedagem Grátis",
                  desc: "Roda direto no GitHub Pages sem custo de servidor."
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

      <footer className="py-12 border-t bg-muted/20">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>
            &copy; {new Date().getFullYear()} InstaWix Feed Generator. 
            Idealizado por <a href="https://github.com/bernardocrvg" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">bernardocrvg</a> e 
            feito por <a href="https://emergent.sh" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Emergent AI</a>.
          </p>
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
