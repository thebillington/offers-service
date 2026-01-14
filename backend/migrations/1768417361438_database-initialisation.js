/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.sql('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

  pgm.createTable("categories", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("uuid_generate_v4()"),
    },
    title: {
      type: "text",
      notNull: true,
      unique: true,
    },
  });

  pgm.createTable("companies", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("uuid_generate_v4()"),
    },
    name: {
      type: "text",
      notNull: true,
    },
    contact_email: {
      type: "text",
      notNull: true,
    },
  });

  pgm.createTable("offers", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("uuid_generate_v4()"),
    },
    title: {
      type: "text",
      notNull: true,
    },
    company_id: {
      type: "uuid",
      notNull: true,
      references: "companies",
      onDelete: "cascade",
    },
    discount_percent: {
      type: "numeric",
      notNull: true,
    },
    category_id: {
      type: "uuid",
      references: "categories",
      onDelete: "set null",
    },
  });

  pgm.addConstraint("offers", "offers_discount_percent_check", {
    check: "discount_percent >= 0",
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("offers");
  pgm.dropTable("companies");
  pgm.dropTable("categories");
};
