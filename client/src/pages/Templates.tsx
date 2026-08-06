import { useAuth } from "@/_core/hooks/useAuth";
import MailCraftDashboardLayout from "@/components/MailCraftDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Plus, Copy, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Prebuilt templates with real content
const prebuiltTemplates = [
  {
    id: 1,
    name: "Newsletter Semanal",
    description: "Template clássico para newsletters semanais",
    category: "Newsletter",
    isPrebuilt: true,
    content: [
      { type: "text", content: "Olá, [Nome]!" },
      { type: "text", content: "Confira as principais notícias desta semana:" },
      { type: "text", content: "📰 Notícia 1: Descrição breve da notícia importante" },
      { type: "text", content: "📰 Notícia 2: Descrição breve de outro assunto relevante" },
      { type: "text", content: "📰 Notícia 3: Mais uma atualização importante" },
      { type: "button", content: "Leia mais" },
      { type: "text", content: "Até a próxima semana!" },
    ],
  },
  {
    id: 2,
    name: "Promoção Flash",
    description: "Template para campanhas de promoção rápida",
    category: "Promoção",
    isPrebuilt: true,
    content: [
      { type: "text", content: "⚡ PROMOÇÃO RELÂMPAGO! ⚡" },
      { type: "text", content: "Aproveite 50% de desconto por tempo limitado!" },
      { type: "text", content: "Válido apenas hoje até as 23:59" },
      { type: "button", content: "Comprar Agora" },
      { type: "text", content: "Não perca esta oportunidade!" },
    ],
  },
  {
    id: 3,
    name: "Bem-vindo",
    description: "Template para email de boas-vindas",
    category: "Onboarding",
    isPrebuilt: true,
    content: [
      { type: "text", content: "Bem-vindo à nossa comunidade, [Nome]! 🎉" },
      { type: "text", content: "Estamos felizes em tê-lo conosco." },
      { type: "text", content: "Aqui você encontrará:" },
      { type: "text", content: "✓ Conteúdo exclusivo\n✓ Ofertas especiais\n✓ Dicas e insights" },
      { type: "button", content: "Explorar Agora" },
      { type: "text", content: "Se tiver dúvidas, entre em contato conosco!" },
    ],
  },
  {
    id: 4,
    name: "Recuperação de Carrinho",
    description: "Template para recuperar vendas abandonadas",
    category: "E-commerce",
    isPrebuilt: true,
    content: [
      { type: "text", content: "Você deixou algo no carrinho! 🛒" },
      { type: "text", content: "Não perca seus itens selecionados." },
      { type: "text", content: "Produtos no seu carrinho:\n- Produto 1: R$ 99,90\n- Produto 2: R$ 149,90\nTotal: R$ 249,80" },
      { type: "button", content: "Completar Compra" },
      { type: "text", content: "Cupom VOLTA10 para 10% de desconto!" },
    ],
  },
  {
    id: 5,
    name: "Anúncio de Produto",
    description: "Template para lançamento de novos produtos",
    category: "Produto",
    isPrebuilt: true,
    content: [
      { type: "text", content: "🚀 Novo Produto Lançado!" },
      { type: "text", content: "Apresentamos [Nome do Produto] - A solução que você esperava." },
      { type: "text", content: "Características principais:\n• Recurso 1\n• Recurso 2\n• Recurso 3" },
      { type: "button", content: "Conhecer Produto" },
      { type: "text", content: "Primeiros 100 clientes ganham 20% de desconto!" },
    ],
  },
  {
    id: 6,
    name: "Feedback",
    description: "Template para solicitar feedback de clientes",
    category: "Engajamento",
    isPrebuilt: true,
    content: [
      { type: "text", content: "Sua opinião é importante para nós! 💬" },
      { type: "text", content: "Como foi sua experiência conosco?" },
      { type: "text", content: "Clique abaixo para responder uma rápida pesquisa:" },
      { type: "button", content: "Responder Pesquisa" },
      { type: "text", content: "Obrigado por nos ajudar a melhorar!" },
    ],
  },
];

export default function Templates() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"prebuilt" | "custom">("prebuilt");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  // Only query custom templates if user is authenticated
  const { user } = useAuth();
  const { data: customTemplates = [], isLoading: customLoading } = user ? trpc.templates.listCustom.useQuery() : { data: [], isLoading: false } as any;

  const filteredPrebuilt = prebuiltTemplates.filter((template: any) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCustom = customTemplates.filter((template: any) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUseTemplate = (template: any) => {
    // Store template in sessionStorage for the builder to pick up
    sessionStorage.setItem("selectedTemplate", JSON.stringify({
      name: template.name,
      content: template.content || [],
    }));
    
    toast.success("Template carregado! Redirecionando para o construtor...");
    
    // Redirect to builder
    setTimeout(() => {
      window.location.href = "/builder";
    }, 500);
  };

  const handleViewTemplate = (template: any) => {
    setSelectedTemplate(template);
  };

  const renderBlockPreview = (block: any) => {
    switch (block.type) {
      case "text":
        return <p className="text-foreground whitespace-pre-wrap text-sm">{block.content}</p>;
      case "image":
        return <img src={block.content} alt="Template content" className="w-full rounded" />;
      case "button":
        return (
          <button className="px-4 py-2 bg-accent text-accent-foreground rounded font-semibold hover:bg-accent/90 transition text-sm">
            {block.content}
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <MailCraftDashboardLayout currentPage="templates">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Templates de Email</h1>
            <p className="text-muted-foreground mt-1">
              Biblioteca de templates pré-prontos e customizados
            </p>
          </div>
          <Button 
            onClick={() => window.location.href = "/builder"}
            className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
          >
            <Plus size={18} />
            Novo Template
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-border">
          <button
            onClick={() => setActiveTab("prebuilt")}
            className={`pb-3 px-4 font-medium transition ${
              activeTab === "prebuilt"
                ? "border-b-2 border-accent text-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Templates Pré-prontos
          </button>
          <button
            onClick={() => setActiveTab("custom")}
            className={`pb-3 px-4 font-medium transition ${
              activeTab === "custom"
                ? "border-b-2 border-accent text-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Meus Templates
          </button>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <Input
            placeholder="Buscar templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Templates Grid */}
        {activeTab === "prebuilt" ? (
          <div>
            {filteredPrebuilt.length === 0 ? (
              <Card className="border border-border bg-white">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Nenhum template encontrado</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPrebuilt.map((template: any) => (
                  <Card
                    key={template.id}
                    className="border border-border bg-white hover:shadow-md transition"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-foreground">
                            {template.name}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {template.description}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className="w-fit bg-accent text-accent-foreground">
                        {template.category || "Template"}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2"
                          onClick={() => handleViewTemplate(template)}
                        >
                          <Eye size={16} />
                          Visualizar
                        </Button>
                        <Button
                          className="flex-1 gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
                          size="sm"
                          onClick={() => handleUseTemplate(template)}
                        >
                          <Copy size={16} />
                          Usar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {customLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Carregando templates customizados...
              </div>
            ) : filteredCustom.length === 0 ? (
              <Card className="border border-border bg-white">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">Nenhum template customizado criado</p>
                  <Button 
                    onClick={() => window.location.href = "/builder"}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
                  >
                    <Plus size={18} />
                    Criar Novo Template
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCustom.map((template: any) => (
                  <Card
                    key={template.id}
                    className="border border-border bg-white hover:shadow-md transition"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-foreground">
                            {template.name}
                          </CardTitle>
                          {template.description && (
                            <CardDescription className="mt-1">
                              {template.description}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                      {template.category && (
                        <Badge className="w-fit bg-muted text-foreground">
                          {template.category}
                        </Badge>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2"
                          onClick={() => handleViewTemplate(template)}
                        >
                          <Eye size={16} />
                          Visualizar
                        </Button>
                        <Button
                          className="flex-1 gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
                          size="sm"
                          onClick={() => handleUseTemplate(template)}
                        >
                          <Copy size={16} />
                          Usar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Template Preview Modal */}
        {selectedTemplate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <CardHeader className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <CardTitle className="text-foreground">{selectedTemplate.name}</CardTitle>
                  {selectedTemplate.description && (
                    <CardDescription className="mt-2">{selectedTemplate.description}</CardDescription>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTemplate(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-4 font-semibold">Pré-visualização:</p>
                  <div className="bg-white p-6 rounded border border-border space-y-4">
                    {selectedTemplate.content && selectedTemplate.content.length > 0 ? (
                      selectedTemplate.content.map((block: any, idx: number) => (
                        <div key={idx}>
                          {renderBlockPreview(block)}
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-8">Template vazio</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedTemplate(null)}
                  >
                    Fechar
                  </Button>
                  <Button
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                    onClick={() => {
                      handleUseTemplate(selectedTemplate);
                      setSelectedTemplate(null);
                    }}
                  >
                    <Copy size={16} className="mr-2" />
                    Usar Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MailCraftDashboardLayout>
  );
}
