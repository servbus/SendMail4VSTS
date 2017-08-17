var path = require('path');
var os = require('os');
var tl = require('vsts-task-lib/task');
var nodemailer = require('nodemailer');


var stransporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    secure: false, // use SSL
    requireTLS:true,
    tls: {
        rejectUnauthorized: false
    },
    port: 587, // port
    auth: {
        user: "cnryb@live.cn",
        pass: "xxxxxxxxxxxxx"
    },
    debug: true // include SMTP traffic in the logs
});

function ssl() {
    var mailOptions = {
        from: "cnryb@live.cn",
        to: "to@servbus.com",
        subject: "subject",
        html: "body"
    }
    // if (attachmentPath) {
    //     mailOptions.attachments =   [{
    //         path: attachmentPath
    //     }];
    // }
    return mailOptions;
}
tl.debug("ready");
stransporter.sendMail(ssl(), function (error, info) {
    if (error) {
        console.log(error);
        tl.error(error);
    } else {
        console.log('Message sent: ' + info.response);
        tl.setResult(tl.TaskResult.Succeeded);
    }
});