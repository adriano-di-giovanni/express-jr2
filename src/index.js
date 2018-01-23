const { createServer } = require('jr2')
const statuses = require('statuses')

module.exports = delegate => {
    const server = createServer(delegate)

    return function(req, res, next) {
        if (!/^POST$/i.test(req.method)) {
            res.set('allow', 'POST')
            res.status(405).send(statuses[405])
            return
        }

        if (!/^application\/json$/i.test(req.headers['content-type'])) {
            res.status(415).send(statuses[415])
            return
        }

        server.handle(req.body, (err, response) => {
            if (err) {
                next(err)
                return
            }

            if (response) {
                // res.set('content-length', Buffer.byteLength(response))
                res.status(200).json(response)
                return
            }

            res.status(204).send(statuses[204])
        })
    }
}
