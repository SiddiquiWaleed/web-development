import javax.swing.UIManager;

public class MainClass {

    public static void main(String[] args) {

        //Just Changing Appearance	of the GUI
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        }
        catch (Exception e) {
            e.printStackTrace();
        }

        LoginPage lp = new LoginPage();

        // Creating Login page
        lp.loginPage();
    }
}