import { MatrixGraph } from "./MatrixGraph";

/**
 * Computes an independent set from the given graph, excluding specified nodes.
 * An independent set is a set of vertices in a graph, no two of which are adjacent.
 *
 * @template T - The type of the vertices in the graph.
 * @param {MatrixGraph<T>} graph - The graph from which to find the independent set.
 * @param {Set<T>} excluded - A set of vertices to exclude from the independent set.
 * @returns {Set<T>} - A set of vertices that form an independent set in the graph.
 */
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

/**
 * Finds all independent sets in a given graph.
 * An independent set is a set of vertices in a graph, no two of which are adjacent.
 *
 * @template T - The type of the vertices in the graph.
 * @param {MatrixGraph<T>} graph - The graph in which to find independent sets.
 * @returns {Array<Set<T>>} An array of sets, where each set is an independent set of vertices.
 */
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
