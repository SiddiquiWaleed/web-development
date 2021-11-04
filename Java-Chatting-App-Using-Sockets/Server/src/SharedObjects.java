import java.util.ArrayList;

class SharedObjects {

    // Each new thread is added into this array list
    static ArrayList<ClientHandler> threadsList = new ArrayList<ClientHandler>();
}