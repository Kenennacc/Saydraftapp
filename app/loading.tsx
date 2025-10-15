"use client";

import { Spinner } from "@heroui/spinner";
import { Card, CardBody } from "@heroui/card";
import { FileTextIcon, MicIcon, BrainIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Loading() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === "...") return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md mx-auto text-center">
        {/* Loading Animation */}
        <div className="mb-8">
          <div className="relative w-24 h-24 mx-auto mb-6">
            {/* Main Spinner */}
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
            
            {/* Floating Icons */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
              <MicIcon className="w-6 h-6 text-primary animate-bounce" />
            </div>
            <div className="absolute bottom-0 left-0 transform translate-x-2 translate-y-2">
              <FileTextIcon className="w-4 h-4 text-secondary animate-pulse" />
            </div>
            <div className="absolute bottom-0 right-0 transform -translate-x-2 translate-y-2">
              <BrainIcon className="w-4 h-4 text-warning animate-pulse delay-300" />
            </div>
          </div>
        </div>

        {/* Loading Content */}
        <Card className="mb-6">
          <CardBody className="p-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Spinner size="md" color="primary" />
              <h2 className="text-xl font-semibold text-foreground">
                Loading{dots}
              </h2>
            </div>
            <p className="text-foreground/70">
              Preparing your SayDraft experience
            </p>
          </CardBody>
        </Card>

        {/* Fun Message */}
        <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-divider">
          <p className="text-sm text-foreground/80 italic">
            "Great contracts are worth the wait! 🎤"
          </p>
        </div>
      </div>
    </div>
  );
}
