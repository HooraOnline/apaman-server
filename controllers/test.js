const express = require('express')
    , router = express.Router();

const logger = require('../utils/winstonLogger');
const PushNotification = require('../utils/PushNotification');

const smsService =require("../utils/smsService");
router.post('/sendSms', function (req, res) {
    logger.info('API: sendSms/Insert %j');
    let info=smsService.sendSms(req.body.message,req.body.receptor,req.body.sender);
    res.set({emailInfo: info}).send();
});
router.post('/notification', function (req, res) {
    logger.info('API: test/notification %j', {body: req.body});
    PushNotification.sendMulti(req.body.title, req.body.message, req.body.tokens)
        .then(result => {
            logger.info('API: test/notification result %j', result);
            res.status(200).send(result);
        })
});


module.exports = router;
