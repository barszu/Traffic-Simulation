import { BasicSimulation } from "./BasicSimulation";
import { DescribedGroupType } from "./AbstractSimulation";

import { calculateCarsGoThroughNumber, config } from "../../appconfig/driving";

class AdvancedSimulation extends BasicSimulation {
    nextGroup() {
        let groupToCars = this.getNumberOfCarsInGroups();

        // do not use same grup if currActiveFazesCount is too much

        if (this.currActiveFazesCount > config.maxFazesNoForSignal) {
            groupToCars.delete(this.getActiveGroup());
        }

        // scenario where take only groups that waited too long
        const groupToCarsWaitingTooLong = new Map<DescribedGroupType, number>();
        groupToCars.forEach((cars, group) => {
            if ((this.waitingTimeForGroup.get(group) as number) > config.maxFazesToWait) {
                groupToCarsWaitingTooLong.set(group, cars);
            }
        });

        if (groupToCarsWaitingTooLong.size > 0) {
            groupToCars = groupToCarsWaitingTooLong;
        }

        // take group with most cars
        let maxCars = -1;
        let maxGroup = null;
        groupToCars.forEach((cars, group) => {
            if (cars > maxCars) {
                maxCars = cars;
                maxGroup = group;
            }
        });

        if (maxGroup === null) {
            throw new Error("No group to take");
        }
        this.setNewGroup(this.describedGroups.indexOf(maxGroup));
    }
}

export { AdvancedSimulation };
