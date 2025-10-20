import client from './client';

export type SubscriptionStatus = {
  subscription: {
    id: string;
    status: string;
    plan: string;
    trialEnd?: string;
    currentPeriodEnd?: string;
  } | null;
  canCreateChat: boolean;
};

export type CreateCheckoutSession = {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
};

export type CreatePortalSession = {
  returnUrl: string;
};

export const getSubscriptionStatus = async (): Promise<SubscriptionStatus> => {
  const response = await client.get('/subscription/status');
  return response.data;
};

export const createCheckoutSession = async (data: CreateCheckoutSession) => {
  const response = await client.post('/subscription/create-checkout-session', data);
  return response.data;
};

export const createPortalSession = async (data: CreatePortalSession) => {
  const response = await client.post('/subscription/create-portal-session', data);
  return response.data;
};
