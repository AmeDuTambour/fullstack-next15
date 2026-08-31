import { spawn } from "node:child_process";
import { mkdirSync, openSync } from "node:fs";
import path from "node:path";

/**
 * Démarre un vrai serveur Next pour la durée de la suite.
 *
 * Les tests de contrat doivent emprunter le même chemin que l'application
 * mobile — routage, middleware, sérialisation comprise — et non importer les
 * handlers directement. C'est aussi ce qui évite d'avoir à transformer les
 * paquets ESM de next-auth sous jest.
 */

const PORT = Number(process.env.CONTRACT_PORT ?? 3100);
const BASE_URL = `http://127.0.0.1:${PORT}`;
const BOOT_TIMEOUT_MS = 120_000;

async function waitForServer(deadline: number) {
  let lastError = "serveur injoignable";

  while (Date.now() < deadline) {
    try {
      // Une 401 suffit : elle prouve que la route est compilée et répond.
      const res = await fetch(`${BASE_URL}/api/products`, {
        signal: AbortSignal.timeout(10_000),
      });
      if (res.status > 0) return;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
    await new Promise((r) => setTimeout(r, 500));
  }

  throw new Error(
    `Le serveur Next n'a pas répondu sur ${BASE_URL} en ${BOOT_TIMEOUT_MS / 1000}s ` +
      `(dernière erreur : ${lastError}). Voir tests/.server.log.`
  );
}

export default async function globalSetup() {
  mkdirSync(path.join(process.cwd(), "tests"), { recursive: true });
  const logPath = path.join(process.cwd(), "tests", ".server.log");
  // Descripteur de fichier plutôt que flux JS : sinon les tubes stdout/stderr
  // restent des handles ouverts et jest signale un event loop non vidé.
  const log = openSync(logPath, "w");

  const server = spawn(
    "npx",
    ["next", "dev", "--port", String(PORT), "--hostname", "127.0.0.1"],
    {
      cwd: process.cwd(),
      // Dossier de compilation séparé : sans lui, ce serveur et celui de
      // développement se disputent `.next` et le corrompent tous les deux.
      env: { ...process.env, NEXT_DIST_DIR: ".next-test" },
      stdio: ["ignore", log, log],
      // Groupe de processus propre, pour pouvoir tuer `next dev` et son enfant.
      detached: true,
    }
  );

  // Récupéré par global-teardown via l'objet global de jest.
  (globalThis as Record<string, unknown>).__CONTRACT_SERVER__ = server;
  process.env.CONTRACT_BASE_URL = BASE_URL;

  const exited = new Promise<never>((_, reject) => {
    server.once("exit", (code) =>
      reject(
        new Error(
          `Le serveur Next s'est arrêté avant d'être prêt (code ${code}). ` +
            `Voir ${logPath}.`
        )
      )
    );
  });

  await Promise.race([waitForServer(Date.now() + BOOT_TIMEOUT_MS), exited]);
}
