// Manage the storage of the accessToken in memory
let accessToken: string | null = null;

export function getToken() {
  return accessToken;
}

export function setToken(token: string) {
  accessToken = token;
}

export function removeToken() {
  accessToken = null;
}
