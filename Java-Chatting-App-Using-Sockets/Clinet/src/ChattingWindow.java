import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.io.BufferedWriter;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.net.Socket;
import javax.swing.*;

public class ChattingWindow {

    protected MyFrame frame, settingsFrame;
    protected JPanel panel, centerPanel, settingsPanel, bottomPanel;
    protected JTextField msgField, recField, changeNameField;
    protected JButton sendButton, settingsButton, saveButton, confirmChangesButton, logoutButton, sendAllButton;
    protected DataOutputStream dout;
    protected volatile Socket clientSocket;
    protected GridBagConstraints c;
    protected JLabel changeNameLabel, changePassLabel;
    protected JPasswordField changePassField;
    protected JScrollPane scrollPane;

    void chattingWindow(String userName, Socket clientSocket, DataOutputStream dout, String userEmail, String userPass) {
        this.clientSocket = clientSocket;
        this.dout = dout;

        // Initializing components
        initComponents(userName);
        // Adding components to panel and then frame
        addComponents();

        // Creating a new Thread to Listen to Incoming Data From Server
        ListeningThread lt = new ListeningThread();
        lt.start();

        // Send Button to send message
        sendButton.addActionListener(e -> {

            String msgToSend = msgField.getText();	// message typed in the text field
            String rec = recField.getText();		// Email of the receiver
            msgField.setText("");					// Making the field empty again

            try {

                dout.writeUTF(Constants.SEND_CONSTANT);	// Status
                dout.writeUTF(msgToSend);			// Sending the server message
                dout.writeUTF(rec);					// Sending the server the receiver email


                // The message you typed appears on the screen
                JLabel label = new JLabel(msgToSend, JLabel.LEFT);
                label.setFont(new Font(label.getFont().getFontName(), Font.PLAIN, 15));
                label.setForeground(Color.green);

                JPanel labelPanel = new JPanel();
                labelPanel.setBackground(Color.decode("#222222"));
                labelPanel.setLayout(new BoxLayout(labelPanel, BoxLayout.X_AXIS));

                labelPanel.add(label);
                labelPanel.add(Box.createHorizontalGlue());

                centerPanel.add(labelPanel);
                centerPanel.revalidate();
                centerPanel.repaint();
            }
            catch (Exception ex) {
                ex.printStackTrace();
            }
        });


        // Save button to save all your message in a File
        saveButton.addActionListener(e -> {
            try {
                // Constant for requesting the server to give us the message history
                dout.writeUTF(Constants.SAVE_CONSTANT);
            }
            catch (IOException ex) {
                ex.printStackTrace();
            }
        });


        // Settings Button to change your account settings
        settingsButton.addActionListener(e -> settingsFrame.setVisible(true));


        // Button in Settings Menu to Change your name and password
        confirmChangesButton.addActionListener(e -> {

            String changeName = changeNameField.getText();
            String changePass = new String(changePassField.getPassword());
            if(changeName.length() == 0 || changePass.length() == 0) {
                JOptionPane.showMessageDialog(frame, "Either Change name firld or change Pass Field is empty","Error"
                        ,JOptionPane.INFORMATION_MESSAGE);
            }
            else {
                int response = JOptionPane.showConfirmDialog(frame,"Do You Want These Changes","Confirm"
                        ,JOptionPane.YES_NO_CANCEL_OPTION, JOptionPane.QUESTION_MESSAGE);


                changeNameField.setText("");
                changePassField.setText("");
                if(response == JOptionPane.YES_OPTION) {
                    try {
                        dout.writeUTF(Constants.SETTINGS_CONSTANT);
                        dout.writeUTF(changeName);
                        dout.writeUTF(changePass);
                        dout.writeUTF(userEmail);
                        settingsFrame.setVisible(false);
                        frame.setEnabled(true);
                    }
                    catch (IOException ex) {
                        ex.printStackTrace();
                    }
                }
            }
        });


        // Button Logout of your Account
        logoutButton.addActionListener(e -> {
            frame.dispose();
            LoginPage lp = new LoginPage();
            try {
                lp.loginPage();
            }
            catch (Exception ex) {
                ex.printStackTrace();
            }
        });


        // Button to send message to all users that are Online
        sendAllButton.addActionListener(e -> {
            String msgToSend = msgField.getText();	// message typed in the text field
            msgField.setText("");

            try {
                dout.writeUTF(Constants.SENDALL_CONSTANT);
                dout.writeUTF(msgToSend);

                // The message you typed appears on the screen
                JLabel label = new JLabel(msgToSend, JLabel.LEFT);
                label.setFont(new Font(label.getFont().getFontName(), Font.PLAIN, 15));
                label.setForeground(Color.green);

                JPanel labelPanel = new JPanel();
                labelPanel.setBackground(Color.decode("#222222"));
                labelPanel.setLayout(new BoxLayout(labelPanel, BoxLayout.X_AXIS));

                labelPanel.add(label);
                labelPanel.add(Box.createHorizontalGlue());

                centerPanel.add(labelPanel);
                centerPanel.revalidate();
                centerPanel.repaint();
            }
            catch (IOException e1) {
                e1.printStackTrace();
            }
        });
    }

    protected void initComponents(String userName) {
        frame = new MyFrame();
        frame.setTitle(userName);
        settingsFrame = new MyFrame();
        c = new GridBagConstraints();
        frame.setLayout(new BorderLayout());
        panel = new JPanel();
        scrollPane = new JScrollPane();
        centerPanel = new JPanel();
        scrollPane = new JScrollPane(centerPanel);
        centerPanel.setLayout(new BoxLayout(centerPanel, BoxLayout.Y_AXIS));
        centerPanel.setBackground(Color.decode("#222222"));
        settingsPanel = new JPanel(new GridBagLayout());
        bottomPanel = new JPanel();
        msgField = new JTextField(20);
        recField = new JTextField(15);
        sendButton = new JButton("Send");
        saveButton = new JButton("Save");
        settingsButton = new JButton("Setting");
        logoutButton = new JButton("Logout");
        sendAllButton = new JButton("Send All");
        changeNameLabel = new JLabel("Change Name");
        changePassLabel = new JLabel("Change Password");
        changeNameField = new JTextField(25);
        changePassField = new JPasswordField(25);
        changeNameLabel.setFont(new Font("Serif", Font.PLAIN, 20));
        changePassLabel.setFont(new Font("Serif", Font.PLAIN, 20));
        confirmChangesButton = new JButton("Confirm");
        confirmChangesButton.setFont(new Font("Serif", Font.PLAIN, 20));
        confirmChangesButton.setForeground(Color.decode("#00b22d"));
        confirmChangesButton.setBackground(Color.decode("#00b22d"));
        sendAllButton.setFont(new Font("Serif", Font.PLAIN, 20));
        sendAllButton.setForeground(Color.decode("#00b22d"));
        sendAllButton.setBackground(Color.decode("#00b22d"));
    }

    protected void addComponents() {
        // Adding all components to the Frame
        panel.add(msgField);
        panel.add(sendButton);
        panel.add(saveButton);
        panel.add(settingsButton);
        panel.add(new JLabel("    Reciever"));
        panel.add(recField);
        panel.add(logoutButton);
        bottomPanel.add(sendAllButton);
        frame.add(panel, BorderLayout.NORTH);
        frame.add(scrollPane, BorderLayout.CENTER);
        frame.add(bottomPanel, BorderLayout.SOUTH);

        settingsFrame.setDefaultCloseOperation(JFrame.HIDE_ON_CLOSE);
        c.insets = new Insets(10,10,10,10);
        c.gridx = 0;
        c.gridy = 0;
        settingsPanel.add(changeNameLabel, c);
        c.gridx = 1;
        settingsPanel.add(changeNameField);
        c.gridx = 0;
        c.gridy = 1;
        settingsPanel.add(changePassLabel, c);
        c.gridx = 1;
        settingsPanel.add(changePassField, c);
        c.gridy = 2;
        settingsPanel.add(confirmChangesButton, c);
        settingsFrame.add(settingsPanel);
        settingsFrame.setVisible(false);
        frame.setVisible(true);
    }

    @SuppressWarnings("InfiniteLoopStatement")
    // Inner class
    private class ListeningThread extends Thread {

        private DataInputStream din;

        @Override
        // This Code is running parallel to the other code and is always waiting for input from the server
        public void run() {

            try{

                din = new DataInputStream(clientSocket.getInputStream());
                while(true) {

                    // Receive message from Server
                    String msg = din.readUTF();

                    // If Server gives back the message history this code executes
                    if(msg.equals(Constants.MSG_HISTORY_CONSTANT)) {
                        int size = Integer.parseInt(din.readUTF());
                        File file = new File("History.txt");
                        BufferedWriter bw = new BufferedWriter(new FileWriter(file));
                        for(int i = 0; i < size; i++) {
                            String message = din.readUTF();
                            String sender = din.readUTF();
                            String receiver = din.readUTF();

                            bw.write("MSG: " + message);
                            bw.write("\r\n");
                            bw.write("Sender: " + sender);
                            bw.write("\r\n");
                            bw.write("Receiver: " + receiver);
                            bw.write("\r\n\r\n");

                        }
                        bw.close();
                    }

                    else {
                        // Updating the GUI to show message on screen which we got from server
                        // This code is executed by the GUI Thread not by this thread
                        SwingUtilities.invokeLater(() -> {

                            JLabel label = new JLabel(msg);
                            label.setForeground(Color.GREEN);
                            label.setFont(new Font(label.getFont().getFontName(), Font.PLAIN, 15));
                            JPanel labelPanel = new JPanel();
                            labelPanel.setBackground(Color.decode("#222222"));
                            labelPanel.setLayout(new BoxLayout(labelPanel, BoxLayout.X_AXIS));

                            labelPanel.add(Box.createHorizontalGlue());
                            labelPanel.add(label);

                            centerPanel.add(labelPanel);
                            centerPanel.revalidate();
                            centerPanel.repaint();
                        });
                    }
                }

            }
            catch (IOException e1) {
                e1.printStackTrace();
            }

        }

    }
}


