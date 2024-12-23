import { RoadNode } from "../RoadNode";
import { Edge } from "../Edge";
import { MarkedNodes } from "../MarkedNodes";
import { isSameAlign } from "../Direction";
import { CallbackExecutor, CallbackType } from "../util/CallbackExecutor";

import { calculateCarsGoThroughNumber, config } from "../../appconfig/driving";
import { MatrixGraph } from "../graph/MatrixGraph";
import { getAllIndependentSets } from "../graph/independentSet";

type DescribedGroupType = { startNodes: Set<RoadNode>; edges: Set<Edge> };
type GroupType = Set<Edge>;
type GroupNodesType = Set<RoadNode>;

type isLoopDetected = boolean;

interface SimulationStatus {
    recentActiveGroup: DescribedGroupType;
    recentActiveFazeTime: number;
    waitingTimeForGroup: Map<DescribedGroupType, number>;
    carsInGroups: Map<DescribedGroupType, number>;
}

type DescribedGroupTypeAsStrings = Array<string>;

interface SimulationStatusAsStrings {
    recentActiveGroup: DescribedGroupTypeAsStrings;
    recentActiveFazeTime: number;
    waitingTimeForGroup: Map<DescribedGroupTypeAsStrings, number>;
    carsInGroups: Map<DescribedGroupTypeAsStrings, number>;
}

function groupBy(nodes: Set<RoadNode>, edges: Set<Edge>, preGivenCollisions: MatrixGraph<Edge>): Array<GroupType> {
    //funkcja do predefiniowania grup, mozna dopisac automatyczne wykrywanie kolizji, ktorych uzytkownik nie zadeklarowal

    return getAllIndependentSets(preGivenCollisions);
}

function describeGroup(group: Array<GroupType>): Array<DescribedGroupType> {
    return group.map(edges => {
        const startNodes = new Set<RoadNode>();
        edges.forEach(edge => {
            startNodes.add(edge.startNode);
        });
        return { startNodes, edges };
    });
}

abstract class AbstractSimulation {
    readonly describedGroups: Array<DescribedGroupType>;

    readonly allNodes: Set<RoadNode>;
    readonly allEdges: Set<Edge>;

    private readonly allNodesMap = new Map<string, RoadNode>();
    readonly waitingTimeForGroup = new Map<DescribedGroupType, number>();

    protected currActiveGroupIdx = 0;
    protected currActiveFazesCount = 0;

    readonly lightChangedCallbacks = new CallbackExecutor();
    readonly carAddedCallbacks = new CallbackExecutor();
    readonly lightStayCallbacks = new CallbackExecutor();

    private lastAddedCar: string | RoadNode | Edge = "";

    getWhereLastCarAdded(): string | RoadNode | Edge {
        return this.lastAddedCar;
    }

    addOnLightsChangeCallback(callback: CallbackType) {
        this.lightChangedCallbacks.addCallback(callback);
    }

    addOnCarAddedCallback(callback: CallbackType) {
        this.carAddedCallbacks.addCallback(callback);
    }

    addOnLightStayCallback(callback: CallbackType) {
        this.lightStayCallbacks.addCallback(callback);
    }

    constructor(nodes: Set<RoadNode>, edges: Set<Edge>, preGivenCollisions: MatrixGraph<Edge>) {
        this.allNodes = nodes;
        this.allEdges = edges;
        const groups = groupBy(nodes, edges, preGivenCollisions);
        this.describedGroups = describeGroup(groups);
        nodes.forEach(node => this.allNodesMap.set(node.toString(), node));
        this.describedGroups.forEach(group => this.waitingTimeForGroup.set(group, 0));
    }

    getActiveGroup(): DescribedGroupType {
        return this.describedGroups[this.currActiveGroupIdx];
    }

    getStatus(): SimulationStatus {
        return {
            recentActiveGroup: this.getActiveGroup(),
            recentActiveFazeTime: this.currActiveFazesCount,
            waitingTimeForGroup: this.waitingTimeForGroup,
            carsInGroups: this.getNumberOfCarsInGroups(),
        };
    }

    getStatusAsString(): SimulationStatusAsStrings {
        return {
            recentActiveGroup: Array.from(this.getActiveGroup().edges).map(edge => edge.toString()),
            recentActiveFazeTime: this.currActiveFazesCount,
            waitingTimeForGroup: new Map(
                Array.from(this.waitingTimeForGroup).map(([group, time]) => [
                    Array.from(group.edges).map(edge => edge.toString()),
                    time,
                ])
            ),
            carsInGroups: this.getNumberOfCarsInGroupsAsString(),
        };
    }

    getNumberOfCarsInGroupsAsString(): Map<DescribedGroupTypeAsStrings, number> {
        return new Map(
            Array.from(this.getNumberOfCarsInGroups()).map(([group, cars]) => [
                Array.from(group.edges).map(edge => edge.toString()),
                cars,
            ])
        );
    }

    protected addWaitingTime(excludedGroup: DescribedGroupType) {
        this.describedGroups.forEach(group => {
            if (group === excludedGroup) {
                this.waitingTimeForGroup.set(group, 0);
            } else {
                this.waitingTimeForGroup.set(group, (this.waitingTimeForGroup.get(group) as number) + 1);
            }
        });
    }

    protected setNewGroup(groupIdx: number) {
        if (this.currActiveGroupIdx === groupIdx) {
            this.addWaitingTime(this.getActiveGroup()); //using old group
            this.currActiveFazesCount++;

            this.lightStayCallbacks.executeAllCallback();
        } else {
            this.currActiveGroupIdx = groupIdx;
            this.addWaitingTime(this.getActiveGroup()); //using new group
            this.currActiveFazesCount = 0;

            this.lightChangedCallbacks.executeAllCallback();
        }
    }

    protected abstract nextGroup(): void;

    addCar(nodeName: string | RoadNode | Edge) {
        if (typeof nodeName === "string") {
            const node = this.allNodesMap.get(nodeName);
            if (node === undefined) {
                throw new Error("Provided Node by name does not exist as Node");
            }
            node.addCar(); // using references it will work and i will modify same node in group edges etc...
        } else
            switch (nodeName.constructor) {
                case RoadNode:
                    // check if node is in nodes
                    if (this.allNodes.has(nodeName as RoadNode)) {
                        (nodeName as RoadNode).addCar();
                    } else {
                        throw new Error("Node is not in nodes");
                    }
                    break;
                case Edge:
                    // check if edge is in edges
                    if (this.allEdges.has(nodeName as Edge)) {
                        (nodeName as Edge).startNode.addCar();
                    } else {
                        throw new Error("Edge is not in edges");
                    }
                    break;
                default:
                    throw new Error("Invalid argument");
            }

        this.lastAddedCar = nodeName;
        this.carAddedCallbacks.executeAllCallback();
    }

    protected goCars() {
        const group = this.getActiveGroup();
        group.startNodes.forEach(node => {
            const carsThrought = calculateCarsGoThroughNumber();
            for (let i = 0; i < carsThrought; i++) {
                node.tryToRemoveCar();
            }
        });
    }

    protected getNumberOfCarsInGroups(): Map<DescribedGroupType, number> {
        const groupToCars = new Map<DescribedGroupType, number>();
        this.describedGroups.forEach(group => {
            let cars = 0;
            group.startNodes.forEach(node => {
                cars += node.getNumberOfCars();
            });
            groupToCars.set(group, cars);
        });
        return groupToCars;
    }

    abstract nextStep(): isLoopDetected;
}

export { AbstractSimulation, DescribedGroupType, SimulationStatus, isLoopDetected, GroupNodesType, GroupType };
