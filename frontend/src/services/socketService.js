import { io } from 'socket.io-client';
import { API_URL } from './api';
import { getAuthToken } from './authStorage';

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(API_URL, {
      autoConnect: false,
    });
  }

  return socket;
};

export const connectSocket = () => {
  const activeSocket = getSocket();
  activeSocket.auth = {
    token: getAuthToken(),
  };

  if (!activeSocket.connected) {
    activeSocket.connect();
  }

  return activeSocket;
};

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
  }
};
