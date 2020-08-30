'use strict';

const BaseContrloller = require('./base');
const svgCaptcha = require('svg-captcha');
const fse = require('fs-extra');
class UtilController extends BaseContrloller {
  async captcha() {
    const { ctx } = this;
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 40,
      noise: 1,
      //   color: true,
      //   backgroud: "#cc9966",
    });
    ctx.session.captcha = captcha.text;
    ctx.response.type = 'image/svg+xml';
    ctx.body = captcha.data;
  }
  async sendCode() {
    const { ctx } = this;
    const email = ctx.query.email;
    const code = Math.random().toString().slice(2, 6);
    console.log('UtilController -> sendCode -> code', code);
    const subject = '小开社区';
    const text = '';
    const html = `<<h2>验证码</h2><<a href="www.baidu.com"><<span>${code}</span></a>`;
    ctx.session.code = code;
    const hasSend = await this.service.tools.sendEmail(
      email,
      subject,
      text,
      html
    );
    if (hasSend) {
      this.massage('发送成功');
    } else {
      this.error('发送失败');
    }
  }
  async uploadfile() {
    const { ctx } = this;
    const [ file ] = ctx.request.files;
    // const { name } = ctx.request.body;
    fse.move(file.filepath, this.config.UPLOAD_FILEPATH + '/' + file.filename);
    this.success({ url: `/public/${file.filename}` });
  }
}

module.exports = UtilController;
