const nodemailer = require('nodemailer');

const sendInviteEmail = async (toEmail, teamName, inviteLink) => {
    try {
        // 1. Instantly generate a test SMTP service account on ethereal.email
        let testAccount = await nodemailer.createTestAccount();

        // 2. Build the Delivery Truck (Transporter)
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        // 3. Draft the Email and Send it!
        let info = await transporter.sendMail({
            from: '"PrompTool Teams" <admin@promptool.com>',
            to: toEmail,
            subject: `You've been invited to ${teamName}!`,
            text: `Aditya wanted you to join a team: ${teamName}. Link: ${inviteLink}`, // Plain text version
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
                <h2>Aditya has invited you! 🎉</h2>
                <p>You have been requested to join <b>${teamName}</b> on PrompTool.</p>
                <a href="${inviteLink}" style="background: #f97316; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Accept Invitation</a>
              </div>
            `, // Beautiful HTML version
        });

        console.log("📨 Email secretly shipped: ", info.messageId);
        // This is the golden link! Clicking it in the console opens the email preview!
        console.log("👀 Preview URL: %s", nodemailer.getTestMessageUrl(info));

        return true;
    } catch (error) {
        console.error("❌ Email Engine Error: ", error);
        return false;
    }
};

module.exports = { sendInviteEmail };
