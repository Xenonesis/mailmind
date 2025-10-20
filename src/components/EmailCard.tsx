"use client";

import { Email } from "@/types/email";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Paperclip, Clock, Mail, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEmailStore } from "@/store/useEmailStore";
import { memo, useMemo } from "react";

interface EmailCardProps {
  email: Email;
  onClick?: () => void;
}

export const EmailCard = memo(function EmailCard({ email, onClick }: EmailCardProps) {
  const { toggleEmailStar, markEmailAsRead } = useEmailStore();

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleEmailStar(email.id);
  };

  const handleCardClick = () => {
    if (!email.isRead) {
      markEmailAsRead(email.id);
    }
    onClick?.();
  };

  const getPriorityColor = useMemo(() => (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-gradient-to-r from-red-500/10 to-pink-500/10 text-red-700 dark:text-red-400 border-red-200/50 dark:border-red-800/50";
      case "medium":
        return "bg-gradient-to-r from-yellow-500/10 to-orange-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200/50 dark:border-yellow-800/50";
      case "low":
        return "bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-700 dark:text-green-400 border-green-200/50 dark:border-green-800/50";
      default:
        return "bg-gradient-to-r from-slate-500/10 to-gray-500/10 text-slate-700 dark:text-slate-400 border-slate-200/50 dark:border-slate-800/50";
    }
  }, []);

  const formatDate = useMemo(() => (date: string) => {
    const emailDate = new Date(date);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - emailDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return emailDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return emailDate.toLocaleDateString([], { weekday: 'short' });
    } else {
      return emailDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  }, []);

  const senderInitials = useMemo(() => 
    email.sender.name.split(" ").map(n => n[0]).join("").toUpperCase(),
    [email.sender.name]
  );

  const cleanedBody = useMemo(() => 
    email.body.replace(/<[^>]*>/g, ""),
    [email.body]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.005,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.995 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={cn(
          "group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/50 dark:hover:shadow-blue-900/20 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:outline-none",
          !email.isRead && "ring-2 ring-blue-500/20 bg-gradient-to-r from-blue-50/80 to-indigo-50/40 dark:from-blue-950/40 dark:to-indigo-950/20",
          email.isRead && "hover:bg-slate-50/80 dark:hover:bg-slate-700/80"
        )}
        onClick={handleCardClick}
        role="article"
        tabIndex={0}
        aria-label={`Email from ${email.sender.name}: ${email.subject}. ${!email.isRead ? 'Unread. ' : ''}${email.isStarred ? 'Starred. ' : ''}Priority: ${email.priority}.`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
          }
        }}
      >
        <CardHeader className="pb-2 sm:pb-3">
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            {/* Left Section - Avatar and Sender Info */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
              <div className="relative shrink-0">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10 ring-2 ring-white dark:ring-slate-700 shadow-sm">
                  <AvatarFallback 
                    className={cn(
                      "text-xs sm:text-sm font-medium",
                      !email.isRead 
                        ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white" 
                        : "bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 text-slate-700 dark:text-slate-300"
                    )}
                    aria-label={`Avatar for ${email.sender.name}`}
                  >
                    {senderInitials}
                  </AvatarFallback>
                </Avatar>
                {!email.isRead && (
                  <div 
                    className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 rounded-full border-2 border-white dark:border-slate-800"
                    aria-label="Unread indicator"
                  />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                  <p className={cn(
                    "text-xs sm:text-sm truncate transition-colors",
                    !email.isRead 
                      ? "font-semibold text-slate-900 dark:text-slate-100" 
                      : "font-medium text-slate-700 dark:text-slate-300"
                  )}>
                    {email.sender.name}
                  </p>
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "text-xs px-1.5 py-0.5 font-medium border-0 shadow-sm shrink-0 hidden sm:inline-flex",
                      getPriorityColor(email.priority)
                    )}
                    aria-label={`Priority: ${email.priority}`}
                  >
                    {email.priority.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {email.sender.email}
                </p>
              </div>
            </div>
            
            {/* Right Section - Actions and Meta */}
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-2 shrink-0">
              {/* Mobile Priority Badge */}
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-xs px-1.5 py-0.5 font-medium border-0 shadow-sm sm:hidden",
                  getPriorityColor(email.priority)
                )}
                aria-label={`Priority: ${email.priority}`}
              >
                {email.priority.charAt(0).toUpperCase()}
              </Badge>
              
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Attachments */}
                {email.attachments && email.attachments.length > 0 && (
                  <div 
                    className="flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 bg-slate-100 dark:bg-slate-700 rounded-full"
                    aria-label={`${email.attachments.length} attachment${email.attachments.length > 1 ? 's' : ''}`}
                  >
                    <Paperclip className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-slate-600 dark:text-slate-400" />
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      {email.attachments.length}
                    </span>
                  </div>
                )}
                
                {/* Star Button */}
                <motion.button
                  onClick={handleStarClick}
                  className="p-1 sm:p-1.5 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-full transition-colors group/star focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={email.isStarred ? "Remove from starred" : "Add to starred"}
                  tabIndex={0}
                >
                  <Star
                    className={cn(
                      "h-3 w-3 sm:h-4 sm:w-4 transition-all duration-200",
                      email.isStarred
                        ? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
                        : "text-slate-400 dark:text-slate-500 group-hover/star:text-yellow-400"
                    )}
                  />
                </motion.button>
              </div>
              
              {/* Date/Time */}
              <div 
                className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400"
                aria-label={`Received ${formatDate(email.date)}`}
              >
                <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span className="font-medium text-xs">
                  {formatDate(email.date)}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 pb-3 sm:pb-4">
          <div className="space-y-2 sm:space-y-3">
            {/* Subject */}
            <h3 className={cn(
              "text-sm leading-relaxed transition-colors line-clamp-1 sm:line-clamp-none",
              !email.isRead 
                ? "font-semibold text-slate-900 dark:text-slate-100" 
                : "font-medium text-slate-700 dark:text-slate-300"
            )}>
              {email.subject}
            </h3>
            
            {/* AI Summary */}
            {email.aiSummary && (
              <motion.div 
                className="relative bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-2 sm:p-3 rounded-lg border border-blue-200/50 dark:border-blue-800/30"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                role="region"
                aria-label="AI-generated summary"
              >
                <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                  <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-blue-600 dark:text-blue-400" />
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                    AI Summary
                  </p>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed line-clamp-2">
                  {email.aiSummary}
                </p>
              </motion.div>
            )}
            
            {/* Email Body Preview */}
            <p 
              className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2"
              aria-label="Email preview"
            >
              {cleanedBody}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});