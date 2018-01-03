const { createServer } = require('jr2')

module.exports = delegate => {
    const server = createServer(delegate)

    return function(req, res, next) {
        if (!/^POST$/i.test(req.method)) {
            res.set('allow', 'POST')
            res.sendStatus(405)
            return
        }

        if (!/^application\/json$/i.test(req.headers['content-type'])) {
            res.sendStatus(415)
            return
        }

        server.handle(req.body, (err, response) => {
            if (err) {
                next(err)
                return
            }

            if (response) {
                res.set('content-length', Buffer.byteLength(response))
                res.json(200, response)
                return
            }

            res.sendStatus(204)
        })
    }
}
