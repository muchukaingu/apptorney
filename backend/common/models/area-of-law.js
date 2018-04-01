module.exports = function(AreaOfLaw) {
    AreaOfLaw.remoteMethod(
        'parents', {
            http: { path: '/parents', verb: 'get' },
            returns: { arg: 'areasOfLaw', type: 'Object', root: true }
        })

    AreaOfLaw.parents = function(cb) {
        this.findOne({ where: { type: "parent" } }, function(err, areas) {

            cb(err, areas)
        })
    }
}