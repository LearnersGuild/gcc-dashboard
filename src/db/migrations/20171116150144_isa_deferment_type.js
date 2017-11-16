exports.up = knex => {
  return knex.schema.table('status_of_learners', table => {
    table.string('isa_deferment_type', 100).nullable()
  })
}

exports.down = knex => {
    return knex.schema.table('status_of_learners', table => {
      table.dropColumn('isa_deferment_type')
    })
}
