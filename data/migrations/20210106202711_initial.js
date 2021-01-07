
exports.up = async function(knex) {
  await knex.schema.createTable('zoos', tbl => {
      tbl.increments("id") // creates a primary key unique and auto increments
      tbl.text("name").notNull()
      tbl.text("address").notNull().unique()
    
  })
  await knex.schema.createTable("species", tbl => {
      tbl.increments("id")
      tbl.text("name").notNull().unique()
  })
  await knex.schema.createTable("animals", tbl => {
      tbl.increments("id")
      tbl.text("name").notNull()
      tbl.integer("species_id")
      //.notNull()
      //create the space of the relationship
      .references("id")
      .inTable("species")
      .onDelete("SET NULL") //what happens whn the row we point at gets deleted
      //.onUpdate() //what happens when the primary key changes
  })
  await knex.schema.createTable("zoos_animals", tbl => {
      tbl.integer("zoo_id").notNull().references("id").inTable("zoos")
      tbl.integer("animal_id")
      .notNull()
      .references("id")
      .inTable("animals")
      .onDelete("CASCADE")
      //.onUpdate("CASCADE") //not used that much bc the pk should not be updated 
     tbl.date("arrival").notNull().defaultTo(knex.raw("current_timestamp"))
      tbl.date("departure") 
      //since this tbnl donest need an id colomun we can set a primary key as a combination of the twocolumns rather then a single column
      tbl.primary(["zoo_id", "animal_id"])
      
  })
};

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists("zoos_animals")
    await knex.schema.dropTableIfExists("animals")
    await knex.schema.dropTableIfExists("species")
  await knex.schema.dropTableIfExists("zoos")
};
