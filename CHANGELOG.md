# Changelog

## [0.1.1] - 2018-01-23

### Changed

* Avoid using [res.sendStatus](http://expressjs.com/en/4x/api.html#res.sendStatus) in order to make
`express-jr2` compatible with Express 3.x
* Use `res.status().json()` instead of the deprecated `res.json(status, body)`

## [0.1.2] - 2018-01-23

### Fixed

* Avoid sending `content-length` to avoid parse error on Express 3.x
