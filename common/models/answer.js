'use strict';

module.exports = function(Answer) {
    Answer.observe('before save', (ctx, next) => {
        const fkBelongToName = 'id_app_user'; 
        const hasOwnerRelation = !!ctx.Model.definition.properties[fkBelongToName];
        if (!hasOwnerRelation) {
            return next();
        }
        const currentUserId = ctx.options.accessToken.userId;
        // Enforce current userId to prevent unauthorized changes
        const suppliedUserId = ctx.data ? ctx.data[fkBelongToName] : ctx.instance[fkBelongToName];
        if (!suppliedUserId) {
            // user id not supplied. force assign current user
            if (ctx.data) {
            ctx.data[fkBelongToName] = currentUserId;
            } else {
            ctx.instance[fkBelongToName] = currentUserId;
            }
        } else if (suppliedUserId !== currentUserId) {
            const err = new Error();
            err.statusCode = 401;
            err.message = 'Supplied id_app_user reference does not match the current user';
            err.code = 'AUTHORIZATION_REQUIRED';
            return next(err);
        }
        return next();
    });
};
