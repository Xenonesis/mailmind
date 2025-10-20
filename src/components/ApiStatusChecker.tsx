"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Wifi, WifiOff } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { motion, AnimatePresence } from "framer-motion";

interface ApiEndpoint {
  name: string;
  endpoint: string;
  method: string;
  requiresAuth: boolean;
}

interface TestResult {
  endpoint: string;
  status: "success" | "error" | "pending";
  statusCode?: number;
  message?: string;
  responseTime?: number;
}

export function ApiStatusChecker() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [apiUrl, setApiUrl] = useState("");

  useEffect(() => {
    setApiUrl(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1");
  }, []);

  const endpoints: ApiEndpoint[] = [
    { name: "Get Emails", endpoint: "/emails", method: "GET", requiresAuth: true },
    { name: "Sync Emails", endpoint: "/emails/sync", method: "GET", requiresAuth: true },
    { name: "Get Categories", endpoint: "/emails/categories", method: "GET", requiresAuth: true },
    { name: "Get User Profile", endpoint: "/user/profile", method: "GET", requiresAuth: true },
    { name: "Get User Settings", endpoint: "/user/settings", method: "GET", requiresAuth: true },
  ];

  const testEndpoint = async (endpoint: ApiEndpoint): Promise<TestResult> => {
    const startTime = Date.now();
    try {
      const response = await axiosClient({
        method: endpoint.method.toLowerCase(),
        url: endpoint.endpoint,
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        endpoint: endpoint.name,
        status: "success",
        statusCode: response.status,
        message: `Success (${response.data?.length || 0} items)`,
        responseTime,
      };
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      
      return {
        endpoint: endpoint.name,
        status: "error",
        statusCode: error.response?.status,
        message: error.response?.data?.message || error.message || "Connection failed",
        responseTime,
      };
    }
  };

  const runTests = async () => {
    setIsTesting(true);
    setResults([]);

    for (const endpoint of endpoints) {
      const result = await testEndpoint(endpoint);
      setResults((prev) => [...prev, result]);
      // Small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    setIsTesting(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (statusCode?: number) => {
    if (!statusCode) return null;
    
    const variant = statusCode >= 200 && statusCode < 300 ? "default" : "destructive";
    return (
      <Badge variant={variant} className="ml-2">
        {statusCode}
      </Badge>
    );
  };

  const overallStatus = results.length > 0 
    ? results.every(r => r.status === "success") 
      ? "online" 
      : results.some(r => r.status === "success")
      ? "partial"
      : "offline"
    : "unknown";

  return (
    <>
      {/* Floating Status Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          title="Check API Status"
        >
          {overallStatus === "online" ? (
            <Wifi className="h-6 w-6" />
          ) : overallStatus === "offline" ? (
            <WifiOff className="h-6 w-6" />
          ) : (
            <AlertCircle className="h-6 w-6" />
          )}
        </Button>
      </motion.div>

      {/* Status Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed bottom-24 right-6 z-50 w-[500px] max-w-[calc(100vw-3rem)]"
            >
              <Card className="shadow-2xl border-slate-200 dark:border-slate-700">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">API Status</CardTitle>
                      <CardDescription className="mt-1">
                        Testing connection to: <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{apiUrl}</code>
                      </CardDescription>
                    </div>
                    <Button
                      onClick={runTests}
                      disabled={isTesting}
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      {isTesting ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Test
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
                  {results.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                      <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Click "Test" to check API endpoints</p>
                    </div>
                  ) : (
                    results.map((result, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                      >
                        <div className="flex items-start space-x-3 flex-1">
                          {getStatusIcon(result.status)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center">
                              <p className="font-medium text-sm text-slate-900 dark:text-slate-100">
                                {result.endpoint}
                              </p>
                              {getStatusBadge(result.statusCode)}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                              {result.message}
                            </p>
                            {result.responseTime && (
                              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                {result.responseTime}ms
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}

                  {results.length > 0 && (
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Overall Status:</span>
                        <Badge
                          variant={overallStatus === "online" ? "default" : "destructive"}
                          className="capitalize"
                        >
                          {overallStatus === "online" ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Connected
                            </>
                          ) : overallStatus === "partial" ? (
                            <>
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Partial
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Disconnected
                            </>
                          )}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        {overallStatus === "offline" && "Using mock data for demo purposes"}
                        {overallStatus === "partial" && "Some endpoints are unavailable"}
                        {overallStatus === "online" && "All endpoints responding normally"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
