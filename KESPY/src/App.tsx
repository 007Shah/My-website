import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import BackHeader from "./components/BackHeader";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Galleries from "./pages/Galleries";
import Comments from "./pages/Comments";
import Pages from "./pages/Pages";
import SinglePage from "./pages/SinglePage";
import Network from "./pages/Network";
import Settings from "./pages/Settings";
import Saved from "./pages/Saved";
import MyPosts from "./pages/MyPosts";
import {
  Home as HomeIcon,
  MessageCircle,
  Image as ImageIcon,
  User,
  Layers3,
  Users,
  Settings as SettingsIcon,
  Bookmark
} from "lucide-react";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#111321] text-slate-400">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}

function MainLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const location = useLocation();

  const showMainSidebar = true;

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-800 overflow-x-hidden">
      <Navbar />
      <div className="flex-1 w-full max-w-6xl mx-auto flex gap-6 px-4 sm:px-6 lg:px-8">
        {/* The single left sidebar that holds all buttons and sections */}
        {showMainSidebar && (
          <div className={`hidden md:block shrink-0 py-4 sticky top-16 h-[calc(100vh-4rem)] transition-all duration-300 ${sidebarCollapsed ? "w-20" : "w-64"}`}>
            <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
          </div>
        )}
        
        {/* Core content expander */}
        <main className="flex-1 min-w-0 py-6">
          <BackHeader />
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#111321]/95 backdrop-blur-md border-t border-slate-850 flex justify-around items-center h-16 px-4 z-50">
        <Link to="/" className="p-2 text-slate-400 hover:text-indigo-400">
          <HomeIcon className="w-5 h-5" />
        </Link>
        <Link to="/posts" className="p-2 text-slate-400 hover:text-indigo-400">
          <User className="w-5 h-5" />
        </Link>
        <Link to="/pages" className="p-2 text-slate-400 hover:text-indigo-400">
          <Layers3 className="w-5 h-5" />
        </Link>
        <Link to="/saved" className="p-2 text-slate-400 hover:text-indigo-400">
          <Bookmark className="w-5 h-5" />
        </Link>
        <Link to="/settings" className="p-2 text-slate-400 hover:text-indigo-400">
          <SettingsIcon className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<Auth />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Home />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/posts"
        element={
          <ProtectedRoute>
            <MainLayout>
              <MyPosts />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/galleries"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Galleries />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/comments"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Comments />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dialogues"
        element={
          <ProtectedRoute>
            <Navigate to="/comments" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pages"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Pages />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/page/:handle"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SinglePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/network"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Network />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/u/:username"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Profile />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Settings />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/saved"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Saved />
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
