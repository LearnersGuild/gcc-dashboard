
exports.up = function(knex, Promise) {
    return knex.schema.table('status_of_learners', table => {
        table.decimal('total_payments_received', 8, 2).nullable()
        table.boolean('isa_payments_past_due').nullable()
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('status_of_learners', table => {
        table.dropColumn('total_payments_received');
        table.dropColumn('isa_payments_past_due');
    });
};
