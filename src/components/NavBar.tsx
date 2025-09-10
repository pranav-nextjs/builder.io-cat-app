"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/breeds", label: "Breeds" },
  { href: "/stats", label: "Stats" },
];

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    navItems.forEach(({ href }) => {
      router.prefetch(href);
    });
  }, [router]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-gray-800" prefetch>
          CatApp
        </Link>

        {/* Desktop Nav */}
        <div className="hidden sm:flex gap-6">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              prefetch
              className={`${
                pathname === href
                  ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              } transition`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`sm:hidden bg-white border-t shadow-md overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col p-4 space-y-3">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              prefetch
              onClickCapture={() => setMenuOpen(false)}
              className={`${
                pathname === href
                  ? "text-blue-600 font-semibold border-l-4 border-blue-600 pl-2"
                  : "text-gray-700 hover:text-blue-600"
              } transition`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
