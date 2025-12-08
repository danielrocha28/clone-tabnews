import email from "infra/email.js";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices;
});

describe("infra/email.js", () => {
  test("send()", async () => {
    await orchestrator.deleteAllEmails();
    await email.send({
      from: "Fintab <contato@fintab.com.br>",
      to: "contato@curso.dev",
      subject: "teste de assunto",
      text: "Teste de corpo.",
    });
    await email.send({
      from: "Fintab <contato@fintab.com.br>",
      to: "contato@curso.dev",
      subject: "Ultimo email enviado",
      text: "corpo do ultimo email enviado.",
    });

    const lastEmail = await orchestrator.getLastEmail();
    console.log(lastEmail);
    expect(lastEmail.sender).toBe("<contato@fintab.com.br>");
    expect(lastEmail.recipients[0]).toBe("<contato@curso.dev>");
    expect(lastEmail.subject).toBe("Ultimo email enviado");
    expect(lastEmail.text).toBe("corpo do ultimo email enviado.\n");
  });
});
