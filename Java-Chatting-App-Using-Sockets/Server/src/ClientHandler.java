import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.net.Socket;
import java.util.ArrayList;

public class ClientHandler extends Thread {

    // Streams of input and output for a specific client
    private final DataInputStream din;
    private final DataOutputStream dout;
    // Also the socket for the specific client
    private final Socket clientSocket;
    // And his/her Email which he/she used to sign in
    private String email;

    /* Constants that will prepare the server to identify which
     function is client going to perform
     */
    private static final String SEND_CONSTANT = "send_37trwyefw76rgw4utrhwvef7uw";
    private static final String LOGIN_CONSTANT = "login_37trwyefw76rgw4utrhwvef7uw";
    private static final String SAVE_CONSTANT = "save_37trwyefw76rgw4utrhwvef7uw";
    private static final String SETTINGS_CONSTANT = "settings_37trwyefw76rgw4utrhwvef7uw";
    private static final String SIGNUP_CONSTANT = "signup_37trwyefw76rgw4utrhwvef7uw";
    private static final String MSG_HISTORY_CONSTANT = "receiving_msg_history_37trwyefw76rgw4utrhwvef7uw";
    private static final String ADMIN_CONSTANT = "admin_37trwyefw76rgw4utrhwvef7uw";
    private static final String SIGNUP_ADMIN_CONSTANT = "signup_admin_37trwyefw76rgw4utrhwvef7uw";
    private static final String SENDALL_CONSTANT = "sendall_37trwyefw76rgw4utrhwvef7uw";
    private static final String DELETEUSER_CONSTANT = "deleteuser_37trwyefw76rgw4utrhwvef7uw";


    ClientHandler(Socket clientSocket, DataInputStream din, DataOutputStream dout) {
        this.clientSocket = clientSocket;
        this.dout = dout;
        this.din = din;
        this.email = "";
    }

    String getEmail() {
        return this.email;
    }

    @Override
    public void run() {
        try {
            while(true) {
                String status = din.readUTF();

                /* status is of login then first if will run which will be used
                 to check the login credentials of user */
                if(status.equals(LOGIN_CONSTANT)) {
                    String email = din.readUTF();
                    String pass = din.readUTF();
                    // If email and password matches
                    if(DataBase.checkLoginDetails(email, pass)) {
                        this.email = email;
                        dout.writeUTF("true");
                    }
                    // If email and pass don't matches
                    else {
                        dout.writeUTF("false");
                    }
                }

                // If client tries to login as an administrator
                else if(status.equals(ADMIN_CONSTANT)) {
                    String email = din.readUTF();
                    String pass = din.readUTF();

                    // If Login Credentials matches
                    if(DataBase.checkAdminDetails(email, pass)) {
                        this.email = email;
                        dout.writeUTF("true");
                    }
                    // If don't
                    else {
                        dout.writeUTF("false");
                    }
                }

                // If client tries to sign up an administrator account
                else if(status.equals(SIGNUP_ADMIN_CONSTANT)) {
                    String name = din.readUTF();
                    String email = din.readUTF();
                    String pass = din.readUTF();
                    DataBase.addNewAdminAccount(name, email, pass);
                }

                // If client tries to send a message
                else if(status.equals(SEND_CONSTANT)) {
                    String msg, rec;
                    msg = din.readUTF();
                    rec = din.readUTF();

                    for(int i = 0; i < SharedObjects.threadsList.size(); i++) {
                        ClientHandler ch = SharedObjects.threadsList.get(i);
                        if(ch.getEmail().equals(rec)) {
                            DataOutputStream dout = ch.getOutpusStream();
                            synchronized(dout) {
                                dout.writeUTF(this.email + ": " + msg);
                                DataBase.storeMSGInDataBase(msg, this.email , rec);
                            }
                            break;
                        }
                    }
                }

                /* If client tries to send a message to every client connected
                 to server right now*/
                else if(status.equals(SENDALL_CONSTANT)) {
                    String msg, rec = "ALL";
                    msg = din.readUTF();

                    for(int i = 0; i < SharedObjects.threadsList.size(); i++) {
                        ClientHandler ch = SharedObjects.threadsList.get(i);

                        DataOutputStream dout = ch.getOutpusStream();
                        synchronized(dout) {
                            dout.writeUTF(this.email + ": " + msg);
                            DataBase.storeMSGInDataBase(msg, this.email , rec);
                        }
                    }
                }

                // If client tries to sign up as regular user
                else if(status.equals(SIGNUP_CONSTANT)) {
                    String name = din.readUTF();
                    String email = din.readUTF();
                    String pass = din.readUTF();
                    DataBase.addNewAccountToDataBase(name, email, pass);
                }

                // If client tries to save the message history
                else if(status.equals(SAVE_CONSTANT)) {
                    ArrayList<Message> msgs = DataBase.getMessageHistory(email);
                    dout.writeUTF(MSG_HISTORY_CONSTANT);
                    dout.writeUTF(Integer.toString(msgs.size()));
                    for(int i = 0; i < msgs.size(); i++) {
                        dout.writeUTF(msgs.get(i).getMsg());
                        dout.writeUTF(msgs.get(i).getSender());
                        dout.writeUTF(msgs.get(i).getReceiver());
                    }
                }

                // If client tries to change his/her account settings
                else if(status.equals(SETTINGS_CONSTANT)) {
                    String changeName = din.readUTF();
                    String changePass = din.readUTF();
                    String userEmail = din.readUTF();
                    DataBase.changeSettings(changeName, changePass, userEmail);
                }

                // If administrator tries to delete an account
                else if(status.equals(DELETEUSER_CONSTANT)) {
                    String email = din.readUTF();
                    DataBase.deleteUser(email);
                }

            }
        }
        catch (Exception e) {
            for(int i = 0; i < SharedObjects.threadsList.size(); i++) {
                ClientHandler ch = SharedObjects.threadsList.get(i);
                if(ch.getEmail().equals(this.email)) {
                    SharedObjects.threadsList.remove(i);
                    break;
                }
            }
        }
    }

    public DataOutputStream getOutpusStream() {
        return this.dout;
    }
}