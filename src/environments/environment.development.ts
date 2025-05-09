export const environment = {
  security: {
    header: 'X-User-Id',
    // header: 'X-Authentication-Token',
  },
  services: {
    users: 'http://localhost:8080',
    chats: 'http://localhost:8081',
    messages: 'http://localhost:8082',
    notifications: 'http://localhost:8888',
  }
};
