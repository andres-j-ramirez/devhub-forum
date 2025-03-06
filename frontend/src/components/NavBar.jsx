import { useState, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function NavBar({ isLoggedIn }) {
  const [darkMode, setDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between items-center">
      {/* Logo */}
      <div className="text-2xl font-bold text-gray-900 dark:text-white">DevHub</div>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-6">
        {isLoggedIn ? (
          <>
            <a href="/dashboard" className="nav-link">Dashboard</a>
            <a href="/profile" className="nav-link">Profile</a>
            <a href="/logout" className="nav-link">Logout</a>
          </>
        ) : (
          <a href="/login" className="nav-link">Login</a>
        )}
      </div>

      {/* Dark Mode Toggle */}
      <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-md bg-gray-200 dark:bg-gray-800">
        {darkMode ? <SunIcon className="h-5 w-5 text-yellow-400" /> : <MoonIcon className="h-5 w-5 text-gray-900" />}
      </button>

      {/* Mobile Menu Button */}
      <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-14 right-4 bg-white dark:bg-gray-900 shadow-md rounded-md p-4 space-y-4">
          {isLoggedIn ? (
            <>
              <a href="/dashboard" className="nav-link">Dashboard</a>
              <a href="/profile" className="nav-link">Profile</a>
              <a href="/logout" className="nav-link">Logout</a>
            </>
          ) : (
            <a href="/login" className="nav-link">Login</a>
          )}
        </div>
      )}
    </nav>
  );
}
