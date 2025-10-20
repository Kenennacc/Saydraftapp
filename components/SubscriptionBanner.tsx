"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { useRouter } from "next/navigation";
import { CrownIcon, ZapIcon } from "lucide-react";
import useSubscription from "@/hooks/useSubscription";
import { useUserInContext } from "@/providers/User";

export default function SubscriptionBanner() {
  const { data: subscription, isLoading } = useSubscription();
  const user = useUserInContext();
  const router = useRouter();

  // Don't show subscription banner for admin users
  if (user?.isAdmin) return null;

  if (isLoading || !subscription) return null;

  if (subscription.canCreateChat) return null;

  const isTrialExpired = subscription.subscription?.trialEnd && 
    new Date(subscription.subscription.trialEnd) < new Date();

  return (
    <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
      <CardBody className="flex flex-row items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
            <CrownIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              {isTrialExpired ? 'Trial Expired' : 'Upgrade to Continue'}
            </h3>
            <p className="text-sm text-foreground/70">
              {isTrialExpired 
                ? 'Your free trial has ended. Upgrade to continue creating contracts.'
                : 'You\'ve reached your daily limit. Upgrade for unlimited contracts.'
              }
            </p>
          </div>
        </div>
        <Button
          color="primary"
          size="sm"
          startContent={<ZapIcon className="w-4 h-4" />}
          onPress={() => router.push('/pricing')}
        >
          Upgrade Now
        </Button>
      </CardBody>
    </Card>
  );
}
