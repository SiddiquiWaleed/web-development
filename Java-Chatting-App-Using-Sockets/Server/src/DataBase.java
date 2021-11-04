import java.io.File;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

class DataBase {

    private static Connection c = null;
    private static Statement stmt = null;

    // Method to make a connection with the database
    static void dbConnector() throws Exception {

        // Creating a file object to check if the file exists or not
        File file = new File("my_database.sqlite");

        // If file is already there then just make connection
        if(file.exists()) {
            try {
                c = DriverManager.getConnection("jdbc:sqlite:my_database.sqlite");
            }
            catch (Exception e) {
                e.printStackTrace();
            }
            System.out.println("Opened database successfully");
        }

        /* Other wise make a new database and also
           run all queries to make the tables in it */
        else {
            try {
                c = DriverManager.getConnection("jdbc:sqlite:my_database.sqlite");
            }
            catch (Exception e) {
                e.printStackTrace();
            }
            System.out.println("Opened database successfully");
            stmt = c.createStatement();

            // Creating first table
            String sql = "CREATE TABLE Admin_Details(\r\n" +
                    "Admin_Email varchar(255),\r\n" +
                    "Admin_Pass varchar(255),\r\n" +
                    "Admin_Name varchar(255)\r\n" +
                    "\r\n" +
                    ")";
            stmt.execute(sql);

            // Creating second table
            sql = "CREATE TABLE Login_Details(\r\n" +
                    "User_Email varchar(255),\r\n" +
                    "User_Pass varchar(255)\r\n" +
                    ", User_Name VARCHAR(255))";
            stmt.execute(sql);

            // Creating third table
            sql = "CREATE TABLE \"Msg_History\" (\"Message\" TEXT, \"Sender\" TEXT, \"Receiver\" TEXT)";
            stmt.execute(sql);
        }

    }

    // Method to check login details of client
    static boolean checkLoginDetails(String email, String pass) throws SQLException {
        Statement stmt ;
        stmt = c.createStatement();

        // SQL Query
        ResultSet rs = stmt.executeQuery("SELECT * FROM Login_Details WHERE User_Email" +
                "='" + email + "' AND User_Pass='" + pass + "'");

        if (rs.next()) {
            return true;
        }
        return false;
    }

    // Method to add a new account in database to use this application
    static void addNewAccountToDataBase(String name, String email, String pass) throws SQLException {
        stmt = c.createStatement();
        String sql = "INSERT INTO Login_Details (User_Email, User_Pass, User_Name) VALUES(?,?,?)";

        // Using Prepared statement to avoid SQL Injection
        PreparedStatement pstmt = c.prepareStatement(sql);
        pstmt.setString(1, email);
        pstmt.setString(2, pass);
        pstmt.setString(3, name);
        pstmt.executeUpdate();
    }

    // Method which stores all messages in database
    static void storeMSGInDataBase(String msg, String sender, String receiver) throws SQLException {
        stmt = c.createStatement();
        String sql = "INSERT INTO Msg_History (Message, Sender, Receiver) VALUES (?,?,?)";

        // Using Prepared statement to avoid SQL Injection
        PreparedStatement pstmt = c.prepareStatement(sql);
        pstmt.setString(1, msg);
        pstmt.setString(2, sender);
        pstmt.setString(3, receiver);
        pstmt.executeUpdate();
    }

    // Method to get Message history for a specific client
    static ArrayList<Message> getMessageHistory(String email) throws SQLException {
        ArrayList<Message> msgs = new ArrayList<Message>();
        Statement stmt ;
        stmt = c.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT * FROM Msg_History WHERE Sender='" + email
                + "' OR Receiver='" + email + "'");
        while (rs.next()) {
            Message msg = new Message(rs.getString("Sender"), rs.getString("Message"),
                    rs.getString("Receiver"));
            msgs.add(msg);
        }
        rs.close();
        return msgs;
    }

    // Method which changes client settings
    static void changeSettings(String changeName, String changePass, String userEmail) throws SQLException {
        stmt = c.createStatement();
        stmt.executeQuery("UPDATE Login_Details SET User_Pass = '" +changePass+ "' , "
                + "User_Name = '" +changeName+ "'	WHERE User_Email = '" +userEmail+ "'");
    }

    // Method to check the login details of an administrator
    static boolean checkAdminDetails(String email, String pass) throws SQLException {
        Statement stmt ;
        stmt = c.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT * FROM Admin_Details WHERE Admin_Email" +
                "='" + email + "' AND Admin_Pass='" + pass + "'");
        if (rs.next()) {
            return true;
        }
        return false;
    }

    // Method to add a new administrator account
    static void addNewAdminAccount(String name, String email, String pass) throws SQLException {
        stmt = c.createStatement();
        String sql = "INSERT INTO Admin_Details (Admin_Email, Admin_Pass, Admin_Name) VALUES(?,?,?)";

        // Using Prepared statement to avoid SQL Injection
        PreparedStatement pstmt = c.prepareStatement(sql);
        pstmt.setString(1, email);
        pstmt.setString(2, pass);
        pstmt.setString(3, name);
        pstmt.executeUpdate();
    }

    // Method to delete a user account
    static void deleteUser(String email) throws SQLException {
        stmt = c.createStatement();
        String sql = "DELETE FROM Login_Details WHERE User_Email = '"+email+"'";
        stmt.execute(sql);
    }

}
