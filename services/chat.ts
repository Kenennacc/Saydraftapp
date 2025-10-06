import client from "./client";

type CreateChat = {
  id: string;
};

export enum MessageType {
  TEXT = "text",
}

export type Chat = {
  id: string;
  title: string;
  createdAt: Date;
  state: Uppercase<"mic" | "text">;
};

export type File = {
  id: string;
  url: string;
  type: string;
};

export type Prompt = {
  id: string;
  value: string;
  selected: boolean;
};

export type Message = {
  id: string;
  text: string;
  type: MessageType;
  assistant: boolean;
  files: File[];
  prompts: Prompt[];
};

export type SelectPrompt = {
  chatId: string;
  messageId: string;
  value: string;
};

export const getChats = () => {
  return client.get<any, { data: Chat[] }>("/chats");
};

export const getChat = (id: string) => {
  return client.get<any, { data: Chat }>(`/chats/${id}`);
};

export const deleteChat = (id: string) => {
  return client.delete(`/chats/${id}`);
};

export const createChat = () => {
  return client.post<any, { data: CreateChat }>("/chats");
};

export const updateChat = ({ id, title }: Partial<Chat>) => {
  return client.patch(`/chats/${id}`, { title });
};

export const listenToAudio = (message: Blob, chatId: string) => {
  const formdata = new FormData();
  formdata.append("audio", message);
  return client.post(`/chats/${chatId}/messages`, formdata, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getMessages = (id: string) => {
  return client.get<any, { data: Message[] }>(`/chats/${id}/messages`);
};

export const selectPrompt = ({ chatId, messageId, value }: SelectPrompt) => {
  return client.post(`chats/${chatId}/messages/${messageId}/prompts`, {
    value,
  });
};
