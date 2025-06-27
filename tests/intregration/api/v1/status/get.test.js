test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const { database, updated_at } = await response.json();
  const pgVersion = database.version;
  const maxConnections = database.max_connections;
  const openedConnections = database.opened_connections;

  expect(updated_at).toBeDefined();
  const parsedUpdatedAt = new Date(updated_at).toISOString();
  expect(updated_at).toEqual(parsedUpdatedAt);

  expect(pgVersion).toBeDefined();
  expect(typeof pgVersion).toBe("string");
  expect(pgVersion.length).toBeGreaterThan(0);

  expect(maxConnections).toBeDefined();
  expect(typeof maxConnections).toBe("number");
  expect(maxConnections).toBeGreaterThan(0);

  expect(openedConnections).toBeDefined();
  expect(typeof openedConnections).toBe("number");
  expect(openedConnections).toBeLessThanOrEqual(maxConnections);
});
