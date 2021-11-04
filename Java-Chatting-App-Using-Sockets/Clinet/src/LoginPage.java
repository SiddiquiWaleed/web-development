import java.awt.CardLayout;
import java.awt.Color;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.Socket;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JPasswordField;
import javax.swing.JTextField;

class LoginPage {

    private MyFrame frame, IPFrame;
    private JPanel mainPanel, loginPanel, signUpPanel, IPPanel;
    private GridBagConstraints c;
    private JLabel userNameLabel, userPassLabel, newNameLabel, newEmailLabel, newPassLabel, enterIPLabel;
    private JTextField userNameField, newNameField, newEmailField, IPField;
    private JButton submitButton, signUpButton, confirmButton, backButton,
            adminLoginButton, adminSignUpButton, enterIPButton;
    private CardLayout cl;
    private JPasswordField newPassField, userPassField;
    private volatile Socket clientSocket;
    private DataOutputStream dout;
    private static DataInputStream din;

    void loginPage() {

        // Initializing all components
        initComponents();
        // Adding components to panel and then to frame
        addComponentsToFrame();

        // Submit Button to submit email and password for user
        submitButton.addActionListener(e -> {

            String userEmail = userNameField.getText();
            String userPass = new String (userPassField.getPassword());

            if(userEmail.length() == 0 || userPass.length() == 0) {
                JOptionPane.showMessageDialog(frame, "Either Email or Password is empty","Error",JOptionPane.INFORMATION_MESSAGE);
            }

            else {
                try {

                    dout.writeUTF(Constants.LOGIN_CONSTANT);
                    dout.writeUTF(userEmail);
                    dout.writeUTF(userPass);
                    if(din.readUTF().equals("true")){
                        frame.dispose();
                        ChattingWindow cw = new ChattingWindow();
                        cw.chattingWindow(userEmail, clientSocket, dout, userEmail, userPass);
                    }

                    else {
                        JOptionPane.showMessageDialog(frame, "Wrong Email or Password","Error",JOptionPane.INFORMATION_MESSAGE);
                    }
                }
                catch (Exception ex) {
                    ex.printStackTrace();
                }
            }

        });


        // SignUp Button to Open the Panel to add New Account in Database
        signUpButton.addActionListener(e -> cl.show(mainPanel, "2"));

        // Administrator login button
        adminLoginButton.addActionListener(e -> {

            String userEmail = userNameField.getText();
            String userPass = new String (userPassField.getPassword());

            if(userEmail.length() == 0 || userPass.length() == 0) {
                JOptionPane.showMessageDialog(frame, "Either Email or Password is empty","Error",JOptionPane.INFORMATION_MESSAGE);
            }

            else {
                try {

                    dout.writeUTF(Constants.ADMIN_CONSTANT);
                    dout.writeUTF(userEmail);
                    dout.writeUTF(userPass);
                    if(din.readUTF().equals("true")){
                        frame.dispose();
                        AdminWindow aw = new AdminWindow();
                        aw.adminWindow(userEmail, clientSocket, dout, userEmail, userPass);
                    }

                    else {
                        JOptionPane.showMessageDialog(frame, "Wrong Email or Password","Error",JOptionPane.INFORMATION_MESSAGE);
                    }
                }
                catch (Exception ex) {
                    ex.printStackTrace();
                }
            }
        });

        // Confirm Button in sign up panel to confirm the submission of account in Database
        confirmButton.addActionListener(e -> {

            // Confirming to SignUp
            int response = JOptionPane.showConfirmDialog(frame,"Do You Want To Sign Up","Confirm"
                    ,JOptionPane.YES_NO_CANCEL_OPTION, JOptionPane.QUESTION_MESSAGE);

            String newName = newNameField.getText();
            String newEmail = newEmailField.getText();
            String newPass = new String(newPassField.getPassword());

            if(newName.length() == 0 || newEmail.length() == 0 || newPass.length() == 0) {
                JOptionPane.showMessageDialog(frame, "Either Email or Password or Name is empty","Error",JOptionPane.INFORMATION_MESSAGE);
            }

            else {
                // If Yes
                if(response == JOptionPane.YES_OPTION) {
                    try {
                        dout.writeUTF(Constants.SIGNUP_CONSTANT);
                        dout.writeUTF(newName);
                        dout.writeUTF(newEmail);
                        dout.writeUTF(newPass);
                        newNameField.setText("");
                        newEmailField.setText("");
                        newPassField.setText("");
                    } catch (IOException ex) {
                        ex.printStackTrace();
                    }
                }
            }
        });


        // Button to go Back to Login Page
        backButton.addActionListener(e -> cl.show(mainPanel, "1"));

        // Sign Up as Administrator Button
        adminSignUpButton.addActionListener(e -> {

            // Confirming to SignUp
            int response = JOptionPane.showConfirmDialog(frame,"Do You Want To Sign Up as Admin","Confirm"
                    ,JOptionPane.YES_NO_CANCEL_OPTION, JOptionPane.QUESTION_MESSAGE);
            String newName = newNameField.getText();
            String newEmail = newEmailField.getText();
            String newPass = new String(newPassField.getPassword());

            if(newName.length() == 0 || newEmail.length() == 0 || newPass.length() == 0) {
                JOptionPane.showMessageDialog(frame, "Either Email or Password or Name is empty","Error",JOptionPane.INFORMATION_MESSAGE);
            }

            else {
                // If Yes
                if(response == JOptionPane.YES_OPTION) {
                    try {
                        dout.writeUTF(Constants.SIGNUP_ADMIN_CONSTANT);
                        dout.writeUTF(newName);
                        dout.writeUTF(newEmail);
                        dout.writeUTF(newPass);
                        newNameField.setText("");
                        newEmailField.setText("");
                        newPassField.setText("");
                    } catch (IOException e1) {
                        e1.printStackTrace();
                    }
                }
            }
        });

        enterIPButton.addActionListener(e -> {

            String ip = IPField.getText();
            try {
                boolean socketInitialised = initSocket(ip);
                if(socketInitialised) {
                    IPFrame.dispose();
                    frame.setVisible(true);
                }
            }
            catch (IOException ex) {
                ex.printStackTrace();
            }
        });
    }


    // Initializing all Components
    private void initComponents() {
        frame = new MyFrame();
        IPFrame = new MyFrame();
        IPFrame.setSize(400, 200);
        IPFrame.setTitle("IP Settings");

        mainPanel = new JPanel();
        IPPanel = new JPanel();
        //IPPanel = new JPanel(new GridBagLayout());
        cl = new CardLayout();
        mainPanel.setLayout(cl);
        loginPanel = new JPanel(new GridBagLayout());
        signUpPanel = new JPanel(new GridBagLayout());
        c = new GridBagConstraints();
        userNameLabel = new JLabel("Email");
        userNameLabel.setForeground(Color.decode("#0c0c0c"));
        userPassLabel = new JLabel("Password");
        userPassLabel.setForeground(Color.decode("#0c0c0c"));
        enterIPLabel = new JLabel("Enter IP Address of Server");
        userNameField = new JTextField(30);
        userPassField = new JPasswordField(30);
        IPField = new JTextField(25);
        submitButton = new JButton("Login");
        submitButton.setBackground(Color.decode("#00b22d"));
        submitButton.setForeground(Color.decode("#00b22d"));
        enterIPButton = new JButton("Enter IP");
        signUpButton = new JButton("Sign Up");
        signUpButton.setBackground(Color.decode("#00b22d"));
        signUpButton.setForeground(Color.decode("#00b22d"));
        adminLoginButton = new JButton("Admin Login");
        adminLoginButton.setBackground(Color.decode("#de0707"));
        adminLoginButton.setForeground(Color.decode("#de0707"));


        // Sign Up Page Components
        newNameLabel = new JLabel("Enter Name: ");
        newEmailLabel = new JLabel("Enter Email: ");
        newPassLabel = new JLabel("Enter Password: ");
        confirmButton = new JButton("Confirm");
        confirmButton.setBackground(Color.decode("#00b22d"));
        confirmButton.setForeground(Color.decode("#00b22d"));
        newNameField = new JTextField(25);
        newEmailField = new JTextField(25);
        newPassField = new JPasswordField(25);
        backButton = new JButton("Back");
        backButton.setBackground(Color.decode("#00b22d"));
        backButton.setForeground(Color.decode("#00b22d"));
        adminSignUpButton = new JButton("SignUp Admin");
        adminSignUpButton.setBackground(Color.decode("#de0707"));
        adminSignUpButton.setForeground(Color.decode("#de0707"));


        // Setting fonts for Login Panel
        userNameLabel.setFont(new Font("Serif", Font.PLAIN, 20));
        userPassLabel.setFont(new Font("Serif", Font.PLAIN, 20));
        submitButton.setFont(new Font("Serif", Font.PLAIN, 20));
        signUpButton.setFont(new Font("Serif", Font.PLAIN, 20));

        // Setting Fonts for Sign Up Panel
        newNameLabel.setFont(new Font("Serif", Font.PLAIN, 20));
        newEmailLabel.setFont(new Font("Serif", Font.PLAIN, 20));
        newPassLabel.setFont(new Font("Serif", Font.PLAIN, 20));
        confirmButton.setFont(new Font("Serif", Font.PLAIN, 20));
        backButton.setFont(new Font("Serif", Font.PLAIN, 20));

    }

    // Adding EveryThing to Frame in Right Places
    private void addComponentsToFrame() {

        // Properties of Login Panel
        c.insets = new Insets(10,10,10,10);
        c.gridx = 0;
        c.gridy = 0;
        loginPanel.add(userNameLabel, c);
        c.gridy = 1;
        loginPanel.add(userNameField, c);
        c.gridy = 2;
        loginPanel.add(userPassLabel, c);
        c.gridy = 3;
        loginPanel.add(userPassField, c);
        c.gridy = 4;
        loginPanel.add(submitButton, c);
        c.gridy = 5;
        loginPanel.add(signUpButton, c);
        c.gridy = 6;
        loginPanel.add(adminLoginButton, c);
        // Login Panel Ends here


        // Properties of Sign Up Panel
        c.gridx = 0;
        c.gridy = 0;
        signUpPanel.add(newNameLabel, c);
        c.gridx = 1;
        signUpPanel.add(newNameField, c);
        c.gridx = 0;
        c.gridy = 1;
        signUpPanel.add(newEmailLabel, c);
        c.gridx = 1;
        signUpPanel.add(newEmailField, c);
        c.gridx = 0;
        c.gridy = 2;
        signUpPanel.add(newPassLabel, c);
        c.gridx = 1;
        signUpPanel.add(newPassField, c);
        c.gridx = 1;
        c.gridy = 3;
        signUpPanel.add(confirmButton, c);
        c.gridx = 0;
        signUpPanel.add(backButton, c);
        c.gridx = 3;
        signUpPanel.add(adminSignUpButton, c);
        // Sign Up Panel Ends Here


        // Properties of IP Frame
        c.gridx = 0;
        c.gridy = 0;
        IPPanel.add(enterIPLabel);
        c.gridx = 1;
        IPPanel.add(IPField);
        c.gridy = 1;
        IPPanel.add(enterIPButton);


        // Adding Panels in Frame
        mainPanel.add(loginPanel, "1");
        mainPanel.add(signUpPanel, "2");
        cl.show(mainPanel, "1");
        frame.add(mainPanel);
        IPFrame.add(IPPanel);
        IPFrame.setVisible(true);
    }

    private boolean initSocket(String ip) throws IOException {

        try {
            clientSocket = new Socket(ip,9999);
        }
        catch(Exception e) {
            // Either server is down or the IP address you entered is incorrect
            JOptionPane.showMessageDialog(frame, "Either server is down or the ip"
                    + " address you entered is incorrect","Error",JOptionPane.INFORMATION_MESSAGE);
            return false;
        }

        dout = new DataOutputStream(clientSocket.getOutputStream());
        din = new DataInputStream(clientSocket.getInputStream());

        return true;
    }

}