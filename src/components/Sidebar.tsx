"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Inbox, 
  Star, 
  Send, 
  Archive, 
  Trash2, 
  Settings, 
  Mail,
  Menu,
  X,
  ChevronDown,
  Plus,
  FileText,
  Shield,
  Briefcase,
  User,
  Tag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useEmailStore } from "@/store/useEmailStore";
import { EmailCategory } from "@/types/email";

const categoryIcons = {
  inbox: Inbox,
  sent: Send,
  drafts: FileText,
  spam: Shield,
  work: Briefcase,
  personal: User,
  promotions: Tag,
  starred: Star,
};

const categoryLabels = {
  inbox: "Inbox",
  sent: "Sent",
  drafts: "Drafts",
  spam: "Spam",
  work: "Work",
  personal: "Personal",
  promotions: "Promotions",
  starred: "Starred",
};

const categoryColors = {
  inbox: "text-blue-600 dark:text-blue-400",
  sent: "text-green-600 dark:text-green-400",
  drafts: "text-orange-600 dark:text-orange-400",
  spam: "text-red-600 dark:text-red-400",
  work: "text-purple-600 dark:text-purple-400",
  personal: "text-pink-600 dark:text-pink-400",
  promotions: "text-yellow-600 dark:text-yellow-400",
  starred: "text-yellow-500 dark:text-yellow-400",
};

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { selectedCategory, setSelectedCategory, emails } = useEmailStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const getEmailCount = (category: EmailCategory) => {
    if (category === "starred") {
      return emails.filter(email => email.isStarred).length;
    }
    return emails.filter(email => email.category === category).length;
  };

  const getUnreadCount = (category: EmailCategory) => {
    if (category === "starred") {
      return emails.filter(email => email.isStarred && !email.isRead).length;
    }
    return emails.filter(email => email.category === category && !email.isRead).length;
  };

  const primaryCategories = ["inbox", "sent", "drafts", "starred"];
  const secondaryCategories = ["work", "personal", "promotions", "spam"];

  const SidebarContent = () => (
    <motion.div 
      className={cn(
        "w-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-r border-slate-200 dark:border-slate-700 flex flex-col h-screen",
        className
      )}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <Mail className="h-5 w-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-slate-100">MailMind</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Smart Email Management</p>
              </div>
            )}
          </div>
          
          {/* Desktop collapse toggle */}
          <div className="hidden lg:block">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8 p-0"
            >
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform",
                isCollapsed ? "rotate-90" : "rotate-0"
              )} />
            </Button>
          </div>
          
          {/* Mobile close button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {!isCollapsed && (
          <Button 
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 shadow-lg mt-4"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Compose
          </Button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Primary Categories */}
        <div className="space-y-1">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 mb-3">
            Main
          </h3>
          {primaryCategories.map((category) => {
            const Icon = categoryIcons[category as EmailCategory];
            const emailCount = getEmailCount(category as EmailCategory);
            const unreadCount = getUnreadCount(category as EmailCategory);
            const isSelected = selectedCategory === category;
            
            return (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category as EmailCategory)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-xl text-left transition-all duration-200 group relative overflow-hidden",
                  isSelected
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600"
                    layoutId="activeCategory"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                <div className="flex items-center space-x-3 relative z-10">
                  <Icon className={cn(
                    "h-5 w-5 transition-colors",
                    isSelected 
                      ? "text-white" 
                      : categoryColors[category as EmailCategory]
                  )} />
                  <span className={cn(
                    "font-medium transition-colors",
                    isSelected ? "text-white" : "text-slate-700 dark:text-slate-300"
                  )}>
                    {categoryLabels[category as EmailCategory]}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 relative z-10">
                  <AnimatePresence>
                    {unreadCount > 0 && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                      >
                        <Badge 
                          className={cn(
                            "text-xs px-2 py-0.5 font-semibold border-0",
                            isSelected 
                              ? "bg-white/20 text-white" 
                              : "bg-blue-500 text-white"
                          )}
                        >
                          {unreadCount}
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <span className={cn(
                    "text-xs transition-colors",
                    isSelected 
                      ? "text-white/70" 
                      : "text-slate-500 dark:text-slate-400"
                  )}>
                    {emailCount}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Secondary Categories */}
        <div className="space-y-1">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 mb-3">
            Categories
          </h3>
          {secondaryCategories.map((category, index) => {
            const Icon = categoryIcons[category as EmailCategory];
            const emailCount = getEmailCount(category as EmailCategory);
            const unreadCount = getUnreadCount(category as EmailCategory);
            const isSelected = selectedCategory === category;
            
            return (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category as EmailCategory)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-xl text-left transition-all duration-200 group relative overflow-hidden",
                  isSelected
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
              >
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600"
                    layoutId="activeCategory"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                <div className="flex items-center space-x-3 relative z-10">
                  <Icon className={cn(
                    "h-5 w-5 transition-colors",
                    isSelected 
                      ? "text-white" 
                      : categoryColors[category as EmailCategory]
                  )} />
                  <span className={cn(
                    "font-medium transition-colors",
                    isSelected ? "text-white" : "text-slate-700 dark:text-slate-300"
                  )}>
                    {categoryLabels[category as EmailCategory]}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 relative z-10">
                  <AnimatePresence>
                    {unreadCount > 0 && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                      >
                        <Badge 
                          className={cn(
                            "text-xs px-2 py-0.5 font-semibold border-0",
                            isSelected 
                              ? "bg-white/20 text-white" 
                              : "bg-blue-500 text-white"
                          )}
                        >
                          {unreadCount}
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <span className={cn(
                    "text-xs transition-colors",
                    isSelected 
                      ? "text-white/70" 
                      : "text-slate-500 dark:text-slate-400"
                  )}>
                    {emailCount}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="space-y-1">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 mb-3">
            Quick Actions
          </h3>
          <div className="space-y-1">
            <button className="w-full flex items-center space-x-3 p-3 rounded-xl text-left transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">
              <Archive className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              <span className="font-medium">Archive</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 rounded-xl text-left transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">
              <Trash2 className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              <span className="font-medium">Trash</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 rounded-xl text-left transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">
              <Settings className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              <span className="font-medium">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-20 left-4 z-40">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileOpen(true)}
          className="bg-background/95 backdrop-blur-sm"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] transition-all duration-300",
        isCollapsed ? "w-16" : "w-72"
      )}>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMobileOpen(false)}
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 z-50"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}