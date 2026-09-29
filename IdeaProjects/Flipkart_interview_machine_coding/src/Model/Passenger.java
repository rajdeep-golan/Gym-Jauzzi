package Model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Passenger {
    String name;
    List<Double> ratings;
    public Location location;
    public Map<String, List<Double>> ratingsToDrivers; // passenger has received from driver

    public Passenger(String name) {
        this.name = name;
        ratings = new ArrayList<>();
        location = new Location(0, 0);
        ratingsToDrivers = new HashMap<>();
    }

    public void addRating(String dname, double rating) {
        ratings.add(rating);
        if (!ratingsToDrivers.containsKey(dname)) {
            ratingsToDrivers.put(dname, new ArrayList<>());
        }
        ratingsToDrivers.get(dname).add(rating);
    }

    public double getAverageRating() {
        if (ratings.size() == 0)
            return 0.0;
        double avg = 0;
        for (double rating : ratings) {
            avg += rating;
        }
        return (avg / ratings.size());
    }


}
