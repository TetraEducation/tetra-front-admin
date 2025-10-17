import { Link } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import { Home, Settings, Building2, Users, BarChart3, ChevronLeft, ChevronRight, User, LogOut } from 'lucide-react'

export default function PlatformSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

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
          <button className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg border-2 border-blue-500">
            <User size={18} className="text-white" />
          </button>

          {/* User Menu Dropdown - Hover */}
          {showUserMenu && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-neutral-950 border border-blue-800 rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 border-b border-blue-800">
                <p className="text-white font-medium">{user.name}</p>
                <p className="text-blue-300 text-sm">{user.email}</p>
                <p className="text-blue-400 text-xs mt-1">{user.role}</p>
              </div>
              <div className="p-2">
                <button className="w-full flex items-center gap-3 p-2 text-white hover:bg-blue-800 rounded transition-colors">
                  <User size={16} />
                  <span className="text-sm">Meu Perfil</span>
                </button>
                <button className="w-full flex items-center gap-3 p-2 text-white hover:bg-blue-800 rounded transition-colors">
                  <Settings size={16} />
                  <span className="text-sm">Configurações</span>
                </button>
                <hr className="border-blue-800 my-2" />
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
        className={`fixed top-0 left-0 h-full bg-neutral-950 text-white shadow-2xl z-40 transition-all duration-300 ease-in-out flex flex-col ${
          isCollapsed ? 'w-16' : 'w-72'
        } rounded-r-xl`}
      >
        <div className={`flex items-center border-b border-blue-800 ${
          isCollapsed ? 'justify-center p-2' : 'justify-between p-4'
        }`}>
          {!isCollapsed && <h2 className="text-xl font-bold">Plataforma</h2>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg transition-colors flex items-center justify-center hover:bg-blue-800"
            aria-label={isCollapsed ? "Expand menu" : "Collapse menu"}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className={`flex-1 overflow-y-auto ${isCollapsed ? 'p-2' : 'p-4'}`}>
          <Link
            to="/administrative-panel/home"
            className={`flex items-center gap-3 rounded-lg transition-colors mb-2 ${
              isCollapsed ? 'justify-center p-2' : 'p-3'
            } hover:bg-blue-800`}
            activeProps={{
              className: `flex items-center gap-3 rounded-lg transition-colors mb-2 ${
                isCollapsed ? 'justify-center p-2' : 'p-3'
              } bg-blue-600 hover:bg-blue-700`,
            }}
          >
            <Home size={20} />
            {!isCollapsed && <span className="font-medium">Dashboard</span>}
          </Link>

          {/* Platform Management Links */}
          <div className="mt-6">
            {!isCollapsed && (
              <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-wider mb-3">
                Gestão da Plataforma
              </h3>
            )}
            
            <Link
              to="/administrative-panel/home"
              className={`flex items-center gap-3 rounded-lg hover:bg-blue-800 transition-colors mb-2 ${
                isCollapsed ? 'justify-center p-2' : 'p-3'
              }`}
              activeProps={{
                className: `flex items-center gap-3 p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors mb-2 ${
                  isCollapsed ? 'justify-center' : ''
                }`,
              }}
            >
              <Building2 size={20} />
              {!isCollapsed && <span className="font-medium">Tenants</span>}
            </Link>

            <Link
              to="/administrative-panel/home"
              className={`flex items-center gap-3 rounded-lg hover:bg-blue-800 transition-colors mb-2 ${
                isCollapsed ? 'justify-center p-2' : 'p-3'
              }`}
              activeProps={{
                className: `flex items-center gap-3 p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors mb-2 ${
                  isCollapsed ? 'justify-center' : ''
                }`,
              }}
            >
              <Users size={20} />
              {!isCollapsed && <span className="font-medium">Usuários</span>}
            </Link>

            <Link
              to="/administrative-panel/home"
              className={`flex items-center gap-3 rounded-lg hover:bg-blue-800 transition-colors mb-2 ${
                isCollapsed ? 'justify-center p-2' : 'p-3'
              }`}
              activeProps={{
                className: `flex items-center gap-3 p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors mb-2 ${
                  isCollapsed ? 'justify-center' : ''
                }`,
              }}
            >
              <BarChart3 size={20} />
              {!isCollapsed && <span className="font-medium">Analytics</span>}
            </Link>
          </div>

          {/* Platform Settings */}
          <div className='mt-6'>
            {!isCollapsed && (
              <h3 className='text-sm font-semibold text-blue-300 uppercase tracking-wider mb-3'>Configurações</h3>
            )}
            <Link
              to="/administrative-panel/home"
              className={`flex items-center gap-3 rounded-lg hover:bg-blue-800 transition-colors mb-2 ${
                isCollapsed ? 'justify-center p-2' : 'p-3'
              }`}
              activeProps={{
                className: `flex items-center gap-3 p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors mb-2 ${
                  isCollapsed ? 'justify-center' : ''
                }`,
              }}
            >
              <Settings size={20} />
              {!isCollapsed && <span className="font-medium">Configurações</span>}
            </Link>
          </div>
        </nav>
      </aside>
    </>
  )
}
