const { exec } = require("node:child_process");

let spinner = [
  "/",
  "/",
  "/",
  "/",
  "-",
  "-",
  "-",
  "-",
  "\\",
  "\\",
  "\\",
  "\\",
  "|",
  "|",
  "|",
  "|",
];
let i = 0;
let awaintMessage = "🔴 Awaiting for postgres";

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost ", handleReturn);

  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.cursorTo(awaintMessage.length + 1);
      process.stdout.write(`${spinner[i++ % spinner.length]}`);
      checkPostgres();
      return;
    }

    console.log("\n🟢 Postgres is ready!");
  }
}
process.stdout.write(awaintMessage);
checkPostgres();
