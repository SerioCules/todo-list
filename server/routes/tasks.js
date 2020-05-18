const Router = require('@koa/router')
const store = require('../../store')

const router = new Router({ prefix: '/api/tasks' })

router.post('/', async (ctx) => {
  await store.addTask(ctx.request.body)
  ctx.status = 200
})

router.get('/', async (ctx) => {
  ctx.response.body = await store.listTasks()
})

router.delete('/', async (ctx) => {
  await store.deleteTask(ctx.request.query)
  ctx.status = 200
})

module.exports = router