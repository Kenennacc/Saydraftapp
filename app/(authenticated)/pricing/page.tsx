"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Badge } from "@heroui/badge";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { 
  CheckIcon, 
  CrownIcon, 
  ZapIcon, 
  SparklesIcon, 
  ShieldCheckIcon,
  ClockIcon,
  TrendingUpIcon,
  UsersIcon,
  XIcon
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { createCheckoutSession } from "@/services/subscription";
import { addToast } from "@heroui/toast";
import { useRouter } from "next/navigation";
import NonAdminGuard from "@/components/NonAdminGuard";
import useSubscription from "@/hooks/useSubscription";
import { useUserInContext } from "@/providers/User";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out SayDraft",
    tagline: "Get started with basics",
    features: [
      { text: "1 contract chat per day", icon: CheckIcon },
      { text: "Basic contract templates", icon: CheckIcon },
      { text: "Standard AI assistance", icon: CheckIcon },
      { text: "Community support", icon: CheckIcon },
    ],
    limitations: [
      { text: "No advanced features", icon: XIcon },
      { text: "Daily usage limits", icon: XIcon },
    ],
    buttonText: "Current Plan",
    buttonVariant: "bordered" as const,
    popular: false,
    gradient: "from-gray-400 to-gray-600",
  },
  {
    name: "Pro",
    price: "$6.99",
    period: "per month",
    description: "For professionals who need unlimited contracts",
    tagline: "Everything you need to succeed",
    features: [
      { text: "Unlimited contract chats", icon: CheckIcon },
      { text: "Advanced AI features", icon: SparklesIcon },
      { text: "Priority support 24/7", icon: ShieldCheckIcon },
      { text: "Custom templates", icon: CheckIcon },
      { text: "Team collaboration", icon: UsersIcon },
      { text: "Advanced analytics", icon: TrendingUpIcon },
      { text: "Export to multiple formats", icon: CheckIcon },
      { text: "API access", icon: CheckIcon },
    ],
    limitations: [],
    buttonText: "Start 7-Day Free Trial",
    buttonVariant: "solid" as const,
    popular: true,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || 'price_test_fallback',
    gradient: "from-primary to-secondary",
    savings: "Save $83.88/year",
  },
];

export default function PricingPage() {
  const router = useRouter();
  const { data: subscriptionData, isLoading: subscriptionLoading } = useSubscription();
  const user = useUserInContext();

  const checkoutMutation = useMutation({
    mutationFn: createCheckoutSession,
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (error: any) => {
      console.error('Checkout session error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to start checkout. Please try again.";
      addToast({
        description: errorMessage,
        color: "danger",
      });
    },
  });

  const currentPlan = subscriptionData?.subscription?.plan || 'free';
  const isFreePlan = currentPlan === 'free';
  const isPaidPlan = currentPlan === 'paid';

  const handleUpgrade = (priceId: string) => {
    if (!priceId) {
      addToast({
        description: "Stripe price ID is not configured. Please contact support.",
        color: "danger",
      });
      return;
    }

    // Ensure we have a valid origin
    const origin = window.location.origin || 'http://localhost:3000';
    const successUrl = `${origin}/chat?success=true`;
    const cancelUrl = `${origin}/pricing?canceled=true`;
    
    console.log('Creating checkout session with URLs:', { 
      successUrl, 
      cancelUrl, 
      priceId,
      origin: window.location.origin,
      href: window.location.href
    });
    
    // Validate URLs before sending
    if (!successUrl.startsWith('http://') && !successUrl.startsWith('https://')) {
      addToast({
        description: "Invalid URL format. Please refresh the page and try again.",
        color: "danger",
      });
      return;
    }
    
    checkoutMutation.mutate({
      priceId,
      successUrl,
      cancelUrl,
    });
  };

  const getButtonText = (plan: typeof plans[0]) => {
    if (user?.isAdmin) return "Admin Access";
    if (plan.name === "Pro") {
      if (isPaidPlan) return "Current Plan";
      return "Start 7-Day Free Trial";
    }
    if (plan.name === "Free") {
      if (isFreePlan) return "Current Plan";
      return "Downgrade to Free";
    }
    return plan.buttonText;
  };

  const isButtonDisabled = (plan: typeof plans[0]) => {
    if (user?.isAdmin) return true;
    if (plan.name === "Pro" && isPaidPlan) return true;
    if (plan.name === "Free" && isFreePlan) return true;
    return false;
  };

  return (
    <NonAdminGuard>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative">
            <div className="text-center mb-12">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                <SparklesIcon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">7-Day Free Trial</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Choose Your{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Perfect Plan
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-foreground/70 max-w-3xl mx-auto mb-4">
                Start with a 7-day free trial. No credit card required. Cancel anytime.
              </p>

              {/* Current Plan Badge */}
              {!subscriptionLoading && (
                <div className="flex justify-center gap-2 items-center text-sm text-foreground/60">
                  <span>Currently on:</span>
                  <Chip 
                    color={isPaidPlan ? "primary" : "default"} 
                    size="sm"
                    startContent={isPaidPlan ? <CrownIcon className="w-3 h-3" /> : undefined}
                  >
                    {isPaidPlan ? "Pro Plan" : "Free Plan"}
                  </Chip>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => {
              const isCurrentPlan = (plan.name === "Pro" && isPaidPlan) || (plan.name === "Free" && isFreePlan);
              
              return (
                <Card
                  key={plan.name}
                  className={`relative transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                    plan.popular
                      ? "border-2 border-primary shadow-2xl md:scale-105 z-10"
                      : "border border-divider hover:border-primary/50"
                  } ${isCurrentPlan ? "ring-2 ring-success/30" : ""}`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className={`px-6 py-1.5 rounded-full bg-gradient-to-r ${plan.gradient} text-white text-sm font-semibold shadow-lg`}>
                        ⭐ Most Popular
                      </div>
                    </div>
                  )}

                  {/* Current Plan Badge */}
                  {isCurrentPlan && (
                    <div className="absolute -top-4 right-4">
                      <Chip color="success" size="sm" startContent={<CheckIcon className="w-3 h-3" />}>
                        Active
                      </Chip>
                    </div>
                  )}
                  
                  <CardHeader className="pb-6 pt-8">
                    <div className="text-center w-full">
                      {/* Icon with Gradient */}
                      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-gradient-to-br ${plan.gradient} shadow-lg`}>
                        {plan.popular ? (
                          <CrownIcon className="w-10 h-10 text-white" />
                        ) : (
                          <ZapIcon className="w-10 h-10 text-white opacity-80" />
                        )}
                      </div>
                      
                      {/* Plan Name */}
                      <h3 className="text-3xl font-bold text-foreground mb-2">
                        {plan.name}
                      </h3>
                      
                      {/* Tagline */}
                      <p className="text-sm text-foreground/60 mb-6">{plan.tagline}</p>
                      
                      {/* Price */}
                      <div className="mb-2">
                        <div className="flex items-baseline justify-center gap-2">
                          <span className="text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            {plan.price}
                          </span>
                          <span className="text-foreground/60 text-lg">/{plan.period.replace('per ', '')}</span>
                        </div>
                        
                        {plan.savings && (
                          <p className="text-sm text-success font-medium mt-2">{plan.savings}</p>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-foreground/70 text-sm">{plan.description}</p>
                    </div>
                  </CardHeader>

                  <Divider />

                  <CardBody className="pt-6">
                    {/* Features */}
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                          <li key={index} className="flex items-start gap-3">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              plan.popular ? 'bg-primary/10' : 'bg-success/10'
                            }`}>
                              <Icon className={`w-3 h-3 ${plan.popular ? 'text-primary' : 'text-success'}`} />
                            </div>
                            <span className="text-foreground/80 text-sm leading-relaxed">{feature.text}</span>
                          </li>
                        );
                      })}
                    </ul>

                    {/* Limitations (for free plan) */}
                    {plan.limitations && plan.limitations.length > 0 && (
                      <>
                        <Divider className="my-4" />
                        <ul className="space-y-3 mb-6">
                          {plan.limitations.map((limitation, index) => {
                            const Icon = limitation.icon;
                            return (
                              <li key={index} className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-danger/10">
                                  <Icon className="w-3 h-3 text-danger" />
                                </div>
                                <span className="text-foreground/50 text-sm leading-relaxed">{limitation.text}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </>
                    )}

                    {/* CTA Button */}
                    <Button
                      color={plan.popular ? "primary" : "default"}
                      variant={isCurrentPlan ? "bordered" : "solid"}
                      size="lg"
                      fullWidth
                      isLoading={checkoutMutation.isPending}
                      isDisabled={isButtonDisabled(plan)}
                      className={`font-semibold ${plan.popular && !isCurrentPlan ? 'bg-gradient-to-r from-primary to-secondary text-white' : ''}`}
                      onPress={() => {
                        if (isButtonDisabled(plan)) return;
                        if (plan.priceId) {
                          handleUpgrade(plan.priceId);
                        } else {
                          router.push("/chat");
                        }
                      }}
                      startContent={
                        !checkoutMutation.isPending && plan.popular && !isCurrentPlan ? (
                          <SparklesIcon className="w-4 h-4" />
                        ) : isCurrentPlan ? (
                          <CheckIcon className="w-4 h-4" />
                        ) : undefined
                      }
                    >
                      {checkoutMutation.isPending ? "Processing..." : getButtonText(plan)}
                    </Button>

                    {/* Trial Notice */}
                    {plan.popular && !isCurrentPlan && (
                      <p className="text-xs text-center text-foreground/60 mt-4">
                        <ClockIcon className="w-3 h-3 inline mr-1" />
                        7-day free trial • Cancel anytime
                      </p>
                    )}
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-4xl mx-auto">
            {/* Trust Badges */}
            <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-2xl p-8 mb-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ShieldCheckIcon className="w-6 h-6 text-success" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Secure Payments</p>
                  <p className="text-xs text-foreground/60 mt-1">256-bit SSL</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ClockIcon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-foreground">7-Day Trial</p>
                  <p className="text-xs text-foreground/60 mt-1">No card required</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <SparklesIcon className="w-6 h-6 text-warning" />
                  </div>
                  <p className="text-sm font-medium text-foreground">No Setup Fees</p>
                  <p className="text-xs text-foreground/60 mt-1">Start instantly</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <XIcon className="w-6 h-6 text-danger" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Cancel Anytime</p>
                  <p className="text-xs text-foreground/60 mt-1">No questions</p>
                </div>
              </div>
            </div>

            {/* Feature Comparison */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Compare Features
              </h2>
              <p className="text-foreground/70">
                See what makes Pro worth the upgrade
              </p>
            </div>

            <Card className="overflow-hidden">
              <CardBody className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-foreground/5">
                        <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Feature</th>
                        <th className="text-center py-4 px-6 text-sm font-semibold text-foreground">Free</th>
                        <th className="text-center py-4 px-6 text-sm font-semibold text-primary">Pro</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-divider">
                      <tr className="hover:bg-foreground/5 transition-colors">
                        <td className="py-4 px-6 text-sm text-foreground/80">Contract chats per day</td>
                        <td className="text-center py-4 px-6 text-sm text-foreground/60">1</td>
                        <td className="text-center py-4 px-6 text-sm font-medium text-primary">Unlimited</td>
                      </tr>
                      <tr className="hover:bg-foreground/5 transition-colors">
                        <td className="py-4 px-6 text-sm text-foreground/80">AI Model</td>
                        <td className="text-center py-4 px-6 text-sm text-foreground/60">Basic</td>
                        <td className="text-center py-4 px-6 text-sm font-medium text-primary">Advanced</td>
                      </tr>
                      <tr className="hover:bg-foreground/5 transition-colors">
                        <td className="py-4 px-6 text-sm text-foreground/80">Contract templates</td>
                        <td className="text-center py-4 px-6">
                          <CheckIcon className="w-5 h-5 text-success mx-auto" />
                        </td>
                        <td className="text-center py-4 px-6">
                          <CheckIcon className="w-5 h-5 text-success mx-auto" />
                        </td>
                      </tr>
                      <tr className="hover:bg-foreground/5 transition-colors">
                        <td className="py-4 px-6 text-sm text-foreground/80">Custom templates</td>
                        <td className="text-center py-4 px-6">
                          <XIcon className="w-5 h-5 text-danger/50 mx-auto" />
                        </td>
                        <td className="text-center py-4 px-6">
                          <CheckIcon className="w-5 h-5 text-success mx-auto" />
                        </td>
                      </tr>
                      <tr className="hover:bg-foreground/5 transition-colors">
                        <td className="py-4 px-6 text-sm text-foreground/80">Team collaboration</td>
                        <td className="text-center py-4 px-6">
                          <XIcon className="w-5 h-5 text-danger/50 mx-auto" />
                        </td>
                        <td className="text-center py-4 px-6">
                          <CheckIcon className="w-5 h-5 text-success mx-auto" />
                        </td>
                      </tr>
                      <tr className="hover:bg-foreground/5 transition-colors">
                        <td className="py-4 px-6 text-sm text-foreground/80">Advanced analytics</td>
                        <td className="text-center py-4 px-6">
                          <XIcon className="w-5 h-5 text-danger/50 mx-auto" />
                        </td>
                        <td className="text-center py-4 px-6">
                          <CheckIcon className="w-5 h-5 text-success mx-auto" />
                        </td>
                      </tr>
                      <tr className="hover:bg-foreground/5 transition-colors">
                        <td className="py-4 px-6 text-sm text-foreground/80">Priority support</td>
                        <td className="text-center py-4 px-6">
                          <XIcon className="w-5 h-5 text-danger/50 mx-auto" />
                        </td>
                        <td className="text-center py-4 px-6">
                          <CheckIcon className="w-5 h-5 text-success mx-auto" />
                        </td>
                      </tr>
                      <tr className="hover:bg-foreground/5 transition-colors">
                        <td className="py-4 px-6 text-sm text-foreground/80">API access</td>
                        <td className="text-center py-4 px-6">
                          <XIcon className="w-5 h-5 text-danger/50 mx-auto" />
                        </td>
                        <td className="text-center py-4 px-6">
                          <CheckIcon className="w-5 h-5 text-success mx-auto" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>

            {/* CTA Section */}
            <div className="text-center mt-16 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-2xl p-12">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Ready to supercharge your contract workflow?
              </h3>
              <p className="text-foreground/70 mb-6 max-w-2xl mx-auto">
                Join thousands of professionals who trust SayDraft for their contract needs.
                Start your free 7-day trial today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  color="primary"
                  size="lg"
                  className="font-semibold bg-gradient-to-r from-primary to-secondary"
                  startContent={<SparklesIcon className="w-5 h-5" />}
                  onPress={() => {
                    const proPlan = plans.find(p => p.popular);
                    if (proPlan?.priceId && !isPaidPlan) {
                      handleUpgrade(proPlan.priceId);
                    }
                  }}
                  isDisabled={isPaidPlan}
                >
                  {isPaidPlan ? "You're on Pro" : "Start Free Trial"}
                </Button>
                <Button
                  variant="bordered"
                  size="lg"
                  className="font-semibold"
                  onPress={() => router.push("/subscription")}
                >
                  Manage Subscription
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NonAdminGuard>
  );
}
