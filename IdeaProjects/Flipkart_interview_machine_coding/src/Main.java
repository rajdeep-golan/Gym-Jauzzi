import Model.Driver;
import Model.Location;
import Model.Passenger;
import Service.Manager;

import java.io.*;

public class Main{
    public static void main(String[] args)throws Exception{
        BufferedReader br=new BufferedReader(new InputStreamReader(System.in));
        //     String input=br.readLine();
        Manager m=new Manager();

        System.out.println("Enter 1/2 for (1) Entering Rating Manually (2) AutoFeed Ratings");
        int choice = Integer.parseInt(br.readLine());
        if(choice == 1){
            System.out.println("Enter Driver Name (d1,d2,etc.) & Rating for Driver (4)");
            System.out.println("Not implemented taking input. Please exit  try AutoFeed.");
        }
        else if( choice == 2 ) {
            Driver d1 = new Driver("d1");
            d1.addRating("p1", 4.0);
            d1.addRating("p2", 4.0);
            d1.addRating("p3", 3.0);
            m.drivers.put("d1", d1);
            //   System.out.println(m.drivers.get("d1").getAverageRating());
            Driver d2 = new Driver("d2");
            d2.addRating("p1", 3.0);
            d2.addRating("p2", 1.0);
            d2.addRating("p2", 5.0);
            m.drivers.put("d2", d2);
            Driver d3 = new Driver("d3");
            d3.addRating("p3", 5.0);
            d3.addRating("p1", 4.0);
            //   d3.addRating("c3",3.0);
            m.drivers.put("d3", d3);

            Driver d4 = new Driver("d4");
            d4.addRating("p4", 3.0);
            d4.addRating("p5", 1.0);
            m.drivers.put("d4", d4);


            Passenger p1 = new Passenger("p1");
            m.passengers.put("p1", p1);
            p1.addRating("d1", 4.0);
            p1.addRating("d2", 4.0);
            p1.addRating("d3", 3.0);
            Passenger p2 = new Passenger("p2");
            m.passengers.put("p2", p2);
            p2.addRating("d1", 3.0);
            p2.addRating("d2", 2.0);
            p2.addRating("d2", 5.0);
            Passenger p3 = new Passenger("p3");
            m.passengers.put("p3", p3);
            p3.addRating("d1", 3.0);
            p3.addRating("d3", 4.0);

            Passenger p4 = new Passenger("p4");
            m.passengers.put("p4", p4);
            p4.addRating("d4", 5.0);

            Passenger p5 = new Passenger("p5");
            m.passengers.put("p5", p5);
            p5.addRating("d4", 5.0);
        }
        else{
            System.out.println("Invalid Input");
            return;
        }
        while(true){
            System.out.println("Enter some input :  Available_Drivers , Passenger , exit");
            String[] input=br.readLine().split(" ");
            if(input[0].equals("exit"))
                break;

            //We are adding the Available Drivers
            else if(input[0].equals("Available_Drivers")){
                for(String drivername: m.drivers.keySet()){
                    System.out.println("Enter location for driver "+drivername);
                    int x=Integer.parseInt(br.readLine());
                    int y=Integer.parseInt(br.readLine());
                    Location l=new Location(x,y);
                    m.drivers.get(drivername).location=l;
                }
            }
            else if(input[0].equals("Passenger")){
                System.out.println("Enter passenger name");
                String name=br.readLine();
                if(!m.passengers.containsKey(name)){
                    System.out.println("Passenger name does not exists");
                    continue;
                }
                System.out.println("Enter location for passenger "+name);
                int x=Integer.parseInt(br.readLine());
                int y=Integer.parseInt(br.readLine());
                Location l=new Location(x,y);
                m.passengers.get(name).location=l;
                System.out.println("Enter Vehicle Type Choice [ 1,2 or 3] (1) Hatchback (2) Sedan (3) SUV");
                int vehicleTypeChoice = Integer.parseInt(br.readLine());
                System.out.println("Average Rating "+m.passengers.get(name).getAverageRating());
                System.out.println("Eligible drivers by Rating");
                m.findEligibleDrivers(name, m.passengers.get(name).getAverageRating());

            }


        }


    }
}


