# Informe de migración de la landing — Cuore Tech

Fecha: 2026-09-10 · Estado: **implementado y verificado en el repositorio; no desplegado**.

La página vende ahora un único servicio: **desarrollo de ERP a medida y software de operaciones para
empresas B2B**, liderado por perfiles senior. Ya no aparece como servicio de desarrollo de CRM, ni
como producto envasado, SaaS, reventa o demo instantánea. No existe página separada de CRM.

## 1. Qué comunica la página

- Hero exacto: `CUSTOM ERP DEVELOPMENT FOR B2B OPERATIONS` / **ERP software built around your
  business.** / línea de soporte sobre sistemas modulares (pedidos, inventario, workflows,
  aprobaciones, integraciones y reportes) "sin forzar tu operación a una plataforma genérica".
- Un único destino de conversión en todo el sitio: el formulario de Fit Review. Los botones de hero,
  fit, sección intermedia, banda final y el botón de envío dicen **Request My Free Fit Review**; los
  enlaces cortos de la navegación y de la barra fija usan **Request a Free Fit Review**, y el enlace
  de `privacy.html`, **Request a Free Review** (todos al mismo formulario). Microcopy:
  `Free 30-minute review · No obligation · Honest build-or-buy recommendation`.
- Calificación visible: **Projects typically start at $10,000.** (arriba del fold, en el proceso y en
  los datos estructurados como `priceRange: "$10,000+"`).
- Es un servicio (descubrimiento, diseño, construcción, integración y soporte), entrega modular y por
  fases, sin pagar módulos irrelevantes ni licencias por usuario; contabilidad, nómina y banca se
  integran, no se reconstruyen.
- Build-or-buy honesto: hay una sección "cuándo custom NO vale la pena" y la promesa de decirlo si un
  software envasado es mejor opción. La arquitectura, seguridad y decisiones de producto siguen
  siendo responsabilidad de ingeniería senior; la IA acelera la entrega y no es el producto.
- Frase sustituta: *"The right system is not the one with the most features. It is the one your
  operation can actually rely on."*
- Ejemplos de dashboard: 4 pestañas navegables por teclado — **Retail, Restaurant, Travel,
  Manufacturing** — cada una con métricas y maquetado propios (AOV y rotación de inventario; cubiertos,
  ticket medio, food cost % y merma; margen por paquete, ocupación y salidas próximas; órdenes de
  trabajo, WIP, cumplimiento, yield y scrap). Cada panel —y también la maqueta del hero— muestra el
  mismo aviso, literal:
  `Illustrative concept — fictional sample data. Not a client system or client result.`

## 2. Archivos modificados

| Archivo | Cambio principal |
| --- | --- |
| `index.html` | Copys de SEO y hero, secciones de servicio/fit/módulos/casos, `#examples` en 4 pestañas con disclaimer, cita sustituida, FAQ y JSON-LD coherentes, form sin opción premarcada, comentarios de migración. |
| `css/style.css` | Cuatro acentos de panel (`.dash-frame-*`), utilidades de barra y `.dash-disclaimer`, `.fit-cta`, `.po-*` en lugar de `.deal-*`, token corregido `--text-on-light`. |
| `js/main.js` | Eventos renombrados, `generate_lead` solo al enviar, mensaje de éxito/"submitted", texto de fallo, comentarios sobre el Form real. |
| `privacy.html` | "Request a Free Review", "inquiries", fecha 2026-09-01; enlace de vuelta a la landing. |
| `sitemap.xml` | `lastmod` 2026-09-10 en ambas URLs. |
| `GOOGLE-ADS-LAUNCH.md` | Reescrito: nada configurado aún, tabla de eventos, migración del Form, atribución y limitaciones. |
| `CHANGES.md` | Registro de cambios actualizado a la oferta ERP (antes describía la versión CRM). |
| `IMPLEMENTATION-REPORT.md` | Marcado como **registro histórico** de la ronda anterior (no se reescribió su contenido). |
| `ERP-MIGRATION-SPEC.md` | Nota de estatus: el brief de marketing manda sobre este spec donde difieren. |
| `.htmlvalidate.json` (nuevo) | Reglas de `html-validate` (`html-validate:recommended` + WCAG; `void-style` apagado). |
| `tools/verify.mjs` (nuevo) | Suite de verificación estática del sitio. |

## 3. Mejoras de conversión

- Una sola oferta y una sola acción; el CTA aparece en header sticky, secciones intermedias, banda
  final y botón del formulario con el mismo texto.
- El formulario ya no preselecciona un objetivo: obliga a elegir y mejora la calidad del lead.
- Microcopy de fricción fuera del fold (gratuito, 30 minutos, sin compromiso, recomendación honesta).
- Ejemplos por industria para que el visitante se reconozca, con métricas de su sector.
- Fricción calificadora visible ($10,000 + "custom no es para todos") para filtrar leads viables.
- El clic en el CTA se mide como intención, **nunca como conversión de lead**.

## 4. Comandos ejecutados y resultado real

```
node --check js/main.js
  exit 0
node tools/verify.mjs
  exit 0 → 110/110 checks passed
node node_modules/html-validate/bin/html-validate.mjs index.html privacy.html
  exit 0 (sin salida = sin errores)
node tools/mutation-check.mjs backup / apply 0..2 / restore
  caso 0 → exit 1 (107/110) · caso 1 → exit 1 (108/110) · caso 2 → exit 1 (107/110)
  tras `restore`, js/main.js vuelve a su contenido exacto
node tools/audit.mjs
  exit 0 → 21 archivos de texto revisados (1 omitido: el propio auditor)
  Informativo: lista los términos retirados que quedan en cada archivo; no aplica las excepciones
  permitidas ni falla por sí solo, así que su salida hay que leerla (lo interpreta el punto 4).
```

La prueba de mutación ataca el propio `js/main.js` con tres defectos deliberados — emitir la
conversión de lead al pulsar un CTA, emitir dos conversiones por envío y no emitir ninguna — y
comprueba que la suite falla en cada caso: el caso 0 rompe `jsdom run: no lead conversion fires
before the form is submitted`, el caso 1 rompe `jsdom run: exactly one lead conversion after the
POST resolves` y el caso 2 rompe `js/main.js emits the approved event names`. Tras `restore` la
suite volvió a 110/110 y `git diff --stat` de `js/main.js` no cambió (15 inserciones / 9
borrados, las mismas de antes de la prueba).

`tools/audit.mjs` recorre además **todos** los archivos de texto del repositorio (no solo los que
revisa `verify.mjs`), incluidos los informes históricos y los briefs del usuario. Las listas
siguientes sí distinguen entre lo que se sirve y lo que no.

- Términos `Salesforce`, `HubSpot`, `pipeline`, `deals`, `crm_page_view`, `crm_cta_click`,
  `crm_scroll_depth`, `crm_form_submit`, `crm_email_click`: **0 coincidencias en los archivos que se
  publican** (`index.html`, `css/style.css`, `js/main.js`, `privacy.html`, `sitemap.xml`,
  `robots.txt`), búsqueda sin distinguir mayúsculas. `leads` no aparece en la página: sobrevive solo
  como nombre del producto de Google (*Enhanced Conversions for Leads*) en `GOOGLE-ADS-LAUNCH.md` y
  en prosa de estos informes.
- `CRM`: solo las tres excepciones permitidas — el nombre de módulo visible **Sales & CRM** (2 veces),
  los `value` ocultos del Form (`Replace our existing CRM`, `Build a CRM from scratch`) y sus
  comentarios/documentación.
- Codificación: UTF-8 válido, sin mojibake, sin BOM y sin CRLF en todos los archivos entregados. Los
  únicos archivos del repositorio marcados por el auditor son `LANDING_CHANGES.md` (CRLF) y
  `LANDING_CHANGES_TEXT.md` (BOM + CRLF + mojibake): son briefs del usuario, no se sirven y no se
  han tocado.
- HTML/CSS/JS: IDs duplicados, anclas internas, assets locales inexistentes, propiedades CSS sin
  definir y el parseo con `css-tree`: sin hallazgos. El envío real del formulario se ejercitó en un
  entorno jsdom con el endpoint y los `entry.*` reales.

## 5. Configuración externa pendiente antes de invertir en anuncios

**Nada está configurado todavía.** Los puntos 1 y 2 son ediciones de `SITE_CONFIG` en este
repositorio que luego hay que desplegar para que surtan efecto; el paso 4.2 vuelve a tocar código
(`index.html`) y también exige desplegar. El resto ocurre fuera del repositorio: en las cuentas de
Google, sobre el formulario publicado, en el hosting o como decisiones de negocio.

1. **GA4**: crear/pegar el `ga4Id` en `SITE_CONFIG` (`js/main.js`). Hoy está vacío: los eventos sí se
   empujan a `window.dataLayer`, pero **no se envía nada a GA4** porque no se inyecta `gtag.js`.
2. **Google Ads**: crear la acción de conversión (leads) y pegar `adsConversionId` y
   `adsConversionLabel`. Mientras estén vacíos, `sendConversion()` es un no-op deliberado.
3. **Tag de Google** desplegado en el dominio y verificado con Tag Assistant/DebugView.
4. **Migración del Google Form** — 4 pasos, detalle en `GOOGLE-ADS-LAUNCH.md`:
   1. En el Form en vivo, sustituir las seis opciones de la pregunta de objetivo principal por las
      seis etiquetas visibles de `index.html`, en el mismo orden.
   2. Sustituir en `index.html` los seis atributos `value` por esas mismas seis cadenas, sin tocar
      ninguno de los `entry.*` de `js/main.js`.
   3. Enviar una prueba real **desde la página publicada** (para eso hay que haber desplegado ya el
      `index.html` con los `value` nuevos).
   4. Confirmar la fila de prueba en la hoja de cálculo vinculada y borrarla.

   Mientras 1-3 no estén hechos, lo que viaja al Form sigue siendo el texto legacy de CRM: invisible
   para el visitante, pero real en los datos que llegan al equipo comercial.
5. **Atribución**: el Form en vivo tiene 4 preguntas (`entry.*` de objetivo, cuello de botella, email
   y nombre) y **no tiene preguntas propias para `gclid`/UTM**. La página recoge deliberadamente solo
   objetivo, email y nombre (decisión previa del dueño del proyecto: "3 options, super quick to
   answer"), así que la respuesta del cuello de botella viaja rellenada solo con el bloque
   `[Attribution]` dentro de `entry.1006754821`. Mientras no se creen preguntas específicas para
   campaña/término/anuncio y sus `entry.*`, **GCLID y UTM no serán columnas consultables en Google
   Sheets**. Efecto secundario a decidir: hoy esa columna no contiene contexto humano; el bloque de
   texto con `name="bottleneck"` sigue en el HTML comentado y basta descomentarlo para volver a
   pedirlo (hay que valorar la fricción extra frente a la calidad del lead).
6. **Validación end-to-end con un lead real**: enviar una prueba, confirmar fila en Sheets, correo
   recibido y respuesta humana; después activar el presupuesto.
7. **Despliegue** de este build en `cuoretechllc.com` (canonical y sitemap ya apuntan ahí). Este
   repositorio no lleva ninguna configuración de hosting ni de despliegue (no hay `.github/`,
   `netlify.toml` ni `vercel.json`), así que publicar depende por completo de cómo esté configurado
   el hosting en la cuenta: hay que **confirmar allí la rama y la carpeta de origen de GitHub Pages**
   antes de invertir en anuncios — esta verificación es local y no puede leer esa configuración — y
   después reenviar el sitemap a Search Console.
8. **Confirmación de negocio**: precio mínimo, alcance del Fit Review de 30 minutos y compromiso de
   respuesta en 1 día hábil son afirmaciones comerciales que la empresa debe validar.

## 6. Confirmaciones

- **No se desplegó nada, no se hizo commit ni push, no se tocó Google Ads y no se modificó el Google
  Form.** No se crearon campañas, audiencias ni conversiones.
- **No se inventaron clientes, testimonios, resultados, métricas ni credenciales.** La sección de
  social proof sigue oculta y los paneles son datos ficticios avisados en pantalla.
- **No se inventaron IDs** de GA4, Google Ads, conversión ni `entry.*`: los campos analíticos quedan
  deliberadamente vacíos y los `entry.*` son los ya existentes en el Form en vivo.
- El formulario se envía con `mode: "no-cors"`, por lo que el navegador **no puede confirmar la
  entrega**: el mensaje dice "submitted", nunca "recibido". Esto debe validarse con el lead real del
  punto 6 antes de considerar el formulario confiable.
- Accesibilidad y comportamiento conservados: skip link, pestañas con `role="tablist"`, roving
  tabindex y flechas/Home/End, región `aria-live` en el estado del formulario,
  `prefers-reduced-motion`, estados de foco y degradación `.no-js`.
- **Límite de esta verificación:** no hay navegador en este entorno. Accesibilidad y responsive se
  revisaron de forma estática (markup, CSS y jsdom); el desbordamiento horizontal en móvil no se
  pudo medir en pantalla.

## 7. Notas de inventario

- `LANDING_CHANGES_TEXT.md` (brief original del usuario) ya contenía **doble codificación (mojibake),
  BOM y CRLF** y es casi idéntico a `LANDING_CHANGES.md`. No se sirvió ni se reescribió; si se desea,
  la reparación es mecánica.
- `IMPLEMENTATION-REPORT.md` conserva su texto histórico de la etapa CRM bajo un aviso explícito de
  "superado", y `ERP-MIGRATION-SPEC.md` quedó marcado como subordinado al brief final.
