import { BasicSimulation } from "./BasicSimulation";
import { DescribedGroupType } from "./AbstractSimulation";
import { config } from "../../appconfig/driving";

/**
 * A class representing an advanced traffic simulation (using number of cars waiting for traffic signal).
 * Extends the BasicSimulation class. (taking nextStep() method from BasicSimulation)
 */
class AdvancedSimulation extends BasicSimulation {
    /**
     * Determines the next group in the simulation.
     * Selects the group with the most cars, considering waiting time and maximum fazes.
     * @throws {Error} - If no group is available to take.
     */
    nextGroup() {
        let groupToCars = this.getNumberOfCarsInGroups();

        // Do not use the same group if currActiveFazesCount is too high
        if (this.currActiveFazesCount > config.maxFazesNoForSignal) {
            groupToCars.delete(this.getActiveGroup());
        }

        // Special scenario where only groups that waited too long are considered
        const groupToCarsWaitingTooLong = new Map<DescribedGroupType, number>();
        groupToCars.forEach((cars, group) => {
            if ((this.waitingTimeForGroup.get(group) as number) > config.maxFazesToWait) {
                groupToCarsWaitingTooLong.set(group, cars);
            }
        });

        if (groupToCarsWaitingTooLong.size > 0) {
            groupToCars = groupToCarsWaitingTooLong;
        }

        // Take the group with the most cars
        let maxCars = -1;
        let maxGroup: DescribedGroupType | null = null;
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
