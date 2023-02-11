
package pathfinder.scriptTestRunner;

import graph.DesignMap;
import pathfinder.datastructures.Path;
import pathfinder.DijkstraPathFinder;

import java.io.*;
import java.util.*;

/**
 * This class implements a test driver that uses a script file format
 * to test an implementation of Dijkstra's algorithm on a graph.
 */
public class PathfinderTestDriver {

    /**
     * T -> Graph: maps the names of graphs to the actual graph
     **/
    private final Map<String, DesignMap<String, Double>> graphs = new HashMap<>();
    private final PrintWriter output;
    private final BufferedReader input;

    /**
     * @spec.requires r != null && w != null
     * @spec.effects Creates a new PathfinderTestDriver which reads command from
     * {@code r} and writes results to {@code w}
     **/
    public PathfinderTestDriver(Reader r, Writer w) {
        // DONE: Implement this, reading commands from `r` and writing output to `w`.
        // See GraphTestDriver as an example.
        input = new BufferedReader(r);
        output = new PrintWriter(w);
    }

    /**
     * @throws IOException if the input or output sources encounter an IOException
     * @spec.effects Executes the commands read from the input and writes results to the output
     **/
    public void runTests() throws IOException {
        // DONE: Implement this.
        String inputLine;
        while((inputLine = input.readLine()) != null) {
            if((inputLine.trim().length() == 0) ||
                    (inputLine.charAt(0) == '#')) {
                // echo blank and comment lines
                output.println(inputLine);
            } else {
                // separate the input line on white space
                StringTokenizer st = new StringTokenizer(inputLine);
                if(st.hasMoreTokens()) {
                    String command = st.nextToken();

                    List<String> arguments = new ArrayList<>();
                    while(st.hasMoreTokens()) {
                        arguments.add(st.nextToken());
                    }

                    executeCommand(command, arguments);
                }
            }
            output.flush();
        }
    }

    private void executeCommand(String command, List<String> arguments) {
        try {
            switch(command) {
                case "createGraph":
                    createGraph(arguments);
                    break;
                case "addNode":
                    addNode(arguments);
                    break;
                case "addEdge":
                    addEdge(arguments);
                    break;
                case "findPath":
                    FindPath(arguments);
                    break;
                default:
                    output.println("Unrecognized command: " + command);
                    break;
            }
        } catch(Exception e) {
            String formattedCommand = command;
            formattedCommand += arguments.stream().reduce("", (a, b) -> a + " " + b);
            output.println("Exception while running command: " + formattedCommand);
            e.printStackTrace(output);
        }
    }

    private void createGraph(List<String> arguments) {
        if(arguments.size() != 1) {
            throw new CommandException("Bad arguments to CreateGraph: " + arguments);
        }
        createGraph(arguments.get(0));
    }

    private void createGraph(String graphName) {
        graphs.put(graphName, new DesignMap<>());
        output.println("created graph " + graphName);
    }

    private void addNode(List<String> arguments) {
        if(arguments.size() != 2) {
            throw new CommandException("Bad arguments to addNode: " + arguments);
        }
        String graphName = arguments.get(0);
        String nodeName = arguments.get(1);
        addNode(graphName, nodeName);
    }

    private void addNode(String graphName, String nodeName) {
        DesignMap<String, Double> map1 = graphs.get(graphName);
        map1.addNode(nodeName);
        output.println("added node " + nodeName + " to " + graphName);
    }

    private void addEdge(List<String> arguments) {
        if(arguments.size() != 4) {
            throw new CommandException("Bad arguments to addEdge: " + arguments);
        }
        String graphName = arguments.get(0);
        String parentName = arguments.get(1);
        String childName = arguments.get(2);
        double edgeLabel = Double.parseDouble(arguments.get(3));
        addEdge(graphName, parentName, childName, edgeLabel);
    }

    private void addEdge(String graphName, String parentName, String childName, double weight) {
        DesignMap<String, Double> map1 = graphs.get(graphName);
        map1.addEdge(parentName, childName, weight);
        output.println("added edge " + String.format(" %.3f", weight) +
                " from " + parentName + " to " + childName + " in " + graphName);
    }

    private void FindPath(List<String> arguments) {
        if(arguments.size() != 3) {
            throw new CommandException("Bad arguments to CreateGraph: " + arguments);
        }
        String graphName = arguments.get(0);
        String start = arguments.get(1);
        String dest = arguments.get(2);
        DesignMap<String, Double> map = graphs.get(graphName);
        if (!map.contains(start) && !map.contains(dest)) {
            output.println("unknown: " + start);
            output.println("unknown: " + dest);
        } else if (!map.contains(start)) {
            output.println("unknown: " + start);
        } else if (!map.contains(dest)) {
            output.println("unknown: " + dest);
        } else {
            output.println("path from " + start + " to " + dest + ":");
                DijkstraPathFinder<String, Double> finder = new DijkstraPathFinder<>();
                Path<String> paths = finder.DijkstraPath(map, start, dest);
                if (paths == null) {
                    output.println("no path found");
                } else {
                    double totalCost = 0;
                    for (Path<String>.Segment seg: paths) {
                        totalCost += seg.getCost();
                        output.println(seg.getStart() + " to " + seg.getEnd() + " with weight " +
                                String.format(" %.3f", seg.getCost()));
                    }
                    output.println("total cost: " + String.format(" %.3f", totalCost));
            }
        }
    }

    /**
     * This exception results when the input file cannot be parsed properly
     **/
    static class CommandException extends RuntimeException {

        public CommandException() {
            super();
        }

        public CommandException(String s) {
            super(s);
        }

        public static final long serialVersionUID = 3495;
    }

}
