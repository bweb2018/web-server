const BaseController = require("./base");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const hashSalt = "@kkb:abc!:";

class UserController extends BaseController {
  async login() {
    const { ctx, app } = this;
    const { email, passwd, sendcode } = ctx.request.body;
    if (sendcode !== ctx.session.code) {
      return this.error("邮箱验证码错误");
    }
    //检查邮箱是存在
    const user = await ctx.model.User.findOne({
      email,
      passwd: md5(passwd + hashSalt),
    });
    if (!user) {
      return this.error("用户名或密码错误");
    }
    const token = jwt.sign(
      {
        _id: user._id,
        email,
      },
      app.config.jwt.secret,
      {
        expiresIn: "1h",
      }
    );
    this.success({ token, email });
  }
  async register() {
    const { ctx } = this;
    const { email, captcha, passwd, nickname } = ctx.request.body;

    // 验证码是否一致
    if (captcha.toLowerCase() !== ctx.session.captcha.toLowerCase()) {
      return this.error("验证码错误");
    }
    //检查邮箱是存在
    if (await this.checkEmail(email)) {
      return this.error("邮箱已存在");
    }
    //写入数据库
    const ret = await ctx.model.User.create({
      email,
      nickname,
      passwd: md5(passwd + hashSalt),
    });
    //回复响应
    if (ret._id) {
      this.massage("注册成功");
    }
  }
  async info() {
    const { ctx } = this;
    const user = await this.checkEmail(ctx.state.email);
    if (user) {
      this.success(user);
    }
  }
  async verify() {}
  async checkEmail(email) {
    const user = await this.ctx.model.User.findOne({ email });
    return user;
  }
}

module.exports = UserController;
