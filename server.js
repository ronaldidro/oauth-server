import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer as createViteServer } from "vite";
import { api } from "./src/api/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isTest = process.env.VITEST;

process.env.MY_CUSTOM_SECRET = "API_KEY_qwertyuiop";

export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === "production",
  hmrPort
) {
  const resolve = (p) => path.resolve(__dirname, p);

  const indexProd = isProd
    ? fs.readFileSync(resolve("dist/client/index.html"), "utf-8")
    : "";

  const app = express();

  app.use("/api", (req, res, next) => api(req, res, next));

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite;
  if (!isProd) {
    // Crea servidor Vite en modo middleware y configura el tipo de aplicación como
    // 'custom', deshabilitando la propia lógica de servicio HTML de Vite para que el servidor principal
    // puede tomar el control
    vite = await createViteServer({
      root,
      logLevel: isTest ? "error" : "info",
      server: {
        middlewareMode: true,
        watch: {
          // Durante las pruebas, editamos los archivos demasiado rápido y, a veces
          // Chokidar omite eventos de cambio, por lo que aplicamos el sondeo para mantener la coherencia.
          usePolling: true,
          interval: 100,
        },
        hmr: {
          port: hmrPort,
        },
      },
      appType: "custom",
    });
    // Usa la instancia de Connect de Vite como middleware. Si usas tu propio
    // router de Express (express.Router()), debes usar router.use
    app.use(vite.middlewares);
  } else {
    app.use((await import("compression")).default());
    app.use(
      (await import("serve-static")).default(resolve("dist/client"), {
        index: false,
      })
    );
  }

  app.use("*", async (req, res) => {
    try {
      const url = req.originalUrl;
      let template, render;

      if (!isProd) {
        // 1. Lee index.html
        template = fs.readFileSync(resolve("index.html"), "utf-8");
        // 2. Aplica transformaciones Vite HTML. Esto inyecta el cliente Vite HMR
        // y también aplica transformaciones HTML de los complementos de Vite, por ejemplo,
        // preámbulos globales de @vitejs/plugin-react
        template = await vite.transformIndexHtml(url, template);
        // 3. Carga la entrada del servidor. vite.ssrLoadModule se transforma automáticamente
        // ¡tu código fuente de ESM se puede usar en Node.js! No hay empaquetado
        // requerido, y proporciona una invalidación eficiente similar a HMR.
        render = (await vite.ssrLoadModule("/src/entry-server.jsx")).render;
      } else {
        template = indexProd;
        // @ts-ignore
        render = (await import("./dist/server/entry-server.js")).render;
      }

      const context = {};
      // 4. renderiza el HTML de la aplicación. Esto asume que la función `render`
      // exportada desde entry-server.js llama a las API de SSR del marco apropiado,
      // por ejemplo, ReactDOMServer.renderToString()
      const appHtml = render(url, context);

      if (context.url) {
        // Somewhere a `<Redirect>` was rendered
        return res.redirect(301, context.url);
      }
      // 5. Inyecta el HTML generado por la aplicación en la plantilla.
      const html = template.replace(`<!--app-html-->`, appHtml);
      // 6. Devuelve el HTML renderizado.
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      // Si se detecta un error, permite que Vite fije el trazado de pila
      // para que se asigne de nuevo a tu código fuente real.
      !isProd && vite.ssrFixStacktrace(e);
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  });

  return { app, vite };
}

if (!isTest) {
  createServer().then(({ app }) =>
    app.listen(5173, () => {
      console.log("http://localhost:5173");
    })
  );
}
