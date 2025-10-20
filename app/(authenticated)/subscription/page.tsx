"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { ArrowLeftIcon, CreditCardIcon, SettingsIcon, CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import SubscriptionManagement from "@/components/SubscriptionManagement";
import NonAdminGuard from "@/components/NonAdminGuard";
import useSubscription from "@/hooks/useSubscription";
import { useUserInContext } from "@/providers/User";

export default function SubscriptionPage() {
  const router = useRouter();
  const { data: subscriptionData, isLoading } = useSubscription();
  const user = useUserInContext();

  return (
    <NonAdminGuard>
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="light"
            isIconOnly
            onPress={() => router.back()}
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <CreditCardIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Subscription Management
              </h1>
              <p className="text-foreground/70">
                Manage your subscription and billing
              </p>
            </div>
          </div>
        </div>

        {/* Subscription Management */}
        <div className="mb-8">
          <SubscriptionManagement />
        </div>

        {/* Additional Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <SettingsIcon className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  {user?.isAdmin ? "Admin Information" : "Billing Information"}
                </h3>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="space-y-3">
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : user?.isAdmin ? (
                <>
                  <div>
                    <p className="text-sm text-foreground/70">Role</p>
                    <p className="text-sm text-foreground font-medium">
                      Administrator
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/70">Access Level</p>
                    <p className="text-sm text-foreground">
                      Full system access with unlimited features
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/70">Billing</p>
                    <p className="text-sm text-foreground">
                      Not applicable for admin accounts
                    </p>
                  </div>
                </>
              ) : subscriptionData?.subscription?.plan === "paid" ? (
                <>
                  <div>
                    <p className="text-sm text-foreground/70">Payment Method</p>
                    <p className="text-sm text-foreground">
                      Manage your payment methods in the customer portal
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/70">Billing History</p>
                    <p className="text-sm text-foreground">
                      View and download your invoices
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/70">Subscription Status</p>
                    <p className="text-sm text-foreground font-medium">
                      {subscriptionData?.subscription?.status === "trialing" ? "Free Trial Active" : 
                       subscriptionData?.subscription?.status === "active" ? "Active" : 
                       subscriptionData?.subscription?.status?.toUpperCase()}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-foreground/70">Current Plan</p>
                    <p className="text-sm text-foreground">
                      Free plan with daily limits
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/70">Upgrade Benefits</p>
                    <p className="text-sm text-foreground">
                      Get unlimited chats and advanced features
                    </p>
                  </div>
                  <div className="pt-2">
                    <Button
                      color="primary"
                      size="sm"
                      onPress={() => router.push("/pricing")}
                      className="w-full"
                    >
                      Upgrade to Pro
                    </Button>
                  </div>
                </>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <CreditCardIcon className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  Plan Details
                </h3>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="space-y-3">
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-foreground/70">Current Plan</p>
                    <p className="text-sm font-medium text-foreground">
                      {user?.isAdmin ? (
                        "Admin - Unlimited Access"
                      ) : subscriptionData?.subscription?.plan === "paid" ? (
                        "Pro Plan - $6.99/month"
                      ) : (
                        "Free Plan - 1 chat per day"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/70">Features</p>
                    <div className="text-sm text-foreground space-y-1 mt-2">
                      {user?.isAdmin ? (
                        <>
                          <div className="flex items-center gap-2">
                            <CheckIcon className="w-3 h-3 text-primary" />
                            <span>Unlimited everything</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckIcon className="w-3 h-3 text-primary" />
                            <span>Full admin access</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckIcon className="w-3 h-3 text-primary" />
                            <span>All premium features</span>
                          </div>
                        </>
                      ) : subscriptionData?.subscription?.plan === "paid" ? (
                        <>
                          <div className="flex items-center gap-2">
                            <CheckIcon className="w-3 h-3 text-primary" />
                            <span>Unlimited contract chats</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckIcon className="w-3 h-3 text-primary" />
                            <span>Advanced AI features</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckIcon className="w-3 h-3 text-primary" />
                            <span>Priority support</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <CheckIcon className="w-3 h-3 text-foreground/50" />
                            <span>1 contract chat per day</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckIcon className="w-3 h-3 text-foreground/50" />
                            <span>Basic AI features</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckIcon className="w-3 h-3 text-foreground/50" />
                            <span>Community support</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  {subscriptionData?.subscription?.plan === "paid" && subscriptionData?.subscription?.currentPeriodEnd && (
                    <div>
                      <p className="text-sm text-foreground/70">Next Billing</p>
                      <p className="text-sm text-foreground">
                        {new Date(subscriptionData.subscription.currentPeriodEnd).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                  {subscriptionData?.subscription?.plan === "free" && (
                    <div>
                      <p className="text-sm text-foreground/70">Usage Today</p>
                      <p className="text-sm text-foreground">
                        {subscriptionData?.canCreateChat ? "0/1 chats used" : "1/1 chats used"}
                      </p>
                    </div>
                  )}
                  {subscriptionData?.subscription?.status === "trialing" && subscriptionData?.subscription?.trialEnd && (
                    <div className="bg-warning/10 rounded-lg p-3 border border-warning/20">
                      <p className="text-sm text-warning font-medium">
                        Trial ends on {new Date(subscriptionData.subscription.trialEnd).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Help Section */}
        <Card className="mt-6">
          <CardBody className="text-center py-8">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Need Help?
            </h3>
            <p className="text-foreground/70 mb-4">
              If you have any questions about your subscription or billing, 
              please contact our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="bordered"
                onPress={() => router.push("/pricing")}
              >
                View All Plans
              </Button>
              <Button
                color="primary"
                onPress={() => window.open("mailto:support@saydraft.com", "_blank")}
              >
                Contact Support
              </Button>
            </div>
          </CardBody>
        </Card>
        </div>
      </div>
    </NonAdminGuard>
  );
}
