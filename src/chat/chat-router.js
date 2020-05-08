const express = require("express");
const ChatService = require("./chat-service");

const ChatRouter = express.Router();
const jsonBodyParser = express.json();

ChatRouter.route("/messages")
  .get((req, res, next) => {
    const { user_id, partner_id } = req.headers;

    ChatService.getMessagesByUser(req.app.get("db"), user_id, partner_id)
      .then(messages => {
        res.json(messages);
      })
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { message, user_id_sender, user_id_reciever } = req.body;

    const newMessage = {
      message,
      user_id_sender,
      user_id_reciever
    };

    for (const [key, value] of Object.entries(newMessage)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      }
    }

    ChatService.postNewMessage(req.app.get("db"), newMessage)
      .then(messages => {
        res.status(201).json(messages);
      })
      .catch(next);
  });

module.exports = ChatRouter;
