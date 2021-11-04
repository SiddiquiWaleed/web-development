import java.util.ArrayList;
import java.util.Scanner;

public class FlightController {

	private static final Scanner scan = new Scanner(System.in);
	private static final ArrayList<Flight> flightsList = new ArrayList<Flight>();

	public static void loadFlightsState() {
		// Filling the filghtsList with data from file
		FileHandler.loadFlights(flightsList);
	}

	public static void seatPattern() {
		String seatsPattern[][] = Constants.SEAT_PATTERN;
		for(int row = 0; row < seatsPattern.length; row++) {
			System.out.print((row + 1) + " ");
			for(int col = 0; col < seatsPattern[row].length; col++) {
				System.out.print(seatsPattern[row][col] + " ");
			}
			System.out.println();
		}
		System.out.println();
	}

	public static void seatReservation() {
		String cnicNumber, name, dateOfTravelling, 
		sourceAirport, destinationAirport, seatNumber;

		System.out.println("Enter CNIC number : ");
		do {
			cnicNumber = scan.nextLine();
		}while(Validation.cnicChecker(cnicNumber));


		System.out.println("Enter name : ");
		do {
			name = scan.nextLine();
		}while(Validation.nameChecker(name));


		System.out.println("Enter date of travelling (dd-mm-yyyy) : ");
		do {
			dateOfTravelling = scan.nextLine();
		}while(Validation.dateOfTravellingChecker(dateOfTravelling));
		

		System.out.println("Enter source airport : \n1 For LHR and 2 for KHI");
		do {
			sourceAirport = scan.nextLine();
		}while(Validation.destChecker(sourceAirport));
		if(sourceAirport.equals("1")) {
			sourceAirport = "LHR";
		}
		else {
			sourceAirport = "KHI";
		}


		System.out.println("Enter destination airport : \n1 For Lhr and 2 for KHI");
		do {
			destinationAirport = scan.nextLine();
		}while(Validation.destChecker(destinationAirport));
		if(destinationAirport.equals("1")) {
			destinationAirport = "LHR";
		}
		else {
			destinationAirport = "KHI";
		}


		System.out.println("Enter seat number : ");
		do {
			seatNumber = scan.nextLine();
		}while(Validation.seatNumberInputChecker(seatNumber));


		Flight flight = getFlightOfDate(dateOfTravelling);

		if(flight.seatIsAvailable(seatNumber)) {
			flight.reserveSeat(cnicNumber, name, dateOfTravelling, 
					sourceAirport, destinationAirport, seatNumber);

			System.out.println("Seat reserved");
			System.out.println(Validation.getDate());
		}
		else {
			System.out.println("Sorry! Seat is already reserved.");
		}
	}

	private static Flight getFlightOfDate(String date) {
		Flight flight = null;
		boolean flightFound = false;
		for(int i = 0; i < flightsList.size(); i++) {
			flight = flightsList.get(i);
			if(flight.getDate().equals(date)) {
				flightFound = true;
				break;
			}
		}

		if(flightFound)
			return flight;
		else {
			flight = new Flight(date);
			flightsList.add(flight);
			return flight;
		}
	}

	public static void seatCancellation() {
		String cnic, date;
		System.out.println("Enter the cnic to cancel reservation : ");
		cnic = scan.nextLine();
		System.out.println("Enter the reservation date (dd-mm-yyyy): ");
		date = scan.nextLine();

		Flight flight = FlightController.getFlightOfDate(date);
		boolean canceled = flight.cancelReservation(cnic);

		if(canceled)
			System.out.println("Reservation cancelled");
		else
			System.out.println("No reservations found against CNIC " + cnic);
	}

	public static void availableSeats() {
		String date;
		System.out.println("Which date's data you want to see. Enter the date (dd-mm-yyyy) : ");
		date = scan.nextLine();

		Flight flight = getFlightOfDate(date);
		String[][] seats = flight.getSeats();

		for(int row = 0; row < seats.length; row++) {
			System.out.print((row + 1) + " ");
			for(int col = 0; col < seats[row].length; col++) {
				System.out.print(seats[row][col] + " ");
			}
			System.out.println();
		}
		System.out.println();
	}

	public static void reservedSeats() {
		String date;
		System.out.println("Which date's data you want to see. Enter the date (dd-mm-yyyy) : ");
		date = scan.nextLine();

		Flight flight = FlightController.getFlightOfDate(date);
		String[][] seats = flight.getSeats();

		for(int row = 0; row < seats.length; row++) {
			System.out.print((row + 1) + " ");
			for(int col = 0; col < seats[row].length; col++) {
				System.out.print(seats[row][col] + " ");
			}
			System.out.println();
		}
		System.out.println();
	}

	public static void searchReservation() {
		String cnic;
		System.out.println("Enter the cnic to search reservation : ");
		cnic = scan.nextLine();

		boolean dataFound = false;
		for(int i = 0; i < flightsList.size(); i++) {
			Flight flight = flightsList.get(i);
			Traveller traveller = flight.searchReservation(cnic);

			// If CNIC data found
			if(traveller != null) {
				dataFound = true;

				//Print data here
				System.out.println("Flight date : " + flight.getDate());
				System.out.println("Traveller Name : " + traveller.getName());
				System.out.println("Traveller Source Airport : " + traveller.getSourceAirport());
				System.out.println("Traveller Destination Airport : " + traveller.getDestAirport());
				System.out.println("Traveller Seat Number : " + traveller.getSeatNumber());
				System.out.println();
			}
		}

		if(!dataFound) {
			System.out.println("No reservations found against CNIC " + cnic);
		}
	}
}
