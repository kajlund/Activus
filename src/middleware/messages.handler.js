export function getMessagesHandler() {
  return (req, res, next) => {
    res.locals.messages = req.session.flashMessages || {};
    delete req.session.flashMessages;
    req.flash = (type, message) => {
      if (!req.session.flashMessages) req.session.flashMessages = {};
      if (!req.session.flashMessages[type])
        req.session.flashMessages[type] = [];
      req.session.flashMessages[type].push(message);
    };

    next();
  };
}
