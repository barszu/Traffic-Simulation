
type CallbackType = () => void;

class CallbackExecutor {

    private callbacks: Function[] = [];

    addCallback(callback: CallbackType) {
        this.callbacks.push(callback);
    }

    executeAllCallback() {
        this.callbacks.forEach((callback) => {
            callback();
        });
    }
}

export { CallbackExecutor, CallbackType };