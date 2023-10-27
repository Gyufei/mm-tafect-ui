import { BusDispatch } from "../hooks/use-bus";
import { IUser } from "./user";

const UserStorageKey = "user";

export const UserStorageChangeEvent = "user-storage-change";

export function getLocalUsers() {
  const localUsersStr = localStorage.getItem(UserStorageKey) || "[]";
  const localUsers: IUser[] = JSON.parse(localUsersStr);

  return localUsers;
}

export function setLocalUsers(users: IUser[], broadcast: boolean = true) {
  localStorage.setItem(UserStorageKey, JSON.stringify(users));
  if (broadcast) BusDispatch(UserStorageChangeEvent);
}

export function addOrUpdateUser(user: IUser) {
  const localUsers = getLocalUsers();
  const index = localUsers.findIndex((u) => u.name === user.name);

  if (index === -1) {
    localUsers.push(user);
  } else {
    localUsers[index] = user;
  }

  setLocalUsers(localUsers);
}

export function getUserActive() {
  const localUsers = getLocalUsers();
  const activeUser = localUsers.find((u) => u.active);

  return activeUser;
}

export function setUserActive(name: string) {
  const localUsers = getLocalUsers();
  const newLocal = localUsers.map((u) => {
    u.active = u.name === name;
    return u;
  });

  setLocalUsers(newLocal, false);
}

export function removeUser(name: string) {
  const localUsers = getLocalUsers();
  const newLocal = localUsers.filter((u) => u.name !== name);

  setLocalUsers(newLocal);
}

export function activeUserLogout() {
  const localUsers = getLocalUsers();
  const newLocal = localUsers.map((u) => {
    if (u.active) {
      u.active = false;
      u.token = "";
    }
    return u;
  });

  setLocalUsers(newLocal);
}

export function userLogout(name: string) {
  const localUsers = getLocalUsers();
  const newLocal = localUsers.map((u) => {
    if (u.name === name) {
      u.active = false;
      u.token = "";
    }
    return u;
  });

  setLocalUsers(newLocal);
}

export function removeOldStorage() {
  // remove old login method by token
  localStorage.removeItem("token");
}
