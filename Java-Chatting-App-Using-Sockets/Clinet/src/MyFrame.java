import javax.swing.JFrame;

class MyFrame extends JFrame{

    // Custom Frame Used for The the GUi
    MyFrame() {
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        this.setSize(800,450);
        this.setTitle("Client");
        this.setResizable(false);
        this.setVisible(false);
    }
}