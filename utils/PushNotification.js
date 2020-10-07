const config = require('config');
const fcmConfig = config.get('APAMAN.fcmConfig');

var http = require("http");

const sql = require("mssql");
const logger = require('./winstonLogger');

var admin = require("firebase-admin");
const Kavenegar = require('kavenegar');
const smsApi = Kavenegar.KavenegarApi({apikey: '66592F4C386E5861736F30624B6D6330706732497A506244674D6B794E744563434F7853363930383171593D'});
module.exports = {
    getSend: async () => {
        logger.info('get All Push Notification from DB');
        //connect to your database
        //sp
        const shema = "dbo";
        const sp = "PushNotification_Select";

        // create Request object
        const request = new sql.Request(pool);
        // query to the database and get the data
        request.execute(`${shema}.${sp}`, function (err, recordset) {
            if (err) logger.error("Error get All Push Notification: ", err);

            let result = [];
            if (recordset) {
                result = recordset.recordset;
            }
            logger.info('get All Push Notification Resul: %j', {Response: result});
            const messages = [];
            result.map(o => {
                if (o.PushID)
                    messages.push({notification: {title: o.Title, body: o.Text}, token: o.PushID});
            });
            //yousefi
            //messages.push({notification: {title: 'Apaman222', body:'Apaman _sendAll'}, token: 'eJi2vfDT-1s:APA91bFcl_Rq9iW-ys5mZ8Rly7f7TNNFqyksvEjnf70picp8myCCpwU3K1kS8i5aoCMTR4iBHJqpZP749m9QgjnwpB0lfoWgRpjxAFu8UGAkSyEBoj3TxNF9owUvNRfZStjFODZd_urG'});
            //sajjad
            //messages.push({notification: {title: 'Apaman222', body:'Apaman _sendAll'}, token: 'dX9NApFggGQ:APA91bGh9nH-nTRTG0TmvuRyHiJevfLPwZnGBs12jY3inO7Kc2aG--UJyjrtae0YYMNWVdQl1sYmzz3_E-xqwTMChv5AaTWPKiD0heRQqwWYOtwuNta7cdgcjr0PPnxLSfH5OPjIVmts'});
            //alireza
            //messages.push({notification: {title: 'Apaman222', body:'Apaman _sendAll'}, token: 'e4EWJEeqMME:APA91bFgFt_M_aHCkNrbc5AxODcL2vaoWBSNpNeI5n1Pds0WD-fPaecKxKWxOuOpHfVPfL-7itshDE_LBVCVW6XPHqznRQRIx4D_kd5P0_pzpYfZjQkNZR8Cg2ROL5DAcL71m-CW4XRa'});
            //monta
            //messages.push({notification: {title: 'Apaman222', body:'Apaman _sendAll'}, token: 'e4EWJEeqMME:APA91bFgFt_M_aHCkNrbc5AxODcL2vaoWBSNpNeI5n1Pds0WD-fPaecKxKWxOuOpHfVPfL-7itshDE_LBVCVW6XPHqznRQRIx4D_kd5P0_pzpYfZjQkNZR8Cg2ROL5DAcL71m-CW4XRa'});
            _sendAll(messages);
            //_sendSmsAll(result);
        });
    },
    sendMulti: async (title, text, tokens) => _sendMulti(title, text, tokens),
    send: async (title, text, pushToken) => _send(title, text, pushToken)
};

/*
* send Multiple message to Multiple users
* */
async function _sendAll(messages) {
    logger.info('_sendAll Start Push Notification prams: %j', messages);
    try {
        admin.messaging().sendAll(messages)
            .then((response) => {
                logger.info('_sendAll All Push Notification on end %j', {response: response});
                console.log(response.successCount + ' messages were sent successfully');
            })
            .catch((error) => {
                logger.error('!!!!!!!! _sendAll Error PushNotification message catch:', error);
            });
    } catch (e) {
        logger.error('!!!!!!!! _sendAll Error catch e:', e);
    }
}

async function _sendSmsAll(messages) {
    logger.info('_sendSmsAll Start Push Notification prams: %j', messages);
    try {
       // messages.map(o => {
            smsApi.Send({
                    message:'notification', //o.Text ,
                    sender: "1000596446" ,
                    receptor: "09196421264,09121984798"},
                function(response, status) {
                    logger.error("Sms response==: ", response);
                    logger.error("Sms status==: ", status);
                    console.log(response);
                    console.log(status);
                }
            );
        //});
    } catch (e) {
        logger.error('$$$$$$$$$$$ _sendSmsAll Error catch e:', e);
    }
}

/*
* Send one Message to Multiple User
* */
function _sendMulti(title, text, registrationTokens) {
    const multiMessage = {
        notification: {
            title: title,
            body: text,
            // "image": string
        },
        tokens: registrationTokens,
    };
    admin.messaging().sendMulticast(multiMessage)
        .then((response) => {
            logger.info('_sendMulti Push Notification on end %j', {response: response});
            if (response.failureCount > 0) {
                logger.info('_sendMulti Push Notification FailureCount %s', response.failureCount);
                const failedTokens = [];
                response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        failedTokens.push(registrationTokens[idx]);
                    }
                });
                console.log('List of tokens that caused failures: ' + failedTokens);
                return {successCount: response.multiMessage,failureCount: response.failureCount}
            }
        })
        .catch((error) => {
            logger.error('!!!!!!!! Error sending PushNotification message catch:', error);
        });
}

/*
* send one message to one user
* */
function _send(title, text, registrationToken) {
    logger.info('_send Start Push11111111111 Notification pram: %j', {
        title: title,
        text: text,
        pushID: registrationToken
    });

    if (registrationToken) {
        try {
            const message = {
                notification: {
                    title: title,
                    body: text,
                    // "image": string
                },
                token:'eJi2vfDT-1s:APA91bFcl_Rq9iW-ys5mZ8Rly7f7TNNFqyksvEjnf70picp8myCCpwU3K1kS8i5aoCMTR4iBHJqpZP749m9QgjnwpB0lfoWgRpjxAFu8UGAkSyEBoj3TxNF9owUvNRfZStjFODZd_urG',
                //token:'e4EWJEeqMME:APA91bFgFt_M_aHCkNrbc5AxODcL2vaoWBSNpNeI5n1Pds0WD-fPaecKxKWxOuOpHfVPfL-7itshDE_LBVCVW6XPHqznRQRIx4D_kd5P0_pzpYfZjQkNZR8Cg2ROL5DAcL71m-CW4XRa'
                //token:registrationToken,
            };
            logger.info('_send Start2222 Push Notification pram: %j', message);
            admin.messaging().send(message)
                    .then((response) => {
                        logger.info('_send Push Notification on end %j', {response: response});
                        return response;
                    })
                    .catch((error) => {
                        logger.error('!!!!!!!! Error sending PushNotification message catch:', error);
                        return error;
                    })
            }catch (e) {
                logger.error('!!!!!!!! _send(queue) Error catch e:', e);
                return e;
            }
    }
}
