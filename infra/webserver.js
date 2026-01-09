function getOrigin() {
  if (["test", "development"].includes(process.env.NODE_ENV)) {
    return "https://localhost:3000";
  }

  if (process.env.VERCEl_ENV === "preview") {
    return `https://${process.env.VERCEl_URl}`;
  }

  return "https://fintab.com.br";
}

const webserver = {
  origin: getOrigin(),
};

export default webserver;
