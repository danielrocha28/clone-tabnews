import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import { createRouter } from "next-connect";
import controller from "infra/controller.js";

const router = createRouter();

export default router.handler(controller.errorHandlers);

router.get(async (request, response) => {
  const dbClient = await database.getNewClient();

  try {
    const migrationOptions = migrateOptions(dbClient);

    const pendingMigrations = await migrationRunner(migrationOptions);

    response.status(200).json(pendingMigrations);
  } finally {
    await dbClient.end();
  }
});

router.post(async (request, response) => {
  const dbClient = await database.getNewClient();

  try {
    const migrationOptions = migrateOptions(dbClient);

    const migratedMigrations = await migrationRunner({
      ...migrationOptions,
      dryRun: false,
    });

    migratedMigrations.length > 0
      ? response.status(201).json(migratedMigrations)
      : response.status(200).json(migratedMigrations);
  } finally {
    await dbClient.end();
  }
});

function migrateOptions(dbClient) {
  return {
    dbClient: dbClient,
    dryRun: true,
    dir: resolve("infra", "migrations"),
    verbose: true,
    direction: "up",
    migrationsTable: "pgmigrations",
  };
}
