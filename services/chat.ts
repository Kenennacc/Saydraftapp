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
  state: Uppercase<"mic" | "text" | "email">;
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
  text: string;
};

export type SendInvite = {
  email: string;
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

export const selectPrompt = ({ chatId, messageId, text }: SelectPrompt) => {
  const formdata = new FormData();
  formdata.append("messageId", messageId);
  formdata.append("text", text);
  return client.post(`/chats/${chatId}/messages`, formdata, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const sendInvite = (chatId: string, email: string) => {
  return client.post<any, any, SendInvite>(`/chats/${chatId}/invite`, {
    email,
  });
};
