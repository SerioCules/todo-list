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
  ctx.status = 501
})

module.exports = router