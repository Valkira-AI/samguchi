const SESSION_KEY = "samguchi_admin_unlocked";

function getExpectedPassword(): string {
  return import.meta.env.VITE_ADMIN_PASSWORD ?? "samguchi2026";
}

export function checkAdminSession(): Promise<{ unlocked: boolean }> {
  try {
    return Promise.resolve({ unlocked: localStorage.getItem(SESSION_KEY) === "1" });
  } catch {
    return Promise.resolve({ unlocked: false });
  }
}

export function unlockAdmin(input: { data: { password: string } }): Promise<{ ok: boolean }> {
  const { password } = input.data;
  if (typeof password !== "string" || password.length === 0 || password.length > 200) {
    return Promise.resolve({ ok: false });
  }
  if (password !== getExpectedPassword()) {
    return Promise.resolve({ ok: false });
  }
  try {
    localStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* ignore storage errors */
  }
  return Promise.resolve({ ok: true });
}

export function lockAdmin(): Promise<{ ok: true }> {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore storage errors */
  }
  return Promise.resolve({ ok: true as const });
}
