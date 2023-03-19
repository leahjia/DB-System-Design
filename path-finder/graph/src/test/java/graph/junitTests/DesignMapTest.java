package graph.junitTests;
import graph.*;
import org.junit.Test;
import org.junit.Rule;
import org.junit.rules.Timeout;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import static org.junit.Assert.*;
import static org.junit.Assert.fail;

public class DesignMapTest<T> {
    @Rule public Timeout globalTimeout = Timeout.seconds(10); // 10 seconds max per method tested

    String N = null;
    String A = "A";
    String B = "B";
    String C = "C";
    String edge1 = "e1";
    String edge2 = "e2";
    private static final List<String> edgeList1 = new ArrayList<>();
    private static final List<String> edgeList2 = new ArrayList<>();
    private static final List<String> edgeList12 = new ArrayList<>();
    private static final List<String> edgeListA = new ArrayList<>();
    private static final List<String> edgeListB = new ArrayList<>();
    private static final List<String> edgeListEmpty = new ArrayList<>();

    /** Tests add and remove nodes successful. */
    @Test
    public void testAddRemoveNode() {
        DesignMap<String, String> map1 = new DesignMap<>();
        map1.addNode(A);
        map1.addNode(B);
        assertTrue(map1.contains(A));
        assertTrue(map1.contains(B));
        map1.removeNode(A);
        map1.removeNode(B);
        assertFalse(map1.contains(A));
        assertFalse(map1.contains(B));

        // add the same node twice, remove only once
        map1.addNode(A);
        map1.addNode(A);
        assertTrue(map1.contains(A));
        map1.removeNode(A);
        assertFalse(map1.contains(A));

        // remove non-existent and null nodes without errors
        map1 = new DesignMap<>();
        map1.removeNode(C);
        map1.removeNode(N);
        assertFalse(map1.contains(C));
        assertFalse(map1.contains(N));
    }

    /** Tests add and remove edges operate correctly with getLabels and contains.
     */
    @Test
    public void testAddremoveEdgeContainsLabels() {
        DesignMap<String, String> map1 = new DesignMap<>();
        edgeList1.add(edge1);
        edgeList2.add(edge2);
        edgeList12.add(edge1);
        edgeList12.add(edge2);

        // Case 1: add & remove one label
        map1.addEdge(A, B, edge1);
        assertTrue(map1.contains(A));
        assertTrue(map1.contains(B));
        assertEquals(map1.getLabels(A, B), edgeList1);

        map1.removeEdge(A, B, edge1);
        assertTrue(map1.contains(A));
        assertTrue(map1.contains(B));
        assertEquals(map1.getLabels(A, B), new ArrayList<>());

        // Case 2: Add 2 edges in the same direction
        map1.addEdge(A, B, edge1);
        map1.addEdge(A, B, edge2);
        assertTrue(map1.contains(A));
        assertTrue(map1.contains(B));
        assertEquals(map1.getLabels(A, B), edgeList12);

        // remove one of the two edges
        map1.removeEdge(A, B, edge1);
        assertTrue(map1.contains(A));
        assertTrue(map1.contains(B));
        assertEquals(map1.getLabels(A, B), edgeList2);

        // Case 3: Add 2 edges in the opposite direction
        map1 = new DesignMap<>();

        map1.addEdge(A, B, edge1);
        map1.addEdge(B, A, edge2);
        assertTrue(map1.contains(A));
        assertTrue(map1.contains(B));
        assertEquals(map1.getLabels(A, B), edgeList1);
        assertEquals(map1.getLabels(B, A), edgeList2);

        // remove one of the two edges
        map1.removeEdge(A, B, edge1);
        assertTrue(map1.contains(A));
        assertTrue(map1.contains(B));
        assertEquals(map1.getLabels(B, A), edgeList2);
    }

    /** Tests add and remove edges throw exceptions when needed.
     */
    @Test
    public void testNodeAndEdgeThrowsIllegalArgumentException() {
        DesignMap<String, String> map1 = new DesignMap<>();
        try {
            // add null node
            map1.addNode(N);
        } catch (IllegalArgumentException e) {
            e.getStackTrace();
        } try {
            // add null edge
            map1.addEdge(A, B, N);
            fail("Expected IllegalArgumentException not occurred.");
        } catch (IllegalArgumentException e) {
            e.getStackTrace();
        } try {
            // add null src
            map1.addEdge(N, A, edge1);
            fail("Expected IllegalArgumentException not occurred.");
        } catch (IllegalArgumentException e) {
            e.getStackTrace();
        } try {
            // add null dst
            map1.addEdge(A, N, edge1);
            fail("Expected IllegalArgumentException not occurred.");
        } catch (IllegalArgumentException e) {
            e.getStackTrace();
        } try {
            // add dup edges
            map1.addEdge(A, B, edge1);
            map1.addEdge(A, B, edge1);
            fail("Expected IllegalArgumentException not occurred.");
        } catch (IllegalArgumentException e) {
            e.getStackTrace();
        } try {
            // remove non-existent edge from A to B
            map1.addEdge(A, B, edge1);
            map1.removeEdge(A, B, edge2);
            fail("Expected IllegalArgumentException not occurred.");
        } catch (IllegalArgumentException e) {
            e.getStackTrace();
        } finally {
            System.out.close();
        }
    }

    /** Tests listChildren and listParents operations. */
    @Test
    public void testlistChildrenParents() {
        DesignMap<String, String> map1 = new DesignMap<>();
        edgeListA.add(A);
        edgeListB.add(B);

        // Case 1: add & remove one label
        map1.addEdge(A, B, edge1);
        assertTrue(map1.contains(A));
        assertTrue(map1.contains(B));
        assertEquals(map1.listChildren(A), edgeListB);
        assertEquals(map1.listParents(B), edgeListA);
        assertEquals(map1.listParents(A), edgeListEmpty);
        assertEquals(map1.listChildren(B), edgeListEmpty);

        map1.removeEdge(A, B, edge1);
        assertTrue(map1.contains(A));
        assertTrue(map1.contains(B));
        assertEquals(map1.listChildren(A), edgeListEmpty);
        assertEquals(map1.listParents(A), edgeListEmpty);
        assertEquals(map1.listChildren(B), edgeListEmpty);
        assertEquals(map1.listParents(B), edgeListEmpty);

        // Case 2: Add 2 edges in the same direction
        map1.addEdge(A, B, edge1);
        map1.addEdge(A, B, edge2);
        assertTrue(map1.contains(A));
        assertTrue(map1.contains(B));
        assertEquals(map1.listChildren(A), edgeListB);
        assertEquals(map1.listParents(A), edgeListEmpty);
        assertEquals(map1.listParents(B), edgeListA);
        assertEquals(map1.listChildren(B), edgeListEmpty);

        map1.removeEdge(A, B, edge1);
        assertTrue(map1.contains(A));
        assertTrue(map1.contains(B));
        assertEquals(map1.listChildren(A), edgeListB);
        assertEquals(map1.listParents(A), edgeListEmpty);
        assertEquals(map1.listParents(B), edgeListA);
        assertEquals(map1.listChildren(B), edgeListEmpty);


        // Case 3: Add 2 edges in the opposite direction
        map1 = new DesignMap<>();

        map1.addEdge(A, B, edge1);
        map1.addEdge(B, A, edge2);
        assertTrue(map1.contains(A));
        assertTrue(map1.contains(B));
        assertEquals(map1.listChildren(A), edgeListB);
        assertEquals(map1.listParents(A), edgeListB);
        assertEquals(map1.listChildren(B), edgeListA);
        assertEquals(map1.listParents(B), edgeListA);

        map1.removeEdge(A, B, edge1);
        assertTrue(map1.contains(A));
        assertTrue(map1.contains(B));
        assertEquals(map1.listChildren(A), edgeListEmpty);
        assertEquals(map1.listParents(A), edgeListB);
        assertEquals(map1.listChildren(B), edgeListA);
        assertEquals(map1.listParents(B), edgeListEmpty);
    }

    /**
     * Tests that listChildren and listParents throws IllegalArgumentException when
     * passing in null value or non-existent nodes in map
     */
    @Test
    public void testlistChildrenParentsThrowsIllegalArgumentException() {
        DesignMap<String, String> map1 = new DesignMap<>();
        try {
            map1.listChildren(N);
            fail("Expected IllegalArgumentException not occurred.");
        } catch (IllegalArgumentException e) {
            e.getStackTrace();
        } try {
            map1.listChildren(A);
            fail("Expected NoSuchElementException not occurred.");
        } catch (NoSuchElementException e) {
            e.getStackTrace();
        } try {
            map1.listParents(N);
            fail("Expected IllegalArgumentException not occurred.");
        } catch (IllegalArgumentException e) {
            e.getStackTrace();
        } try {
            map1.listParents(A);
            fail("Expected NoSuchElementException not occurred.");
        } catch (NoSuchElementException e) {
            e.getStackTrace();
        }
    }

    /**
     * Tests that getNodes return correct nodes in map
     */
    @Test
    public void testGetNodes() {
        DesignMap<String, String> map1 = new DesignMap<>();
        map1.addNode(C);
        map1.addNode(B);
        map1.addNode(A);
        List<String> nodeList = map1.listNodes();
        assertTrue(nodeList.contains(A));
        assertTrue(nodeList.contains(B));
        assertTrue(nodeList.contains(C));
    }



}
