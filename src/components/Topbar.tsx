"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  LogOut, 
  Mail,
  X,
  Filter,
  Sparkles,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Topbar() {
  const { data: session } = useSession();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const SearchComponent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={cn(
      "relative flex-1 max-w-xl",
      isMobile && "w-full"
    )}>
      <motion.div
        initial={false}
        animate={{ scale: searchQuery ? 1.02 : 1 }}
        transition={{ duration: 0.2 }}
        className="relative"
      >
        <Search 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 z-10" 
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder="Search emails, contacts, or keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={cn(
            "pl-11 pr-20 bg-slate-50/80 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 focus:bg-white dark:focus:bg-slate-800 transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 rounded-xl",
            isMobile ? "h-11 text-sm" : "h-10 text-sm",
            searchQuery && "shadow-lg"
          )}
          aria-label="Search emails"
          role="searchbox"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="h-7 w-7 p-0 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
              aria-label="Clear search"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
            aria-label="Filter search results"
          >
            <Filter className="h-3 w-3" />
          </Button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 h-16 lg:h-18 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 px-4 md:px-6 flex items-center justify-between shadow-sm"
      role="banner"
    >
      {/* Left Section */}
      <div className="flex items-center space-x-4 flex-1">
        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Logo (when search is not open) */}
        <div className={cn(
          "flex items-center space-x-2 lg:space-x-3",
          isMobileSearchOpen && "hidden md:flex"
        )}>
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl blur-md opacity-50" />
            <div className="relative w-9 h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Mail className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
              <Sparkles className="h-2.5 w-2.5 text-yellow-300 absolute -top-0.5 -right-0.5 animate-pulse" />
            </div>
          </motion.div>
          <div className="hidden sm:flex flex-col">
            <h1 className="text-base lg:text-lg font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-slate-100 dark:via-blue-200 dark:to-indigo-100 bg-clip-text text-transparent">
              MailMind
            </h1>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5">
              Smart Email AI
            </span>
          </div>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-4">
          <SearchComponent />
        </div>

        {/* Mobile Search Toggle */}
        <div className="md:hidden flex-1">
          <AnimatePresence mode="wait">
            {!isMobileSearchOpen ? (
              <motion.div
                key="search-button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex justify-end"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileSearchOpen(true)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  aria-label="Open search"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="search-input"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-2 w-full"
              >
                <SearchComponent isMobile />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileSearchOpen(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg shrink-0"
                  aria-label="Close search"
                >
                  <X className="h-5 w-5" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Section */}
      <div className={cn(
        "flex items-center space-x-1 md:space-x-2",
        isMobileSearchOpen && "hidden md:flex"
      )}>
        {/* Theme Toggle */}
        <div className="hidden md:block">
          <ThemeToggle />
        </div>

        {/* Notifications */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            size="sm"
            className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Notifications - 3 unread"
          >
            <Bell className="h-5 w-5" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              <Badge 
                className="absolute -top-0.5 -right-0.5 h-5 w-5 p-0 text-[10px] bg-gradient-to-br from-red-500 to-red-600 hover:from-red-500 hover:to-red-600 text-white border-2 border-white dark:border-slate-900 shadow-lg flex items-center justify-center"
                aria-label="3 unread notifications"
              >
                3
              </Badge>
            </motion.div>
          </Button>
        </motion.div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                className="relative h-9 w-9 lg:h-10 lg:w-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors p-0"
                aria-label={`User menu for ${session?.user?.name || 'User'}`}
              >
                <Avatar className="h-9 w-9 lg:h-10 lg:w-10 border-2 border-slate-200 dark:border-slate-700 shadow-md ring-2 ring-transparent hover:ring-blue-500/20 transition-all">
                  <AvatarImage 
                    src={session?.user?.image || ""} 
                    alt={session?.user?.name || "User avatar"}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold">
                    {session?.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-xl" 
            align="end" 
            forceMount
          >
            <DropdownMenuLabel className="font-normal p-3">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 border-2 border-slate-200 dark:border-slate-700">
                  <AvatarImage 
                    src={session?.user?.image || ""} 
                    alt={session?.user?.name || "User avatar"}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold">
                    {session?.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1 flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-none text-slate-900 dark:text-slate-100 truncate">
                    {session?.user?.name || "User"}
                  </p>
                  <p className="text-xs leading-none text-slate-500 dark:text-slate-400 truncate">
                    {session?.user?.email || "user@example.com"}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-200/50 dark:bg-slate-700/50" />
            <div className="p-1">
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800 transition-colors rounded-lg px-3 py-2"
                role="menuitem"
              >
                <User className="mr-3 h-4 w-4 text-slate-600 dark:text-slate-400" />
                <span className="font-medium">Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800 transition-colors rounded-lg px-3 py-2"
                role="menuitem"
              >
                <Settings className="mr-3 h-4 w-4 text-slate-600 dark:text-slate-400" />
                <span className="font-medium">Settings</span>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator className="bg-slate-200/50 dark:bg-slate-700/50" />
            <div className="p-1">
              <DropdownMenuItem 
                className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 focus:bg-red-50 dark:focus:bg-red-950/30 transition-colors rounded-lg px-3 py-2"
                onClick={() => signOut()}
                role="menuitem"
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span className="font-medium">Log out</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}