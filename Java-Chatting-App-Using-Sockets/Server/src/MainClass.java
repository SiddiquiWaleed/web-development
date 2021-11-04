import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.net.ServerSocket;
import java.net.Socket;

public class MainClass {
    /* Sockets are volatile because they will be used by many thread
       so just ti be safe I made them volatile
    */
    private static volatile ServerSocket serverSocket;
    private static volatile Socket clientSocket = null;

    // Objects to send and receive data
    private static DataInputStream din;
    private static DataOutputStream dout;

    // Main Method of Server
    public static void main(String[] args) throws Exception{
        // Connecting the Database
        DataBase.dbConnector();

        ServerGUI gui = new ServerGUI();

        // Server Started
        serverSocket = new ServerSocket(9999);

        while(true) {
            // Waiting for request from Client Computer
            clientSocket = serverSocket.accept();
            System.out.println("A New Client Is Connected");

            /* Input and output streams for clients
               all clients will have different streams
            */
            din = new DataInputStream(clientSocket.getInputStream());
            dout = new DataOutputStream(clientSocket.getOutputStream());

            // Assigning New Thread
            // Starting a parallel thread for each client connected to the server
            ClientHandler t = new ClientHandler(clientSocket, din, dout);
            // Run method of thread is invoked
            t.start();

            // This current thread is added to an array list
            SharedObjects.threadsList.add(t);

        }

    }
}