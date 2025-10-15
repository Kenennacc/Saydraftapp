"use client";

import { Component, ReactNode } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { AlertTriangleIcon, RefreshCwIcon, HomeIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId?: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorId: `BOUNDARY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log error to monitoring service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    // You can also log the error to an error reporting service here
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorId: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

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
                We encountered an unexpected error. This has been reported to our team.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                color="primary"
                size="lg"
                startContent={<RefreshCwIcon className="w-5 h-5" />}
                onPress={this.handleReset}
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
            </div>

            {/* Error ID for Support */}
            {this.state.errorId && (
              <div className="mt-8 p-4 bg-background/50 rounded-lg border border-divider">
                <p className="text-sm text-foreground/60">
                  Error ID: <span className="font-mono text-primary">{this.state.errorId}</span>
                </p>
                <p className="text-xs text-foreground/50 mt-1">
                  Please include this ID when contacting support
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
