const SESSION_KEY = "samguchi_admin_unlocked";
const PASSWORD_SALT = "samguchi-admin-v1::";
const PASSWORD_HASH = "4c49e2ddcd3cb71a13f9fd822ec914faf54612f65eded6d9748748c5c777f0b9";

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function checkAdminSession(): Promise<{ unlocked: boolean }> {
  try {
    return Promise.resolve({ unlocked: localStorage.getItem(SESSION_KEY) === "1" });
  } catch {
    return Promise.resolve({ unlocked: false });
  }
}

export async function unlockAdmin(input: { data: { password: string } }): Promise<{ ok: boolean }> {
  const { password } = input.data;
  if (typeof password !== "string" || password.length === 0 || password.length > 200) {
    return { ok: false };
  }
  if (!globalThis.crypto?.subtle) {
    return { ok: false };
  }
  const hash = await sha256Hex(PASSWORD_SALT + password);
  if (hash !== PASSWORD_HASH) {
    return { ok: false };
  }
  try {
    localStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* ignore storage errors */
  }
  return { ok: true };
}

export function lockAdmin(): Promise<{ ok: true }> {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore storage errors */
  }
  return Promise.resolve({ ok: true as const });
}
