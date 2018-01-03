const express = require('express')
const bodyParser = require('body-parser')
const request = require('superagent')
const jr2HTTP = require('../')

const port = 3000
const url = `http://localhost:${port}/rpc`
let server

beforeEach(done => {
    const delegate = {
        sum(params, { responseWithResult }, callback) {
            const result = params.reduce((a, b) => a + b, 0)
            callback(null, responseWithResult(result))
        },
        notify(params, context, callback) {
            callback()
        },
    }
    server = express()
        .use(bodyParser.json())
        .use('/rpc', jr2HTTP(delegate))
        .listen(3000, done)
})

afterEach(done => server.close(done))

it('should be a function', () => {
    expect(typeof jr2HTTP).toBe('function')
})

it('should return a function', () => {
    expect(typeof jr2HTTP({})).toBe('function')
})

it("should not allow methods other than 'POST'", done => {
    request.get(url).end(err => {
        expect(err).toBeDefined()
        expect(err.status).toBe(405)
        expect(err.response.headers['allow']).toBe('POST')
        done()
    })
})

it("should not allow media types other than 'application/json'", done => {
    request.post(url).end(err => {
        expect(err).toBeDefined()
        expect(err.status).toBe(415)
        done()
    })
})

it('should respond to a request', done => {
    request
        .post(url)
        .send({
            jsonrpc: '2.0',
            method: 'sum',
            params: [1, 2, 4],
            id: 1,
        })
        .end((err, response) => {
            if (err) {
                done(err)
                return
            }

            expect(response).toBeDefined()
            expect(response.status).toBe(200)
            expect(response.headers['content-type']).toBe('application/json; charset=utf-8')
            expect(response.headers['content-length']).toBeDefined()
            expect(response.body).toEqual({
                jsonrpc: '2.0',
                result: 7,
                id: 1,
            })

            done()
        })
})

it('should respond to a notification', done => {
    request
        .post(url)
        .send({
            jsonrpc: '2.0',
            method: 'notify',
        })
        .end((err, response) => {
            if (err) {
                done(err)
                return
            }

            expect(response).toBeDefined()
            expect(response.statusCode).toBe(204)

            done()
        })
})
