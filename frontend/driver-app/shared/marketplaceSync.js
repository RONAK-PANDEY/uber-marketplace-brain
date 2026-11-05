/**
 * marketplaceSync.js - Real-time synchronization bus between Rider App, Driver App,
 * and Admin Dashboard using standard browser BroadcastChannel, cross-port WebSocket relay,
 * and localStorage fallback.
 */

const CHANNEL_NAME = 'uber_marketplace_brain_sync';

class MarketplaceSyncBus {
  constructor() {
    this.listeners = new Set();
    this.channel = null;
    this.ws = null;
    this.clientId = Math.random().toString(36).substring(7);

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (event) => {
          this.notify(event.data);
        };
      } catch (e) {
        console.warn('BroadcastChannel failed, using localStorage fallback', e);
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key === CHANNEL_NAME && event.newValue) {
          try {
            const data = JSON.parse(event.newValue);
            this.notify(data);
          } catch (err) {}
        }
      });
      this.initWebSocket();
    }
  }

  initWebSocket() {
    try {
      const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${proto}//${location.host}/ws/state`;
      this.ws = new WebSocket(wsUrl);
      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'sync' && msg.syncType && msg.senderId !== this.clientId) {
            this.notify({ type: msg.syncType, payload: msg.payload, timestamp: msg.timestamp });
          }
        } catch (err) {}
      };
      this.ws.onclose = () => {
        setTimeout(() => this.initWebSocket(), 3000);
      };
      this.ws.onerror = () => {
        this.ws?.close();
      };
    } catch (e) {}
  }

  notify(message) {
    this.listeners.forEach((fn) => {
      try {
        fn(message);
      } catch (err) {
        console.error('Listener error in marketplaceSync:', err);
      }
    });
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  broadcast(type, payload = {}) {
    const msg = {
      type,
      payload,
      timestamp: Date.now(),
      senderId: this.clientId,
    };

    // 1. Send via WebSocket to bridge across different ports (5173, 5174, 5175)
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify({
          type: 'sync',
          syncType: type,
          payload,
          senderId: this.clientId,
          timestamp: msg.timestamp,
        }));
      } catch (e) {}
    }

    // 2. BroadcastChannel for same-origin tabs
    if (this.channel) {
      try {
        this.channel.postMessage(msg);
      } catch (e) {}
    }

    // 3. Fallback to localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(CHANNEL_NAME, JSON.stringify(msg));
      } catch (e) {}
    }

    // 4. Notify local listeners in the current tab
    this.notify(msg);
  }

  publish(type, payload = {}) {
    return this.broadcast(type, payload);
  }
}

export const marketplaceSync = new MarketplaceSyncBus();
