import { Link } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import {
  Home,
  Settings,
  Building2,
  Users,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
} from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";

export default function PlatformSidebar() {
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showIcon, setShowIcon] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsAnimating(true);
    setShowIcon(false);

    setTimeout(() => {
      setIsCollapsed((previous) => !previous);
    }, 100);

    setTimeout(() => {
      setShowIcon(true);
      setIsAnimating(false);
    }, 550);
  };

  // Mock user data - replace with actual user data from your auth system
  const user = {
    name: "Platform Admin",
    role: "Administrador da Plataforma",
    email: "admin@tetraeducacao.com",
  };

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <>
      {/* User Profile Avatar - Right Side */}
      <div className="fixed top-4 right-4 z-50">
        <div className="relative" ref={userMenuRef}>
          {/* Avatar Button */}
          <button
            onClick={toggleUserMenu}
            className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors shadow-lg border-2 border-emerald-500"
          >
            <User size={18} className="text-white" />
          </button>

          {/* User Menu Dropdown - Click */}
          {showUserMenu && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-neutral-950 border border-emerald-800 rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 border-b border-emerald-800">
                <p className="text-white font-medium">{user.name}</p>
                <p className="text-emerald-300 text-sm">{user.email}</p>
                <p className="text-emerald-400 text-xs mt-1">{user.role}</p>
              </div>
              <div className="p-2">
                <button className="w-full flex items-center gap-3 p-2 text-white hover:bg-emerald-800 rounded transition-colors">
                  <User size={16} />
                  <span className="text-sm">Meu Perfil</span>
                </button>
                <button className="w-full flex items-center gap-3 p-2 text-white hover:bg-emerald-800 rounded transition-colors">
                  <Settings size={16} />
                  <span className="text-sm">Configurações</span>
                </button>
                <hr className="border-emerald-800 my-2" />
                <button className="w-full flex items-center gap-3 p-2 text-red-400 hover:bg-red-900/20 rounded transition-colors">
                  <LogOut size={16} />
                  <span className="text-sm">Sair</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <aside
        className={`fixed top-0 left-0 h-full bg-neutral-950 text-white shadow-2xl z-40 transition-all duration-500 ease-in-out flex flex-col ${
          isCollapsed ? "w-16" : "w-72"
        } rounded-r-xl`}
      >
        <div
          className={`flex items-center border-b border-emerald-800 ${
            isCollapsed ? "justify-center p-2" : "justify-between p-4"
          }`}
        >
          {!isCollapsed && (
            <h2 className="text-xl font-bold transition-opacity duration-300">
              Plataforma
            </h2>
          )}
          <button
            onClick={handleToggle}
            disabled={isAnimating}
            className="p-2 rounded-lg flex items-center justify-center disabled:opacity-50"
            aria-label={isCollapsed ? "Expand menu" : "Collapse menu"}
          >
            <div
              className={`relative w-[18px] h-[18px] transition-opacity duration-150 ${
                showIcon ? "opacity-100" : "opacity-0"
              }`}
            >
              {isCollapsed ? (
                <ChevronRight size={18} className="absolute inset-0" />
              ) : (
                <ChevronLeft size={18} className="absolute inset-0" />
              )}
            </div>
          </button>
        </div>

        <nav
          className={`flex-1 overflow-y-auto ${isCollapsed ? "p-2" : "p-4"}`}
        >
          <Link
            to="/administrative/home"
            className={`flex items-center rounded-lg transition-colors mb-2 ${
              isCollapsed ? "justify-center p-3" : "gap-3 p-3"
            } hover:bg-emerald-800/50`}
            activeProps={{
              className: `flex items-center rounded-lg transition-colors mb-2 ${
                isCollapsed ? "justify-center p-3" : "gap-3 p-3"
              } bg-emerald-600 hover:bg-emerald-700`,
            }}
          >
            <Home size={20} className="flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Dashboard</span>}
          </Link>

          {/* Platform Management Links */}
          <div className="mt-6">
            {!isCollapsed && (
              <h3 className="text-sm font-semibold text-emerald-300 uppercase tracking-wider mb-3">
                Gestão da Plataforma
              </h3>
            )}

            <Link
              to="/administrative/tenants"
              className={`flex items-center rounded-lg hover:bg-emerald-800/50 transition-colors mb-2 ${
                isCollapsed ? "justify-center p-3" : "gap-3 p-3"
              }`}
              activeProps={{
                className: `flex items-center rounded-lg bg-emerald-600 hover:bg-emerald-700 transition-colors mb-2 ${
                  isCollapsed ? "justify-center p-3" : "gap-3 p-3"
                }`,
              }}
            >
              <Building2 size={20} className="flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">Plataformas</span>}
            </Link>

            <Link
              to="/administrative/users"
              className={`flex items-center rounded-lg hover:bg-emerald-800/50 transition-colors mb-2 ${
                isCollapsed ? "justify-center p-3" : "gap-3 p-3"
              }`}
              activeProps={{
                className: `flex items-center rounded-lg bg-emerald-600 hover:bg-emerald-700 transition-colors mb-2 ${
                  isCollapsed ? "justify-center p-3" : "gap-3 p-3"
                }`,
              }}
            >
              <Users size={20} className="flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">Usuários</span>}
            </Link>

            <Link
              to="/administrative/analytics"
              className={`flex items-center rounded-lg hover:bg-emerald-800/50 transition-colors mb-2 ${
                isCollapsed ? "justify-center p-3" : "gap-3 p-3"
              }`}
              activeProps={{
                className: `flex items-center rounded-lg bg-emerald-600 hover:bg-emerald-700 transition-colors mb-2 ${
                  isCollapsed ? "justify-center p-3" : "gap-3 p-3"
                }`,
              }}
            >
              <BarChart3 size={20} className="flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">Analytics</span>}
            </Link>
          </div>

          {/* Platform Settings */}
          <div className="mt-6">
            {!isCollapsed && (
              <h3 className="text-sm font-semibold text-emerald-300 uppercase tracking-wider mb-3">
                Configurações
              </h3>
            )}
            <Link
              to="/administrative/settings"
              className={`flex items-center rounded-lg hover:bg-emerald-800/50 transition-colors mb-2 ${
                isCollapsed ? "justify-center p-3" : "gap-3 p-3"
              }`}
              activeProps={{
                className: `flex items-center rounded-lg bg-emerald-600 hover:bg-emerald-700 transition-colors mb-2 ${
                  isCollapsed ? "justify-center p-3" : "gap-3 p-3"
                }`,
              }}
            >
              <Settings size={20} className="flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-medium">Configurações</span>
              )}
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
}
