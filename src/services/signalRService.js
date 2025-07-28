import * as signalR from '@microsoft/signalr';

const API_URL = import.meta.env.VITE_API_URL;

class SignalRService {
    constructor() {
        this.connection = null;
        this.callbacks = {};
        this.registeredEvents = new Set(); // Track which events have SignalR handlers
        this.initializeConnection();
    }

    initializeConnection = () => {
        if (this.connection) return;

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${API_URL.replace('/api', '')}/hubs/main`)
            .withAutomaticReconnect()
            .build();

        this.connection.onclose(() => {
            setTimeout(() => this.reconnect(), 5000);
        });

        this.connection.onreconnected(() => {
            this.reregisterCallbacks();
        });

        this.startConnection();
    }

    reconnect = () => {
        if (this.connection && this.connection.state === signalR.HubConnectionState.Disconnected) {
            this.startConnection();
        }
    }

    reregisterCallbacks = () => {
        // Clear registered events tracking
        this.registeredEvents.clear();

        // Re-register SignalR handlers for events that have callbacks
        Object.keys(this.callbacks).forEach(event => {
            if (this.callbacks[event].length > 0) {
                this.registerSignalRHandler(event);
            }
        });
    }

    registerSignalRHandler = (event) => {
        if (this.registeredEvents.has(event)) return;

        this.connection.on(event, (...args) => {
            if (this.callbacks[event]) {
                this.callbacks[event].forEach(cb => cb(...args));
            }
        });

        this.registeredEvents.add(event);
    }

    on = (event, callback) => {
        if (!this.connection) {
            this.initializeConnection();
        } else if (this.connection.state === signalR.HubConnectionState.Disconnected) {
            this.reconnect();
        }

        // Store the callback in our callbacks object
        if (!this.callbacks[event]) {
            this.callbacks[event] = [];
        }
        this.callbacks[event].push(callback);

        // Register the SignalR handler only once per event type
        this.registerSignalRHandler(event);

        return () => this.off(event, callback);
    }

    startConnection = async () => {
        try {
            await this.connection.start();
        } catch (error) {
            console.error('Error establishing SignalR connection:', error);
            setTimeout(this.startConnection, 5000);
        }
    }

    off = (event, callback) => {
        if (!this.connection || !this.callbacks[event]) return;

        // Remove the callback from our callbacks object
        this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);

        // If no more callbacks for this event, remove the SignalR handler
        if (this.callbacks[event].length === 0) {
            this.connection.off(event);
            this.registeredEvents.delete(event);
            delete this.callbacks[event];
        }
    }

    stopConnection = async () => {
        if (this.connection) {
            try {
                await this.connection.stop();
                this.connection = null;
                this.callbacks = {};
                this.registeredEvents.clear();
            } catch (error) {
                console.error('Error stopping SignalR connection:', error);
            }
        }
    }
}

// Create a singleton instance
const signalRService = new SignalRService();
export default signalRService;