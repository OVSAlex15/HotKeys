
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Download, User, Info, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from './Logo';
import { useAuth } from '@/contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Цены', path: '/pricing' },
    { name: 'Скачать', path: '/download' },
    { name: 'О проекте', path: '/about' },
  ];

  return (
    <nav className={`glass-nav ${scrolled ? 'py-2' : 'py-4'} transition-all-ease`}>
      <div className="container flex items-center justify-between">
        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-700 hover:text-blue-600 font-medium transition-all-ease"
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Button asChild variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50 hover:text-blue-600">
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Профиль
                  </Link>
                </Button>
                <Button 
                  onClick={() => signOut()} 
                  variant="ghost" 
                  size="sm" 
                  className="hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Выйти
                </Button>
              </>
            ) : (
              <Button asChild variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50 hover:text-blue-600">
                <Link to="/signin">
                  <User className="mr-2 h-4 w-4" />
                  Войти
                </Link>
              </Button>
            )}
            <Button asChild size="sm" className="bg-blue-500 hover:bg-blue-600">
              <Link to="/download">
                <Download className="mr-2 h-4 w-4" />
                Скачать
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700 p-2" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`fixed inset-x-0 top-[57px] z-50 md:hidden transition-all duration-300 ease-in-out transform ${
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-white border-b shadow-md py-4">
          <div className="container flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-700 hover:text-blue-600 py-2 px-4 font-medium transition-all-ease"
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-2 mt-2">
              {user ? (
                <>
                  <Button asChild variant="outline" size="sm" className="w-full justify-start border-blue-200 hover:bg-blue-50 hover:text-blue-600">
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Профиль
                    </Link>
                  </Button>
                  <Button 
                    onClick={() => signOut()} 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Выйти
                  </Button>
                </>
              ) : (
                <Button asChild variant="outline" size="sm" className="w-full justify-start border-blue-200 hover:bg-blue-50 hover:text-blue-600">
                  <Link to="/signin">
                    <User className="mr-2 h-4 w-4" />
                    Войти
                  </Link>
                </Button>
              )}
              <Button asChild size="sm" className="w-full justify-start bg-blue-500 hover:bg-blue-600">
                <Link to="/download">
                  <Download className="mr-2 h-4 w-4" />
                  Скачать
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
