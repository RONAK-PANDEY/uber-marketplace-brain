/**
 * marketplaceSync.js - Real-time synchronization bus between Rider App, Driver App,
 * and Admin Dashboard using standard browser BroadcastChannel and fallback to localStorage.
 * 
 * Works seamlessly across tabs/windows with zero server setup required!
 */

const CHANNEL_NAME = 'uber_marketplace_brain_sync';

class MarketplaceSyncBus {
  constructor() {
    this.listeners = new Set();
    this.channel = null;

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
    }
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
      senderId: Math.random().toString(36).substring(7),
    };

    if (this.channel) {
      try {
        this.channel.postMessage(msg);
      } catch (e) {}
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(CHANNEL_NAME, JSON.stringify(msg));
      } catch (e) {}
    }

    // Also notify local listeners in the same window
    this.notify(msg);
  }
}

export const marketplaceSync = new MarketplaceSyncBus();

