package Service;

import Model.Node;

import java.util.Comparator;

public class DistanceSort implements Comparator<Node> {
    public int compare(Node d1, Node d2) {
        return (int) (d1.dist - d2.dist);
    }
}
