import { CallbackExecutor, CallbackType } from '../src/util/CallbackExecutor';

describe('CallbackExecutor', () => {
    let executor: CallbackExecutor;

    beforeEach(() => {
        executor = new CallbackExecutor();
    });

    it('should add and execute a single callback', () => {
        const mockCallback = jest.fn();
        executor.addCallback(mockCallback);
        executor.executeAllCallback();
        expect(mockCallback).toHaveBeenCalled();
    });

    it('should add and execute multiple callbacks', () => {
        const mockCallback1 = jest.fn();
        const mockCallback2 = jest.fn();
        executor.addCallback(mockCallback1);
        executor.addCallback(mockCallback2);
        executor.executeAllCallback();
        expect(mockCallback1).toHaveBeenCalled();
        expect(mockCallback2).toHaveBeenCalled();
    });

    it('should not execute any callbacks if none were added', () => {
        const mockCallback = jest.fn();
        executor.executeAllCallback();
        expect(mockCallback).not.toHaveBeenCalled();
    });
});