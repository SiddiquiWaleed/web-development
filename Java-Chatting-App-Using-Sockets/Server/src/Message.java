
class Message {

    private String msg;
    private String sender;
    private String receiver;

    public Message(String sender, String msg, String receiver) {
        this.sender = sender;
        this.receiver = receiver;
        this.msg = msg;
    }

    public String getMsg() {
        return this.msg;
    }

    public String getSender() {
        return this.sender;
    }

    public String getReceiver() {
        return this.receiver;
    }
}