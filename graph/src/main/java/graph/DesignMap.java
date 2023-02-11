package graph;

import java.util.List;
import java.util.*;

/**
 * DesignMap represents a mutable map of nodes and edges, where each node is
 *  represented by a non-null T, and each edge is represented by a non-null E.
 *
 *  Abstract Invariant:
 *   Each Node and each edge needs to be unique.
 */
public class DesignMap<T, E> {
    // RI: either true or false
    // AF(this) = true when running expensive rep invariant tests, false when running
    //            only cheap tests
    private static final boolean DEBUG = false;

    // The map of nodes and their outgoing edges and destinations
    // Representation Invariant:
    //  !DesignMap.contains(null), and
    //  !DesignMap.get(node 1).contains(null), !DesignMap.get(node 2).contains(null), ...
    //      !DesignMap.get(node n).contains(null), where n = map.size(), and
    //  DesignMap.get(source).get(destination).get(0)
    //      != DesignMap.get(source).get(destination).get(1) != ...
    //      != DesignMap.get(source).get(destination).get(i - 1),
    //      where i = DesignMap.get(source).get(destination).size(),
    //
    // Abstraction Function:
    //  AF(this) = a map such that
    //   map.keySet() = {node 1, node 2, ..., node i}, and
    //   map.get(node i) = an inner map, where each key represents each child node of node i,
    //      and map.get(node i).get(child j) = {edge 1, edge 2, ..., edge k}.
    //      i = T representation of node in DesignMap,
    //      j = T representation of child node of node i, and
    //      k = label of edge from node i to node j.
    private final Map<T, Map<T, Set<E>>> DesignMap;

    // Checks representation invariant for the entire map, including
    //  checking nulls for all nodes, their outgoing edges, and duplicate edges
    //  with the same source and destination.
    private void checkRep() {
        // cheap tests:
        assert !this.contains(null): "Null node";
        // expensive tests:
        if (DEBUG) {
            for (T src: DesignMap.keySet()) { // take each node
                for (T dst: DesignMap.get(src).keySet()) { // go to each child
                    List<E> edges = new ArrayList<>(DesignMap.get(src).get(dst)); // go to list of edges
                    // verify no null edges
                    assert !edges.contains(null): "Null edge";
                    int n = edges.size();
                    for (int i = 0; i < n; i++) {
                        for (int j = i + 1; j < n; j++) {
                            // verify no duplicates edges
                            assert !edges.get(i).equals(edges.get(j)): "Duplicate edges";
                        }
                    }
                }
            }
        }
    }

    /**
     * Constructs an empty DesignMap
     * @spec.effects this = a new empty DesignMap
     */
    public DesignMap() {
        this.DesignMap = new HashMap<>();
    }

    /**
     * Adds a node to this map if it does not already exist
     * @param newNode the node to be added to this map
     * @throws IllegalArgumentException if newNode is null
     * @spec.requires newNode != null
     * @spec.modifies this
     * @spec.effects this with node newNode in it
     */
    public void addNode(T newNode) throws IllegalArgumentException {
        checkRep();
        if (newNode == null) {
            throw new IllegalArgumentException("Tried to add a null node.");
        }
        DesignMap.put(newNode, new HashMap<>());
        checkRep();
    }

    /**
     * Adds an edge from a source node to a destination node in this map. If any
     *  one of the source and destination nodes does not already exist, automatically
     *  adds the missing node(s) before adding the new edge.
     * @param src the source node of the edge
     * @param dst the destination node of this edge
     * @param label the edge to be added from src to dst in the map
     * @throws IllegalArgumentException if label is null, src is null, dst is null,
     *         or the same label already exists from src to dst
     * @spec.requires src, dst, and label are not null, and edges from src to dst
     *                do not already contain label.
     * @spec.modifies this
     * @spec.effects edges from src to dst in this now contain label
     */
    public void addEdge(T src, T dst, E label) throws IllegalArgumentException {
        checkRep();
        if (src == null || dst == null || label == null) {
            throw new IllegalArgumentException("Null node/label received.");
        }
        if (!this.contains(src)) { this.addNode(src); }
        if (!this.contains(dst)) { this.addNode(dst); }

        checkRep();
        if (DesignMap.get(src).containsKey(dst)) {
            // there is already a set of edges
            if (getLabels(src, dst).contains(label)) {
                throw new IllegalArgumentException("Duplicate edges.");
            }
            // adds label to existing edge set
            DesignMap.get(src).get(dst).add(label);
        } else {
            // creates an edge set for this label
            Set<E> newEdgeSet = new HashSet<>();
            newEdgeSet.add(label);
            DesignMap.get(src).put(dst, newEdgeSet);
        }
        checkRep();
    }

    /**
     * Removes a node (if exists) and all edges from and to this node from the map
     * @param node the node to be removed from this map
     * @spec.modifies this
     * @spec.effects node and all its incoming and outgoing edges are removed from this
     */
    public void removeNode(T node) {
        checkRep();
        // remove edges that go to node
        for (T str: listNodes()) { DesignMap.get(str).remove(node); }
        // remove node and its outgoing edges
        DesignMap.remove(node);
        checkRep();
    }

    /**
     * Removes from the map an edge (if exists) from source node to destination node
     * @param src the source node of the edge
     * @param dst the destination node of the edge
     * @param label the label of the edge
     * @spec.modifies this
     * @spec.effects edge named label from source to destination is removed from this
     */
    public void removeEdge(T src, T dst, E label)  {
        checkRep();
        List<E> labels = getLabels(src, dst);
        if (labels.contains(label)) {
            DesignMap.get(src).get(dst).remove(label);
            if (labels.size() == 1) { // actual size is 0 after remove
                // get rid of empty list with no edges
                DesignMap.get(src).remove(dst);
            }
        }
        checkRep();
    }


    /**
     * Lists all the nodes that can be directly reached from given source node
     * @param source the source node
     * @throws IllegalArgumentException if source is null
     * @throws NoSuchElementException if !DesignMap.contains(source)
     * @return A list of nodes that are direct destinations from source
     * @spec.requires source != null and DesignMap.contains(source)
     */
    public List<T> listChildren(T source)
            throws IllegalArgumentException, NoSuchElementException {
        checkRep();
        if (source == null) { throw new IllegalArgumentException("Null node received."); }
        if (!this.contains(source)) { throw new NoSuchElementException("Node does not exist."); }
        List<T> output = new ArrayList<>(DesignMap.get(source).keySet());
        checkRep();
        return output;
    }

    /**
     * Lists all the nodes that can directly reach given destination node
     * @param dest the destination node we want to find the parents of
     * @throws IllegalArgumentException if dest is null
     * @throws NoSuchElementException if !DesignMap.contains(dest)
     * @return List of all the nodes that can directly reach dest
     * @spec.requires dest != null and DesignMap.contains(A)
     */
    public List<T> listParents(T dest)
            throws IllegalArgumentException, NoSuchElementException{
        checkRep();
        if (dest == null) { throw new IllegalArgumentException("Null node received."); }
        if (!this.contains(dest)) { throw new NoSuchElementException("Node does not exist."); }

        List<T> output = new ArrayList<>();
        for (T str: listNodes()) {
            if (DesignMap.get(str).containsKey(dest)) { output.add(str); }
        }
        checkRep();
        return output;
    }

    /**
     * Lists all the nodes in this
     * @return List of all nodes in this map
     */
    public List<T> listNodes() {
        List<T> output = new ArrayList<>(DesignMap.keySet());
        checkRep();
        return output;
    }

    /**
     * Lists all the edges from given source node to given destination node
     * @param src the source node of the edges
     * @param dst the destination node of the edges
     * @return list of all edges from src to dst
     */
    public List<E> getLabels(T src, T dst) {
        if (!this.contains(src) || !DesignMap.get(src).containsKey(dst)) {
            return new ArrayList<>();
        }
        List<E> output = new ArrayList<>(DesignMap.get(src).get(dst));
        checkRep();
        return output;
    }

    /**
     * Checks if this map contains node
     * @param node the node to be checked in this
     * @return a boolean that is true if this contains node and false otherwise
     */
    public boolean contains(T node) {
        return DesignMap.containsKey(node);
    }

}
