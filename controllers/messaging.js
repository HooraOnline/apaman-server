
const sql = require("mssql");
const CheckException = require('../utils/CheckException');
const setSqlPublicParam =require("../utils/utility");



const express = require('express')
    , router = express.Router();

const logger = require('../utils/winstonLogger');
const PushNotification = require('../utils/PushNotification');

const smsService =require("../utils/smsService");
const EmailSender =require("../utils/EmailSender");


//______________________Payment Insert________________//
router.post('/sendEmail', function (req, res) {
    logger.info('API: Payment/Insert %j');
    let info=EmailSender.sendMail(req.body.to,req.body.subject,req.body.text,req.body.html);
    res.set({emailInfo: info}).send();
});

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
