import { AxiosError } from "axios";

export const formatApiError = (error?: Error | null) => {
  if (!error) return "";
  if (isNetworkError(error)) return constants.NETWORK_ERROR;
  const isApiError = isAPIError(error);
  if (isApiError) return isApiError;
  return constants.INTERNAL_ERROR;
};

const isNetworkError = (error: Error) => {
  return (
    (error instanceof AxiosError && error.code?.includes("ERR_NETWORK")) ||
    error.message.includes("Network Error")
  );
};

const isAPIError = (error: Error): string | false => {
  return error instanceof AxiosError
    ? (error.response?.data?.message ?? error.message)
    : false;
};

const constants = {
  NETWORK_ERROR:
    "We’re having trouble connecting. Please check your internet connection and try again.",
  INTERNAL_ERROR:
    "We’re experiencing some issues right now. Please refresh the page or try again in a few minutes.",
};
