import { getStore } from "@netlify/blobs";

export const handler = async (event) => {
  const bdKael = getStore("db_kael_store");

  if (event.httpMethod === "POST") {
    try {
      const data = JSON.parse(event.body);
      const currentRaw = await bdKael.get("estado_atual");
      if (currentRaw) {
        const current = JSON.parse(currentRaw);
        if (current.version > data.version) {
          return { statusCode: 200, body: JSON.stringify(current) };
        }
      }
      await bdKael.set("estado_atual", JSON.stringify(data));
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      };
    } catch (err) {
      return { statusCode: 500, body: "Erro interno." };
    }
  }

  if (event.httpMethod === "GET") {
    const data = await bdKael.get("estado_atual");
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: data || JSON.stringify({ saldo: 0, bib: [], dia: [], pendente: [], historico: [], version: 1 })
    };
  }

  return { statusCode: 405, body: "Método não permitido" };
};
