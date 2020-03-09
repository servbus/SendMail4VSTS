var path = require('path');
var os = require('os');
var tl = require('vsts-task-lib/task');
var nodemailer = require('nodemailer');


try {
    tl.setResourcePath(path.join(__dirname, 'task.json'));

    var username = tl.getInput('SmtpUsername', false);
    var password = tl.getInput('SmtpPassword', false);

    var server = tl.getInput('SmtpServer', true);
    var isSSL = tl.getBoolInput('UseSSL', false);
    var port = tl.getInput('SmtpPort', true);

    var startTLS = tl.getBoolInput('STARTTLS', false);

    var subject = tl.getInput("Subject", true);
    var body = tl.getInput("Body", true);
    var to = tl.getInput("To", true);
    var from = tl.getInput("From", true);

    var attachmentPath = tl.getInput("Attachment", false);
    tl.debug("get all");

    var config = {
        host: server,
        secure: isSSL, // use SSL
        port: port, // port
    };

    if(username)
    {
        config.auth = {
            user: username
        };
        if(password){
            config.auth.pass = password;
        }
    }

    if (startTLS) {
        config.requireTLS = true;
        config.secure = false;
        config.tls = {
            rejectUnauthorized: false
        };
    }

    var stransporter = nodemailer.createTransport(config);

    function ssl() {
        var mailOptions = {
            from: from,
            to: to,
            subject: subject,
            html: body
        }
        if (attachmentPath) {
            mailOptions.attachments = [{
                path: attachmentPath
            }];
        }
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
}
catch (err) {
    tl.error(err.message);
    tl.setResult(tl.TaskResult.Failed, tl.loc('sendMail', err.message));
}
