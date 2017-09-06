exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('status_of_learners', function (table) {
      table.increments('id').unsigned().primary();
      table.integer('hubspot_canonical_vid');
      table.string('email', 100);
      table.string('firstname', 100);
      table.string('lastname', 100);
      table.date('dob_mm_dd_yyyy_').nullable();
      table.string('gender', 50).nullable();
      table.string('race_ethnicity', 150).nullable();
      table.string('highest_degree_earned', 50).nullable();
      table.string('income_level', 50).nullable();
      table.string('current_employment_status', 50).nullable();
      table.date('createdate');
      table.date('enrollee_start_date').nullable();
      table.date('cancellation_date').nullable();
      table.string('phase', 50).nullable();
      table.date('resignation_date').nullable();
      table.string('exit_type', 100).nullable();
      table.string('exit_phase', 50).nullable();
      table.string('ps_inactive_type', 100).nullable();
      table.string('stageStatus', 100);
      table.string('metaStage', 100);
      table.string('rollupStage', 100);
      table.string('stage', 100);
      table.boolean('has_llf').nullable();
      table.decimal('llf_amount_eligible', 8, 2).nullable();
      table.decimal('llf_amount_accepted', 8, 2).nullable();
      table.decimal('llf_amount_received', 8, 2).nullable();
      table.decimal('llf_payment_count', 8, 2).nullable();
      table.decimal('llf_income_percent', 5, 4).nullable();
      table.date('llf_date_signed').nullable();
      table.decimal('llf_amount_paid', 8, 2).nullable();
      table.date('llf_first_payment_due_date').nullable();
      table.string('llf_status').nullable();
      table.boolean('has_pif').nullable();
      table.decimal('pif_amount_eligible', 8, 2).nullable();
      table.decimal('pif_amount_accepted', 8, 2).nullable();
      table.decimal('pif_amount_received', 8, 2).nullable();
      table.decimal('pif_payment_count', 8, 2).nullable();
      table.decimal('pif_income_percent', 5, 4).nullable();
      table.date('pif_date_signed').nullable();
      table.decimal('pif_amount_paid', 8, 2).nullable();
      table.date('pif_first_payment_due_date').nullable();
      table.string('pif_status').nullable();
      table.decimal('learner_s_starting_salary', 8, 2).nullable();
      table.boolean('have_you_accepted_a_job_offer').nullable();
      table.boolean('has_received_llf_financing').nullable();
      table.text('isa_data').nullable();
      table.timestamps(true, true);
    })
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('status_of_learners'),
  ]);
};
