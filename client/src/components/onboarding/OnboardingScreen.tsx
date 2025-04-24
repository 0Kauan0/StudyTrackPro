import React, { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/use-profile";
import { useToast } from "@/hooks/use-toast";

interface OnboardingScreenProps {
  onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [name, setName] = useState("");
  const { updateProfile, isUpdating } = useProfile();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Nome é obrigatório",
        description: "Por favor, digite seu nome para continuar",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Atualiza o perfil com o nome e reinicia o nível para 0
      await updateProfile({ 
        name: name.trim(),
        level: 1,
        xp: 0
      });
      
      toast({
        title: "Bem-vindo!",
        description: `Olá, ${name}! Seu perfil está pronto para acompanhar seu progresso nos estudos.`,
      });
      
      // Chama a função de conclusão do onboarding
      onComplete();
      
      // Redireciona para a página do cronômetro
      setLocation("/");
      
    } catch (error) {
      console.error("Erro ao configurar perfil:", error);
      toast({
        title: "Erro ao configurar perfil",
        description: "Não foi possível salvar suas informações. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full bg-slate-800 border-slate-700">
        <CardHeader className="pb-2 text-center">
          <CardTitle className="text-2xl text-white">Bem-vindo ao YPT Estudos</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-4">
          <div className="text-center mb-8 text-slate-300">
            <p>Vamos começar configurando seu perfil para acompanhar seu progresso.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                Como podemos te chamar?
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite seu nome"
                className="bg-slate-700 border-slate-600 text-white"
                autoFocus
              />
            </div>
            
            <div className="text-center">
              <Button 
                type="submit" 
                className="w-full"
                disabled={isUpdating}
              >
                {isUpdating ? "Salvando..." : "Começar a Estudar"}
              </Button>
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-center text-xs text-slate-500">
          <p>YPT Estudos - Acompanhe seu progresso e melhore seus resultados</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingScreen;