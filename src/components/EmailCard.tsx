"use client";

import { Email } from "@/types/email";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEmailStore } from "@/store/useEmailStore";

interface EmailCardProps {
  email: Email;
  onClick: () => void;
}

export function EmailCard({ email, onClick }: EmailCardProps) {
  const { toggleEmailStar, markEmailAsRead } = useEmailStore();

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleEmailStar(email.id);
  };

  const handleCardClick = () => {
    if (!email.isRead) {
      markEmailAsRead(email.id);
    }
    onClick();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          "cursor-pointer transition-all hover:shadow-md",
          !email.isRead && "border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
        )}
        onClick={handleCardClick}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {email.sender.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className={cn(
                    "text-sm truncate",
                    !email.isRead && "font-semibold"
                  )}>
                    {email.sender.name}
                  </p>
                  <Badge variant="secondary" className={getPriorityColor(email.priority)}>
                    {email.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {email.sender.email}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {email.attachments && email.attachments.length > 0 && (
                <Paperclip className="h-4 w-4 text-muted-foreground" />
              )}
              <button
                onClick={handleStarClick}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              >
                <Star
                  className={cn(
                    "h-4 w-4",
                    email.isStarred
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  )}
                />
              </button>
              <span className="text-xs text-muted-foreground">
                {new Date(email.date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <h3 className={cn(
            "text-sm mb-2 truncate",
            !email.isRead && "font-semibold"
          )}>
            {email.subject}
          </h3>
          {email.aiSummary && (
            <div className="bg-blue-50 dark:bg-blue-950/30 p-2 rounded-md mb-2">
              <p className="text-xs text-blue-700 dark:text-blue-300 font-medium mb-1">
                AI Summary
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 line-clamp-2">
                {email.aiSummary}
              </p>
            </div>
          )}
          <p className="text-xs text-muted-foreground line-clamp-2">
            {email.body.replace(/<[^>]*>/g, "")}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}