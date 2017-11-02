
exports.up = function(knex, Promise) {
    return knex.schema.table('status_of_learners', table => {
        table.string('race', 100).nullable();
        table.boolean('two_or_more_races').nullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('status_of_learners', table => {
        table.dropColumn('race');
        table.dropColumn('two_or_more_races');
    });
};
