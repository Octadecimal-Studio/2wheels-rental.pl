'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiMenu, FiX } from 'react-icons/fi';
import { getAssetPath } from '@/lib/paths';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-md'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={getAssetPath('/img/logo.svg')}
              alt="Logo"
              width={80}
              height={80}
              className="h-16 w-16 md:h-20 md:w-20"
            />
            <span className={`font-heading text-xl md:text-2xl font-bold transition-colors ${
              isScrolled ? 'text-primary-black' : 'text-white'
            }`}>
              2Wheels Rental
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#o-nas" className={`transition-colors ${
              isScrolled ? 'text-gray-dark hover:text-accent-red' : 'text-white hover:text-accent-red'
            }`}>
              O nas
            </Link>
            <Link href="#motocykle" className={`transition-colors ${
              isScrolled ? 'text-gray-dark hover:text-accent-red' : 'text-white hover:text-accent-red'
            }`}>
              Motocykle
            </Link>
            <Link href="#cennik" className={`transition-colors ${
              isScrolled ? 'text-gray-dark hover:text-accent-red' : 'text-white hover:text-accent-red'
            }`}>
              Cennik
            </Link>
            <Link href="#kontakt" className={`transition-colors ${
              isScrolled ? 'text-gray-dark hover:text-accent-red' : 'text-white hover:text-accent-red'
            }`}>
              Kontakt
            </Link>
            <Link
              href="#rezerwacja"
              className="bg-accent-red text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Rezerwuj teraz
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden transition-colors ${
              isScrolled ? 'text-gray-dark' : 'text-white'
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden mt-4 pb-4 border-t ${
            isScrolled ? 'border-gray-light' : 'border-white/20'
          }`}>
            <div className="flex flex-col gap-4 pt-4">
              <Link
                href="#o-nas"
                className={`transition-colors ${
                  isScrolled ? 'text-gray-dark hover:text-accent-red' : 'text-white hover:text-accent-red'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                O nas
              </Link>
              <Link
                href="#motocykle"
                className={`transition-colors ${
                  isScrolled ? 'text-gray-dark hover:text-accent-red' : 'text-white hover:text-accent-red'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Motocykle
              </Link>
              <Link
                href="#cennik"
                className={`transition-colors ${
                  isScrolled ? 'text-gray-dark hover:text-accent-red' : 'text-white hover:text-accent-red'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Cennik
              </Link>
              <Link
                href="#kontakt"
                className={`transition-colors ${
                  isScrolled ? 'text-gray-dark hover:text-accent-red' : 'text-white hover:text-accent-red'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Kontakt
              </Link>
              <Link
                href="#rezerwacja"
                className="bg-accent-red text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Rezerwuj teraz
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
