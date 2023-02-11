package pathfinder;

import graph.DesignMap;
import pathfinder.datastructures.Path;
import java.util.Comparator;
import java.util.HashSet;
import java.util.PriorityQueue;
import java.util.Set;

/**
 * DijkstraPathFinder is a path finding algorithm that evaluates
 *  the edges in a given graph and finds the shortest path between
 *  the given start node and given end node.
 */
public class DijkstraPathFinder<T, E> {

    // Note: DijkstraPathFinder is not ann ADT, hence does not have RI or AF

    /**
     * Comparator for Path types, compares two Paths by the values of their cost
     */
    private class PathComparator implements Comparator<Path<T>> {
        public int compare(Path<T> A, Path<T> B) {
            return Double.compare(A.getCost(), B.getCost());
        }
    }

    /**
     * Finds and returns the lowest cost path (if there is one) between the given
     *  start node and end node, returns null if there isn't a path
     * @param map the DesignMap that contains all the nodes and edges to be evaluated
     * @param start the start node of the path
     * @param dest the end node of the path
     * @spec.requires map, start, and dest are not null, and edges in map are non-negative
     */
    public Path<T> DijkstraPath(DesignMap<T, E> map, T start, T dest) {
        // Each element is a path from start to a given node.
        // A path's “priority” in the queue is the total cost of that path.
        PriorityQueue<Path<T>> pq = new PriorityQueue<>(new PathComparator());
        Set<T> known = new HashSet<>();
        Path<T> initPath = new Path<>(start);
        initPath.extend(start, 0.0);
        pq.add(initPath);
        Path<T> paths = initPath;
        if (start.equals(dest)) { return paths; }
        while (!pq.isEmpty()) {
            // process the next lowest-costing path in queue
            Path<T> currPath = pq.remove();
            // DEST of this path
            T edgeTo = currPath.getEnd();
            // SP found
            if (edgeTo.equals(dest)) {
                paths = currPath;
                break;
            } else if (!known.contains(edgeTo)) {
                for (T child : map.listChildren(edgeTo)) {
                    if (!known.contains(child)) {
                        String minCost = map.getLabels(edgeTo, child).get(0).toString();
                        double newCost = Double.parseDouble(minCost);
                        Path<T> newPath = currPath.extend(child, newCost);
                        pq.add(newPath);
                    }
                }
                known.add(edgeTo);
            }
        }
        return paths.equals(initPath) ? null : paths;
    }
}
