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
  pgm.addColumns("offers", {
    website: {
      type: "text",
    },
    image_url: {
      type: "text",
    },
  });

  pgm.addColumns("categories", {
    colour: {
      type: "text",
    },
  });

  pgm.addColumns("companies", {
    image_url: {
      type: "text",
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropColumns("offers", ["website", "image_url"]);
  pgm.dropColumns("categories", ["colour"]);
  pgm.dropColumns("companies", ["image_url"]);
};
