import { MatrixGraph } from "./MatrixGraph";

function getIndependentSet<T>(graph: MatrixGraph<T>, excluded: Set<T>): Set<T> {
    const independentSet = new Set<T>();
    const visited = new Set(excluded);

    for (const node of graph.vertices) {
        if (!visited.has(node)) {
            independentSet.add(node);
            graph.getNeighbours(node).forEach(neighbor => visited.add(neighbor));
        }
    }

    return independentSet;
}

function getAllIndependentSets<T>(graph: MatrixGraph<T>): Array<Set<T>> {
    const independentSets = [];
    const excluded = new Set<T>();

    for (const node of graph.vertices) {
        if (!excluded.has(node)) {
            const independentSet = getIndependentSet(graph, excluded);
            independentSet.forEach(node => excluded.add(node));
            independentSets.push(independentSet);
        }
    }

    return independentSets;
}

export { getIndependentSet, getAllIndependentSets };
