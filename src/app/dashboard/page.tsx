"use client";

import { useEffect, useState, useMemo, useCallback, lazy, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/Topbar";
import { Sidebar } from "@/components/Sidebar";
import { EmailCard } from "@/components/EmailCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEmailStore } from "@/store/useEmailStore";
import { RefreshCw, Inbox, Mail, TrendingUp, Clock, Star, Filter, Search } from "lucide-react";
import { motion } from "framer-motion";
import axiosClient from "@/lib/axiosClient";
import { Email } from "@/types/email";

// Lazy load heavy components
const LazyEmailCard = lazy(() => import("@/components/EmailCard").then(module => ({ default: module.EmailCard })));

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    filteredEmails,
    selectedCategory,
    isLoading,
    setEmails,
    setIsLoading,
    setUser,
  } = useEmailStore();
  const [syncLoading, setSyncLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: "1", // This would come from the session
        email: session.user.email || "",
        firstName: session.user.name?.split(" ")[0] || "",
        lastName: session.user.name?.split(" ")[1] || "",
      });
      fetchEmails();
    }
  }, [session]);

  const fetchEmails = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await axiosClient.get("/emails");
      setEmails(response.data || []);
    } catch (error) {
      console.error("Failed to fetch emails:", error);
      // Set mock data for demo purposes
      setMockEmails();
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, setEmails, setIsLoading]);

  const setMockEmails = () => {
    const mockEmails: Email[] = [
      {
        id: "1",
        subject: "Welcome to MailMind!",
        sender: { name: "MailMind Team", email: "hello@mailmind.com" },
        recipients: [{ email: session?.user?.email || "" }],
        body: "Welcome to MailMind! We're excited to help you manage your emails more efficiently with AI-powered features.",
        date: new Date().toISOString(),
        category: "inbox",
        priority: "high",
        isRead: false,
        isStarred: true,
        aiSummary: "Welcome message from MailMind team introducing AI-powered email management features.",
      },
      {
        id: "2",
        subject: "Project Update - Q4 Goals",
        sender: { name: "Sarah Johnson", email: "sarah@company.com" },
        recipients: [{ email: session?.user?.email || "" }],
        body: "Hi team, I wanted to share an update on our Q4 goals and the progress we've made so far...",
        date: new Date(Date.now() - 86400000).toISOString(),
        category: "work",
        priority: "medium",
        isRead: true,
        isStarred: false,
        aiSummary: "Project update discussing Q4 goals and current progress from Sarah Johnson.",
      },
      {
        id: "3",
        subject: "Special Offer: 50% Off Premium Plan",
        sender: { name: "CloudService", email: "offers@cloudservice.com" },
        recipients: [{ email: session?.user?.email || "" }],
        body: "Don't miss out on our limited-time offer! Get 50% off our premium plan for the first 6 months...",
        date: new Date(Date.now() - 172800000).toISOString(),
        category: "promotions",
        priority: "low",
        isRead: false,
        isStarred: false,
        aiSummary: "Promotional email offering 50% discount on premium cloud service plan.",
      },
    ];
    setEmails(mockEmails);
  };

  const handleSync = useCallback(async () => {
    if (syncLoading) return;
    
    setSyncLoading(true);
    try {
      const response = await axiosClient.get("/emails/sync");
      if (response.data) {
        await fetchEmails();
      }
    } catch (error) {
      console.error("Sync failed:", error);
    } finally {
      setSyncLoading(false);
    }
  }, [syncLoading, fetchEmails]);

  const handleEmailClick = useCallback((emailId: string) => {
    router.push(`/dashboard/${emailId}`);
  }, [router]);

  // Memoized email statistics
  const emailStats = useMemo(() => {
    return {
      total: filteredEmails.length,
      unread: filteredEmails.filter(email => !email.isRead).length,
      starred: filteredEmails.filter(email => email.isStarred).length,
      highPriority: filteredEmails.filter(email => email.priority === 'high').length,
    };
  }, [filteredEmails]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="flex h-screen">
          {/* Desktop Sidebar Skeleton */}
          <div className="hidden lg:block w-64 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-r border-slate-200 dark:border-slate-700">
            <div className="p-6 space-y-4">
              <motion.div 
                className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-lg"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {[...Array(6)].map((_, i) => (
                <motion.div 
                  key={i}
                  className="h-10 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-lg"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
          </div>
          
          {/* Main Content Skeleton */}
          <div className="flex-1 flex flex-col">
            {/* Topbar Skeleton */}
            <motion.div 
              className="h-16 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 flex items-center px-4 lg:px-6"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="flex-1 flex items-center justify-between">
                <div className="h-8 w-32 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-lg" />
                <div className="flex items-center gap-4">
                  <div className="h-8 w-64 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-lg" />
                  <div className="h-8 w-8 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-full" />
                </div>
              </div>
            </motion.div>
            
            {/* Content Area Skeleton */}
            <div className="flex-1 p-4 lg:p-6 space-y-6">
              {/* Stats Cards Skeleton */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <motion.div 
                    key={i}
                    className="h-24 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
              </div>
              
              {/* Email List Skeleton */}
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <motion.div 
                    key={i}
                    className="h-32 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Loading Indicator */}
        <motion.div 
          className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 360]
          }}
          transition={{ 
            scale: { duration: 2, repeat: Infinity },
            rotate: { duration: 3, repeat: Infinity, ease: "linear" }
          }}
        >
          <Mail className="h-6 w-6" />
        </motion.div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Topbar />
      <div className="flex flex-col lg:flex-row">
        {/* Mobile Sidebar Toggle */}
        <div className="lg:hidden">
          <Sidebar />
        </div>
        
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* Header Section */}
          <motion.div 
            className="mb-6 lg:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <Inbox className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 capitalize">
                    {selectedCategory === "starred" ? "Starred" : selectedCategory}
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                    {emailStats.total} emails • {emailStats.unread} unread
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  onClick={handleSync}
                  disabled={syncLoading}
                  variant="outline"
                  size="sm"
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-xs sm:text-sm"
                >
                  <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 ${syncLoading ? "animate-spin" : ""}`} />
                  <span className="hidden sm:inline">Sync</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-xs sm:text-sm"
                >
                  <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
              </div>
            </div>

            {/* Email Statistics Cards */}
            <motion.div 
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {[
                { 
                  label: "Total", 
                  value: emailStats.total, 
                  icon: Mail, 
                  color: "from-blue-500 to-indigo-600",
                  bgColor: "from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50",
                  textColor: "text-blue-700 dark:text-blue-300"
                },
                { 
                  label: "Unread", 
                  value: emailStats.unread, 
                  icon: Clock, 
                  color: "from-emerald-500 to-teal-600",
                  bgColor: "from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50",
                  textColor: "text-emerald-700 dark:text-emerald-300"
                },
                { 
                  label: "Starred", 
                  value: emailStats.starred, 
                  icon: Star, 
                  color: "from-yellow-500 to-orange-600",
                  bgColor: "from-yellow-50 to-orange-50 dark:from-yellow-950/50 dark:to-orange-950/50",
                  textColor: "text-yellow-700 dark:text-yellow-300"
                },
                { 
                  label: "Priority", 
                  value: emailStats.highPriority, 
                  icon: TrendingUp, 
                  color: "from-red-500 to-pink-600",
                  bgColor: "from-red-50 to-pink-50 dark:from-red-950/50 dark:to-pink-950/50",
                  textColor: "text-red-700 dark:text-red-300"
                }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.1 * index,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    y: -2,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className={`relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group bg-gradient-to-br ${stat.bgColor} backdrop-blur-sm`}>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1 sm:space-y-2">
                          <p className={`text-xs sm:text-sm font-medium tracking-wide uppercase ${stat.textColor}`}>
                            {stat.label}
                          </p>
                          <motion.p 
                            className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100"
                            key={stat.value}
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            {stat.value}
                          </motion.p>
                        </div>
                        <motion.div 
                          className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br shadow-lg group-hover:shadow-xl transition-all duration-300 ${stat.color}`}
                          whileHover={{ 
                            rotate: [0, -10, 10, 0],
                            transition: { duration: 0.5 }
                          }}
                        >
                          <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </motion.div>
                      </div>
                      
                      {/* Animated background pattern */}
                      <motion.div 
                        className="absolute inset-0 opacity-5 dark:opacity-10"
                        animate={{ 
                          backgroundPosition: ["0% 0%", "100% 100%"],
                        }}
                        transition={{ 
                          duration: 20, 
                          repeat: Infinity, 
                          repeatType: "reverse" 
                        }}
                        style={{
                          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
                          backgroundSize: "20px 20px"
                        }}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Email List Section */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <Skeleton className="h-32 w-full rounded-xl bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600" />
                  </motion.div>
                ))}
              </div>
            ) : filteredEmails.length === 0 ? (
              <motion.div 
                className="text-center py-16 px-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Mail className="h-12 w-12 text-slate-400 dark:text-slate-500" />
                </motion.div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  No emails found
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                  {selectedCategory === "inbox" 
                    ? "Your inbox is empty. Try syncing to fetch new emails."
                    : `No emails in ${selectedCategory}. Try switching to a different category.`
                  }
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={handleSync} 
                    disabled={syncLoading}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <motion.div
                      animate={syncLoading ? { rotate: 360 } : {}}
                      transition={{ duration: 1, repeat: syncLoading ? Infinity : 0, ease: "linear" }}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                    </motion.div>
                    {syncLoading ? "Syncing..." : "Sync Emails"}
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div 
                className="space-y-3 sm:space-y-4"
                layout
              >
                {filteredEmails.map((email, index) => (
                  <motion.div
                    key={email.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ 
                      duration: 0.4,
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ 
                      y: -2,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <Suspense fallback={<Skeleton className="h-32 w-full rounded-xl" />}>
                      <LazyEmailCard
                        email={email}
                        onClick={() => handleEmailClick(email.id)}
                      />
                    </Suspense>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}