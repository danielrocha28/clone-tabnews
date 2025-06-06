import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseName = process.env.POSTGRES_DB;
  const { rows: versionRows } = await database.query("SHOW server_version;");
  const { rows: maxConnectionsRows } = await database.query(
    "SHOW max_connections;",
  );
  const { rows: openedConnectionsRows } = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  const version = versionRows[0].server_version;
  const maxConnections = parseInt(maxConnectionsRows[0].max_connections);
  const openedConnections = openedConnectionsRows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    database: {
      version: version,
      max_connections: maxConnections,
      opened_connections: openedConnections,
    },
  });
}

export default status;
