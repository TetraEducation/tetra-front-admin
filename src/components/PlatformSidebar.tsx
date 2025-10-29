import { Link } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import { Home, Settings, Building2, Users, BarChart3, ChevronLeft, ChevronRight, User, LogOut } from 'lucide-react'

export default function PlatformSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showIcon, setShowIcon] = useState(true)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const handleToggle = () => {
    setIsAnimating(true)
    setShowIcon(false)
    
    
    setTimeout(() => {
      setIsCollapsed(!isCollapsed)
    }, 100)
    
 
    setTimeout(() => {
      setShowIcon(true)
      setIsAnimating(false)
    }, 550) 
  }

  // Mock user data - replace with actual user data from your auth system
  const user = {
    name: "Platform Admin",
    role: "Administrador da Plataforma",
    email: "admin@tetraeducacao.com"
  }

  return (
    <>
      {/* User Profile Avatar - Right Side */}
      <div className="fixed top-4 right-4 z-50">
        <div 
          className="relative group" 
          ref={userMenuRef}
          onMouseEnter={() => setShowUserMenu(true)}
          onMouseLeave={() => setShowUserMenu(false)}
        >
          {/* Avatar Button */}
          <button className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors shadow-lg border-2 border-emerald-500">
            <User size={18} className="text-white" />
          </button>

          {/* User Menu Dropdown - Hover */}
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
          isCollapsed ? 'w-16' : 'w-72'
        } rounded-r-xl`}
      >
        <div className={`flex items-center border-b border-emerald-800 ${
          isCollapsed ? 'justify-center p-2' : 'justify-between p-4'
        }`}>
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
            <div className={`relative w-[18px] h-[18px] transition-opacity duration-150 ${
              showIcon ? 'opacity-100' : 'opacity-0'
            }`}>
              {isCollapsed ? (
                <ChevronRight size={18} className="absolute inset-0" />
              ) : (
                <ChevronLeft size={18} className="absolute inset-0" />
              )}
            </div>
          </button>
        </div>

        <nav className={`flex-1 overflow-y-auto ${isCollapsed ? 'p-2' : 'p-4'}`}>
          <Link
            to="/administrative-panel/home"
            className={`flex items-center rounded-lg transition-colors mb-2 ${
              isCollapsed ? 'justify-center p-3' : 'gap-3 p-3'
            } hover:bg-emerald-800/50`}
            activeProps={{
              className: `flex items-center rounded-lg transition-colors mb-2 ${
                isCollapsed ? 'justify-center p-3' : 'gap-3 p-3'
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
              to="/administrative-panel/tenants"
              className={`flex items-center rounded-lg hover:bg-emerald-800/50 transition-colors mb-2 ${
                isCollapsed ? 'justify-center p-3' : 'gap-3 p-3'
              }`}
              activeProps={{
                className: `flex items-center rounded-lg bg-emerald-600 hover:bg-emerald-700 transition-colors mb-2 ${
                  isCollapsed ? 'justify-center p-3' : 'gap-3 p-3'
                }`,
              }}
            >
              <Building2 size={20} className="flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">Plataformas</span>}
            </Link>

            <Link
              to="/administrative-panel/users"
              className={`flex items-center rounded-lg hover:bg-emerald-800/50 transition-colors mb-2 ${
                isCollapsed ? 'justify-center p-3' : 'gap-3 p-3'
              }`}
              activeProps={{
                className: `flex items-center rounded-lg bg-emerald-600 hover:bg-emerald-700 transition-colors mb-2 ${
                  isCollapsed ? 'justify-center p-3' : 'gap-3 p-3'
                }`,
              }}
            >
              <Users size={20} className="flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">Usuários</span>}
            </Link>

            <Link
              to="/administrative-panel/analytics"
              className={`flex items-center rounded-lg hover:bg-emerald-800/50 transition-colors mb-2 ${
                isCollapsed ? 'justify-center p-3' : 'gap-3 p-3'
              }`}
              activeProps={{
                className: `flex items-center rounded-lg bg-emerald-600 hover:bg-emerald-700 transition-colors mb-2 ${
                  isCollapsed ? 'justify-center p-3' : 'gap-3 p-3'
                }`,
              }}
            >
              <BarChart3 size={20} className="flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">Analytics</span>}
            </Link>
          </div>

          {/* Platform Settings */}
          <div className='mt-6'>
            {!isCollapsed && (
              <h3 className='text-sm font-semibold text-emerald-300 uppercase tracking-wider mb-3'>Configurações</h3>
            )}
            <Link
              to="/administrative-panel/settings"
              className={`flex items-center rounded-lg hover:bg-emerald-800/50 transition-colors mb-2 ${
                isCollapsed ? 'justify-center p-3' : 'gap-3 p-3'
              }`}
              activeProps={{
                className: `flex items-center rounded-lg bg-emerald-600 hover:bg-emerald-700 transition-colors mb-2 ${
                  isCollapsed ? 'justify-center p-3' : 'gap-3 p-3'
                }`,
              }}
            >
              <Settings size={20} className="flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">Configurações</span>}
            </Link>
          </div>
        </nav>
      </aside>
    </>
  )
}
