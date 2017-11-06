exports.up = knex => {
  return knex.schema.table('status_of_learners', table => {
    table.date('date_phase_1').nullable()
    table.date('date_phase_2').nullable()
    table.date('date_phase_3').nullable()
    table.date('date_phase_4').nullable()
    table.date('date_phase_5').nullable()
    table.string('phase_1_attempt', 20).nullable()
    table.string('phase_2_attempt', 20).nullable()
    table.string('phase_3_attempt', 20).nullable()
    table.string('phase_4_attempt', 20).nullable()
    table.string('phase_1_interview_outcome', 20).nullable()
    table.string('phase_2_interview_outcome', 20).nullable()
    table.string('phase_3_interview_outcome', 20).nullable()
    table.string('phase_4_interview_outcome', 20).nullable()
  })
}

exports.down = knex => {
    return knex.schema.table('status_of_learners', table => {
      table.dropColumn('date_phase_1')
      table.dropColumn('date_phase_1')
      table.dropColumn('date_phase_1')
      table.dropColumn('date_phase_1')
      table.dropColumn('date_phase_1')
      table.dropColumn('phase_1_attempt')
      table.dropColumn('phase_2_attempt')
      table.dropColumn('phase_3_attempt')
      table.dropColumn('phase_4_attempt')
      table.dropColumn('phase_1_interview_outcome')
      table.dropColumn('phase_2_interview_outcome')
      table.dropColumn('phase_3_interview_outcome')
      table.dropColumn('phase_4_interview_outcome')
    })
}
