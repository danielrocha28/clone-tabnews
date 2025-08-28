import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const data = await response.json();
  return data;
}

export default function StatusPage() {
  return (
    <>
      <h1> Status Database </h1>
      <UpdatedAt />
    </>
  );
}
function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!data) {
    return <div> Erro ao carregar os dados</div>;
  }

  const updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  const { version, max_connections, opened_connections } = data.database;

  return (
    <div>
      <div>Última atualização: {updatedAtText}</div>
      <div>Versão do Postgres: {version}</div>
      <div>Maximo de conexões suportadas: {max_connections}</div>
      <div>Conexões abertas: {opened_connections}</div>
    </div>
  );
}
