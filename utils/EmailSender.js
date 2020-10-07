const config = require('config');
const fcmConfig = config.get('APAMAN.fcmConfig');
const nodemailer = require("nodemailer");

const logger = require('./winstonLogger');



module.exports = {
    sendMail: async (to,subject,text,html) => {
        logger.info('send mail');
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: 'rotbinoo@gmail.com',
                pass: '******'
            }
        });

        try{
            let info = await transporter.sendMail({
                from: '"Apaman 👻" <rotbinoo@gmail.com>', // sender address
                to:to, // list of receivers
                subject: subject, // Subject line
                text: text, // plain text body
                html: html, // html body
            });
            logger.info('send mail info',info);
            return info;
        }
        catch (e){
            return e;
        }

    },
};

/*
* send one message to one user
* */
async function _sendEmailOne (title, text, registrationToken) {
    logger.info('_send Start Push Notification pram: %j', {
        title: title,
        text: text,
        pushID: registrationToken
    });

    try{
        let testAccount = await nodemailer.createTestAccount();
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });
        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: "bar@example.com, baz@example.com", // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>", // html body
        });


    }catch (e){

    }
}


/*
* send Multiple message to Multiple users
* */
async function _sendEmailAll(messages) {
    logger.info('_sendAll Start Push Notification prams: %j', messages);
    try {


    } catch (e) {
        logger.error('!!!!!!!! _sendAll Error catch e:', e);
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

}


