// src/api/socket.js - Fixed Socket Configuration
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL;

// Create socket instance
const socketInstance = io(SOCKET_URL, {
    autoConnect: true,
    transports: ['websocket', 'polling'], // Fallback to polling
    timeout: 20000,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    maxReconnectionAttempts: 5,
});

// Connection event handlers
socketInstance.on('connect', () => {
    // console.log('Connected to server:', socketInstance.id);
});

socketInstance.on('disconnect', (reason) => {
    // console.log('Disconnected from server:', reason);
});

socketInstance.on('connect_error', (error) => {
    // console.error('Connection error:', error);
});

socketInstance.on('reconnect', (attemptNumber) => {
    // console.log('Reconnected after', attemptNumber, 'attempts');
});

socketInstance.on('reconnect_error', (error) => {
    // console.error('Reconnection error:', error);
});

export default socketInstance;
