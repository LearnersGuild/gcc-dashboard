
exports.up = function(knex, Promise) {
    return knex.schema.table('status_of_learners', table => {
        table.decimal('learner_reported_salary', 8, 2).nullable()
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('status_of_learners', table => {
        table.dropColumn('learner_reported_salary');
    });
};
