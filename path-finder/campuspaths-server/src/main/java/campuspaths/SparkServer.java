
package campuspaths;

import campuspaths.utils.CORSFilter;
import com.google.gson.Gson;
import pathfinder.CampusMap;
import pathfinder.datastructures.Path;
import pathfinder.datastructures.Point;
import spark.*;

import java.util.Map;

public class SparkServer {
  
  public static void main(String[] args) {
    CORSFilter corsFilter = new CORSFilter();
    corsFilter.apply();
    
    final CampusMap map = new CampusMap();
    
    Spark.get("path", new Route() {
      @Override
      public Object handle(Request request, Response response) {
        Path<Point> pathFound = null;
        try {
          pathFound = map.findShortestPath(request.queryParams("start"),
                  request.queryParams("end"));
        } catch (Exception e) {
          Spark.halt(400, "Invalid input: start/end is null or not a number");
        }
        return pathFound != null ? new Gson().toJson(pathFound) : "There is no path:(";
      }
    });
    
    Spark.get("names", new Route() {
      @Override
      public Object handle(Request request, Response response) {
        Map<String, String> names = map.buildingNames();
        return new Gson().toJson(names);
      }
    });
    
  }
  
}
