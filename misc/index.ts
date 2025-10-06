import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const setQueryParam = (
  router: AppRouterInstance,
  params: URLSearchParams,
  { key, value }: { key: string; value: string },
) => {
  const searchParams = new URLSearchParams(params);
  searchParams.set(key, value);
  router.replace(`/chat?${searchParams}`);
};

export const removeQueryParam = (
  router: AppRouterInstance,
  params: URLSearchParams,
  key: string,
) => {
  const searchParams = new URLSearchParams(params);
  searchParams.delete(key);
  router.replace(`/chat?${searchParams}`);
};

export const secondsToTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const _seconds = seconds < 60 ? seconds : seconds % 60;
  const prefix = (value: number) => (value <= 9 ? "0" : "") + value;
  return `${prefix(minutes)}:${prefix(_seconds)}`;
};

export const getDayPeriod = (timeZone: string) => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    dayPeriod: "narrow",
    timeZone,
  });
  return formatter.format(new Date()).slice(6);
};

export const tap = async (volume: number = 1) => {
  try {
    const audio = new Audio("/tap.mp3");
    audio.volume = volume;
    await audio.play();
  } catch (err) {}
};
