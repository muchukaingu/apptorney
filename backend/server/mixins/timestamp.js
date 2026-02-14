module.exports = function(Model, options) {
    options = options || {};

    var createdAt = options.createdAt || 'createdAt';
    var updatedAt = options.updatedAt || 'updatedAt';

    if (!Model.definition.properties[createdAt]) {
        Model.defineProperty(createdAt, {
            type: Date
        });
    }

    if (!Model.definition.properties[updatedAt]) {
        Model.defineProperty(updatedAt, {
            type: Date
        });
    }

    Model.observe('before save', function setTimestamps(ctx, next) {
        var now = new Date();

        if (ctx.instance) {
            if (!ctx.instance[createdAt]) {
                ctx.instance[createdAt] = now;
            }
            ctx.instance[updatedAt] = now;
        } else {
            ctx.data = ctx.data || {};
            if (ctx.isNewInstance && !ctx.data[createdAt]) {
                ctx.data[createdAt] = now;
            }
            ctx.data[updatedAt] = now;
        }

        next();
    });
};
