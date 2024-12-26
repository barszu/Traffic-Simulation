/**
 * A type representing a callback function.
 * @typedef {Function} CallbackType
 */
type CallbackType = () => void;

/**
 * A class for managing and executing callback functions.
 */
class CallbackExecutor {
    /**
     * An array to store the callback functions.
     * @private
     * @type {Function[]}
     */
    private callbacks: Function[] = [];

    /**
     * Adds a callback function to the list.
     *
     * @param {CallbackType} callback - The callback function to add.
     */
    addCallback(callback: CallbackType) {
        this.callbacks.push(callback);
    }

    /**
     * Executes all stored callback functions.
     */
    executeAllCallback() {
        this.callbacks.forEach(callback => {
            callback();
        });
    }
}

export { CallbackExecutor, CallbackType };
