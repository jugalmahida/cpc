
import { useState, useEffect } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Logo from "/logo.png";
import { navigation } from "../constants/Navigation";
import { useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubMenuOpen, setMobileSubMenuOpen] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get current route

  const [openMenu, setOpenMenu] = useState(null);
  let menuTimeout;

  const handleMouseEnter = (name) => {
    clearTimeout(menuTimeout);
    setOpenMenu(name);
  };

  const handleMouseLeave = () => {
    menuTimeout = setTimeout(() => {
      setOpenMenu(null);
    }, 200); // Delay hiding for 200ms
  };


  const isHomePage = location.pathname === "/"; // Check if it's the home page

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigation = (href) => {
    const currentPath = window.location.pathname;

    if (href.startsWith("#")) {
      if (currentPath !== "/") {
        navigate(`/${href}`);
      } else {
        const section = document.querySelector(href);
        if (section) section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(href);
    }
    setMobileMenuOpen(false);
  };

  return (
    // Before z-50, now z-40
    <header
      className={`fixed inset-x-0 bottom-4 z-40 m-0 p-0 transition-colors duration-300 xl:bottom-4 
      ${isHomePage && !isScrolled
          ? "xl:bg-transparent xl:border-transparent"
          : "xl:bg-white xl:shadow-lg xl:border xl:border-gray-200"
        }
      lg:rounded-[50px] xl:px-3 xl:py-1.5 xl:max-w-[95%] lg:left-1/2 xl:-translate-x-1/2 xl:w-full`}
    >
      <nav aria-label="Global" className="flex items-center justify-between p-1 lg:px-4">
        {/* Logo - Hidden on Mobile */}
        <div className="hidden xl:flex xl:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">CPC</span>
            <img alt="logo" src={Logo} className="h-12 w-auto" />
          </a>
        </div>

        {/* Floating Action Button - Mobile Menu */}
        <div className="fixed bottom-6 right-6 z-50 xl:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="inline-flex items-center justify-center rounded-full p-4 bg-[#1A556F] text-white shadow-lg hover:bg-[#14415e] transition-colors duration-200"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>

        {/* Desktop Navigation - Hidden on Mobile */}
        <div className="hidden xl:flex xl:gap-x-6 xl:items-center">
          {navigation.map((item) => (
            <div
              key={item.name}
              className="relative group"
              onMouseEnter={() => handleMouseEnter(item.name)}
              onMouseLeave={handleMouseLeave}
            >
              <a
                href={item.href}
                onClick={(e) => {
                  if (item.subMenu) e.preventDefault();
                  else {
                    e.preventDefault();
                    handleNavigation(item.href);
                  }
                }}
                className={`text-sm font-semibold transition-colors duration-200 
      ${isHomePage && !isScrolled ? "text-white hover:text-blue-200" : "text-gray-900 hover:text-blue-600"}`}
              >
                {item.name}
              </a>

              {item.subMenu && openMenu === item.name && (
                <div
                  className="absolute left-0 bottom-full mb-2 bg-white shadow-lg rounded-lg border border-gray-200 w-48"
                  onMouseEnter={() => clearTimeout(menuTimeout)} // Keep menu open when hovering submenu
                  onMouseLeave={handleMouseLeave} // Close when leaving submenu
                >
                  {item.subMenu.map((subItem) => (
                    <a
                      key={subItem.name}
                      href={subItem.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigation(subItem.href);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {subItem.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Mobile Menu Dialog */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="xl:hidden">
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">CPC</span>
              <img alt="" src={Logo} className="h-8 w-auto" />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="mt-4 flow-root">
            <div className="-my-4 divide-y divide-gray-500/10">
              <div className="space-y-2 py-4">
                {navigation.map((item) => (
                  <div key={item.name} className="relative">
                    <button
                      className="w-full text-left -mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                      onClick={(e) => {
                        e.preventDefault();
                        if (item.subMenu) {
                          setMobileSubMenuOpen(item.name === mobileSubMenuOpen ? null : item.name);
                        } else {
                          handleNavigation(item.href);
                          setMobileMenuOpen(false);
                        }
                      }}
                    >
                      {item.name}
                    </button>

                    {/* Submenu for Mobile */}
                    {item.subMenu && mobileSubMenuOpen === item.name && (
                      <div className="ml-4 border-l border-gray-300 pl-3">
                        {item.subMenu.map((subItem) => (
                          <a
                            key={subItem.name}
                            href={subItem.href}
                            onClick={(e) => {
                              e.preventDefault();
                              handleNavigation(subItem.href);
                              setMobileMenuOpen(false);
                            }}
                            className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                          >
                            {subItem.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
