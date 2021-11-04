import java.awt.Color;
import java.awt.Font;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.Socket;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;

public class AdminWindow extends ChattingWindow{

    private JButton deleteUserButton, confirmDeleteButton;
    private MyFrame adminFrame;
    private JPanel adminPanel;
    private JLabel emailLabel;
    private JTextField emailField;

    void adminWindow(String userName, Socket clientSocket, DataOutputStream doutt, String userEmail, String userPass) {
        super.chattingWindow(userName, clientSocket, doutt, userEmail, userPass);

        // Delete Bottom when Admin is Logged In
        deleteUserButton.addActionListener(e -> adminFrame.setVisible(true));

        confirmDeleteButton.addActionListener(e -> {
            String email = emailField.getText();
            emailField.setText("");
            if(email.length() == 0) {
                JOptionPane.showMessageDialog(frame, "Email Field is Empty","Error",JOptionPane.INFORMATION_MESSAGE);
            }
            else {
                int response = JOptionPane.showConfirmDialog(frame,"Do you want to Delete this User","Confirm"
                        ,JOptionPane.YES_NO_CANCEL_OPTION, JOptionPane.QUESTION_MESSAGE);

                if(response == JOptionPane.YES_OPTION) {
                    try {
                        dout.writeUTF(Constants.DELETEUSER_CONSTANT);
                        dout.writeUTF(email);
                        adminFrame.setVisible(false);
                    }
                    catch (IOException ex) {
                        ex.printStackTrace();
                    }
                }
            }
        });
    }

    public void initComponents(String userName) {
        super.initComponents(userName);
        adminFrame = new MyFrame();
        adminFrame.setVisible(false);
        adminPanel = new JPanel(new GridBagLayout());
        adminFrame.setTitle("Admin Settings");
        adminFrame.setSize(400, 200);
        adminFrame.setDefaultCloseOperation(JFrame.HIDE_ON_CLOSE);
        deleteUserButton = new JButton("Delete Users");
        deleteUserButton.setFont(new Font("Serif", Font.PLAIN, 20));
        deleteUserButton.setForeground(Color.decode("#de0707"));
        deleteUserButton.setBackground(Color.decode("#de0707"));
        confirmDeleteButton = new JButton("Delete Account");
        emailLabel = new JLabel("User's Email you want to delete");
        emailField = new JTextField(25);

    }

    public void addComponents() {
        super.addComponents();
        bottomPanel.add(deleteUserButton);
        adminFrame.add(adminPanel);

        c.insets = new Insets(10,10,10,10);
        c.gridx = 0;
        c.gridy = 0;
        adminPanel.add(emailLabel, c);
        c.gridx = 1;
        c.gridy = 1;
        adminPanel.add(confirmDeleteButton, c);
        adminPanel.add(emailField);
    }
}


