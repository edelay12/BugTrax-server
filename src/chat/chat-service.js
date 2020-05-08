const xss = require("xss");

const ChatService = {
  getMessagesByUser(db, user1, user2) {
    return db
      .from("chat")
      .select("*")
      .where({ user_id_sender: user1, user_id_reciever: user2 })
      .orWhere({ user_id_sender: user2, user_id_reciever: user1 });
  },
  postNewMessage(db, newMessage) {
    return db
      .insert(newMessage)
      .into("chat")
      .then(() => {
        return db
          .from("chat")
          .select("*")
          .where({
            user_id_sender: newMessage.user_id_sender,
            user_id_reciever: newMessage.user_id_reciever
          })
          .orWhere({
            user_id_sender: newMessage.user_id_reciever,
            user_id_reciever: newMessage.user_id_sender
          });
      });
  }
};

module.exports = ChatService;
