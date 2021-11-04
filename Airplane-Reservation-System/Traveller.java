
public class Traveller {

	private String cnic;
	private String name;
	private String dateOfTravelling;
	private String sourceAirport;
	private String destAirport;
	private String seatNumber;
	
	public Traveller(String cnic, String name, String dateOfTravel,
			String sourceAirport, String destAirport, String seatNumber) {
		this.cnic = cnic;
		this.name = name;
		this.dateOfTravelling = dateOfTravel;
		this.sourceAirport = sourceAirport;
		this.destAirport = destAirport;
		this.seatNumber = seatNumber;
	}
	
	public String getCNIC() {
		return this.cnic;
	}
	
	public String getName() {
		return this.name;
	}
	
	public String getDateOfTravel() {
		return this.dateOfTravelling;
	}
	
	public String getSourceAirport() {
		return this.sourceAirport;
	}
	
	public String getDestAirport() {
		return this.destAirport;
	}
	
	public String getSeatNumber() {
		return this.seatNumber;
	}
}
