# likit
Realtime log monitoring middleware for Koa, Koa2 and Express

### install

```
npm i likit@latest -S
```

### koa
```js
app.use(likit.koa({
  app,
  port: 3001 // default
}))
```

### koa2
```js
app.use(likit.koa2({
  app,
  port: 3001 // default
}))
```

### express
```js
app.use(likit.express({
  app,
  port: 3001 // default
}))
```
