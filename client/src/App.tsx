import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import Campaigns from "./pages/Campaigns";
import Subscribers from "./pages/Subscribers";
import Segments from "./pages/Segments";
import Templates from "./pages/Templates";
import EmailBuilder from "./pages/EmailBuilder";

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      )} />
      <Route path="/dashboard" component={() => (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      )} />
      <Route path="/campaigns" component={() => (
        <ProtectedRoute>
          <Campaigns />
        </ProtectedRoute>
      )} />
      <Route path="/subscribers" component={() => (
        <ProtectedRoute>
          <Subscribers />
        </ProtectedRoute>
      )} />
      <Route path="/segments" component={() => (
        <ProtectedRoute>
          <Segments />
        </ProtectedRoute>
      )} />
      <Route path="/templates" component={() => (
        <ProtectedRoute>
          <Templates />
        </ProtectedRoute>
      )} />
      <Route path="/builder" component={() => (
        <ProtectedRoute>
          <EmailBuilder />
        </ProtectedRoute>
      )} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
