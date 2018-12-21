# likit
Realtime request/response monitoring middleware for Koa, Koa2 and Express

![img](https://i.ibb.co/qBpJv96/screencapture-localhost-3001-2018-12-21-15-59-47.png)

Added basic auth support.

### install

```
npm i likit@latest -S
```

### koa
```js
app.use(likit.koa({
  app,
  port: 3001, // default
  username: 'admin', // default
  password: 'admin' // default
}))
```

### koa2
```js
app.use(likit.koa2({
  app,
  port: 3001, // default
  username: 'admin', // default
  password: 'admin' // default
}))
```

### express
```js
app.use(likit.express({
  app,
  port: 3001, // default
  username: 'admin', // default
  password: 'admin' // default
}))
```
