exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('status_of_learners', table => {
      table.string('email', 100)
      table.date('dob_mm_dd_yyyy_').nullable()
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('status_of_learners'),
  ])
}

