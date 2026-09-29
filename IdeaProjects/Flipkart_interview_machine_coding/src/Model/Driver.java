package Model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Driver {
    public String name;

    public Map<String, List<Double>> passengerRatings; // driver has received by passengers
    List<Double> ratings;
    public Location location;

    public Driver(String name) {
        this.name = name;
        ratings = new ArrayList<>();
        passengerRatings = new HashMap<>();
        location = new Location(0, 0); // default
    }

    public void addRating(String pname, double rating) {
        ratings.add(rating);
        if (!passengerRatings.containsKey(pname)) {
            passengerRatings.put(pname, new ArrayList<>());
        }
        passengerRatings.get(pname).add(rating);
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
