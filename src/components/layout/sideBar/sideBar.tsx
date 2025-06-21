import React, { useState, useEffect } from "react";
import {
  Zap,
  BarChart3,
  Users,
  ChevronDown,
  ChevronRight,
  Package,
  ClipboardList,
  ChevronLeft,
  Menu,
  Settings,
  LogOut,
  Calendar,
  FileText,
  TrendingUp
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  // Ouvrir automatiquement le menu commercial si on est sur une de ses pages
  const isCommercialPath = currentPath.startsWith("/commerciaux");
  const [openCommercialMenu, setOpenCommercialMenu] = useState(isCommercialPath);

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Garder le menu ouvert quand on navigue entre les sous-pages
    if (currentPath.startsWith("/commerciaux")) {
      setOpenCommercialMenu(true);
    }
  }, [currentPath]);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCommercialMenu = () => setOpenCommercialMenu(!openCommercialMenu);

  const isActive = (path: string) => currentPath.startsWith(path);

  return (
    <>
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow"
          title="Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {isOpen && (
        <div className="flex flex-col w-72 bg-white border-r border-gray-200 h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">DigiSales</span>
            </div>
            <button
              onClick={toggleSidebar}
              className="text-gray-400 hover:text-gray-600 lg:hidden"
              title="Close"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-3 space-y-1">
              <SidebarLink
                icon={<BarChart3 className="w-5 h-5" />}
                to="/dashboard"
                active={isActive("/dashboard")}
              >
                Tableau de bord
              </SidebarLink>

              {/* Menu Commerciaux avec sous-menus */}
              <div>
                <button
                  onClick={toggleCommercialMenu}
                  className={`flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive("/commerciaux") ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center">
                    <span className={`mr-3 ${isActive("/commerciaux") ? "text-blue-600" : "text-gray-400"}`}>
                      <Users className="w-5 h-5" />
                    </span>
                    <span>Commerciaux</span>
                  </div>
                  {openCommercialMenu ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {openCommercialMenu && (
                  <div className="ml-8 mt-1 space-y-1">
                    {/* Catalogue Produits */}
                    <SidebarLink
                      icon={<Package className="w-5 h-5" />}
                      to="/commerciaux/catalogue"
                      active={isActive("/commerciaux/catalogue")}
                    >
                      Catalogue Produits
                    </SidebarLink>

                    {/* Opérations Commerciales */}
                    <SidebarLink
                      icon={<ClipboardList className="w-5 h-5" />}
                      to="/commerciaux/operations"
                      active={isActive("/commerciaux/operations")}
                    >
                      Opérations Commerciales
                    </SidebarLink>
                  </div>
                )}
              </div>

              <SidebarLink
                icon={<TrendingUp className="w-5 h-5" />}
                to="/performance"
                active={isActive("/performance")}
              >
                Performance
              </SidebarLink>

              <SidebarLink
                icon={<Calendar className="w-5 h-5" />}
                to="/activities"
                active={isActive("/activities")}
              >
                Activités
              </SidebarLink>

               <SidebarLink
                icon={<Package className="w-5 h-5" />}
                to="/stocks"
                active={isActive("/stocks")}
              >
                Stocks
              </SidebarLink>

              <SidebarLink
                icon={<FileText className="w-5 h-5" />}
                to="/reports"
                active={isActive("/reports")}
              >
                Rapports
              </SidebarLink>

              <SidebarLink
                icon={<Settings className="w-5 h-5" />}
                to="/settings"
                active={isActive("/settings")}
              >
                Paramètres
              </SidebarLink>

            </nav>
          </div>

          {/* User Profile */}
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  className="h-10 w-10 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User profile"
                />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">Thomas Martin</p>
                <p className="text-xs text-gray-500">Directeur Commercial</p>
              </div>
              <button title="Déconnexion" className="text-gray-400 hover:text-gray-600">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const SidebarLink = ({
  icon,
  children,
  active = false,
  to = "#",
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
  to?: string;
}) => (
  <Link
    to={to}
    className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
      active ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
    }`}
  >
    <span className={`mr-3 ${active ? "text-blue-600" : "text-gray-400"}`}>
      {icon}
    </span>
    <span>{children}</span>
  </Link>
);

export default Sidebar;