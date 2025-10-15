"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { 
  AlertTriangleIcon, 
  RefreshCwIcon, 
  HomeIcon, 
  ArrowLeftIcon,
  BugIcon,
  MailIcon
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [errorId, setErrorId] = useState<string>("");

  useEffect(() => {
    setMounted(true);
    // Generate a unique error ID for tracking
    setErrorId(`ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    
    // Log the error to an error reporting service
    console.error("Application Error:", {
      message: error.message,
      stack: error.stack,
      errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  }, [error, errorId]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleReportError = () => {
    const errorReport = {
      errorId,
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };

    // Create mailto link with error details
    const subject = `SayDraft Error Report - ${errorId}`;
    const body = `Error Details:\n\n${JSON.stringify(errorReport, null, 2)}`;
    const mailtoLink = `mailto:support@saydraft.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.open(mailtoLink);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-danger/10 rounded-full flex items-center justify-center">
            <AlertTriangleIcon className="w-12 h-12 text-danger" />
          </div>
          <div className="text-6xl font-bold text-danger/20 mb-4">
            Oops!
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Something Went Wrong
          </h1>
          <p className="text-lg text-foreground/70 mb-6">
            We encountered an unexpected error. Don't worry, our team has been notified 
            and we're working to fix it.
          </p>
          
          {/* Error Details (Development only) */}
          {process.env.NODE_ENV === 'development' && (
            <Card className="mb-6 text-left">
              <CardBody className="p-4">
                <h3 className="font-semibold text-foreground mb-2">Error Details:</h3>
                <pre className="text-sm text-foreground/70 bg-background/50 p-3 rounded overflow-auto">
                  {error.message}
                </pre>
                <p className="text-xs text-foreground/50 mt-2">
                  Error ID: {errorId}
                </p>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button
            color="primary"
            size="lg"
            startContent={<RefreshCwIcon className="w-5 h-5" />}
            onPress={reset}
            className="font-semibold"
          >
            Try Again
          </Button>
          <Button
            as={Link}
            href="/"
            color="secondary"
            size="lg"
            startContent={<HomeIcon className="w-5 h-5" />}
            className="font-semibold"
          >
            Go Home
          </Button>
          <Button
            variant="light"
            size="lg"
            startContent={<ArrowLeftIcon className="w-5 h-5" />}
            onPress={() => window.history.back()}
            className="font-semibold"
          >
            Go Back
          </Button>
        </div>

        {/* Error Reporting */}
        <Card className="max-w-md mx-auto">
          <CardBody className="text-center p-6">
            <BugIcon className="w-8 h-8 text-warning mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">
              Help Us Fix This
            </h3>
            <p className="text-sm text-foreground/70 mb-4">
              If this error persists, please report it to our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                color="warning"
                variant="light"
                size="sm"
                startContent={<MailIcon className="w-4 h-4" />}
                onPress={handleReportError}
              >
                Report Error
              </Button>
              <Button
                as={Link}
                href="/help"
                variant="bordered"
                size="sm"
              >
                Get Help
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Error ID for Support */}
        <div className="mt-8 p-4 bg-background/50 rounded-lg border border-divider">
          <p className="text-sm text-foreground/60">
            Error ID: <span className="font-mono text-primary">{errorId}</span>
          </p>
          <p className="text-xs text-foreground/50 mt-1">
            Please include this ID when contacting support
          </p>
        </div>
      </div>
    </div>
  );
}
