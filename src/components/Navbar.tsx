"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Sparkles, Menu, X, ArrowRight, Zap, Shield, Brain } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Features", href: "#features", icon: Zap },
    { name: "Security", href: "#security", icon: Shield },
    { name: "AI Powered", href: "#ai", icon: Brain },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-lg"
            : "bg-transparent"
        )}
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Mail className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                  <Sparkles className="h-3 w-3 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
                </div>
              </motion.div>
              <div className="flex flex-col">
                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-slate-100 dark:via-blue-200 dark:to-indigo-100 bg-clip-text text-transparent">
                  MailMind
                </h1>
                <span className="hidden sm:block text-[10px] lg:text-xs text-slate-500 dark:text-slate-400 -mt-1">
                  Smart Email AI
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.name} href={link.href}>
                    <Button
                      variant="ghost"
                      className="group relative px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Icon className="h-4 w-4 mr-2 opacity-70 group-hover:opacity-100 transition-opacity" />
                      {link.name}
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-3/4 transition-all duration-300" />
                    </Button>
                  </Link>
                );
              })}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              <ThemeToggle />
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <span className="relative z-10 flex items-center">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center space-x-2">
              <ThemeToggle />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                ) : (
                  <Menu className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                )}
              </motion.button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-16 right-0 bottom-0 w-full sm:w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l border-slate-200/50 dark:border-slate-700/50 z-50 lg:hidden shadow-2xl"
            >
              <div className="flex flex-col h-full p-6">
                {/* Navigation Links */}
                <div className="space-y-2 mb-8">
                  <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                    Navigation
                  </h3>
                  {navLinks.map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-left group hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-indigo-500/10 group-hover:from-blue-500/20 group-hover:to-indigo-500/20 transition-colors">
                                <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="text-slate-700 dark:text-slate-300 font-medium">
                                {link.name}
                              </span>
                            </div>
                          </Button>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Divider */}
                <div className="border-t border-slate-200 dark:border-slate-700 my-6" />

                {/* Action Buttons */}
                <div className="space-y-3 mt-auto">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>

                {/* Footer Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center justify-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                    <Sparkles className="h-4 w-4" />
                    <span>Trusted by 10,000+ users</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
