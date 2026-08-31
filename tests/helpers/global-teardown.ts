import type { ChildProcess } from "node:child_process";

const GRACE_MS = 5_000;

export default async function globalTeardown() {
  const server = (globalThis as Record<string, unknown>).__CONTRACT_SERVER__ as
    | ChildProcess
    | undefined;

  if (!server || server.exitCode !== null || !server.pid) return;

  await new Promise<void>((resolve) => {
    // Le minuteur de secours doit être annulé dès la sortie du processus,
    // sinon il maintient la boucle d'événements de jest ouverte 5 s de plus.
    const grace = setTimeout(() => {
      try {
        process.kill(-server.pid!, "SIGKILL");
      } catch {
        /* déjà mort */
      }
      resolve();
    }, GRACE_MS);

    server.once("exit", () => {
      clearTimeout(grace);
      resolve();
    });

    try {
      // `next dev` lance un processus enfant : viser le groupe entier.
      process.kill(-server.pid!, "SIGTERM");
    } catch {
      server.kill("SIGTERM");
    }
  });
}
