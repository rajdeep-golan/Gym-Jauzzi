package Service;

import Model.Driver;
import Model.Location;
import Model.Node;
import Model.Passenger;

import java.util.*;

public class Manager {

    double dist(int x1, int x2, int y1, int y2) {
        return Math.sqrt(Math.abs(x1 - x2) * Math.abs(x1 - x2) + Math.abs(y1 - y2) * Math.abs(y1 - y2));
    }

    public Map<String, Driver> drivers;
    public Map<String, Passenger> passengers;


    public Manager() {
        drivers = new HashMap<>();
        passengers = new HashMap<>();
    }

    public void findEligibleDrivers(String passengerName, double rating) {
        List<Driver> eligible = new ArrayList<>();
        for (String drivername : drivers.keySet()) {
            if (drivers.get(drivername).getAverageRating() >= rating) {
                //   System.out.println(drivername+", "+drivers.get(drivername).getAverageRating());
                eligible.add(drivers.get(drivername));
            }
        }

        if (eligible.size() > 0) {
            displayDriverByRating(eligible);
        }

        if (eligible.size() == 0) {
            findAndDisplayDriversByRatingGreaterThan1(passengerName, eligible);
        }

        if (eligible.size() == 0) {
            System.out.println("No matching drivers found");
            return;
        }

        List<Node> dist = new ArrayList<>();
        Location l = passengers.get(passengerName).location;
        for (Driver d : eligible) {
            Node n = new Node(d.name, dist(l.x, d.location.x, l.y, d.location.y));
            dist.add(n);
        }

        Collections.sort(dist, new DistanceSort());

        displayDriversByDistace(dist);
    }

    private void displayDriverByRating(List<Driver> eligible){
        Collections.sort(eligible, new RatingSort());
        for (Driver d : eligible) {
            System.out.println(d.name + " " + d.getAverageRating());
        }
    }

    private void findAndDisplayDriversByRatingGreaterThan1(String passengerName, List<Driver> eligible) {
        for (String drivername : passengers.get(passengerName).ratingsToDrivers.keySet()) {

            System.out.println(drivername + " " + passengerName);
            List<Double> ratings = drivers.get(drivername).passengerRatings.get(passengerName);
            // List<Double> ratings=passengers.get(passengerName).ratingsToDrivers.get(drivername);
            double sum = 0.0;
            System.out.println(ratings);

            for (Double rate : ratings) {
                sum += rate;
            }
            System.out.println("Sum " + sum);

            if (sum > 1) {
                eligible.add(drivers.get(drivername));
                System.out.println(drivername);
            }

        }
    }

    private void displayDriversByDistace(List<Node> dist) {
        System.out.println("Eligible drivers by dist");
        for (Node n : dist) {
            System.out.println(n.name);
        }
    }

}
