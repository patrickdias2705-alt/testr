export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST." });
  }

  const body = typeof req.body === "object" ? req.body : {};
  const { transaction_id, status, amount, type } = body;

  console.log("[PagLoop callback]", { transaction_id, status, amount, type });

  return res.status(200).send("OK");
}
