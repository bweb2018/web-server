'use strict';

const { Service } = require('egg');
const nodemeller = require('nodemailer');
const userEmail = 'mayi15515143250@163.com';
const transporter = nodemeller.createTransport({
  service: '163',
  secureConnection: true,
  auth: {
    user: userEmail,
    pass: 'AJQTXZPXIHBQNEVU',
  },
});
class ToolsService extends Service {
  async sendEmail(email, subject, text, html) {
    const sendOptions = {
      from: userEmail,
      cc: userEmail,
      to: email,
      subject,
      text,
      html,
    };
    try {
      await transporter.sendMail(sendOptions);
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = ToolsService;
