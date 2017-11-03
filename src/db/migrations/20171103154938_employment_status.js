
exports.up = function(knex, Promise) {
    return knex.schema.table('status_of_learners', table => {
        table.string('employed_in_or_out_of_field', 50).nullable();
        table.string('employment_type', 50).nullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('status_of_learners', table => {
        table.dropColumn('employed_in_or_out_of_field');
        table.dropColumn('employment_type');
    });
};
