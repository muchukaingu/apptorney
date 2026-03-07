    Legislation.viewLegislationWithFlattenedParts = function(id, cb) {
        var flattenedJSON = ''

        function recursive(instance, parts) {
            for (var i = 0; i < parts.length; i++) {
                flattenedJSON = flattenedJSON + ((parts[i].number) ? parts[i].number : '') + parts[i].title + '\n' + ((parts[i].content) ? parts[i].content + '\n' : '')
                if (parts[i].title == instance.legislationParts[instance.legislationParts.length - 1].title) {
                    instance.flattenedParts = flattenedJSON
                    Legislation.upsert(instance, (err, res) => {
                        console.log('update successful')
                        cb(null, 1)
                    })
                }
                if (parts[i].subParts) {
                    var subparts = parts[i].subParts
                    recursive(instance, subparts, flattenedJSON)
                }
            }
        }
        Legislation.findById(id,
            function(err, legislation) {
                var legislationParts = legislation.legislationParts
                recursive(legislation, legislationParts)
            })
    }