import { io, Socket } from 'socket.io-client';
import { getServerBaseUrl } from './api';

class SocketService {
  private socket: Socket | null = null;
  private currentRoomCode: string | null = null;
  private listeners: Map<string, Set<(...args: any[]) => void>> = new Map();

  connect(): Socket {
    const token = localStorage.getItem('gte_access_token');
    const serverUrl = getServerBaseUrl();

    if (this.socket) {
      if (this.socket.connected) {
        return this.socket;
      }
      // Update auth token if it changed
      if (this.socket.auth && typeof this.socket.auth === 'object') {
        (this.socket.auth as any).token = token;
      }
      if (!this.socket.connected) {
        this.socket.connect();
      }
      return this.socket;
    }

    this.socket = io(serverUrl || undefined, {
      auth: { token },
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 25,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('⚡ Connected to Game Socket Server:', this.socket?.id);
      // Auto rejoin room if roomCode is set
      if (this.currentRoomCode) {
        this.socket?.emit('ROOM_JOIN', { roomCode: this.currentRoomCode });
      }
    });

    this.socket.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message);
    });

    // Reattach any registered listeners
    for (const [event, cbs] of this.listeners.entries()) {
      for (const cb of cbs) {
        this.socket.on(event, cb);
      }
    }

    return this.socket;
  }

  updateAuthToken(newToken?: string) {
    const token = newToken || localStorage.getItem('gte_access_token');
    if (this.socket) {
      this.socket.auth = { token };
      if (!this.socket.connected) {
        this.socket.connect();
      }
    } else {
      this.connect();
    }
  }

  joinRoom(roomCode: string) {
    this.currentRoomCode = roomCode.toUpperCase();
    const s = this.getSocket();
    if (s?.connected) {
      s.emit('ROOM_JOIN', { roomCode: this.currentRoomCode });
    } else {
      this.connect();
    }
  }

  leaveRoom() {
    if (this.currentRoomCode) {
      this.emit('ROOM_LEAVE');
      this.currentRoomCode = null;
    }
  }

  getSocket(): Socket | null {
    if (!this.socket) {
      return this.connect();
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.currentRoomCode = null;
  }

  emit(event: string, data?: any) {
    if (!this.socket || !this.socket.connected) {
      this.connect();
    }
    this.socket?.emit(event, data);
  }

  on(event: string, callback: (...args: any[]) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
    this.socket?.on(event, callback);
  }

  off(event: string, callback?: (...args: any[]) => void) {
    if (callback) {
      this.listeners.get(event)?.delete(callback);
      this.socket?.off(event, callback);
    } else {
      this.listeners.delete(event);
      this.socket?.off(event);
    }
  }
}

export const socketService = new SocketService();
export default socketService;
