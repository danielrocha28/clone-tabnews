import email from "infra/email";
import database from "infra/database.js";
import webserver from "infra/webserver";

const EXPIRATION_IN_MILLISECONDS = 60 * 15 * 1000; // 15 minutes

async function create(userId) {
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);

  const newToken = await runInsertQuery(userId, expiresAt);
  return newToken;

  async function runInsertQuery(userId, expiresAt) {
    const results = await database.query({
      text: `
      INSERT INTO 
        user_activation_token (user_id, expires_at)
      VALUES
        ($1, $2)
      RETURNING
        *
      ;`,
      values: [userId, expiresAt],
    });

    return results.rows[0];
  }
}

async function sendEmailToUser(user, activationtoken) {
  await email.send({
    from: "Fintab <contato@fintab.com.br>",
    to: user.email,
    subject: "Ative seu cadastro no Fintab",
    text: `${user.username}, clique no link abaixo para ativar seu cadastro no Fintab:
    
${webserver.origin}/cadastro/ativar${activationtoken.id}
    `,
  });
}

const activation = {
  sendEmailToUser,
  create,
};

export default activation;
