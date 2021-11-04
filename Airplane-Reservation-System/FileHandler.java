import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;

public class FileHandler {

	private File flightDataFile;

	public FileHandler(String filename) {

		this.flightDataFile = new File(filename);

		// If file does'nt exists then create a file
		if(!flightDataFile.exists()) {
			try {
				BufferedWriter writer = new BufferedWriter(new FileWriter(flightDataFile));
				writer.close();
			} 
			catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	// This method will pick up data from each file and load into flightsList
	public static void loadFlights(ArrayList<Flight> flightsList) {

		String currentDirectory = System.getProperty("user.dir");

		File folder = new File(currentDirectory);
		File[] listOfFiles = folder.listFiles();

		for(int i = 0; i < listOfFiles.length; i++) {
			// If the index contains a file (not folder)
			if(listOfFiles[i].isFile()) {
				File fileToReadFrom = listOfFiles[i];
				String fileName = fileToReadFrom.getName();
				// If it is a .txt file
				if(fileName.endsWith(".txt")) {
					// Extracting the date from filename
					String date = fileName.substring(0, fileName.length() - 4);

					Flight flight = new Flight(date);

					try {
						BufferedReader reader = new BufferedReader(new FileReader(fileToReadFrom));

						String seatNumber;
						while(reader.readLine() != null) {
							reader.readLine();
							reader.readLine();
							reader.readLine();
							reader.readLine();

							seatNumber = reader.readLine();
							flight.markAsReserved(seatNumber);
						}

						reader.close();

						flightsList.add(flight);
					} 
					catch (Exception e) {
						e.printStackTrace();
					}
				}
			}
		}
	}

	public void saveDate(String cnic, String name, String dateOfTravelling, 
			String sourceAirport, String destAirport, String seatNumber) {

		try {
			BufferedWriter writer = new BufferedWriter(new FileWriter(flightDataFile, true));
			writer.write(cnic);
			writer.write("\r\n");
			writer.write(name);
			writer.write("\r\n");
			writer.write(dateOfTravelling);
			writer.write("\r\n");
			writer.write(sourceAirport);
			writer.write("\r\n");
			writer.write(destAirport);
			writer.write("\r\n");
			writer.write(seatNumber);
			writer.write("\r\n");
			writer.close();
		} 
		catch (IOException e) {
			e.printStackTrace();
		}
	}

	public Traveller searchReservation(String cnicToSearch) {
		Traveller traveller = null;

		try {
			BufferedReader reader = new BufferedReader(new FileReader(flightDataFile));
			String data, cnic, name, dateOfTravel, sourceAirport, destAirport, seatNumber;
			while((data = reader.readLine()) != null) {
				cnic = data;
				name = reader.readLine();
				dateOfTravel = reader.readLine();
				sourceAirport = reader.readLine();
				destAirport = reader.readLine();
				seatNumber = reader.readLine();

				if(cnicToSearch.equals(cnic)) {
					traveller = new Traveller(cnic, name, dateOfTravel,
							sourceAirport, destAirport, seatNumber);
					break;
				}
			}

			reader.close();
		} 
		catch (IOException e) {
			e.printStackTrace();
		}

		return traveller;
	}

	public String cancelReservation(String cnicToCancelReserv) {
		File tempFile = new File("temp.txt");
		String seatNumberCancelled = null;
		try {
			BufferedReader reader = new BufferedReader(new FileReader(flightDataFile));
			BufferedWriter writer = new BufferedWriter(new FileWriter(tempFile));

			String data, cnic, name, dateOfTravel, sourceAirport, destAirport, seatNumber;

			while((data = reader.readLine()) != null) {
				cnic = data;
				name = reader.readLine();
				dateOfTravel = reader.readLine();
				sourceAirport = reader.readLine();
				destAirport = reader.readLine();
				seatNumber = reader.readLine();

				if(cnicToCancelReserv.equals(cnic)) {
					seatNumberCancelled = seatNumber;
				}
				else {
					// Writing the data into the other file
					writer.write(cnic);
					writer.write("\r\n");
					writer.write(name);
					writer.write("\r\n");
					writer.write(dateOfTravel);
					writer.write("\r\n");
					writer.write(sourceAirport);
					writer.write("\r\n");
					writer.write(destAirport);
					writer.write("\r\n");
					writer.write(seatNumber);
					writer.write("\r\n");
				}
			}

			reader.close();
			writer.close();

			flightDataFile.delete();
			tempFile.renameTo(flightDataFile);

			return seatNumberCancelled;
		}
		catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
}
