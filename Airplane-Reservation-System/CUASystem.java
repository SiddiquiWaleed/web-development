import java.util.Scanner;

public class CUASystem {
	
	private static final Scanner scan = new Scanner(System.in);

	public static void showMenu() {
		System.out.println("a. Seat Pattern");
		System.out.println("b. Seat Reservation");
		System.out.println("c. Seat Cancellation");
		System.out.println("d. Available Seats");
		System.out.println("e. Reserved Seats");
		System.out.println("f. Search Reservation");
		System.out.println("g. Exit");
	}	
	
	public static void main(String[] args) {
		FlightController.loadFlightsState();
		
		String choice;
		
			do {
				CUASystem.showMenu();
				choice = scan.next();
				
				if(choice.equals("a")) {
					FlightController.seatPattern();
				}
				else if(choice.equals("b")) {
					FlightController.seatReservation();
				}
				else if(choice.equals("c")) {
					FlightController.seatCancellation();
				}
				else if(choice.equals("d")) {
					FlightController.availableSeats();
				}
				else if(choice.equals("e")) {
					FlightController.reservedSeats();
				}
				else if(choice.equals("f")) {
					FlightController.searchReservation();
				}
				else if(choice.equals("g")) {
					continue;
				}
				else {
					System.out.println("Invalid input. Try again.");
				}
			}
			while(!choice.equals("g"));
		
		
	}
}
