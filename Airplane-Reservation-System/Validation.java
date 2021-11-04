import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Scanner;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Validation {
	public static final Scanner scan = new Scanner(System.in);

	public static boolean mainMenuInputCheck(String choice) {
		if(choice.equals("a") || choice.equals("b") || choice.equals("c") || choice.equals("d") || 
				choice.equals("e") || choice.equals("f") || choice.equals("g")){
			return false;
		}
		else {
			System.out.println("Invalid Input");
			System.out.println("Enter Again");
			return true;
		}
	}

	public static boolean seatNumberInputChecker(String seatNumber) {
		if(seatNumber.length() == 3) {
			if(seatNumber.equals("10A") || seatNumber.equals("10B") || seatNumber.equals("10C") || seatNumber.equals("10D")) {
				return false;
			}
			else {
				System.out.println("Invalid Input");
				System.out.println("Enter Again");
				return true;
			}
		}
		else if(seatNumber.length() == 2) {
			if(seatNumber.charAt(0) == '1' || seatNumber.charAt(0) == '2' || seatNumber.charAt(0) == '3' || seatNumber.charAt(0) == '4' ||  
					seatNumber.charAt(0) == '5' || seatNumber.charAt(0) == '6' || seatNumber.charAt(0) == '7' || seatNumber.charAt(0) == '8' 
					|| seatNumber.charAt(0) == '9') {
				if(seatNumber.charAt(1) == 'A' || seatNumber.charAt(1) == 'B' || seatNumber.charAt(1) == 'C' || seatNumber.charAt(1) == 'D') {
					return false;
				}
				else {
					System.out.println("Invalid Input");
					System.out.println("Enter Again");
					return true;
				}

			}
			else {
				System.out.println("Invalid Input");
				System.out.println("Enter Again");
				return true;
			}
		}
		else {
			System.out.println("Invalid Input");
			System.out.println("Enter Again");
			return true;
		}
	}



	public static boolean nameChecker(String name) {
		if(name.matches("^[\\p{L} .'-]+$")) {
			return false;
		}
		else {
			System.out.println("Invalid Name");
			System.out.println("Enter Again");
			return true;
		}

	}

	public static boolean cnicChecker(String cnic) {
		if(cnic.length() != 13) {
			System.out.println("Invalid Cnic");
			System.out.println("Enter Again");
			return true;
		}
		else {
			return false;
		}
	}

	public static boolean dateOfTravellingChecker(String strDate) {
		String regex = "(0?[1-9]|[12][0-9]|3[01])-(0?[1-9]|1[012])-((19|20)\\d\\d)";
		Pattern pattern = Pattern.compile(regex);
		Matcher matcher = pattern.matcher(strDate);
		if(matcher.matches()){

			matcher.reset();

			if(matcher.find()){

				String day = matcher.group(1);
				String month = matcher.group(2);
				int year = Integer.parseInt(matcher.group(3));

				if (day.equals("31") && 
						(month.equals("4") || month .equals("6") || month.equals("9") ||
								month.equals("11") || month.equals("04") || month .equals("06") ||
								month.equals("09"))) {
					System.out.println("Invalid Date");
					System.out.println("Enter Again");
					return true; 
				} else if (month.equals("2") || month.equals("02")) {

					if(year % 4==0){
						if(day.equals("30") || day.equals("31")){
							System.out.println("Invalid Date");
							System.out.println("Enter Again");
							return true;
						}else{
							return false;
						}
					}else{
						if(day.equals("29")||day.equals("30")||day.equals("31")){
							System.out.println("Invalid Date");
							System.out.println("Enter Again");
							return true;
						}else{
							return false;
						}
					}
				}else{				 
					return false;				 
				}
			}
			else{
				System.out.println("Invalid Date");
				System.out.println("Enter Again");
				return true;
			}		  
		}
		else{
			System.out.println("Invalid Date");
			System.out.println("Enter Again");
			return true;
		}
	}

	public static boolean destChecker(String dest) {
		if(dest.equals("1") || dest.equals("2")) {
			return false;
		}
		else {
			System.out.println("Invalid Date");
			System.out.println("Enter Again");
			return true;
		}
	}


	public static String getDate() {
		String date;
		DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");  
		LocalDateTime now = LocalDateTime.now();   
		date = dtf.format(now);
		return date;
	}
}