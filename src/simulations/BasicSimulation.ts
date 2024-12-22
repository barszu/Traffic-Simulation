import { RoadNode } from "../RoadNode"
import { Edge } from "../Edge"
import { MarkedNodes } from "../MarkedNodes"
import { Directions, isSameAlign } from "../Direction";
import { CallbackExecutor, CallbackType } from "../util/CallbackExecutor";

import { calculateCarsGoThroughNumber, config } from "../../appconfig/driving";


type DescribedGroupType = {startNodes: Set<RoadNode>, edges: Set<Edge>}
type GroupType = Set<Edge>
type GroupNodesType = Set<RoadNode>

interface SimulationStatus {
    recentActiveGroup: DescribedGroupType;
    recentActiveFazeTime: number;
    waitingTimeForGroup: Map<DescribedGroupType, number>;
    carsInGroups: Map<DescribedGroupType, number>;
}

function groupBy(nodes: Set<RoadNode>, edges: Set<Edge>) : Array<GroupType> {
    const groups = new Array<Set<Edge>>()
    
    
    function worker(edges: Set<Edge>) {

        const marked = new MarkedNodes(nodes)

        const edgesWithColisions = new Set<Edge>()
        const group = new Set<Edge>()

        let first : null | Edge = null
        
        for (const edge of edges) {

            if (first === null) { // pierwsza napotkana konfiguracja jest poprawna
                first = edge
                marked.markEdge(edge)
                group.add(edge)
                continue
            }


            if (marked.isMarked(edge.destinationNode) ) {
                edgesWithColisions.add(edge)
            } 
            else if (! isSameAlign(first.startNode.position , edge.startNode.position)) { // z dwoch roznych kierunkow
                // dla uproszczenia zakładam tu zawsze kolizje
                edgesWithColisions.add(edge)
            } 
            else {
                // brak kolizji dodaje do grupy
                marked.markEdge(edge)
                group.add(edge)
            }

            
        }

        groups.push(group)
        return edgesWithColisions
    }

    while(edges.size > 0){
        edges = worker(edges)
    }
    return groups
}

function describeGroup(group: Array<GroupType>) : Array<DescribedGroupType> {
    return group.map(edges => {
        const startNodes = new Set<RoadNode>()
        edges.forEach(edge => {
            startNodes.add(edge.startNode)
        })
        return {startNodes, edges}
    })
}

class BasicSimulation{

    readonly describedGroups: Array<DescribedGroupType>
    readonly allNodes: Set<RoadNode>
    readonly allEdges: Set<Edge>
    readonly allNodesMap = new Map<string, RoadNode>()
    readonly waitingTimeForGroup = new Map<DescribedGroupType, number>()

    readonly callbacks = new CallbackExecutor()

    protected currActiveGroupIdx = 0
    protected currActiveFazesCount = 0

    addOnLightsChangeCallback(callback: CallbackType) {
        this.callbacks.addCallback(callback)
    }

    constructor (nodes: Set<RoadNode>, edges: Set<Edge>){
        this.allNodes = nodes
        this.allEdges = edges
        const groups = groupBy(nodes, edges)
        this.describedGroups = describeGroup(groups)
        nodes.forEach(node => this.allNodesMap.set(node.toString(), node))
        this.describedGroups.forEach(group => this.waitingTimeForGroup.set(group, 0))
    }

    private addWaitingTime(excludedGroup: DescribedGroupType) {
        this.describedGroups.forEach(group => {
            if (group === excludedGroup) {
                this.waitingTimeForGroup.set(group, 0)
            } else {
                this.waitingTimeForGroup.set(group, this.waitingTimeForGroup.get(group) as number + 1)
            }
        })
    }

    getActiveGroup() : DescribedGroupType {
        return this.describedGroups[this.currActiveGroupIdx]
    }

    getStatus(): SimulationStatus{
        return {
            recentActiveGroup: this.getActiveGroup(),
            recentActiveFazeTime: this.currActiveFazesCount,
            waitingTimeForGroup: this.waitingTimeForGroup,
            carsInGroups: this.getNumberOfCarsInGroups()
        }
    }

    setNewGroup(groupIdx: number) {
        if(this.currActiveGroupIdx === groupIdx) {
            this.addWaitingTime(this.getActiveGroup()) //using old group
            this.currActiveFazesCount++
        } else {
            this.currActiveGroupIdx = groupIdx
            this.addWaitingTime(this.getActiveGroup()) //using new group
            this.currActiveFazesCount = 0
            this.callbacks.executeAllCallback()
        }    
    }

    nextGroup(){
        this.setNewGroup((this.currActiveGroupIdx + 1) % this.describedGroups.length)
    }

    addCar(nodeName: string) {
        const node = this.allNodesMap.get(nodeName)
        if (node === undefined) {
            throw new Error("Provided Node by name does not exist")
        }
        node.addCar() // using references it will work and i will modify same node in group edges etc...
    }

    goCars() {
        const group = this.getActiveGroup()
        group.startNodes.forEach(node => {
            const carsThrought = calculateCarsGoThroughNumber()
            for (let i = 0; i < carsThrought; i++) {
                node.tryToRemoveCar()
            }
        })
    }

    protected getNumberOfCarsInGroups() : Map<DescribedGroupType, number> {
        const groupToCars = new Map<DescribedGroupType, number>()
        this.describedGroups.forEach(group => {
            let cars = 0
            group.startNodes.forEach(node => {
                cars += node.getNumberOfCars()
            })
            groupToCars.set(group, cars)
        })
        return groupToCars
    }

    

}

export { BasicSimulation, DescribedGroupType, SimulationStatus }


