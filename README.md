# jr2 HTTP Server Middleware

Create a [JSON-RPC 2.0](http://www.jsonrpc.org/specification) compliant HTTP server with [jr2](https://github.com/adriano-di-giovanni/jr2) and [Express](http://expressjs.com/).

## Installation

```bash
npm install --save express-jr2
```

## Setup

```javascript
const express = require('express')
const bodyParser = require('body-parser')
const jr2HTTP = require('express-jr2')

const delegate = {
    sum(params, { responseWithResult }, callback) {
        const result = params.reduce((a, b) => a + b, 0)
        callback(null, responseWithResult(result))
    },
}
const app = express()

app
    .use(bodyParser.json())
    .use('/rpc', jr2HTTP(delegate))

app.listen(3000)
```

## License

MIT
