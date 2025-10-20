"use client";

import { EmailCategory } from "@/types/email";
import { useEmailStore } from "@/store/useEmailStore";
import { cn } from "@/lib/utils";
import {
  Inbox,
  Send,
  FileText,
  Shield,
  Briefcase,
  User,
  Tag,
  Star,
} from "lucide-react";

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

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { selectedCategory, setSelectedCategory, emails } = useEmailStore();

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

  return (
    <div className={cn("w-64 bg-card border-r p-4", className)}>
      <div className="space-y-2">
        {Object.entries(categoryIcons).map(([category, Icon]) => {
          const emailCount = getEmailCount(category as EmailCategory);
          const unreadCount = getUnreadCount(category as EmailCategory);
          
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category as EmailCategory)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors",
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5" />
                <span className="font-medium">
                  {categoryLabels[category as EmailCategory]}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {emailCount}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}