package Service;

import Model.Driver;

import java.util.Comparator;

public class RatingSort implements Comparator<Driver> {
    public int compare(Driver d1, Driver d2) {
        if (d1.getAverageRating() > d2.getAverageRating()) {
            return -1;
        } else if (d1.getAverageRating() < d2.getAverageRating())
            return 1;

        return 0;
    }
}
