
public class Flight {
	
	private String date;
	private String[][] seats;
	private FileHandler fileHandler;
	
	public Flight(String date) {
		this.date = date;
		seats = new String[][] {{"A", "B", "C", "D"},
								{"A", "B", "C", "D"},
								{"A", "B", "C", "D"},
								{"A", "B", "C", "D"},
								{"A", "B", "C", "D"},
								{"A", "B", "C", "D"},
								{"A", "B", "C", "D"},
								{"A", "B", "C", "D"},
								{"A", "B", "C", "D"},
								{"A", "B", "C", "D"}};
		
		String filename = date + ".txt";
		fileHandler = new FileHandler(filename);
	}
	
	public String getDate() {
		return this.date;
	}
	
	public String[][] getSeats() {
		return this.seats;
	}
	
	public void reserveSeat(String cnic, String name, String dateOfTravelling,
			String sourceAirport, String destAirport, String seatNumber) {
		
		int row = getRowFromSeatNumber(seatNumber);
		int col = getColumFromSeatNumber(seatNumber);
		
		// changing the value of index in seats array
		seats[row - 1][col - 1] = "X";
		
		// Saving data in file
		fileHandler.saveDate(cnic, name, dateOfTravelling, 
				sourceAirport, destAirport, seatNumber);
	}
	
	public void markAsReserved(String seatNumber) {
		int row = getRowFromSeatNumber(seatNumber);
		int col = getColumFromSeatNumber(seatNumber);
		
		// changing the value of index in seats array
		seats[row - 1][col - 1] = "X";
	}
	
	public boolean seatIsAvailable(String seatNumber) {
		int row = getRowFromSeatNumber(seatNumber);
		int col = getColumFromSeatNumber(seatNumber);
		
		if(seats[row - 1][col - 1].equals("X"))
			return false;
		else
			return true;
	}
	
	private static int getRowFromSeatNumber(String seatNumber) {
		String row = seatNumber.substring(0, seatNumber.length() - 1);
		return Integer.parseInt(row);
	}
	
	private static int getColumFromSeatNumber(String seatNumber) {
		String col = seatNumber.split("")[seatNumber.length() - 1];
		
		if(col.equals("A"))
			return 1;
		else if(col.equals("B"))
			return 2;
		else if(col.equals("C"))
			return 3;
		else
			return 4;
	}
	
	public Traveller searchReservation(String cnic) {
		return fileHandler.searchReservation(cnic);
	}
	
	public boolean cancelReservation(String cnic) {
		String seatNumberCancelled = fileHandler.cancelReservation(cnic);
		if(seatNumberCancelled == null)
			return false;
		else {
			int row = getRowFromSeatNumber(seatNumberCancelled);
			int col = getColumFromSeatNumber(seatNumberCancelled);
			
			String columChar = seatNumberCancelled.split("")[seatNumberCancelled.length() - 1];
			
			seats[row - 1][col - 1] = columChar;
			
			return true;
		}
	}
}
