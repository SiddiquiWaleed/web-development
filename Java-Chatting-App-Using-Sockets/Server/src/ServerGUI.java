import javax.swing.*;
import java.awt.*;

public class ServerGUI extends JFrame {

    private JPanel panel ;
    private JButton serverButton;

    ServerGUI(){
        this.setSize(300,200);
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        this.setResizable(false);
        this.setTitle("Server Computer");
        initComponents();
        addComponents();
        this.setVisible(true);

        serverButton.addActionListener( e-> {
            serverButton.setText("OFF");
            serverButton.setBackground(Color.decode("#de0b0b"));
            this.dispose();
        });
    }

    public void initComponents(){
        panel = new JPanel();

        serverButton = new JButton("Turn Off");
        serverButton.setFont(new Font("Serif", Font.PLAIN, 15));
        serverButton.setBackground(Color.decode("#00b22d"));
        serverButton.setBounds(105,60,100,50);

        panel.setLayout(null);
    }

    public void addComponents(){
        panel.add(serverButton);
        this.add(panel);
    }

}
