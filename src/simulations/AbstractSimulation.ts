import { RoadNode } from "../RoadNode";
import { Edge } from "../Edge";
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

/**
 * Groups nodes and edges into independent sets.
 * function for predefining groups, can add automatic detection of collisions not declared by the user
 * @param {Set<RoadNode>} nodes - The set of road nodes.
 * @param {Set<Edge>} edges - The set of edges.
 * @param {MatrixGraph<Edge>} preGivenCollisions - The matrix graph of pre-given collisions.
 * @returns {Array<GroupType>} - An array of independent sets.
 */
function groupBy(nodes: Set<RoadNode>, edges: Set<Edge>, preGivenCollisions: MatrixGraph<Edge>): Array<GroupType> {
    return getAllIndependentSets(preGivenCollisions);
}

/**
 * Describes groups of edges and their start nodes.
 * @param {Array<GroupType>} group - An array of groups of edges.
 * @returns {Array<DescribedGroupType>} - An array of described groups.
 */
function describeGroup(group: Array<GroupType>): Array<DescribedGroupType> {
    return group.map(edges => {
        const startNodes = new Set<RoadNode>();
        edges.forEach(edge => {
            startNodes.add(edge.startNode);
        });
        return { startNodes, edges };
    });
}

/**
 * An abstract class representing a traffic simulation.
 */
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

    /**
     * Gets the location where the last car was added.
     * @returns {string | RoadNode | Edge} - The location where the last car was added.
     */
    getWhereLastCarAdded(): string | RoadNode | Edge {
        return this.lastAddedCar;
    }

    /**
     * Adds a callback to be executed when the lights change.
     * @param {CallbackType} callback - The callback function to add.
     */
    addOnLightsChangeCallback(callback: CallbackType) {
        this.lightChangedCallbacks.addCallback(callback);
    }

    /**
     * Adds a callback to be executed when a car is added.
     * @param {CallbackType} callback - The callback function to add.
     */
    addOnCarAddedCallback(callback: CallbackType) {
        this.carAddedCallbacks.addCallback(callback);
    }

    /**
     * Adds a callback to be executed when the lights stay the same.
     * @param {CallbackType} callback - The callback function to add.
     */
    addOnLightStayCallback(callback: CallbackType) {
        this.lightStayCallbacks.addCallback(callback);
    }

    /**
     * Creates an instance of AbstractSimulation.
     * @param {Set<RoadNode>} nodes - The set of road nodes.
     * @param {Set<Edge>} edges - The set of edges.
     * @param {MatrixGraph<Edge>} preGivenCollisions - The matrix graph of pre-given collisions.
     */
    constructor(nodes: Set<RoadNode>, edges: Set<Edge>, preGivenCollisions: MatrixGraph<Edge>) {
        this.allNodes = nodes;
        this.allEdges = edges;
        const groups = groupBy(nodes, edges, preGivenCollisions);
        this.describedGroups = describeGroup(groups);
        nodes.forEach(node => this.allNodesMap.set(node.toString(), node));
        this.describedGroups.forEach(group => this.waitingTimeForGroup.set(group, 0));
    }

    /**
     * Gets the currently active group.
     * @returns {DescribedGroupType} - The currently active group.
     */
    getActiveGroup(): DescribedGroupType {
        return this.describedGroups[this.currActiveGroupIdx];
    }

    /**
     * Gets the current status of the simulation.
     * @returns {SimulationStatus} - The current status of the simulation.
     */
    getStatus(): SimulationStatus {
        return {
            recentActiveGroup: this.getActiveGroup(),
            recentActiveFazeTime: this.currActiveFazesCount,
            waitingTimeForGroup: this.waitingTimeForGroup,
            carsInGroups: this.getNumberOfCarsInGroups(),
        };
    }

    /**
     * Gets the current status of the simulation as strings (prettyfied data more readable for humans).
     * @returns {SimulationStatusAsStrings} - The current status of the simulation as strings.
     */
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

    /**
     * Gets the number of cars in groups as strings (prettyfied data more readable for humans)
     * @returns {Map<DescribedGroupTypeAsStrings, number>} - The number of cars in groups as strings.
     */
    getNumberOfCarsInGroupsAsString(): Map<DescribedGroupTypeAsStrings, number> {
        return new Map(
            Array.from(this.getNumberOfCarsInGroups()).map(([group, cars]) => [
                Array.from(group.edges).map(edge => edge.toString()),
                cars,
            ])
        );
    }

    /**
     * Adds waiting time to all groups except the excluded group.
     * @param {DescribedGroupType} excludedGroup - The group to exclude from adding waiting time.
     */
    protected addWaitingTime(excludedGroup: DescribedGroupType) {
        this.describedGroups.forEach(group => {
            if (group === excludedGroup) {
                this.waitingTimeForGroup.set(group, 0);
            } else {
                this.waitingTimeForGroup.set(group, (this.waitingTimeForGroup.get(group) as number) + 1);
            }
        });
    }

    /**
     * Sets a new active group.
     * Executes the light changed callback if the group is new, or the light stay callback if the group is the same.
     * @param {number} groupIdx - The index of the new active group.
     */
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

    /**
     * Abstract method to determine the next group.
     * Must be implemented by subclasses.
     */
    protected abstract nextGroup(): void;

    /**
     * Adds a car to a node or edge.
     * Executes the car added callback.
     * @param {string | RoadNode | Edge} nodeName - The name of the node, or the node or edge itself.
     * @throws {Error} - If the node or edge does not exist.
     */
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

    /**
     * Moves cars through the active group.
     */
    protected goCars() {
        const group = this.getActiveGroup();
        group.startNodes.forEach(node => {
            const carsThrought = calculateCarsGoThroughNumber();
            for (let i = 0; i < carsThrought; i++) {
                node.tryToRemoveCar();
            }
        });
    }

    /**
     * Gets the number of cars in each group.
     * @returns {Map<DescribedGroupType, number>} - A map of groups to the number of cars in each group.
     */
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

    /**
     * Abstract method to perform the next step in the simulation.
     * Must be implemented by subclasses.
     * @returns {isLoopDetected} - Whether a loop was detected.
     */
    abstract nextStep(): isLoopDetected;
}

export {
    AbstractSimulation,
    DescribedGroupType,
    SimulationStatus,
    SimulationStatusAsStrings,
    isLoopDetected,
    GroupNodesType,
    GroupType,
};
