
package pathfinder;

import graph.DesignMap;
import pathfinder.datastructures.Path;
import pathfinder.datastructures.Point;
import pathfinder.parser.CampusBuilding;
import pathfinder.parser.CampusPath;
import pathfinder.parser.CampusPathsParser;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * CampusMap implements the ModelAPI interface to communicate with
 * DesignMap with given commands through the web server.
 */
public class CampusMap implements ModelAPI {

    // Note: CampusMap is not ann ADT, hence does not have RI or AF

    @Override
    public boolean shortNameExists(String shortName) {
        // DONE: Implement this method exactly as it is specified in ModelAPI
        return buildingNames().containsKey(shortName);
    }

    @Override
    public String longNameForShort(String shortName) {
        // DONE: Implement this method exactly as it is specified in ModelAPI
        if (!shortNameExists(shortName)) {
            throw new IllegalArgumentException("short name provided does not exist");
        } else {
            return buildingNames().get(shortName);
        }
    }

    @Override
    public Map<String, String> buildingNames() {
        // DONE: Implement this method exactly as it is specified in ModelAPI
        Map<String, String> names = new HashMap<>();
        List<CampusBuilding> buildings = CampusPathsParser.parseCampusBuildings("campus_buildings.csv");
        for (CampusBuilding building: buildings) {
            names.put(building.getShortName(), building.getLongName());
        }
        return names;
    }

    @Override
    public Path<Point> findShortestPath(String startShortName, String endShortName) {
        // DONE: Implement this method exactly as it is specified in ModelAPI
        if (!shortNameExists(startShortName) || !shortNameExists(endShortName)) {
            throw new IllegalArgumentException("Not valid short names of buildings");
        }
        List<CampusBuilding> buildings =
                CampusPathsParser.parseCampusBuildings("campus_buildings.csv");
        List<CampusPath> paths = CampusPathsParser.parseCampusPaths("campus_paths.csv");

        // adds all nodes to map, and tags the start and end buildings
        DesignMap<Point, Double> map = new DesignMap<>();
        Point startBuilding = null;
        Point endBuilding = null;
        for (CampusBuilding building: buildings) {
            Point newBuilding = new Point(building.getX(), building.getY());
            map.addNode(newBuilding);
            if (building.getShortName().equals(startShortName)) {
                startBuilding = newBuilding;
            }
            if (building.getShortName().equals(endShortName)) {
                endBuilding = newBuilding;
            }
        }

        // checks if either start or end building is still null
        if (startBuilding == null && endBuilding == null) {
            throw new IllegalArgumentException("start or end are null");
        }

        // adds all edges to map
        for (CampusPath path : paths) {
            Point startPoint = new Point(path.getX1(), path.getY1());
            Point endPoint = new Point(path.getX2(), path.getY2());
            double weight = path.getDistance();
            map.addEdge(startPoint, endPoint, weight);
        }

        DijkstraPathFinder<Point, Double> finder = new DijkstraPathFinder<>();
        return finder.DijkstraPath(map, startBuilding, endBuilding);
    }

}
