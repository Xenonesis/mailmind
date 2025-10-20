"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowLeft, User, Bell, Shield, Palette, Save, LogOut } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { UserSettings } from "@/types/email";

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    theme: "system",
    syncFrequency: 15,
    aiModel: "gpt-3.5-turbo",
    notifications: {
      email: true,
      push: true,
      summary: true,
    },
  });

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }
    fetchSettings();
  }, [session]);

  const fetchSettings = async () => {
    try {
      const response = await axiosClient.get("/user/settings");
      if (response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      await axiosClient.put("/user/settings", settings);
      // Show success message (you could add a toast here)
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    localStorage.removeItem("token");
    router.push("/login");
  };

  const updateSettings = (key: keyof UserSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateNotificationSettings = (key: keyof UserSettings["notifications"], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value }
    }));
  };

  if (!session) {
    return null;
  }

  const displayName = session.user?.name || "User";
  const displayEmail = session.user?.email || "";

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
            Back to Dashboard
          </Button>
          
          <div className="flex items-center space-x-4">
            <Button onClick={saveSettings} disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center">
              <Palette className="mr-2 h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-lg">
                      {displayName.split(" ").map(n => n[0]).join("").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium">{displayName}</h3>
                    <p className="text-muted-foreground">{displayEmail}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <Input
                      value={displayName.split(" ")[0] || ""}
                      placeholder="First name"
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input
                      value={displayName.split(" ")[1] || ""}
                      placeholder="Last name"
                      disabled
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input value={displayEmail} disabled />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Sync Frequency (minutes)</label>
                  <Input
                    type="number"
                    value={settings.syncFrequency}
                    onChange={(e) => updateSettings("syncFrequency", parseInt(e.target.value))}
                    min="5"
                    max="60"
                  />
                  <p className="text-xs text-muted-foreground">
                    How often to sync emails from your providers (5-60 minutes)
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you want to be notified about new emails and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for important messages
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => updateNotificationSettings("email", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Get push notifications on your devices
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.push}
                    onCheckedChange={(checked) => updateNotificationSettings("push", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">AI Summary Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Get notified when AI summaries are generated
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.summary}
                    onCheckedChange={(checked) => updateNotificationSettings("summary", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize the look and feel of your MailMind experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Theme</h4>
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred theme
                    </p>
                  </div>
                  <ThemeToggle />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">AI Model</label>
                  <select
                    className="w-full p-2 border rounded-md bg-background"
                    value={settings.aiModel}
                    onChange={(e) => updateSettings("aiModel", e.target.value)}
                  >
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Fast)</option>
                    <option value="gpt-4">GPT-4 (Advanced)</option>
                    <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Choose the AI model for email summaries and categorization
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security and privacy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Connected Accounts</h4>
                      <p className="text-sm text-muted-foreground">
                        Manage your connected email providers
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Data Export</h4>
                      <p className="text-sm text-muted-foreground">
                        Download a copy of your data
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Export
                    </Button>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-red-600">Sign Out</h4>
                      <p className="text-sm text-muted-foreground">
                        Sign out of your MailMind account
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={handleSignOut}
                      className="flex items-center"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}