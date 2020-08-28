'use strict';

const jwt = require('jsonwebtoken');

module.exports = ({ app }) => {
  return async function verify(ctx, next) {
    if (!ctx.request.headers.authorization) {
      ctx.body = {
        code: -666,
        message: '用户没有登录',
      };
      return;
    }
    const tooken = ctx.request.headers.authorization.replace('Bearer ', '');
    try {
      const ret = await jwt.verify(tooken, app.config.jwt.secret);
      ctx.state.email = ret.email;
      ctx.state.id = ret._id;
      await next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        ctx.body = {
          code: -666,
          message: '用户过期了',
        };
      } else {
        ctx.body = {
          code: -666,
          message: '用户出错',
        };
      }
    }
  };
};
