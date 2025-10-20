"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmailStore } from "@/store/useEmailStore";
import { ArrowLeft, Star, Trash2, RefreshCw, Paperclip, Calendar, User } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { Email } from "@/types/email";

export default function EmailDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { emails, toggleEmailStar } = useEmailStore();
  const [email, setEmail] = useState<Email | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);

  const emailId = params.emailId as string;

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }

    // First try to find email in store
    const foundEmail = emails.find(e => e.id === emailId);
    if (foundEmail) {
      setEmail(foundEmail);
      setIsLoading(false);
    } else {
      fetchEmail();
    }
  }, [emailId, emails, session]);

  const fetchEmail = async () => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get(`/emails/${emailId}`);
      setEmail(response.data);
    } catch (error) {
      console.error("Failed to fetch email:", error);
      // Set mock email for demo
      setMockEmail();
    } finally {
      setIsLoading(false);
    }
  };

  const setMockEmail = () => {
    const mockEmail: Email = {
      id: emailId,
      subject: "Welcome to MailMind - Your AI Email Assistant",
      sender: { name: "MailMind Team", email: "hello@mailmind.com" },
      recipients: [{ email: session?.user?.email || "user@example.com" }],
      body: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #2563eb;">Welcome to MailMind!</h2>
          
          <p>Dear ${session?.user?.name || "User"},</p>
          
          <p>We're thrilled to welcome you to MailMind, the revolutionary AI-powered email management platform that will transform how you handle your inbox.</p>
          
          <h3 style="color: #2563eb;">What makes MailMind special?</h3>
          <ul>
            <li><strong>AI-Powered Summaries:</strong> Get instant, intelligent summaries of your emails</li>
            <li><strong>Smart Categorization:</strong> Automatically organize emails into Work, Personal, Promotions, and more</li>
            <li><strong>Priority Detection:</strong> Never miss important emails with our AI priority system</li>
            <li><strong>Beautiful Interface:</strong> Enjoy a clean, modern design that makes email management a pleasure</li>
          </ul>
          
          <h3 style="color: #2563eb;">Getting Started</h3>
          <p>Your account is now active and ready to use. Here are your next steps:</p>
          <ol>
            <li>Connect your email accounts for seamless synchronization</li>
            <li>Explore the dashboard and familiarize yourself with the categories</li>
            <li>Try the AI summary feature on your existing emails</li>
            <li>Customize your settings to match your preferences</li>
          </ol>
          
          <p>If you have any questions or need assistance, our support team is here to help. Simply reply to this email or visit our help center.</p>
          
          <p>Thank you for choosing MailMind. We're excited to help you achieve inbox zero!</p>
          
          <p>Best regards,<br>
          The MailMind Team</p>
          
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #666;">
            This email was sent to ${session?.user?.email || "user@example.com"}. 
            If you no longer wish to receive these emails, you can unsubscribe at any time.
          </p>
        </div>
      `,
      date: new Date().toISOString(),
      category: "inbox",
      priority: "high",
      isRead: true,
      isStarred: false,
      aiSummary: "Welcome email from MailMind team introducing AI-powered email management features, including smart categorization, priority detection, and getting started instructions.",
    };
    setEmail(mockEmail);
  };

  const handleStarToggle = () => {
    if (email) {
      toggleEmailStar(email.id);
      setEmail({ ...email, isStarred: !email.isStarred });
    }
  };

  const handleDelete = async () => {
    if (!email) return;
    
    try {
      await axiosClient.delete(`/emails/${email.id}`);
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to delete email:", error);
      // For demo, just navigate back
      router.push("/dashboard");
    }
  };

  const handleRegenerateSummary = async () => {
    if (!email) return;
    
    setAiLoading(true);
    try {
      const response = await axiosClient.post(`/ai/summarize`, {
        emailId: email.id,
        content: email.body,
      });
      
      if (response.data?.summary) {
        setEmail({ ...email, aiSummary: response.data.summary });
      }
    } catch (error) {
      console.error("Failed to regenerate summary:", error);
      // Mock AI summary for demo
      const mockSummary = "This is a regenerated AI summary: " + email.aiSummary;
      setEmail({ ...email, aiSummary: mockSummary });
    } finally {
      setAiLoading(false);
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Email not found</h2>
          <p className="text-muted-foreground mb-4">The email you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Inbox
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleStarToggle}
            >
              <Star
                className={`h-4 w-4 ${
                  email.isStarred
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Email Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {email.sender.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">{email.subject}</CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{email.sender.name}</span>
                    <span className="text-sm text-muted-foreground">
                      &lt;{email.sender.email}&gt;
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <Badge className={getPriorityColor(email.priority)}>
                  {email.priority} priority
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(email.date).toLocaleString()}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* AI Summary */}
        {email.aiSummary && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <span className="mr-2">🤖</span>
                  AI Summary
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerateSummary}
                  disabled={aiLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${aiLoading ? "animate-spin" : ""}`} />
                  Regenerate
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                {email.aiSummary}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Email Content */}
        <Card>
          <CardContent className="pt-6">
            <div
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: email.body }}
            />
          </CardContent>
        </Card>

        {/* Attachments */}
        {email.attachments && email.attachments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Paperclip className="mr-2 h-5 w-5" />
                Attachments ({email.attachments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {email.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{attachment.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(attachment.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}