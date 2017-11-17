exports.up = knex => {
  return knex.schema.table('status_of_learners', table => {
    table.string('isa_deferment_type', 100).nullable()
    table.boolean('isa_income_docs_received').nullable()
    table.renameColumn('pif_amount_paid', 'pif_monthly_payment_amount')
    table.renameColumn('llf_amount_paid', 'llf_monthly_payment_amount')
  })
}

exports.down = knex => {
  return knex.schema.table('status_of_learners', table => {
    table.dropColumn('isa_deferment_type')
    table.dropColumn('isa_income_docs_received')
    table.renameColumn('pif_monthly_payment_amount', 'pif_amount_paid')
    table.renameColumn('llf_monthly_payment_amount', 'llf_amount_paid')
  })
}
