"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  LogOut, 
  Mail,
  Menu,
  X,
  Filter
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

  const SearchComponent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={cn(
      "relative flex-1 max-w-md",
      isMobile && "w-full"
    )}>
      <Search 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" 
        aria-hidden="true"
      />
      <Input
        type="search"
        placeholder="Search emails..."
        className={cn(
          "pl-10 pr-4 bg-slate-50/80 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 focus:bg-white dark:focus:bg-slate-800 transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
          isMobile ? "h-10 text-sm" : "h-9 text-sm"
        )}
        aria-label="Search emails"
        role="searchbox"
      />
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        aria-label="Filter search results"
      >
        <Filter className="h-3 w-3" />
      </Button>
    </div>
  );

  return (
    <header 
      className="h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50 px-4 md:px-6 flex items-center justify-between shadow-sm"
      role="banner"
    >
      {/* Left Section */}
      <div className="flex items-center space-x-4 flex-1">
        {/* Mobile Logo (when search is not open) */}
        <div className={cn(
          "md:hidden flex items-center space-x-2",
          isMobileSearchOpen && "hidden"
        )}>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
            <Mail className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            EmailAI
          </h1>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-md">
          <SearchComponent />
        </div>

        {/* Mobile Search Toggle */}
        <div className="md:hidden">
          <AnimatePresence mode="wait">
            {!isMobileSearchOpen ? (
              <motion.div
                key="search-button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileSearchOpen(true)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  aria-label="Open search"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="search-input"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center space-x-2 w-full"
              >
                <SearchComponent isMobile />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileSearchOpen(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  aria-label="Close search"
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Section */}
      <div className={cn(
        "flex items-center space-x-2 md:space-x-3",
        isMobileSearchOpen && "hidden md:flex"
      )}>
        {/* Notifications */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            size="sm"
            className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            aria-label="Notifications - 3 unread"
          >
            <Bell className="h-4 w-4" />
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 hover:bg-red-500 text-white border-2 border-white dark:border-slate-900 shadow-sm"
              aria-label="3 unread notifications"
            >
              3
            </Badge>
          </Button>
        </motion.div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              aria-label={`User menu for ${session?.user?.name || 'User'}`}
            >
              <Avatar className="h-8 w-8 border-2 border-slate-200 dark:border-slate-700 shadow-sm">
                <AvatarImage 
                  src={session?.user?.image || ""} 
                  alt={session?.user?.name || "User avatar"}
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-medium">
                  {session?.user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-56 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg" 
            align="end" 
            forceMount
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-slate-900 dark:text-slate-100">
                  {session?.user?.name || "User"}
                </p>
                <p className="text-xs leading-none text-slate-500 dark:text-slate-400">
                  {session?.user?.email || "user@example.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-200/50 dark:bg-slate-700/50" />
            <DropdownMenuItem 
              className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 focus:bg-slate-50 dark:focus:bg-slate-800/50 transition-colors"
              role="menuitem"
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 focus:bg-slate-50 dark:focus:bg-slate-800/50 transition-colors"
              role="menuitem"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-200/50 dark:bg-slate-700/50" />
            <DropdownMenuItem 
              className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 focus:bg-red-50 dark:focus:bg-red-950/20 transition-colors"
              onClick={() => signOut()}
              role="menuitem"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}