import { useAuth } from "@/_core/hooks/useAuth";
import MailCraftDashboardLayout from "@/components/MailCraftDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Plus, Copy, Trash2, Eye } from "lucide-react";
import { useState } from "react";

// Mock prebuilt templates
const prebuiltTemplates = [
  {
    id: 1,
    name: "Newsletter Semanal",
    description: "Template clássico para newsletters semanais",
    category: "Newsletter",
    isPrebuilt: true,
  },
  {
    id: 2,
    name: "Promoção Flash",
    description: "Template para campanhas de promoção rápida",
    category: "Promoção",
    isPrebuilt: true,
  },
  {
    id: 3,
    name: "Bem-vindo",
    description: "Template para email de boas-vindas",
    category: "Onboarding",
    isPrebuilt: true,
  },
  {
    id: 4,
    name: "Recuperação de Carrinho",
    description: "Template para recuperar vendas abandonadas",
    category: "E-commerce",
    isPrebuilt: true,
  },
  {
    id: 5,
    name: "Anúncio de Produto",
    description: "Template para lançamento de novos produtos",
    category: "Produto",
    isPrebuilt: true,
  },
  {
    id: 6,
    name: "Feedback",
    description: "Template para solicitar feedback de clientes",
    category: "Engajamento",
    isPrebuilt: true,
  },
];

export default function Templates() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"prebuilt" | "custom">("prebuilt");

  const { data: customTemplates = [], isLoading } = trpc.templates.listPrebuilt.useQuery();

  const filteredPrebuilt = prebuiltTemplates.filter((template) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCustom = customTemplates.filter((template) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
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
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Carregando templates...
              </div>
            ) : filteredPrebuilt.length === 0 ? (
              <Card className="border border-border bg-white">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Nenhum template encontrado</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPrebuilt.map((template) => (
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
                        {template.category}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2"
                        >
                          <Eye size={16} />
                          Visualizar
                        </Button>
                        <Button
                          className="flex-1 gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
                          size="sm"
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
            {filteredCustom.length === 0 ? (
              <Card className="border border-border bg-white">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">Nenhum template customizado criado</p>
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
                    <Plus size={18} />
                    Criar Novo Template
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCustom.map((template) => (
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
                        >
                          <Eye size={16} />
                          Visualizar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </MailCraftDashboardLayout>
  );
}
