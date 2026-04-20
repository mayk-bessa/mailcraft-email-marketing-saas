import { useAuth } from "@/_core/hooks/useAuth";
import MailCraftDashboardLayout from "@/components/MailCraftDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, Mail, Users, Activity } from "lucide-react";

// Mock data for charts
const openRateData = [
  { date: "Jan", rate: 22 },
  { date: "Feb", rate: 28 },
  { date: "Mar", rate: 35 },
  { date: "Apr", rate: 32 },
  { date: "May", rate: 41 },
  { date: "Jun", rate: 45 },
];

const clickRateData = [
  { date: "Jan", clicks: 12 },
  { date: "Feb", clicks: 18 },
  { date: "Mar", clicks: 24 },
  { date: "Apr", clicks: 20 },
  { date: "May", clicks: 28 },
  { date: "Jun", clicks: 35 },
];

const subscriberGrowthData = [
  { date: "Jan", subscribers: 1200 },
  { date: "Feb", subscribers: 1800 },
  { date: "Mar", subscribers: 2400 },
  { date: "Apr", subscribers: 2800 },
  { date: "May", subscribers: 3500 },
  { date: "Jun", subscribers: 4200 },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <MailCraftDashboardLayout currentPage="dashboard">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Bem-vindo, {user?.name}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Aqui está um resumo do desempenho de suas campanhas de email.
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-border bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                Taxa de Abertura Média
              </CardTitle>
              <Mail className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">45%</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-accent font-semibold">+8%</span> em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                Taxa de Clique Média
              </CardTitle>
              <Activity className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">8.5%</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-accent font-semibold">+2.1%</span> em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                Crescimento de Assinantes
              </CardTitle>
              <Users className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">4,200</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-accent font-semibold">+600</span> novos assinantes este mês
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Open Rate Chart */}
          <Card className="border border-border bg-white">
            <CardHeader>
              <CardTitle className="text-foreground">Taxa de Abertura</CardTitle>
              <CardDescription>Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={openRateData}>
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.65 0.22 25)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="oklch(0.65 0.22 25)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 65)" />
                  <XAxis dataKey="date" stroke="oklch(0.5 0.01 65)" />
                  <YAxis stroke="oklch(0.5 0.01 65)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid oklch(0.9 0.01 65)",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="rate"
                    stroke="oklch(0.65 0.22 25)"
                    fillOpacity={1}
                    fill="url(#colorRate)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Click Rate Chart */}
          <Card className="border border-border bg-white">
            <CardHeader>
              <CardTitle className="text-foreground">Taxa de Clique</CardTitle>
              <CardDescription>Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={clickRateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 65)" />
                  <XAxis dataKey="date" stroke="oklch(0.5 0.01 65)" />
                  <YAxis stroke="oklch(0.5 0.01 65)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid oklch(0.9 0.01 65)",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Bar dataKey="clicks" fill="oklch(0.65 0.22 25)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Subscriber Growth Chart */}
        <Card className="border border-border bg-white">
          <CardHeader>
            <CardTitle className="text-foreground">Crescimento de Assinantes</CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={subscriberGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 65)" />
                <XAxis dataKey="date" stroke="oklch(0.5 0.01 65)" />
                <YAxis stroke="oklch(0.5 0.01 65)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid oklch(0.9 0.01 65)",
                    borderRadius: "0.5rem",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="subscribers"
                  stroke="oklch(0.65 0.22 25)"
                  strokeWidth={2}
                  dot={{ fill: "oklch(0.65 0.22 25)", r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </MailCraftDashboardLayout>
  );
}
