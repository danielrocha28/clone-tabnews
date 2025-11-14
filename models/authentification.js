import user from "models/users.js";
import password from "models/password.js";
import { NotFoundError, UnauthorizedError } from "infra/errors.js";

async function getAuthenticatedUser(providedEmail, providedPassword) {
  try {
    const storedUser = await findOneByEmail(providedEmail);
    await validatePassword(providedPassword, storedUser.password);

    return storedUser;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "Dados de autentificação não conferem.",
        action: "Verifique se os dados informados estão corretos.",
      });
    }

    throw error;
  }

  async function findOneByEmail(providedEmail) {
    let storedUser;

    try {
      storedUser = await user.findOneByEmail(providedEmail);
    } catch (error) {
      if (error instanceof NotFoundError)
        throw new UnauthorizedError({
          message: "email não confere.",
          action: "Verifique se este dado está correto",
        });

      throw error;
    }
    return storedUser;
  }

  async function validatePassword(providedPassword, storedPasword) {
    const correctPasswordMatch = await password.compare(
      providedPassword,
      storedPasword,
    );
    if (!correctPasswordMatch) {
      throw new UnauthorizedError({
        message: "Senha não confere.",
        action: "Verifique se este dado está correto",
      });
    }
  }
}

const authentification = {
  getAuthenticatedUser,
};

export default authentification;
