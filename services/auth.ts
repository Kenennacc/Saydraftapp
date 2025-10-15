import client from "./client";

export type Register = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

export type Login = Pick<Register, "email" | "password">;

export type VerifyEmail = {
  token: string;
};

export type ForgotPassword = {
  email: string;
};

export type ResetPassword = {
  token: string;
  password: string;
};

export type User = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  timezone: string;
  isVerified: boolean;
 isAdmin: boolean;
};

export type ResendVerificationLink = {
  email: string;
};

export const login = (payload: Login) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return client.post<any, any, Login>("/auth/login", payload, {
    headers: {
      "x-timezone": timezone,
    },
  });
};

export const register = (payload: Register) => {
  return client.post<any, any, Register>("/auth/register", payload);
};

export const user = () => {
  return client.get<any, { data: User }>("/auth/user", {
    withCredentials: true,
  });
};

export const forgotPassword = (email: string) => {
  return client.post<any, any, ForgotPassword>("/auth/forgot-password", {
    email,
  });
};

export const resetPassword = (token: string, password: string) => {
  return client.post<any, any, ResetPassword>("/auth/reset-password", {
    password,
    token,
  });
};

export const verifyEmail = (token: string) => {
  return client.post<any, any, VerifyEmail>("/auth/verify", { token });
};

export const resendVerificationLink = (email: string) => {
  return client.post<any, any, ResendVerificationLink>("/auth/request-verify", {
    email,
  });
};

export const logout = () => {
  return client.post("/auth/logout");
};
