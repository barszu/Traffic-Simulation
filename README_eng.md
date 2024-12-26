# Traffic Simulation Project

## Project Description

A traffic simulation project that models the behavior of vehicles at intersections with traffic lights. The project includes various classes and modules for managing road nodes, edges, simulations, and presets.

The intersection is represented as a set of vertices and edges, and can take on `any shape` (number of lanes, directions of travel).

### Terminology Used

-   set of vertices - inbound and outbound lanes at the intersection
-   edges - line/path of travel

### Example

> for the intersection (presets/preset1.json):

![preset1](docs_img\preset1A.jpg)

> It is represented as:

![preset1](docs_img\preset1B.jpg)

## Operation

1. Preparing the intersection configuration (example: `presets/preset1.json`):

    - Define the vertices and edges describing the intersection.
    - For the simulation to work correctly (without lane conflicts), edge collisions must be specified. A one-sided relationship is sufficient; the program will automatically create a two-sided one (if A excludes B, then B will exclude A).

2. Optional parameter changes:

    - Duration of one phase of the lights.
    - Maximum number of light phases after which the currently active signal must change.
    - Maximum number of phases waiting for a light change.

3. Loading the configuration:

    - Check the correctness of the provided configuration. In case of an error, the program will terminate (src/main.ts).

4. Divide edges into groups where no conflicting edges exist within a group.

5. Simulation:

    - Switching between groups.
    - Green light turns on for travel directions (edges) in the active group, and red light for the others.
    - Yellow light turns on in the group that has just been changed and in the group that has just been activated.

### Simulation Considering the Number of Waiting Vehicles

1. Retrieve information about the number of cars waiting at vertices within the edge group (starting vertices).
2. Remove the active group from consideration if it has been active for too long.
3. Check a special scenario:

    > Consider only groups that have been waiting too long for a light change.

4. Select the group with the highest number of cars.

It is very important to choose the right parameters for changing the lights.

## Highlighted Places in the Project

-   `src/`
    -   `appconfig/`
        -   `driving.ts` - Traffic simulation configuration.
    -   `graph/`
        -   `independentSet.ts` - Functions for calculating independent sets in a graph.
    -   `simulations/`
        -   `AbstractSimulation.ts` - Abstract class representing a traffic simulation.
        -   `BasicSimulation.ts` - Class representing a basic traffic simulation.
        -   `AdvancedSimulation.ts` - Class representing an advanced traffic simulation.
    -   `Direction.ts` - Enum representing the four main directions.
    -   `Edge.ts` - Class representing a road connection (edge) between two road nodes.
    -   `RoadNode.ts` - Class representing a road node (lane).
    -   `main.ts` - Main function running the simulation.

## Running

1. Installation

```bash
npm install
```

2. Program

```bash
npm run main
```

3. Tests

```bash
npm run test
```

## About the Application

The application is mainly written in an object-oriented manner, with a good division of responsibilities between classes (level of abstraction).

Control is done through statically defined commands in the preset, but they can also be streamed to the application.

The algorithm for switching between groups is very fast (has low computational complexity).

The group selection algorithm can be freely modified (e.g., automatically adding conflicting edges if they share some features). It is more demanding than the switching algorithm but is executed only once.

-   Complexity O(V^3), where V is the number of vertices.

The project allows for very simple code modification and maintenance, and it also includes tests. It enables the creation of any intersection with roads from a maximum of 4 directions, but this is also easily modifiable - just add another direction in `src\Direction.ts`.

The simulation state is very easily accessible by calling declarative methods that trigger appropriate callbacks in specific situations (e.g., light change). This functionality allows for easy integration with the backend or frontend.

Edges and vertices are singletons, so an edge like N1 -> E1 and vertices N1, E1 appear once in the program to reduce the difficulty of handling the code.

### Example Run

> `presets\preset1.json`

```pl


Initial state
{
  recentActiveGroup: [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ],
  recentActiveFazeTime: 0,
  waitingTimeForGroup: Map(2) {
    [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ] => 0,
    [ 'S2 -> W1' ] => 0
  },
  carsInGroups: Map(2) {
    [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ] => 0,
    [ 'S2 -> W1' ] => 0
  }
}
Car added to:  S2
Map(2) {
  [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ] => 1,
  [ 'S2 -> W1' ] => 1
}
Car added to:  N2
Map(2) {
  [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ] => 2,
  [ 'S2 -> W1' ] => 1
}
Car added to:  N2
Map(2) {
  [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ] => 3,
  [ 'S2 -> W1' ] => 1
}
Car added to:  N2
Map(2) {
  [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ] => 4,
  [ 'S2 -> W1' ] => 1
}
Car added to:  N2
Map(2) {
  [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ] => 5,
  [ 'S2 -> W1' ] => 1
}
Car added to:  N2
Map(2) {
  [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ] => 6,
  [ 'S2 -> W1' ] => 1
}
Car added to:  N2
Map(2) {
  [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ] => 7,
  [ 'S2 -> W1' ] => 1
}
Car added to:  N2
Map(2) {
  [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ] => 8,
  [ 'S2 -> W1' ] => 1
}
Car added to:  N2
Map(2) {
  [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ] => 9,
  [ 'S2 -> W1' ] => 1
}
Light stay
Light stay
Car added to:  S2
Map(2) {
  [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ] => 2,
  [ 'S2 -> W1' ] => 1
}
Car added to:  S2
Map(2) {
  [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ] => 3,
  [ 'S2 -> W1' ] => 2
}
Light stay
Light stay
Lights changed
{
  recentActiveGroup: [ 'S2 -> W1' ],
  recentActiveFazeTime: 0,
  waitingTimeForGroup: Map(2) {
    [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ] => 1,
    [ 'S2 -> W1' ] => 0
  },
  carsInGroups: Map(2) {
    [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ] => 0,
    [ 'S2 -> W1' ] => 0
  }
}
Lights changed
{
  recentActiveGroup: [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ],
  recentActiveFazeTime: 0,
  waitingTimeForGroup: Map(2) {
    [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ] => 0,
    [ 'S2 -> W1' ] => 1
  },
  carsInGroups: Map(2) {
    [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ] => 0,
    [ 'S2 -> W1' ] => 0
  }
}
Light stay

```
