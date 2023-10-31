import { StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { IUser } from "../auth/user";
import { cloneDeep } from "lodash";

export interface GlobalStoreSlice {
  timezone: string | null | undefined;
  timezoneText: () => string;
  setTimezone: (val: string) => void;

  users: Array<IUser>;
  activeUser: () => IUser | null;

  addOrUpdateUser: (user: IUser) => void;
  setUserActive: (name: string) => void;
  removeUser: (name: string) => void;
  activeLogout: () => void;
  userLogout: (name: string) => void;
}

export const CreateGlobalStoreState: StateCreator<
  GlobalStoreSlice,
  [],
  [["zustand/persist", unknown]]
> = persist(
  (set, get) => ({
    timezone: String(Math.round((new Date().getTimezoneOffset() * -1) / 60)),
    timezoneText: () => {
      const timezone = (get() as any).timezone;
      if (!timezone) return "";
      const temp = timezone >= 0 ? `+${timezone}` : timezone;
      return `UTC${temp}`;
    },
    setTimezone: (val: string) => set(() => ({ timezone: val })),

    users: [],

    activeUser: () => {
      const users = get().users;
      const activeUser = users.find((u) => u.active);
      return activeUser || null;
    },

    addOrUpdateUser: (user: IUser) => {
      const users = cloneDeep(get().users);

      if (user.active) {
        users.forEach((u) => {
          u.active = false;
        });
      }

      const index = users.findIndex((u) => u.name === user.name);

      if (index === -1) {
        users.push(user);
      } else {
        users[index] = user;
      }

      set(() => ({ users }));
    },

    setUserActive: (name: string) => {
      const users = cloneDeep(get().users);
      const newUsers = users.map((u) => {
        u.active = u.name === name;
        return u;
      });

      set(() => ({ users: newUsers }));
    },

    removeUser: (name: string) => {
      const users = cloneDeep(get().users);
      const newUsers = users.filter((u) => u.name !== name);

      set(() => ({ users: newUsers }));
    },

    activeLogout: () => {
      const users = cloneDeep(get().users);
      const newUsers = users.map((u) => {
        if (u.active) {
          u.token = "";
          u.expires = 0;
        }
        return u;
      });

      set(() => ({ users: newUsers }));
    },

    userLogout: (name: string) => {
      const users = cloneDeep(get().users);
      const newUsers = users.map((u) => {
        if (u.name === name) {
          u.token = "";
          u.expires = 0;
        }
        return u;
      });

      set(() => ({ users: newUsers }));
    },
  }),
  {
    name: "globalStorage", // name of the item in the storage (must be unique)
    storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
  },
);
