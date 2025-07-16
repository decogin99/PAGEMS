import * as signalR from '@microsoft/signalr';

const API_URL = import.meta.env.VITE_API_URL;

class SignalRService {
    // Add this to the constructor
    constructor() {
        this.connection = null;
        this.callbacks = {};
        // Initialize connection immediately
        this.initializeConnection();
    }

    // Add this to the initializeConnection method after creating the connection
    initializeConnection = () => {
        if (this.connection) return;

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${API_URL.replace('/api', '')}/hubs/main`)
            .withAutomaticReconnect()
            .build();

        // Log connection state changes
        this.connection.onclose(() => {
            setTimeout(() => this.reconnect(), 5000);
        });

        this.connection.onreconnected(() => {
            this.reregisterCallbacks();
        });

        // Start the connection
        this.startConnection();
    }

    // Add a method to reconnect
    reconnect = () => {
        if (this.connection && this.connection.state === signalR.HubConnectionState.Disconnected) {
            this.startConnection();
        }
    }

    // Add a method to re-register all callbacks after reconnection
    reregisterCallbacks = () => {
        const callbacksCopy = { ...this.callbacks };
        this.callbacks = {};

        // Re-register each callback
        Object.entries(callbacksCopy).forEach(([event, callbacks]) => {
            callbacks.forEach(callback => {
                this.on(event, callback);
            });
        });
    }

    // Modify the on method to check connection state
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

        // Register the callback with SignalR
        this.connection.on(event, (...args) => {
            if (this.callbacks[event]) {
                this.callbacks[event].forEach(cb => cb(...args));
            }
        });

        return () => this.off(event, callback);
    }

    // Start the SignalR connection
    startConnection = async () => {
        try {
            await this.connection.start();
        } catch (error) {
            console.error('Error establishing SignalR connection:', error);
            // Retry connection after 5 seconds
            setTimeout(this.startConnection, 5000);
        }
    }

    // Remove a callback for a specific event
    off = (event, callback) => {
        if (!this.connection || !this.callbacks[event]) return;

        // Remove the callback from our callbacks object
        this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);

        // If no more callbacks for this event, remove the SignalR handler
        if (this.callbacks[event].length === 0) {
            this.connection.off(event);
            delete this.callbacks[event];
        }
    }

    // Stop the SignalR connection
    stopConnection = async () => {
        if (this.connection) {
            try {
                await this.connection.stop();
                this.connection = null;
                this.callbacks = {};
            } catch (error) {
                console.error('Error stopping SignalR connection:', error);
            }
        }
    }
}

// Create a singleton instance
const signalRService = new SignalRService();
export default signalRService;