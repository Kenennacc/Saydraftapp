"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { 
  HomeIcon, 
  ArrowLeftIcon, 
  SearchIcon, 
  FileTextIcon
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotFound() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* 404 Animation/Illustration */}
        <div className="mb-8">
          <div className="relative">
            {/* Animated 404 */}
            <div className="text-9xl font-bold text-primary/20 mb-4 animate-pulse">
              404
            </div>
            
            {/* Floating elements */}
            <div className="absolute top-0 left-1/4 w-4 h-4 bg-primary/30 rounded-full animate-bounce delay-100"></div>
            <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-secondary/30 rounded-full animate-bounce delay-300"></div>
            <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-warning/30 rounded-full animate-bounce delay-500"></div>
            <div className="absolute bottom-0 right-1/3 w-5 h-5 bg-success/30 rounded-full animate-bounce delay-700"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-xl text-foreground/70 mb-6 max-w-2xl mx-auto">
            The page you're looking for seems to have vanished into the digital void. 
            Don't worry, even the best contracts sometimes get lost in translation!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            color="primary"
            size="lg"
            startContent={<ArrowLeftIcon className="w-5 h-5" />}
            onPress={() => router.back()}
            className="font-semibold"
          >
            Go Back
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
            as={Link}
            href="/chat"
            variant="bordered"
            size="lg"
            startContent={<FileTextIcon className="w-5 h-5" />}
            className="font-semibold"
          >
            Start Chat
          </Button>
        </div>


        {/* Search Suggestion */}
        <Card className="max-w-md mx-auto">
          <CardBody className="text-center p-6">
            <SearchIcon className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">
              Looking for something specific?
            </h3>
            <p className="text-sm text-foreground/70 mb-4">
              Try searching for what you need or check our navigation menu.
            </p>
            <Button
              as={Link}
              href="/"
              color="primary"
              variant="light"
              size="sm"
            >
              Explore SayDraft
            </Button>
          </CardBody>
        </Card>

        {/* Fun Message */}
        <div className="mt-12 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl border border-divider">
          <p className="text-foreground/80 italic">
            "Even the best voice contracts need the right address to be heard. 
            Let's get you back on track! 🎤"
          </p>
        </div>
      </div>
    </div>
  );
}
