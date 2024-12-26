import { AbstractSimulation, isLoopDetected } from "./AbstractSimulation";

/**
 * A class representing a basic traffic simulation.
 * Simulation do not use number of cars waiting for signal
 * Extends the AbstractSimulation class.
 */
class BasicSimulation extends AbstractSimulation {
    /**
     * Determines the next group in the simulation.
     * Sets the new group to the next group in the list, wrapping around if necessary.
     */
    protected nextGroup() {
        this.setNewGroup((this.currActiveGroupIdx + 1) % this.describedGroups.length);
    }

    /**
     * Performs the next step in the simulation.
     * Moves cars through the active group and determines the next group.
     * Callbacks will be invoked through the nextGroup method.
     * @returns {isLoopDetected} - Whether a loop was detected.
     */
    nextStep(): isLoopDetected {
        this.goCars();
        this.nextGroup();
        if (this.describedGroups.length === 1) {
            return true;
        }
        return false;
    }
}

export { BasicSimulation };
