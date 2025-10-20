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
import { Separator } from "@/components/ui/separator";
import { useEmailStore } from "@/store/useEmailStore";
import { 
  ArrowLeft, 
  Star, 
  Trash2, 
  RefreshCw, 
  Paperclip, 
  Calendar, 
  User, 
  Reply, 
  ReplyAll, 
  Forward, 
  Download,
  Clock,
  Sparkles,
  Eye,
  Archive
} from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { Email } from "@/types/email";
import { motion, AnimatePresence } from "framer-motion";

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
        return "bg-gradient-to-r from-red-500/10 to-red-600/10 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800";
      case "medium":
        return "bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      case "low":
        return "bg-gradient-to-r from-green-500/10 to-green-600/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800";
      default:
        return "bg-gradient-to-r from-gray-500/10 to-gray-600/10 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-16 lg:pl-72">
        <motion.div 
          className="max-w-5xl mx-auto p-6 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-4 mb-6">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-32 w-full" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-16 lg:pl-72">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Eye className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Email not found</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              The email you're looking for doesn't exist or may have been deleted.
            </p>
          </div>
          <Button onClick={() => router.push("/dashboard")} size="lg">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-background pt-16 lg:pl-72"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Enhanced Header */}
      <motion.div 
        className="border-b bg-card/95 backdrop-blur-sm sticky top-16 z-40"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="max-w-5xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="ghost"
                onClick={() => router.push("/dashboard")}
                className="flex items-center hover:bg-muted/50"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Inbox
              </Button>
            </motion.div>
            
            <div className="flex items-center space-x-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="sm">
                  <Reply className="h-4 w-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="sm">
                  <ReplyAll className="h-4 w-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="sm">
                  <Forward className="h-4 w-4" />
                </Button>
              </motion.div>
              <Separator orientation="vertical" className="h-6" />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="sm">
                  <Archive className="h-4 w-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleStarToggle}
                  className="relative"
                >
                  <Star
                    className={`h-4 w-4 transition-colors ${
                      email.isStarred
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground hover:text-yellow-400"
                    }`}
                  />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Enhanced Email Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Avatar className="h-14 w-14 ring-2 ring-primary/20 shadow-md">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-lg">
                        {email.sender.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-2xl font-bold mb-3 leading-tight">
                      {email.subject}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{email.sender.name}</span>
                        <span className="text-muted-foreground">
                          &lt;{email.sender.email}&gt;
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(email.date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-3">
                  <Badge className={`${getPriorityColor(email.priority)} border font-medium px-3 py-1`}>
                    {email.priority} priority
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    {new Date(email.date).toLocaleString()}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Enhanced AI Summary */}
        {email.aiSummary && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                    </motion.div>
                    AI Summary
                  </CardTitle>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRegenerateSummary}
                      disabled={aiLoading}
                      className="bg-white/50 hover:bg-white/80 dark:bg-gray-800/50 dark:hover:bg-gray-800/80"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${aiLoading ? "animate-spin" : ""}`} />
                      Regenerate
                    </Button>
                  </motion.div>
                </div>
              </CardHeader>
              <CardContent>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-lg" />
                  <p className="relative text-blue-800 dark:text-blue-200 bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg border border-blue-200/50 dark:border-blue-800/50 leading-relaxed">
                    {email.aiSummary}
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Enhanced Email Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-8">
              <div
                className="prose dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-lg leading-relaxed"
                dangerouslySetInnerHTML={{ __html: email.body }}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Attachments */}
        {email.attachments && email.attachments.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Paperclip className="mr-2 h-5 w-5 text-primary" />
                  Attachments ({email.attachments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {email.attachments.map((attachment, index) => (
                    <motion.div
                      key={attachment.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Paperclip className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{attachment.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(attachment.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button variant="outline" size="sm" className="flex items-center">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}