import { type } from "node:os";
import create from "zustand";
import { devtools, persist } from "zustand/middleware";

type folderData = {
  id: string;
  name: string;
  type: string;
};
type bookmarkData = {
  id: string;
  name: string;
  url: string;
  description: string;
  folder_id: string;
  author_id: string;
};
interface storeState {
  user: null | {
    id: string;
    email: string;
    username: string;
  };
  setUser: (
    data: null | {
      id: string;
      email: string;
      username: string;
    }
  ) => void;
  folder: folderData[] | any;
  setFolder: (data: folderData[] | any) => void;
}
export const useStore = create<storeState>((set) => ({
  user: null,
  setUser: (data) => set(() => ({ user: data })),
  folder: [],
  setFolder: (data) => set(() => ({ folder: data })),
}));
