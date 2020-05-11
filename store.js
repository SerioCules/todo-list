const storage = require('azure-storage')
const uuid = require('uuid')
const service = storage.createTableService("magazyn21", "42KFssiW5+05n+yjTU8kDpI9rHuE4ZPBQGOZQQvx3LI0ZYYYdbhEma6MK4XJBjTixtqP8leB1KhFnY4GA4Z+fQ==")
const table = 'tasks'

const init = async () => (
  new Promise((resolve, reject) => {
    service.createTableIfNotExists(table, (error, result, response) => {
      if (!error) {
        console.log("Table Created / already exists")
        resolve()
      }
      else {
        console.log("Unable to create table")
        init()
        reject()
      }
    })
  })
)

const listTasks = async () => (
  new Promise((resolve, reject) => {
    const query = new storage.TableQuery()
      .select(['title', 'description'])
      .where('PartitionKey eq ?', 'task')

    service.queryEntities(table, query, null, (error, result) => {
      !error ? resolve(result.entries.map((entry) => ({
        title: entry.title._,
        description: entry.description._
      }))) : reject()
    })
  })
)

const addTask = async ({ title, description }) => (
  new Promise((resolve, reject) => {
    const gen = storage.TableUtilities.entityGenerator
    const task = {
      PartitionKey: gen.String('task'),
      RowKey: gen.String(uuid.v4()),
      title,
      description
    }

    service.insertEntity(table, task, (error) => {
      !error ? resolve() : reject()
    })
  })
)

module.exports = {
  init,
  addTask,
  listTasks
}