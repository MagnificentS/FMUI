/**
 * FM-Base Data Binding System
 * Two-way data binding with observer pattern, computed properties,
 * dependency tracking, and batch updates for performance
 */

class DataBinding {
    constructor() {
        this.observers = new Map();
        this.computedProperties = new Map();
        this.dependencies = new Map();
        this.bindings = new Map();
        this.updateQueue = [];
        this.isUpdating = false;
        this.nextTickCallbacks = [];
        
        // Performance tracking
        this.stats = {
            observerCount: 0,
            computedCount: 0,
            bindingCount: 0,
            updateCycles: 0,
            averageUpdateTime: 0
        };
        
        this.initializeObserver();
    }

    /**
     * Initialize the observer system
     */
    initializeObserver() {
        // Create a proxy handler for reactive objects
        this.createProxyHandler();
    }

    /**
     * Create proxy handler for reactive objects
     */
    createProxyHandler() {
        this.proxyHandler = {
            get: (target, property, receiver) => {
                // Track dependency access
                this.trackDependency(target, property);
                
                const value = Reflect.get(target, property, receiver);
                
                // Make nested objects reactive
                if (value && typeof value === 'object' && !this.isProxy(value)) {
                    return this.createReactiveProxy(value);
                }
                
                return value;
            },
            
            set: (target, property, value, receiver) => {
                const oldValue = target[property];
                const result = Reflect.set(target, property, value, receiver);
                
                if (oldValue !== value) {
                    this.notifyPropertyChange(target, property, value, oldValue);
                }
                
                return result;
            },
            
            deleteProperty: (target, property) => {
                const oldValue = target[property];
                const result = Reflect.deleteProperty(target, property);
                
                if (result) {
                    this.notifyPropertyChange(target, property, undefined, oldValue);
                }
                
                return result;
            }
        };
    }

    /**
     * Make an object reactive
     * @param {Object} obj - Object to make reactive
     * @param {string} path - Optional path for nested objects
     */
    reactive(obj, path = '') {
        if (!obj || typeof obj !== 'object') {
            return obj;
        }
        
        if (this.isProxy(obj)) {
            return obj;
        }
        
        return this.createReactiveProxy(obj, path);
    }

    /**
     * Create a reactive proxy for an object
     */
    createReactiveProxy(obj, path = '') {
        const proxy = new Proxy(obj, this.proxyHandler);
        
        // Mark as proxy for identification
        Object.defineProperty(proxy, '__isReactiveProxy', {
            value: true,
            enumerable: false,
            writable: false
        });
        
        // Store path for debugging
        if (path) {
            Object.defineProperty(proxy, '__path', {
                value: path,
                enumerable: false,
                writable: false
            });
        }
        
        // Make existing nested objects reactive
        for (const key in obj) {
            if (obj.hasOwnProperty(key) && obj[key] && typeof obj[key] === 'object') {
                obj[key] = this.createReactiveProxy(obj[key], path ? `${path}.${key}` : key);
            }
        }
        
        return proxy;
    }

    /**
     * Check if object is already a proxy
     */
    isProxy(obj) {
        return obj && obj.__isReactiveProxy === true;
    }

    /**
     * Track dependency access for computed properties
     */
    trackDependency(target, property) {
        const currentComputed = this.currentComputed;
        if (!currentComputed) return;
        
        const targetId = this.getObjectId(target);
        const dependencyKey = `${targetId}.${property}`;
        
        if (!this.dependencies.has(currentComputed)) {
            this.dependencies.set(currentComputed, new Set());
        }
        
        this.dependencies.get(currentComputed).add(dependencyKey);
        
        // Reverse mapping for notifications
        const reverseDeps = this.observers.get(dependencyKey) || new Set();
        reverseDeps.add(currentComputed);
        this.observers.set(dependencyKey, reverseDeps);
    }

    /**
     * Notify observers of property changes
     */
    notifyPropertyChange(target, property, newValue, oldValue) {
        const targetId = this.getObjectId(target);
        const dependencyKey = `${targetId}.${property}`;
        
        // Add to update queue for batch processing
        this.queueUpdate({
            type: 'property-change',
            target,
            property,
            newValue,
            oldValue,
            dependencyKey,
            timestamp: performance.now()
        });
        
        this.scheduleUpdate();
    }

    /**
     * Create a computed property
     * @param {Function} computeFn - Function to compute the value
     * @param {Object} options - Options for the computed property
     */
    computed(computeFn, options = {}) {
        const computedId = this.generateId('computed');
        let cachedValue;
        let isDirty = true;
        let isComputing = false;
        
        const computedProperty = {
            id: computedId,
            compute: computeFn,
            options,
            getValue: () => {
                if (isComputing) {
                    throw new Error(`Circular dependency detected in computed property ${computedId}`);
                }
                
                if (isDirty || !options.cache) {
                    isComputing = true;
                    this.currentComputed = computedId;
                    
                    try {
                        const startTime = performance.now();
                        cachedValue = computeFn();
                        this.stats.averageUpdateTime = 
                            (this.stats.averageUpdateTime + (performance.now() - startTime)) / 2;
                    } finally {
                        this.currentComputed = null;
                        isComputing = false;
                        isDirty = false;
                    }
                }
                
                return cachedValue;
            },
            invalidate: () => {
                isDirty = true;
                if (options.immediate !== false) {
                    this.queueUpdate({
                        type: 'computed-invalidate',
                        computedId,
                        timestamp: performance.now()
                    });
                    this.scheduleUpdate();
                }
            },
            dispose: () => {
                this.disposeComputed(computedId);
            }
        };
        
        this.computedProperties.set(computedId, computedProperty);
        this.stats.computedCount++;
        
        return computedProperty;
    }

    /**
     * Create a watcher for property changes
     * @param {Function} watchFn - Function that returns the value to watch
     * @param {Function} callback - Callback for when value changes
     * @param {Object} options - Watcher options
     */
    watch(watchFn, callback, options = {}) {
        const watcherId = this.generateId('watcher');
        let oldValue;
        let isActive = true;
        
        const watcher = {
            id: watcherId,
            watchFn,
            callback,
            options,
            dispose: () => {
                isActive = false;
                this.disposeWatcher(watcherId);
            }
        };
        
        // Create computed property for the watch function
        const computed = this.computed(() => {
            if (!isActive) return;
            
            const newValue = watchFn();
            
            if (oldValue !== undefined && !this.isEqual(oldValue, newValue)) {
                if (options.immediate || oldValue !== undefined) {
                    this.queueUpdate({
                        type: 'watcher-callback',
                        watcherId,
                        newValue,
                        oldValue,
                        callback,
                        timestamp: performance.now()
                    });
                    this.scheduleUpdate();
                }
            }
            
            oldValue = this.deepClone(newValue);
            return newValue;
        }, { immediate: false });
        
        watcher.computed = computed;
        
        // Get initial value
        if (options.immediate) {
            oldValue = this.deepClone(computed.getValue());
        } else {
            computed.getValue(); // Just to set up dependencies
        }
        
        return watcher;
    }

    /**
     * Bind DOM element to data
     * @param {HTMLElement} element - DOM element to bind
     * @param {Object} bindings - Binding configuration
     */
    bind(element, bindings) {
        const bindingId = this.generateId('binding');
        const elementBindings = [];
        
        for (const [type, config] of Object.entries(bindings)) {
            const binding = this.createBinding(element, type, config);
            if (binding) {
                elementBindings.push(binding);
            }
        }
        
        this.bindings.set(bindingId, {
            element,
            bindings: elementBindings,
            dispose: () => {
                elementBindings.forEach(binding => binding.dispose?.());
                this.bindings.delete(bindingId);
            }
        });
        
        this.stats.bindingCount++;
        
        return this.bindings.get(bindingId);
    }

    /**
     * Create specific binding type
     */
    createBinding(element, type, config) {
        switch (type) {
            case 'text':
                return this.createTextBinding(element, config);
            case 'html':
                return this.createHtmlBinding(element, config);
            case 'attribute':
                return this.createAttributeBinding(element, config);
            case 'style':
                return this.createStyleBinding(element, config);
            case 'class':
                return this.createClassBinding(element, config);
            case 'event':
                return this.createEventBinding(element, config);
            case 'model':
                return this.createModelBinding(element, config);
            default:
                console.warn(`Unknown binding type: ${type}`);
                return null;
        }
    }

    /**
     * Create text content binding
     */
    createTextBinding(element, config) {
        const watcher = this.watch(
            () => this.evaluateExpression(config.expression || config),
            (newValue) => {
                element.textContent = newValue != null ? String(newValue) : '';
            },
            { immediate: true }
        );
        
        return watcher;
    }

    /**
     * Create HTML content binding
     */
    createHtmlBinding(element, config) {
        const watcher = this.watch(
            () => this.evaluateExpression(config.expression || config),
            (newValue) => {
                element.innerHTML = newValue != null ? String(newValue) : '';
            },
            { immediate: true }
        );
        
        return watcher;
    }

    /**
     * Create attribute binding
     */
    createAttributeBinding(element, config) {
        const watchers = [];
        
        for (const [attr, expression] of Object.entries(config)) {
            const watcher = this.watch(
                () => this.evaluateExpression(expression),
                (newValue) => {
                    if (newValue != null) {
                        element.setAttribute(attr, String(newValue));
                    } else {
                        element.removeAttribute(attr);
                    }
                },
                { immediate: true }
            );
            
            watchers.push(watcher);
        }
        
        return {
            dispose: () => watchers.forEach(w => w.dispose())
        };
    }

    /**
     * Create style binding
     */
    createStyleBinding(element, config) {
        const watchers = [];
        
        for (const [property, expression] of Object.entries(config)) {
            const watcher = this.watch(
                () => this.evaluateExpression(expression),
                (newValue) => {
                    element.style[property] = newValue != null ? String(newValue) : '';
                },
                { immediate: true }
            );
            
            watchers.push(watcher);
        }
        
        return {
            dispose: () => watchers.forEach(w => w.dispose())
        };
    }

    /**
     * Create class binding
     */
    createClassBinding(element, config) {
        if (typeof config === 'string') {
            // Simple class expression
            return this.watch(
                () => this.evaluateExpression(config),
                (newValue) => {
                    element.className = newValue != null ? String(newValue) : '';
                },
                { immediate: true }
            );
        }
        
        // Object-based class binding
        const watchers = [];
        
        for (const [className, expression] of Object.entries(config)) {
            const watcher = this.watch(
                () => this.evaluateExpression(expression),
                (shouldHaveClass) => {
                    element.classList.toggle(className, !!shouldHaveClass);
                },
                { immediate: true }
            );
            
            watchers.push(watcher);
        }
        
        return {
            dispose: () => watchers.forEach(w => w.dispose())
        };
    }

    /**
     * Create event binding
     */
    createEventBinding(element, config) {
        const listeners = [];
        
        for (const [eventType, handler] of Object.entries(config)) {
            const eventHandler = (event) => {
                if (typeof handler === 'function') {
                    handler(event);
                } else if (typeof handler === 'string') {
                    this.evaluateExpression(handler, { event });
                }
            };
            
            element.addEventListener(eventType, eventHandler);
            listeners.push({ eventType, handler: eventHandler });
        }
        
        return {
            dispose: () => {
                listeners.forEach(({ eventType, handler }) => {
                    element.removeEventListener(eventType, handler);
                });
            }
        };
    }

    /**
     * Create two-way model binding
     */
    createModelBinding(element, config) {
        const { get, set } = this.parseModelExpression(config);
        
        // Update element when data changes
        const dataWatcher = this.watch(
            () => get(),
            (newValue) => {
                if (element.type === 'checkbox') {
                    element.checked = !!newValue;
                } else if (element.type === 'radio') {
                    element.checked = element.value === String(newValue);
                } else {
                    element.value = newValue != null ? String(newValue) : '';
                }
            },
            { immediate: true }
        );
        
        // Update data when element changes
        const eventType = element.type === 'checkbox' || element.type === 'radio' ? 'change' : 'input';
        const eventHandler = () => {
            let value;
            
            if (element.type === 'checkbox') {
                value = element.checked;
            } else if (element.type === 'radio') {
                value = element.checked ? element.value : get();
            } else if (element.type === 'number') {
                value = element.value ? Number(element.value) : null;
            } else {
                value = element.value;
            }
            
            set(value);
        };
        
        element.addEventListener(eventType, eventHandler);
        
        return {
            dispose: () => {
                dataWatcher.dispose();
                element.removeEventListener(eventType, eventHandler);
            }
        };
    }

    /**
     * Schedule batch update
     */
    scheduleUpdate() {
        if (this.isUpdating) return;
        
        requestAnimationFrame(() => this.processBatchUpdate());
    }

    /**
     * Process batched updates
     */
    processBatchUpdate() {
        if (this.isUpdating || this.updateQueue.length === 0) return;
        
        this.isUpdating = true;
        const startTime = performance.now();
        
        try {
            const updates = this.updateQueue.splice(0);
            const groupedUpdates = this.groupUpdates(updates);
            
            // Process property changes first
            this.processPropertyChanges(groupedUpdates.propertyChanges);
            
            // Then computed invalidations
            this.processComputedInvalidations(groupedUpdates.computedInvalidations);
            
            // Finally watcher callbacks
            this.processWatcherCallbacks(groupedUpdates.watcherCallbacks);
            
            this.stats.updateCycles++;
            this.stats.averageUpdateTime = 
                (this.stats.averageUpdateTime + (performance.now() - startTime)) / 2;
        } finally {
            this.isUpdating = false;
            
            // Process next tick callbacks
            this.processNextTickCallbacks();
            
            // Schedule another update if queue is not empty
            if (this.updateQueue.length > 0) {
                this.scheduleUpdate();
            }
        }
    }

    /**
     * Group updates by type for efficient processing
     */
    groupUpdates(updates) {
        const groups = {
            propertyChanges: [],
            computedInvalidations: [],
            watcherCallbacks: []
        };
        
        for (const update of updates) {
            switch (update.type) {
                case 'property-change':
                    groups.propertyChanges.push(update);
                    break;
                case 'computed-invalidate':
                    groups.computedInvalidations.push(update);
                    break;
                case 'watcher-callback':
                    groups.watcherCallbacks.push(update);
                    break;
            }
        }
        
        return groups;
    }

    /**
     * Process property change updates
     */
    processPropertyChanges(updates) {
        const affectedComputed = new Set();
        
        for (const update of updates) {
            const observers = this.observers.get(update.dependencyKey);
            if (observers) {
                observers.forEach(computedId => affectedComputed.add(computedId));
            }
        }
        
        // Invalidate affected computed properties
        for (const computedId of affectedComputed) {
            const computed = this.computedProperties.get(computedId);
            if (computed) {
                computed.invalidate();
            }
        }
    }

    /**
     * Process computed invalidation updates
     */
    processComputedInvalidations(updates) {
        for (const update of updates) {
            const computed = this.computedProperties.get(update.computedId);
            if (computed && computed.options.immediate !== false) {
                computed.getValue(); // Trigger recomputation
            }
        }
    }

    /**
     * Process watcher callback updates
     */
    processWatcherCallbacks(updates) {
        for (const update of updates) {
            try {
                update.callback(update.newValue, update.oldValue);
            } catch (error) {
                console.error(`Error in watcher callback ${update.watcherId}:`, error);
            }
        }
    }

    /**
     * Queue update for batch processing
     */
    queueUpdate(update) {
        this.updateQueue.push(update);
    }

    /**
     * Schedule callback for next tick
     */
    nextTick(callback) {
        this.nextTickCallbacks.push(callback);
    }

    /**
     * Process next tick callbacks
     */
    processNextTickCallbacks() {
        const callbacks = this.nextTickCallbacks.splice(0);
        for (const callback of callbacks) {
            try {
                callback();
            } catch (error) {
                console.error('Error in nextTick callback:', error);
            }
        }
    }

    /**
     * Utility methods
     */
    evaluateExpression(expression, context = {}) {
        if (typeof expression === 'function') {
            return expression(context);
        }
        
        if (typeof expression === 'string') {
            // Simple property access for now
            // In a real implementation, you'd use a proper expression parser
            return this.getNestedProperty(context, expression);
        }
        
        return expression;
    }

    parseModelExpression(expression) {
        // Simple implementation - in real app you'd parse complex expressions
        if (typeof expression === 'string') {
            return {
                get: () => this.getNestedProperty(window, expression),
                set: (value) => this.setNestedProperty(window, expression, value)
            };
        }
        
        return expression;
    }

    getNestedProperty(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }

    setNestedProperty(obj, path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((current, key) => current[key] = current[key] || {}, obj);
        target[lastKey] = value;
    }

    getObjectId(obj) {
        if (!obj.__reactiveId) {
            Object.defineProperty(obj, '__reactiveId', {
                value: this.generateId('object'),
                enumerable: false,
                writable: false
            });
        }
        return obj.__reactiveId;
    }

    generateId(prefix = 'id') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj);
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        
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
        if (a == null || b == null) return false;
        if (typeof a !== typeof b) return false;
        
        if (typeof a === 'object') {
            const keysA = Object.keys(a);
            const keysB = Object.keys(b);
            
            if (keysA.length !== keysB.length) return false;
            
            for (const key of keysA) {
                if (!this.isEqual(a[key], b[key])) return false;
            }
            
            return true;
        }
        
        return false;
    }

    /**
     * Cleanup methods
     */
    disposeComputed(computedId) {
        this.computedProperties.delete(computedId);
        
        // Clean up dependencies
        const deps = this.dependencies.get(computedId);
        if (deps) {
            deps.forEach(dep => {
                const observers = this.observers.get(dep);
                if (observers) {
                    observers.delete(computedId);
                    if (observers.size === 0) {
                        this.observers.delete(dep);
                    }
                }
            });
            this.dependencies.delete(computedId);
        }
        
        this.stats.computedCount--;
    }

    disposeWatcher(watcherId) {
        // Watcher cleanup is handled by the watcher itself
    }

    /**
     * Get binding statistics
     */
    getStats() {
        return { ...this.stats };
    }

    /**
     * Clear all bindings and observers
     */
    destroy() {
        this.observers.clear();
        this.computedProperties.clear();
        this.dependencies.clear();
        this.bindings.forEach(binding => binding.dispose());
        this.bindings.clear();
        this.updateQueue.length = 0;
        this.nextTickCallbacks.length = 0;
    }
}

// Export to global scope
window.DataBinding = DataBinding;

// Create global instance
window.dataBinding = new DataBinding();