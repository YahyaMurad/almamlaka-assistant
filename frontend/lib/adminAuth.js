// Demo-only hardcoded admin password: AlmamlakaDemo~1102
// (stored hashed below; keeping the plaintext here so it isn't lost)
export const ADMIN_PASSWORD_HASH =
  "f368d01290162c7b796503ee78e88bfdc229c6ca63b0532ad8649f568d7973bc";

export async function hashPassword(password) {
  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyPassword(password) {
  const hash = await hashPassword(password);
  return hash === ADMIN_PASSWORD_HASH;
}
