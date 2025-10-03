/**
 * FM-Base Utilities
 * Common utility functions for number formatting, date/time operations,
 * deep object manipulation, and performance helpers
 */

class FMUtils {
    constructor() {
        this.formatters = new Map();
        this.memoCache = new Map();
        this.debounceCache = new Map();
        this.throttleCache = new Map();
        
        this.initializeFormatters();
    }

    /**
     * Initialize number and date formatters
     */
    initializeFormatters() {
        // Currency formatters for different locales
        this.formatters.set('currency-gbp', new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }));
        
        this.formatters.set('currency-eur', new Intl.NumberFormat('en-EU', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }));
        
        this.formatters.set('currency-usd', new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }));
        
        // Percentage formatter
        this.formatters.set('percentage', new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }));
        
        // Date formatters
        this.formatters.set('date-short', new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }));
        
        this.formatters.set('date-long', new Intl.DateTimeFormat('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }));
        
        this.formatters.set('time', new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
        }));
    }

    // ==================== NUMBER FORMATTING ====================

    /**
     * Format currency with locale-specific formatting
     * @param {number} amount - Amount to format
     * @param {string} currency - Currency code (GBP, EUR, USD)
     * @param {object} options - Additional formatting options
     */
    formatCurrency(amount, currency = 'GBP', options = {}) {
        if (amount == null || isNaN(amount)) return '—';
        
        const formatterKey = `currency-${currency.toLowerCase()}`;
        let formatter = this.formatters.get(formatterKey);
        
        if (!formatter) {
            formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency.toUpperCase(),
                ...options
            });
            this.formatters.set(formatterKey, formatter);
        }
        
        // Handle large numbers with suffixes
        if (options.compact && Math.abs(amount) >= 1000) {
            return this.formatCompactNumber(amount, currency);
        }
        
        return formatter.format(amount);
    }

    /**
     * Format large numbers with K, M, B suffixes
     * @param {number} num - Number to format
     * @param {string} currency - Optional currency for prefix
     */
    formatCompactNumber(num, currency = null) {
        if (num == null || isNaN(num)) return '—';
        
        const absNum = Math.abs(num);
        const sign = num < 0 ? '-' : '';
        const currencySymbol = currency ? this.getCurrencySymbol(currency) : '';
        
        if (absNum >= 1e9) {
            return `${sign}${currencySymbol}${(absNum / 1e9).toFixed(1)}B`;
        } else if (absNum >= 1e6) {
            return `${sign}${currencySymbol}${(absNum / 1e6).toFixed(1)}M`;
        } else if (absNum >= 1e3) {
            return `${sign}${currencySymbol}${(absNum / 1e3).toFixed(1)}K`;
        }
        
        return `${sign}${currencySymbol}${absNum}`;
    }

    /**
     * Get currency symbol for currency code
     */
    getCurrencySymbol(currency) {
        const symbols = {
            GBP: '£',
            EUR: '€',
            USD: '$'
        };
        return symbols[currency.toUpperCase()] || currency;
    }

    /**
     * Format percentage with customizable precision
     * @param {number} value - Value to format as percentage (0.1 = 10%)
     * @param {number} precision - Decimal places
     */
    formatPercentage(value, precision = 1) {
        if (value == null || isNaN(value)) return '—';
        
        const percentage = value * 100;
        return `${percentage.toFixed(precision)}%`;
    }

    /**
     * Format rating out of maximum (e.g., 18/20)
     * @param {number} rating - Current rating
     * @param {number} maxRating - Maximum possible rating
     * @param {object} options - Formatting options
     */
    formatRating(rating, maxRating = 20, options = {}) {
        if (rating == null || isNaN(rating)) return '—';
        
        const { showMax = true, precision = 0, colorCode = false } = options;
        const formattedRating = rating.toFixed(precision);
        
        let result = showMax ? `${formattedRating}/${maxRating}` : formattedRating;
        
        if (colorCode) {
            const percentage = rating / maxRating;
            const colorClass = this.getRatingColorClass(percentage);
            result = `<span class="${colorClass}">${result}</span>`;
        }
        
        return result;
    }

    /**
     * Get color class based on rating percentage
     */
    getRatingColorClass(percentage) {
        if (percentage >= 0.8) return 'rating-excellent';
        if (percentage >= 0.6) return 'rating-good';
        if (percentage >= 0.4) return 'rating-average';
        if (percentage >= 0.2) return 'rating-poor';
        return 'rating-terrible';
    }

    /**
     * Format number with thousand separators
     * @param {number} num - Number to format
     * @param {string} separator - Thousand separator (default: comma)
     */
    formatNumber(num, separator = ',') {
        if (num == null || isNaN(num)) return '—';
        
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    }

    // ==================== DATE/TIME FORMATTING ====================

    /**
     * Format date with various styles
     * @param {Date|string|number} date - Date to format
     * @param {string} style - Format style (short, long, relative, etc.)
     * @param {object} options - Additional options
     */
    formatDate(date, style = 'short', options = {}) {
        const dateObj = this.parseDate(date);
        if (!dateObj) return '—';
        
        switch (style) {
            case 'short':
                return this.formatters.get('date-short').format(dateObj);
            case 'long':
                return this.formatters.get('date-long').format(dateObj);
            case 'relative':
                return this.formatRelativeDate(dateObj);
            case 'time':
                return this.formatters.get('time').format(dateObj);
            case 'datetime':
                return `${this.formatDate(dateObj, 'short')} ${this.formatDate(dateObj, 'time')}`;
            case 'iso':
                return dateObj.toISOString().split('T')[0];
            default:
                return dateObj.toLocaleDateString();
        }
    }

    /**
     * Parse various date formats into Date object
     */
    parseDate(date) {
        if (date instanceof Date) return date;
        if (typeof date === 'string' || typeof date === 'number') {
            const parsed = new Date(date);
            return isNaN(parsed.getTime()) ? null : parsed;
        }
        return null;
    }

    /**
     * Format relative date (e.g., "2 days ago", "in 3 hours")
     * @param {Date} date - Date to format
     * @param {Date} relativeTo - Date to compare against (default: now)
     */
    formatRelativeDate(date, relativeTo = new Date()) {
        const diffMs = date.getTime() - relativeTo.getTime();
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);
        const diffWeeks = Math.floor(diffDays / 7);
        const diffMonths = Math.floor(diffDays / 30);
        const diffYears = Math.floor(diffDays / 365);
        
        const future = diffMs > 0;
        const prefix = future ? 'in ' : '';
        const suffix = future ? '' : ' ago';
        
        const abs = Math.abs;
        
        if (abs(diffYears) >= 1) {
            return `${prefix}${abs(diffYears)} year${abs(diffYears) !== 1 ? 's' : ''}${suffix}`;
        } else if (abs(diffMonths) >= 1) {
            return `${prefix}${abs(diffMonths)} month${abs(diffMonths) !== 1 ? 's' : ''}${suffix}`;
        } else if (abs(diffWeeks) >= 1) {
            return `${prefix}${abs(diffWeeks)} week${abs(diffWeeks) !== 1 ? 's' : ''}${suffix}`;
        } else if (abs(diffDays) >= 1) {
            return `${prefix}${abs(diffDays)} day${abs(diffDays) !== 1 ? 's' : ''}${suffix}`;
        } else if (abs(diffHours) >= 1) {
            return `${prefix}${abs(diffHours)} hour${abs(diffHours) !== 1 ? 's' : ''}${suffix}`;
        } else if (abs(diffMinutes) >= 1) {
            return `${prefix}${abs(diffMinutes)} minute${abs(diffMinutes) !== 1 ? 's' : ''}${suffix}`;
        } else {
            return 'just now';
        }
    }

    /**
     * Get age from birth date
     * @param {Date|string} birthDate - Birth date
     * @param {Date} referenceDate - Reference date (default: today)
     */
    calculateAge(birthDate, referenceDate = new Date()) {
        const birth = this.parseDate(birthDate);
        if (!birth) return null;
        
        let age = referenceDate.getFullYear() - birth.getFullYear();
        const monthDiff = referenceDate.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    }

    // ==================== OBJECT UTILITIES ====================

    /**
     * Deep clone an object
     * @param {*} obj - Object to clone
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj);
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (obj instanceof Set) return new Set(Array.from(obj).map(item => this.deepClone(item)));
        if (obj instanceof Map) {
            const cloned = new Map();
            for (const [key, value] of obj) {
                cloned.set(this.deepClone(key), this.deepClone(value));
            }
            return cloned;
        }
        
        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = this.deepClone(obj[key]);
            }
        }
        return cloned;
    }

    /**
     * Deep merge objects
     * @param {object} target - Target object
     * @param {...object} sources - Source objects
     */
    deepMerge(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();
        
        if (this.isObject(target) && this.isObject(source)) {
            for (const key in source) {
                if (this.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    this.deepMerge(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }
        
        return this.deepMerge(target, ...sources);
    }

    /**
     * Check if value is a plain object
     */
    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    }

    /**
     * Get nested property value
     * @param {object} obj - Object to search
     * @param {string} path - Dot-notation path
     * @param {*} defaultValue - Default value if not found
     */
    get(obj, path, defaultValue = undefined) {
        if (!obj || !path) return defaultValue;
        
        const keys = path.split('.');
        let current = obj;
        
        for (const key of keys) {
            if (current == null || typeof current !== 'object') {
                return defaultValue;
            }
            current = current[key];
        }
        
        return current !== undefined ? current : defaultValue;
    }

    /**
     * Set nested property value
     * @param {object} obj - Object to modify
     * @param {string} path - Dot-notation path
     * @param {*} value - Value to set
     */
    set(obj, path, value) {
        if (!obj || !path) return obj;
        
        const keys = path.split('.');
        let current = obj;
        
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!(key in current) || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }
        
        current[keys[keys.length - 1]] = value;
        return obj;
    }

    /**
     * Check if objects are deeply equal
     * @param {*} a - First value
     * @param {*} b - Second value
     */
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

    /**
     * Pick specific properties from object
     * @param {object} obj - Source object
     * @param {array} keys - Keys to pick
     */
    pick(obj, keys) {
        const result = {};
        for (const key of keys) {
            if (key in obj) {
                result[key] = obj[key];
            }
        }
        return result;
    }

    /**
     * Omit specific properties from object
     * @param {object} obj - Source object
     * @param {array} keys - Keys to omit
     */
    omit(obj, keys) {
        const result = { ...obj };
        for (const key of keys) {
            delete result[key];
        }
        return result;
    }

    // ==================== PERFORMANCE UTILITIES ====================

    /**
     * Debounce function execution
     * @param {function} func - Function to debounce
     * @param {number} delay - Delay in milliseconds
     * @param {object} options - Additional options
     */
    debounce(func, delay, options = {}) {
        const key = func.toString() + delay;
        
        if (this.debounceCache.has(key)) {
            return this.debounceCache.get(key);
        }
        
        let timeoutId;
        let lastArgs;
        
        const debounced = (...args) => {
            lastArgs = args;
            clearTimeout(timeoutId);
            
            timeoutId = setTimeout(() => {
                if (options.leading && timeoutId) {
                    func.apply(this, lastArgs);
                } else {
                    func.apply(this, lastArgs);
                }
            }, delay);
            
            if (options.leading && !timeoutId) {
                func.apply(this, args);
            }
        };
        
        debounced.cancel = () => {
            clearTimeout(timeoutId);
            timeoutId = null;
        };
        
        debounced.flush = () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
                func.apply(this, lastArgs);
                timeoutId = null;
            }
        };
        
        this.debounceCache.set(key, debounced);
        return debounced;
    }

    /**
     * Throttle function execution
     * @param {function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @param {object} options - Additional options
     */
    throttle(func, limit, options = {}) {
        const key = func.toString() + limit;
        
        if (this.throttleCache.has(key)) {
            return this.throttleCache.get(key);
        }
        
        let inThrottle;
        let lastArgs;
        
        const throttled = (...args) => {
            lastArgs = args;
            
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                
                setTimeout(() => {
                    inThrottle = false;
                    if (options.trailing && lastArgs) {
                        func.apply(this, lastArgs);
                    }
                }, limit);
            }
        };
        
        this.throttleCache.set(key, throttled);
        return throttled;
    }

    /**
     * Memoize function results
     * @param {function} func - Function to memoize
     * @param {function} keyGenerator - Custom key generator
     */
    memoize(func, keyGenerator = (...args) => JSON.stringify(args)) {
        const cache = new Map();
        
        const memoized = (...args) => {
            const key = keyGenerator(...args);
            
            if (cache.has(key)) {
                return cache.get(key);
            }
            
            const result = func.apply(this, args);
            cache.set(key, result);
            return result;
        };
        
        memoized.cache = cache;
        memoized.clear = () => cache.clear();
        
        return memoized;
    }

    /**
     * Measure function execution time
     * @param {function} func - Function to measure
     * @param {string} label - Label for measurement
     */
    measure(func, label = 'Execution') {
        return (...args) => {
            const start = performance.now();
            const result = func.apply(this, args);
            const end = performance.now();
            
            console.log(`${label} took ${end - start} milliseconds`);
            return result;
        };
    }

    /**
     * Create a performance monitor
     * @param {string} name - Monitor name
     */
    createPerformanceMonitor(name) {
        const times = [];
        
        return {
            start: () => performance.now(),
            end: (startTime) => {
                const duration = performance.now() - startTime;
                times.push(duration);
                return duration;
            },
            getStats: () => ({
                count: times.length,
                total: times.reduce((sum, time) => sum + time, 0),
                average: times.length ? times.reduce((sum, time) => sum + time, 0) / times.length : 0,
                min: Math.min(...times),
                max: Math.max(...times)
            }),
            reset: () => times.length = 0
        };
    }

    // ==================== UTILITY FUNCTIONS ====================

    /**
     * Generate unique ID
     * @param {string} prefix - Optional prefix
     * @param {number} length - ID length
     */
    generateId(prefix = '', length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = prefix;
        
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return result;
    }

    /**
     * Generate UUID v4
     */
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Clamp number between min and max
     * @param {number} num - Number to clamp
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     */
    clamp(num, min, max) {
        return Math.min(Math.max(num, min), max);
    }

    /**
     * Linear interpolation
     * @param {number} start - Start value
     * @param {number} end - End value
     * @param {number} t - Interpolation factor (0-1)
     */
    lerp(start, end, t) {
        return start + (end - start) * this.clamp(t, 0, 1);
    }

    /**
     * Map value from one range to another
     * @param {number} value - Value to map
     * @param {number} inMin - Input minimum
     * @param {number} inMax - Input maximum
     * @param {number} outMin - Output minimum
     * @param {number} outMax - Output maximum
     */
    mapRange(value, inMin, inMax, outMin, outMax) {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }

    /**
     * Get random number between min and max
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @param {boolean} integer - Return integer
     */
    random(min = 0, max = 1, integer = false) {
        const value = Math.random() * (max - min) + min;
        return integer ? Math.floor(value) : value;
    }

    /**
     * Shuffle array using Fisher-Yates algorithm
     * @param {array} array - Array to shuffle
     */
    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Group array elements by key
     * @param {array} array - Array to group
     * @param {string|function} keyFn - Key function or property name
     */
    groupBy(array, keyFn) {
        const key = typeof keyFn === 'string' ? item => item[keyFn] : keyFn;
        
        return array.reduce((groups, item) => {
            const groupKey = key(item);
            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(item);
            return groups;
        }, {});
    }

    /**
     * Sort array by multiple criteria
     * @param {array} array - Array to sort
     * @param {array} sortBy - Sort criteria
     */
    sortBy(array, sortBy) {
        return [...array].sort((a, b) => {
            for (const { key, direction = 'asc' } of sortBy) {
                const aVal = typeof key === 'string' ? this.get(a, key) : key(a);
                const bVal = typeof key === 'string' ? this.get(b, key) : key(b);
                
                if (aVal < bVal) return direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }

    /**
     * Clear all caches
     */
    clearCaches() {
        this.memoCache.clear();
        this.debounceCache.clear();
        this.throttleCache.clear();
    }

    /**
     * Get utility statistics
     */
    getStats() {
        return {
            formatters: this.formatters.size,
            memoCache: this.memoCache.size,
            debounceCache: this.debounceCache.size,
            throttleCache: this.throttleCache.size
        };
    }
}

// Export to global scope
window.FMUtils = FMUtils;

// Create global instance
window.fmUtils = new FMUtils();