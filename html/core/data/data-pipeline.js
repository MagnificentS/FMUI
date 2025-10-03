/**
 * FM-Base Data Pipeline
 * Real-time data flow management system with WebSocket support,
 * data transformation, caching, and event-driven updates
 */

class DataPipeline {
    constructor() {
        this.cache = new Map();
        this.subscribers = new Map();
        this.transformers = new Map();
        this.websockets = new Map();
        this.requestQueue = [];
        this.isProcessing = false;
        this.retryAttempts = new Map();
        this.maxRetries = 3;
        
        // Cache configuration
        this.defaultTTL = 5 * 60 * 1000; // 5 minutes
        this.cacheStats = {
            hits: 0,
            misses: 0,
            evictions: 0
        };
        
        this.initializeEventHandlers();
    }

    /**
     * Initialize event handlers and setup
     */
    initializeEventHandlers() {
        // Handle page visibility changes to manage connections
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseRealTimeUpdates();
            } else {
                this.resumeRealTimeUpdates();
            }
        });

        // Handle network status
        window.addEventListener('online', () => this.handleNetworkOnline());
        window.addEventListener('offline', () => this.handleNetworkOffline());
    }

    /**
     * Subscribe to data updates
     * @param {string} dataType - Type of data to subscribe to
     * @param {Function} callback - Callback function for updates
     * @param {Object} options - Subscription options
     */
    subscribe(dataType, callback, options = {}) {
        if (!this.subscribers.has(dataType)) {
            this.subscribers.set(dataType, new Set());
        }
        
        const subscription = {
            callback,
            options,
            id: this.generateSubscriptionId()
        };
        
        this.subscribers.get(dataType).add(subscription);
        
        // Return unsubscribe function
        return () => {
            this.subscribers.get(dataType)?.delete(subscription);
        };
    }

    /**
     * Publish data to subscribers
     * @param {string} dataType - Type of data being published
     * @param {*} data - Data to publish
     * @param {Object} meta - Metadata about the update
     */
    publish(dataType, data, meta = {}) {
        const subscribers = this.subscribers.get(dataType);
        if (!subscribers) return;

        const updateData = {
            type: dataType,
            data,
            timestamp: Date.now(),
            source: meta.source || 'pipeline',
            ...meta
        };

        subscribers.forEach(subscription => {
            try {
                if (this.shouldNotifySubscriber(subscription, updateData)) {
                    subscription.callback(updateData);
                }
            } catch (error) {
                console.error(`Error in subscriber callback for ${dataType}:`, error);
            }
        });
    }

    /**
     * Fetch data with caching and transformation
     * @param {string} endpoint - API endpoint or data identifier
     * @param {Object} options - Request options
     */
    async fetch(endpoint, options = {}) {
        const cacheKey = this.generateCacheKey(endpoint, options);
        
        // Check cache first
        if (options.useCache !== false) {
            const cached = this.getFromCache(cacheKey);
            if (cached) {
                this.cacheStats.hits++;
                return cached.data;
            }
            this.cacheStats.misses++;
        }

        // Add to request queue for batch processing
        return new Promise((resolve, reject) => {
            this.requestQueue.push({
                endpoint,
                options,
                cacheKey,
                resolve,
                reject,
                timestamp: Date.now()
            });
            
            this.processRequestQueue();
        });
    }

    /**
     * Process queued requests with batching and deduplication
     */
    async processRequestQueue() {
        if (this.isProcessing || this.requestQueue.length === 0) return;
        
        this.isProcessing = true;
        
        try {
            // Group requests by endpoint for batching
            const groupedRequests = this.groupRequestsByEndpoint();
            
            for (const [endpoint, requests] of groupedRequests) {
                await this.processBatchedRequests(endpoint, requests);
            }
        } finally {
            this.isProcessing = false;
            
            // Process any new requests that arrived
            if (this.requestQueue.length > 0) {
                setTimeout(() => this.processRequestQueue(), 10);
            }
        }
    }

    /**
     * Group requests by endpoint for batching
     */
    groupRequestsByEndpoint() {
        const groups = new Map();
        const processedRequests = this.requestQueue.splice(0);
        
        processedRequests.forEach(request => {
            const key = request.endpoint;
            if (!groups.has(key)) {
                groups.set(key, []);
            }
            groups.get(key).push(request);
        });
        
        return groups;
    }

    /**
     * Process batched requests for an endpoint
     */
    async processBatchedRequests(endpoint, requests) {
        try {
            const results = await this.executeRequests(endpoint, requests);
            
            requests.forEach((request, index) => {
                const result = results[index];
                
                if (result.success) {
                    // Transform data if transformer exists
                    const transformedData = this.transformData(endpoint, result.data, request.options);
                    
                    // Cache the result
                    this.setCache(request.cacheKey, transformedData, request.options.ttl);
                    
                    // Publish to subscribers
                    this.publish(endpoint, transformedData, {
                        source: 'fetch',
                        cached: false
                    });
                    
                    request.resolve(transformedData);
                } else {
                    this.handleRequestError(request, result.error);
                }
            });
        } catch (error) {
            requests.forEach(request => {
                this.handleRequestError(request, error);
            });
        }
    }

    /**
     * Execute actual HTTP requests
     */
    async executeRequests(endpoint, requests) {
        // For single requests
        if (requests.length === 1) {
            const request = requests[0];
            try {
                const response = await this.makeHttpRequest(endpoint, request.options);
                return [{ success: true, data: response }];
            } catch (error) {
                return [{ success: false, error }];
            }
        }
        
        // For multiple requests, batch them if endpoint supports it
        try {
            const batchData = await this.makeBatchRequest(endpoint, requests);
            return batchData.map(data => ({ success: true, data }));
        } catch (error) {
            // Fall back to individual requests
            return Promise.all(requests.map(async request => {
                try {
                    const data = await this.makeHttpRequest(endpoint, request.options);
                    return { success: true, data };
                } catch (err) {
                    return { success: false, error: err };
                }
            }));
        }
    }

    /**
     * Make HTTP request
     */
    async makeHttpRequest(endpoint, options) {
        const config = {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };
        
        if (config.method !== 'GET' && options.data) {
            config.body = JSON.stringify(options.data);
        }
        
        const response = await fetch(endpoint, config);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return response.json();
    }

    /**
     * Make batch request if supported
     */
    async makeBatchRequest(endpoint, requests) {
        // This would depend on your API's batch request format
        const batchPayload = {
            requests: requests.map(req => ({
                method: req.options.method || 'GET',
                data: req.options.data,
                params: req.options.params
            }))
        };
        
        const response = await this.makeHttpRequest(`${endpoint}/batch`, {
            method: 'POST',
            data: batchPayload
        });
        
        return response.results;
    }

    /**
     * Handle request errors with retry logic
     */
    async handleRequestError(request, error) {
        const retryKey = `${request.endpoint}_${request.cacheKey}`;
        const attempts = this.retryAttempts.get(retryKey) || 0;
        
        if (attempts < this.maxRetries && this.shouldRetry(error)) {
            this.retryAttempts.set(retryKey, attempts + 1);
            
            // Exponential backoff
            const delay = Math.pow(2, attempts) * 1000;
            setTimeout(() => {
                this.requestQueue.unshift(request);
                this.processRequestQueue();
            }, delay);
        } else {
            this.retryAttempts.delete(retryKey);
            request.reject(error);
        }
    }

    /**
     * Setup WebSocket connection for real-time updates
     */
    setupWebSocket(endpoint, options = {}) {
        if (this.websockets.has(endpoint)) {
            return this.websockets.get(endpoint);
        }
        
        const ws = new WebSocket(endpoint);
        const wsConfig = {
            socket: ws,
            reconnectAttempts: 0,
            maxReconnectAttempts: options.maxReconnectAttempts || 5,
            reconnectDelay: options.reconnectDelay || 1000,
            ...options
        };
        
        ws.onopen = () => {
            console.log(`WebSocket connected: ${endpoint}`);
            wsConfig.reconnectAttempts = 0;
            this.publish('websocket:connected', { endpoint });
        };
        
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.handleWebSocketMessage(endpoint, data);
            } catch (error) {
                console.error('Failed to parse WebSocket message:', error);
            }
        };
        
        ws.onclose = () => {
            console.log(`WebSocket disconnected: ${endpoint}`);
            this.handleWebSocketDisconnect(endpoint, wsConfig);
        };
        
        ws.onerror = (error) => {
            console.error(`WebSocket error on ${endpoint}:`, error);
        };
        
        this.websockets.set(endpoint, wsConfig);
        return wsConfig;
    }

    /**
     * Handle WebSocket messages
     */
    handleWebSocketMessage(endpoint, data) {
        const { type, payload, timestamp } = data;
        
        // Update cache if this is cached data
        if (payload.cacheKey) {
            this.invalidateCache(payload.cacheKey);
        }
        
        // Transform the data
        const transformedData = this.transformData(type, payload.data, {});
        
        // Publish to subscribers
        this.publish(type, transformedData, {
            source: 'websocket',
            endpoint,
            timestamp: timestamp || Date.now()
        });
    }

    /**
     * Handle WebSocket disconnection with reconnection logic
     */
    handleWebSocketDisconnect(endpoint, wsConfig) {
        this.websockets.delete(endpoint);
        
        if (wsConfig.reconnectAttempts < wsConfig.maxReconnectAttempts) {
            const delay = wsConfig.reconnectDelay * Math.pow(2, wsConfig.reconnectAttempts);
            wsConfig.reconnectAttempts++;
            
            setTimeout(() => {
                console.log(`Attempting to reconnect WebSocket: ${endpoint}`);
                this.setupWebSocket(endpoint, wsConfig);
            }, delay);
        } else {
            console.error(`Max reconnection attempts reached for: ${endpoint}`);
            this.publish('websocket:failed', { endpoint });
        }
    }

    /**
     * Register data transformer
     */
    registerTransformer(dataType, transformer) {
        this.transformers.set(dataType, transformer);
    }

    /**
     * Transform data using registered transformers
     */
    transformData(dataType, data, options) {
        const transformer = this.transformers.get(dataType);
        if (transformer) {
            try {
                return transformer(data, options);
            } catch (error) {
                console.error(`Error transforming data for ${dataType}:`, error);
                return data;
            }
        }
        return data;
    }

    /**
     * Cache management methods
     */
    setCache(key, data, ttl = this.defaultTTL) {
        const expiryTime = Date.now() + ttl;
        this.cache.set(key, {
            data,
            expiryTime,
            accessCount: 0,
            lastAccessed: Date.now()
        });
        
        // Schedule cleanup
        setTimeout(() => this.cleanupExpiredCache(), ttl + 1000);
    }

    getFromCache(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;
        
        if (Date.now() > cached.expiryTime) {
            this.cache.delete(key);
            this.cacheStats.evictions++;
            return null;
        }
        
        cached.accessCount++;
        cached.lastAccessed = Date.now();
        return cached;
    }

    invalidateCache(pattern) {
        if (typeof pattern === 'string') {
            // Exact match
            this.cache.delete(pattern);
        } else if (pattern instanceof RegExp) {
            // Pattern match
            for (const key of this.cache.keys()) {
                if (pattern.test(key)) {
                    this.cache.delete(key);
                }
            }
        }
    }

    cleanupExpiredCache() {
        const now = Date.now();
        for (const [key, cached] of this.cache.entries()) {
            if (now > cached.expiryTime) {
                this.cache.delete(key);
                this.cacheStats.evictions++;
            }
        }
    }

    /**
     * Utility methods
     */
    generateCacheKey(endpoint, options) {
        const keyData = {
            endpoint,
            method: options.method || 'GET',
            params: options.params,
            data: options.data
        };
        return btoa(JSON.stringify(keyData));
    }

    generateSubscriptionId() {
        return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    shouldNotifySubscriber(subscription, updateData) {
        const { options } = subscription;
        
        // Check if subscriber wants this type of update
        if (options.sources && !options.sources.includes(updateData.source)) {
            return false;
        }
        
        // Check rate limiting
        if (options.maxFrequency) {
            const lastNotified = subscription.lastNotified || 0;
            if (Date.now() - lastNotified < options.maxFrequency) {
                return false;
            }
            subscription.lastNotified = Date.now();
        }
        
        return true;
    }

    shouldRetry(error) {
        // Retry on network errors, server errors, but not client errors
        return error.status >= 500 || !error.status;
    }

    /**
     * Network status handlers
     */
    handleNetworkOnline() {
        console.log('Network online - resuming data pipeline');
        this.resumeRealTimeUpdates();
        this.processRequestQueue();
    }

    handleNetworkOffline() {
        console.log('Network offline - pausing real-time updates');
        this.pauseRealTimeUpdates();
    }

    pauseRealTimeUpdates() {
        for (const [endpoint, wsConfig] of this.websockets) {
            if (wsConfig.socket.readyState === WebSocket.OPEN) {
                wsConfig.socket.close();
            }
        }
    }

    resumeRealTimeUpdates() {
        for (const [endpoint, wsConfig] of this.websockets) {
            if (wsConfig.socket.readyState === WebSocket.CLOSED) {
                this.setupWebSocket(endpoint, wsConfig);
            }
        }
    }

    /**
     * Get pipeline statistics
     */
    getStats() {
        return {
            cache: {
                size: this.cache.size,
                ...this.cacheStats
            },
            subscribers: this.subscribers.size,
            websockets: this.websockets.size,
            queueLength: this.requestQueue.length,
            transformers: this.transformers.size
        };
    }

    /**
     * Cleanup resources
     */
    destroy() {
        // Close all WebSocket connections
        for (const [endpoint, wsConfig] of this.websockets) {
            wsConfig.socket.close();
        }
        
        // Clear all data structures
        this.cache.clear();
        this.subscribers.clear();
        this.transformers.clear();
        this.websockets.clear();
        this.requestQueue.length = 0;
        this.retryAttempts.clear();
    }
}

// Export to global scope
window.DataPipeline = DataPipeline;

// Create global instance
window.dataPipeline = new DataPipeline();