exports.up = knex => {
  return knex.schema.table('status_of_learners', table => {
    table.string('job_title', 100).nullable()
    table.date('job_start_date').nullable()
    table.integer('weekly_part_time_hours').nullable()
  })
}

exports.down = knex => {
  return knex.schema.table('status_of_learners', table => {
    table.dropColumn('job_title')
    table.dropColumn('job_start_date')
    table.dropColumn('weekly_part_time_hours')
  })
}

