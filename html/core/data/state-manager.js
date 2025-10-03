/**
 * FM-Base State Manager
 * Global application state management with persistence,
 * undo/redo functionality, and cross-component synchronization
 */

class StateManager {
    constructor() {
        this.state = {};
        this.subscribers = new Map();
        this.middleware = [];
        this.history = {
            past: [],
            present: null,
            future: []
        };
        this.maxHistorySize = 50;
        this.persistenceConfig = {
            enabled: true,
            key: 'fm-base-state',
            storage: localStorage,
            debounceDelay: 1000
        };
        
        // Performance optimization flags
        this.batchUpdates = [];
        this.isUpdating = false;
        this.updateScheduled = false;
        
        this.initializeState();
        this.setupPersistence();
    }

    /**
     * Initialize default state structure
     */
    initializeState() {
        this.state = {
            // Application state
            app: {
                currentScreen: 'squad',
                theme: 'light',
                language: 'en',
                initialized: false
            },
            
            // User preferences
            preferences: {
                animations: true,
                notifications: true,
                autoSave: true,
                debugMode: false
            },
            
            // Game data
            gameData: {
                currentSave: null,
                players: {},
                teams: {},
                matches: {},
                tactics: {},
                lastUpdated: null
            },
            
            // UI state
            ui: {
                selectedPlayer: null,
                activeFilters: {},
                sortOrder: {},
                expandedCards: new Set(),
                modal: {
                    isOpen: false,
                    type: null,
                    data: null
                }
            },
            
            // Cache state
            cache: {
                invalidationTime: {},
                preloadedData: {}
            }
        };
        
        this.history.present = this.deepClone(this.state);
    }

    /**
     * Setup state persistence
     */
    setupPersistence() {
        if (!this.persistenceConfig.enabled) return;
        
        // Load persisted state
        this.loadPersistedState();
        
        // Setup auto-save
        this.debouncedPersist = this.debounce(
            () => this.persistState(),
            this.persistenceConfig.debounceDelay
        );
        
        // Save on page unload
        window.addEventListener('beforeunload', () => {
            this.persistState();
        });
    }

    /**
     * Get state value by path
     * @param {string} path - Dot-notation path to state value
     * @param {*} defaultValue - Default value if path doesn't exist
     */
    get(path, defaultValue = undefined) {
        if (!path) return this.state;
        
        const keys = path.split('.');
        let current = this.state;
        
        for (const key of keys) {
            if (current == null || typeof current !== 'object') {
                return defaultValue;
            }
            current = current[key];
        }
        
        return current !== undefined ? current : defaultValue;
    }

    /**
     * Set state value by path
     * @param {string|object} path - Dot-notation path or state object
     * @param {*} value - Value to set (only used if path is string)
     * @param {object} options - Update options
     */
    set(path, value, options = {}) {
        let updates;
        
        if (typeof path === 'object') {
            updates = path;
            options = value || {};
        } else {
            updates = { [path]: value };
        }
        
        this.batchUpdate(updates, options);
    }

    /**
     * Batch multiple state updates
     */
    batchUpdate(updates, options = {}) {
        this.batchUpdates.push({ updates, options });
        
        if (!this.updateScheduled) {
            this.updateScheduled = true;
            requestAnimationFrame(() => this.processBatchedUpdates());
        }
    }

    /**
     * Process all batched updates
     */
    processBatchedUpdates() {
        if (this.isUpdating) return;
        
        this.isUpdating = true;
        this.updateScheduled = false;
        
        const allUpdates = this.batchUpdates.splice(0);
        const combinedUpdates = {};
        const combinedOptions = {};
        
        // Combine all updates
        for (const { updates, options } of allUpdates) {
            Object.assign(combinedUpdates, updates);
            Object.assign(combinedOptions, options);
        }
        
        this.performUpdate(combinedUpdates, combinedOptions);
        this.isUpdating = false;
    }

    /**
     * Perform the actual state update
     */
    performUpdate(updates, options = {}) {
        const prevState = this.deepClone(this.state);
        const changedPaths = new Set();
        
        // Apply updates
        for (const [path, value] of Object.entries(updates)) {
            const oldValue = this.get(path);
            
            if (this.setValue(path, value)) {
                changedPaths.add(path);
                
                // Track parent paths for nested updates
                const pathParts = path.split('.');
                for (let i = 1; i < pathParts.length; i++) {
                    changedPaths.add(pathParts.slice(0, i).join('.'));
                }
            }
        }
        
        if (changedPaths.size === 0) return;
        
        // Apply middleware
        const actionData = {
            type: options.type || 'UPDATE',
            updates,
            prevState,
            newState: this.state,
            changedPaths: Array.from(changedPaths),
            timestamp: Date.now()
        };
        
        this.applyMiddleware(actionData);
        
        // Add to history if not disabled
        if (!options.skipHistory) {
            this.addToHistory(prevState, actionData);
        }
        
        // Notify subscribers
        this.notifySubscribers(changedPaths, actionData);
        
        // Persist state if enabled
        if (this.persistenceConfig.enabled && !options.skipPersistence) {
            this.debouncedPersist();
        }
    }

    /**
     * Set value at path
     */
    setValue(path, value) {
        const keys = path.split('.');
        let current = this.state;
        
        // Navigate to parent
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!(key in current) || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }
        
        const finalKey = keys[keys.length - 1];
        const oldValue = current[finalKey];
        
        // Check if value actually changed
        if (this.isEqual(oldValue, value)) {
            return false;
        }
        
        current[finalKey] = value;
        return true;
    }

    /**
     * Subscribe to state changes
     * @param {string|array} paths - Path(s) to watch
     * @param {function} callback - Callback function
     * @param {object} options - Subscription options
     */
    subscribe(paths, callback, options = {}) {
        if (typeof paths === 'string') {
            paths = [paths];
        }
        
        const subscription = {
            id: this.generateId(),
            paths: new Set(paths),
            callback,
            options,
            lastNotified: 0
        };
        
        // Add to subscribers for each path
        paths.forEach(path => {
            if (!this.subscribers.has(path)) {
                this.subscribers.set(path, new Set());
            }
            this.subscribers.get(path).add(subscription);
        });
        
        // Return unsubscribe function
        return () => {
            paths.forEach(path => {
                this.subscribers.get(path)?.delete(subscription);
            });
        };
    }

    /**
     * Notify subscribers of changes
     */
    notifySubscribers(changedPaths, actionData) {
        const notifiedSubscriptions = new Set();
        
        for (const path of changedPaths) {
            const pathSubscribers = this.subscribers.get(path);
            if (!pathSubscribers) continue;
            
            for (const subscription of pathSubscribers) {
                if (notifiedSubscriptions.has(subscription.id)) continue;
                
                if (this.shouldNotifySubscription(subscription, changedPaths, actionData)) {
                    try {
                        subscription.callback({
                            path,
                            value: this.get(path),
                            prevValue: this.getValueFromState(actionData.prevState, path),
                            changedPaths: Array.from(changedPaths),
                            action: actionData
                        });
                        subscription.lastNotified = Date.now();
                        notifiedSubscriptions.add(subscription.id);
                    } catch (error) {
                        console.error('Error in state subscription callback:', error);
                    }
                }
            }
        }
    }

    /**
     * Check if subscription should be notified
     */
    shouldNotifySubscription(subscription, changedPaths, actionData) {
        const { options } = subscription;
        
        // Check rate limiting
        if (options.debounce && Date.now() - subscription.lastNotified < options.debounce) {
            return false;
        }
        
        // Check if any of the subscription paths were affected
        const hasMatchingPath = Array.from(subscription.paths).some(subPath => {
            return Array.from(changedPaths).some(changedPath => {
                return changedPath.startsWith(subPath) || subPath.startsWith(changedPath);
            });
        });
        
        if (!hasMatchingPath) return false;
        
        // Check action type filter
        if (options.actionTypes && !options.actionTypes.includes(actionData.type)) {
            return false;
        }
        
        return true;
    }

    /**
     * Add middleware
     */
    use(middleware) {
        this.middleware.push(middleware);
    }

    /**
     * Apply middleware to action
     */
    applyMiddleware(actionData) {
        for (const middleware of this.middleware) {
            try {
                middleware(actionData, this);
            } catch (error) {
                console.error('Error in middleware:', error);
            }
        }
    }

    /**
     * History management
     */
    addToHistory(prevState, actionData) {
        // Remove old history if at limit
        if (this.history.past.length >= this.maxHistorySize) {
            this.history.past.shift();
        }
        
        this.history.past.push({
            state: prevState,
            action: actionData
        });
        
        // Clear future when new action is performed
        this.history.future = [];
    }

    /**
     * Undo last action
     */
    undo() {
        if (this.history.past.length === 0) return false;
        
        const current = {
            state: this.deepClone(this.state),
            action: { type: 'CURRENT' }
        };
        
        const previous = this.history.past.pop();
        
        this.history.future.unshift(current);
        this.state = this.deepClone(previous.state);
        
        this.notifySubscribers(new Set(['*']), {
            type: 'UNDO',
            prevState: current.state,
            newState: this.state
        });
        
        return true;
    }

    /**
     * Redo last undone action
     */
    redo() {
        if (this.history.future.length === 0) return false;
        
        const current = {
            state: this.deepClone(this.state),
            action: { type: 'CURRENT' }
        };
        
        const next = this.history.future.shift();
        
        this.history.past.push(current);
        this.state = this.deepClone(next.state);
        
        this.notifySubscribers(new Set(['*']), {
            type: 'REDO',
            prevState: current.state,
            newState: this.state
        });
        
        return true;
    }

    /**
     * Clear history
     */
    clearHistory() {
        this.history.past = [];
        this.history.future = [];
    }

    /**
     * State persistence methods
     */
    persistState() {
        if (!this.persistenceConfig.enabled) return;
        
        try {
            const stateToSave = this.preparePersistentState();
            const serialized = JSON.stringify(stateToSave);
            this.persistenceConfig.storage.setItem(this.persistenceConfig.key, serialized);
        } catch (error) {
            console.error('Failed to persist state:', error);
        }
    }

    loadPersistedState() {
        if (!this.persistenceConfig.enabled) return;
        
        try {
            const serialized = this.persistenceConfig.storage.getItem(this.persistenceConfig.key);
            if (serialized) {
                const persistedState = JSON.parse(serialized);
                this.mergePersistedState(persistedState);
            }
        } catch (error) {
            console.error('Failed to load persisted state:', error);
        }
    }

    preparePersistentState() {
        // Only persist certain parts of the state
        return {
            app: {
                theme: this.state.app.theme,
                language: this.state.app.language
            },
            preferences: this.state.preferences,
            ui: {
                activeFilters: this.state.ui.activeFilters,
                sortOrder: this.state.ui.sortOrder
            }
        };
    }

    mergePersistedState(persistedState) {
        // Carefully merge persisted state with current state
        const safePaths = [
            'app.theme',
            'app.language',
            'preferences',
            'ui.activeFilters',
            'ui.sortOrder'
        ];
        
        for (const path of safePaths) {
            const value = this.getValueFromState(persistedState, path);
            if (value !== undefined) {
                this.setValue(path, value);
            }
        }
    }

    /**
     * Computed properties system
     */
    computed(dependencies, computeFn, options = {}) {
        let cachedValue;
        let lastDependencyValues = {};
        let isComputing = false;
        
        const computedProperty = () => {
            if (isComputing) {
                throw new Error('Circular dependency detected in computed property');
            }
            
            // Check if dependencies changed
            const currentDependencyValues = {};
            let hasChanged = false;
            
            for (const dep of dependencies) {
                const value = this.get(dep);
                currentDependencyValues[dep] = value;
                
                if (!this.isEqual(value, lastDependencyValues[dep])) {
                    hasChanged = true;
                }
            }
            
            if (hasChanged || cachedValue === undefined) {
                isComputing = true;
                try {
                    cachedValue = computeFn(currentDependencyValues);
                    lastDependencyValues = currentDependencyValues;
                } finally {
                    isComputing = false;
                }
            }
            
            return cachedValue;
        };
        
        // Subscribe to dependency changes if reactive
        if (options.reactive !== false) {
            this.subscribe(dependencies, () => {
                // Invalidate cache
                cachedValue = undefined;
                lastDependencyValues = {};
            });
        }
        
        return computedProperty;
    }

    /**
     * Transaction support for atomic updates
     */
    transaction(fn) {
        const originalSkipHistory = true;
        const updates = {};
        
        // Intercept set calls during transaction
        const originalSet = this.set.bind(this);
        this.set = (path, value, options = {}) => {
            if (typeof path === 'object') {
                Object.assign(updates, path);
            } else {
                updates[path] = value;
            }
        };
        
        try {
            fn();
            
            // Apply all updates at once
            if (Object.keys(updates).length > 0) {
                originalSet(updates, { type: 'TRANSACTION' });
            }
        } finally {
            // Restore original set method
            this.set = originalSet;
        }
    }

    /**
     * Utility methods
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj);
        if (obj instanceof Set) return new Set(Array.from(obj));
        if (obj instanceof Map) return new Map(Array.from(obj.entries()));
        if (Array.isArray(obj)) return obj.map(item => this.deepClone(item));
        
        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = this.deepClone(obj[key]);
            }
        }
        return cloned;
    }

    isEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return a === b;
        if (typeof a !== typeof b) return false;
        
        if (typeof a === 'object') {
            if (Array.isArray(a) !== Array.isArray(b)) return false;
            
            const keysA = Object.keys(a);
            const keysB = Object.keys(b);
            
            if (keysA.length !== keysB.length) return false;
            
            for (const key of keysA) {
                if (!keysB.includes(key) || !this.isEqual(a[key], b[key])) {
                    return false;
                }
            }
            
            return true;
        }
        
        return false;
    }

    getValueFromState(state, path) {
        const keys = path.split('.');
        let current = state;
        
        for (const key of keys) {
            if (current == null || typeof current !== 'object') {
                return undefined;
            }
            current = current[key];
        }
        
        return current;
    }

    debounce(fn, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    generateId() {
        return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Get state statistics
     */
    getStats() {
        return {
            stateSize: JSON.stringify(this.state).length,
            subscriberCount: Array.from(this.subscribers.values())
                .reduce((total, set) => total + set.size, 0),
            historySize: this.history.past.length + this.history.future.length,
            middlewareCount: this.middleware.length
        };
    }

    /**
     * Reset state to initial values
     */
    reset() {
        const prevState = this.deepClone(this.state);
        this.initializeState();
        
        this.notifySubscribers(new Set(['*']), {
            type: 'RESET',
            prevState,
            newState: this.state
        });
        
        this.clearHistory();
    }

    /**
     * Export current state
     */
    export() {
        return this.deepClone(this.state);
    }

    /**
     * Import state
     */
    import(newState, options = {}) {
        const prevState = this.deepClone(this.state);
        this.state = this.deepClone(newState);
        
        this.notifySubscribers(new Set(['*']), {
            type: 'IMPORT',
            prevState,
            newState: this.state,
            ...options
        });
        
        if (!options.skipHistory) {
            this.clearHistory();
        }
    }
}

// Export to global scope
window.StateManager = StateManager;

// Create global instance
window.stateManager = new StateManager();