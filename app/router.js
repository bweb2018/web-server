'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const jwt = app.middleware.jwt({ app });
  router.get('/', controller.home.index);
  router.get('/captcha', controller.util.captcha);
  router.get('/sendcode', controller.util.sendCode);

  router.group({ name: 'user', prefix: '/user' }, router => {
    const { login, register, verify, info } = controller.user;
    router.post('/login', login);
    router.post('/register', register);
    router.get('/info', jwt, info);
    // router.get('/verify', verify);
  });
};
