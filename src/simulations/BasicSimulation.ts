import { RoadNode } from "../RoadNode";
import { Edge } from "../Edge";
import { CallbackExecutor, CallbackType } from "../util/CallbackExecutor";
import { AbstractSimulation, isLoopDetected } from "./AbstractSimulation";

import { calculateCarsGoThroughNumber, config } from "../../appconfig/driving";

class BasicSimulation extends AbstractSimulation {
    protected nextGroup() {
        this.setNewGroup(
            (this.currActiveGroupIdx + 1) % this.describedGroups.length
        );
    }

    nextStep(): isLoopDetected {
        // is recoursion detected, TODO
        this.goCars();
        this.nextGroup();
        this.lightChangedCallbacks.executeAllCallback();
        if (this.describedGroups.length === 1) {
            return true;
        }
        return false;
    }
}

export { BasicSimulation };
