import { BasicSimulation, DescribedGroupType } from "./BasicSimulation";
import { RoadNode } from "../RoadNode";
import { Edge } from "../Edge";

import { calculateCarsGoThroughNumber, config } from "../../appconfig/driving";


class AdvancedSimulation extends BasicSimulation {
  constructor(nodes: Set<RoadNode>, edges: Set<Edge>) { //useless ?
    super(nodes, edges);
  }

  nextGroup(){
    let groupToCars = this.getNumberOfCarsInGroups()

        // do not use same grup if currActiveTime is too much
        
        if (this.currActiveFazesCount > config.maxFazesNoForSignal) {
            groupToCars.delete(this.getActiveGroup())
        }

        // take only groups that waited too long
        const groupToCarsWaitingTooLong = new Map<DescribedGroupType, number>()
        groupToCars.forEach((cars, group) => {
            if (this.waitingTimeForGroup.get(group) as number > config.maxFazesToWait) {
                groupToCarsWaitingTooLong.set(group, cars)
            }
        })

        if (groupToCarsWaitingTooLong.size > 0) {
            groupToCars = groupToCarsWaitingTooLong
        }


        // take group with most cars
        let maxCars = -1
        let maxGroup = null
        groupToCars.forEach((cars, group) => {
            if (cars > maxCars) {
                maxCars = cars
                maxGroup = group
            }
        })

        if (maxGroup === null) {
            throw new Error("No group to take")
        }

        this.setNewGroup(this.describedGroups.indexOf(maxGroup))
  }
}