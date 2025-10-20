"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { useMutation } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";
import { CalendarIcon, CreditCardIcon, SettingsIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPortalSession } from "@/services/subscription";
import useSubscription from "@/hooks/useSubscription";
import { useUserInContext } from "@/providers/User";

export default function SubscriptionManagement() {
  const { data: subscription, isLoading } = useSubscription();
  const user = useUserInContext();
  const router = useRouter();

  const portalMutation = useMutation({
    mutationFn: createPortalSession,
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (error) => {
      addToast({
        description: "Failed to open subscription management. Please try again.",
        color: "danger",
      });
      console.error(error);
    },
  });

  const handleManageSubscription = () => {
    portalMutation.mutate({
      returnUrl: `${window.location.origin}/chat`,
    });
  };

  // Admin users don't need subscription management
  if (user?.isAdmin) {
    return (
      <Card className="w-full">
        <CardBody className="text-center p-8">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCardIcon className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Admin Access
          </h3>
          <p className="text-foreground/70">
            You have unlimited access to all features as an admin user.
            Subscription management is not applicable.
          </p>
        </CardBody>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardBody className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardBody>
      </Card>
    );
  }

  // Handle free plan users
  if (!subscription?.subscription || subscription.subscription.plan === "free") {
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-foreground/10 rounded-full flex items-center justify-center">
              <CreditCardIcon className="w-5 h-5 text-foreground/70" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Free Plan
              </h3>
              <p className="text-sm text-foreground/70">$0/month</p>
            </div>
          </div>
          <Chip color="default" size="sm">
            Active
          </Chip>
        </CardHeader>

        <Divider />

        <CardBody className="space-y-4">
          <div className="bg-foreground/5 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2">Current Plan Includes</h4>
            <ul className="space-y-1 text-sm text-foreground/70">
              <li>• 1 contract chat per day</li>
              <li>• Basic AI features</li>
              <li>• Community support</li>
            </ul>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2">Daily Usage</h4>
            <div className="flex items-center justify-between">
              <p className="text-sm text-foreground/70">Today's chats</p>
              <p className="text-sm font-medium text-foreground">
                {subscription?.canCreateChat ? "0/1 used" : "1/1 used"}
              </p>
            </div>
            {!subscription?.canCreateChat && (
              <p className="text-xs text-foreground/60 mt-2">
                Resets at midnight UTC. Upgrade for unlimited access.
              </p>
            )}
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 border border-primary/20">
            <h4 className="font-semibold text-foreground mb-2">Upgrade to Pro</h4>
            <ul className="space-y-1 text-sm text-foreground/70 mb-3">
              <li>✨ Unlimited contract chats</li>
              <li>✨ Advanced AI features</li>
              <li>✨ Priority support</li>
              <li>✨ Custom templates</li>
              <li>✨ Team collaboration</li>
            </ul>
            <Button
              color="primary"
              onPress={() => router.push("/pricing")}
              className="w-full"
            >
              Upgrade to Pro - $6.99/month
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  const sub = subscription.subscription;
  const isTrial = sub.status === "trialing";
  const isActive = sub.status === "active";
  const isCanceled = sub.status === "canceled";
  const isPaid = sub.plan === "paid";

  const getStatusColor = () => {
    if (isTrial) return "warning";
    if (isActive) return "success";
    if (isCanceled) return "danger";
    return "default";
  };

  const getStatusText = () => {
    if (isTrial) return "Trial";
    if (isActive) return "Active";
    if (isCanceled) return "Canceled";
    return sub.status.charAt(0).toUpperCase() + sub.status.slice(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPlanName = () => {
    if (isPaid) return "Pro Plan";
    return sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1) + " Plan";
  };

  const getPlanPrice = () => {
    if (isPaid) return "$6.99/month";
    return "$0/month";
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isPaid ? 'bg-primary/20' : 'bg-foreground/10'
          }`}>
            <CreditCardIcon className={`w-5 h-5 ${
              isPaid ? 'text-primary' : 'text-foreground/70'
            }`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {getPlanName()}
            </h3>
            <p className="text-sm text-foreground/70">{getPlanPrice()}</p>
          </div>
        </div>
        <Chip color={getStatusColor()} size="sm">
          {getStatusText()}
        </Chip>
      </CardHeader>

      <Divider />

      <CardBody className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-foreground/70" />
            <div>
              <p className="text-sm text-foreground/70">Current Period</p>
              <p className="text-sm font-medium text-foreground">
                {sub.currentPeriodEnd ? formatDate(sub.currentPeriodEnd) : "N/A"}
              </p>
            </div>
          </div>
          
          {isTrial && sub.trialEnd && (
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-warning" />
              <div>
                <p className="text-sm text-foreground/70">Trial Ends</p>
                <p className="text-sm font-medium text-warning">
                  {formatDate(sub.trialEnd)}
                </p>
              </div>
            </div>
          )}
        </div>

        {isTrial && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <h4 className="font-medium text-warning mb-2">🎉 Free Trial Active</h4>
            <p className="text-sm text-foreground/70 mb-2">
              You're enjoying all Pro features for free until{" "}
              {sub.trialEnd && formatDate(sub.trialEnd)}.
            </p>
            <p className="text-xs text-foreground/60">
              Your card will be charged $6.99/month after the trial ends. Cancel anytime before then.
            </p>
          </div>
        )}

        <div className="bg-foreground/5 rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-2">Plan Benefits</h4>
          <ul className="space-y-1 text-sm text-foreground/70">
            <li>• Unlimited contract chats</li>
            <li>• Advanced AI features</li>
            <li>• Priority support</li>
            <li>• Custom templates</li>
            <li>• Team collaboration</li>
          </ul>
        </div>

        <div className="flex gap-2">
          <Button
            color="primary"
            variant="bordered"
            startContent={<SettingsIcon className="w-4 h-4" />}
            onPress={handleManageSubscription}
            isLoading={portalMutation.isPending}
            className="flex-1"
          >
            Manage Subscription
          </Button>
        </div>

        {isCanceled && (
          <div className="bg-danger/10 border border-danger/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <XIcon className="w-4 h-4 text-danger mt-0.5" />
              <div>
                <p className="text-sm font-medium text-danger mb-1">
                  Subscription Canceled
                </p>
                <p className="text-sm text-danger/80">
                  You'll continue to have Pro access until{" "}
                  {sub.currentPeriodEnd && formatDate(sub.currentPeriodEnd)}.
                  After that, you'll be moved to the Free plan.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
