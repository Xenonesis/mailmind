"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/Topbar";
import { Sidebar } from "@/components/Sidebar";
import { EmailCard } from "@/components/EmailCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useEmailStore } from "@/store/useEmailStore";
import { RefreshCw, Inbox } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { Email } from "@/types/email";

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

  const fetchEmails = async () => {
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
  };

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

  const handleSync = async () => {
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
  };

  const handleEmailClick = (emailId: string) => {
    router.push(`/dashboard/${emailId}`);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Topbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Inbox className="h-6 w-6" />
              <h2 className="text-2xl font-bold capitalize">
                {selectedCategory === "starred" ? "Starred" : selectedCategory}
              </h2>
              <span className="text-muted-foreground">
                ({filteredEmails.length})
              </span>
            </div>
            <Button
              onClick={handleSync}
              disabled={syncLoading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${syncLoading ? "animate-spin" : ""}`} />
              Sync
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ))}
            </div>
          ) : filteredEmails.length === 0 ? (
            <div className="text-center py-12">
              <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No emails found</h3>
              <p className="text-muted-foreground mb-4">
                {selectedCategory === "inbox"
                  ? "Your inbox is empty. Try syncing your emails."
                  : `No emails in ${selectedCategory} category.`}
              </p>
              <Button onClick={handleSync} disabled={syncLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${syncLoading ? "animate-spin" : ""}`} />
                Sync Emails
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEmails.map((email) => (
                <EmailCard
                  key={email.id}
                  email={email}
                  onClick={() => handleEmailClick(email.id)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}