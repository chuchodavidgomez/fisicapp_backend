'use strict';

module.exports = function (Appuser) {

    Appuser.whoami = function (callback) {
        callback();
    }

    Appuser.afterRemote('whoami', function (context, model, next) {
        var userId = context.req.accessToken.userId;
        if (!userId) {
            return next(getAuthenticationError());
        }
        Person.findOne({ where: { id: userId } }, function (error, item) {
            if (error) {
                return next(error);
            }
            if (!item) {
                const err = new Error();
                err.statusCode = 401;
                err.message = 'Authorization Required';
                err.code = 'AUTHORIZATION_REQUIRED';
                return next(err);
            }
            context.result = item;
            next();
        })
    });

};
