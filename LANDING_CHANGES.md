Actúa como un equipo formado por:

* Senior B2B product marketer.
* Conversion rate optimisation specialist.
* Google Ads landing-page specialist.
* Senior product designer.
* Senior frontend engineer.

Trabaja directamente sobre el proyecto actual de Cuore Tech. No me hagas preguntas ni te limites a recomendar cambios: inspecciona los archivos existentes, implementa las mejoras, compruébalas y deja un informe final.

OBJETIVO COMERCIAL

Esta landing vende un servicio B2B de diseño y desarrollo de CRM a medida.

No vende un SaaS genérico, una plantilla, un constructor no-code ni “horas de programación”.

Objetivo de adquisición:

* Presupuesto inicial de Google Ads: USD 1,500.
* Proyecto objetivo: aproximadamente USD 10,000–20,000 inicialmente o USD 5,000–10,000 mensuales.
* Necesitamos pocas oportunidades, pero con intención comercial alta.
* La métrica importante es qualified pipeline, no cantidad bruta de formularios.

POSICIONAMIENTO QUE DEBES CONSERVAR

* Custom CRM development for B2B teams.
* Senior-led engineering.
* Honest build-vs-buy recommendation.
* Free 30-minute CRM Fit Review.
* Typical first-phase engagements start at $10,000.
* Customer control over data, hosting, source code and roadmap according to the agreed project scope.
* “Your CRM should fit your business. Not the other way around.”
* Custom CRM is not the right solution for every company.

NO INVENTES:

* Clientes.
* Testimonios.
* Logos.
* Casos de éxito.
* Ratings.
* Premios.
* Número de proyectos.
* Años de experiencia.
* Resultados económicos.
* Plazos de entrega garantizados.
* Certificaciones.
* Propiedad absoluta del código si los términos actuales solo dicen que se define en el alcance.

1. CORRIGE PRIMERO LOS PROBLEMAS MÓVILES

Las capturas reales muestran desplazamiento horizontal y contenido cortado en móvil.

La causa principal conocida es:

```css
.compare-table {
  min-width: 560px;
}
```

La versión móvil convierte la tabla en bloques, pero no elimina ese `min-width`.

Requisitos:

* En móvil, establecer el ancho mínimo correcto en la tabla y en todos sus descendientes.
* Convertir la comparación en tarjetas apiladas verdaderamente responsive.
* No solucionar el problema añadiendo simplemente `overflow-x: hidden` al `body`.
* Encontrar y corregir el elemento responsable de cada overflow.
* Ningún componente debe superar el ancho del viewport.
* Probar expresamente 320, 375, 390, 768, 1024 y 1440 px.
* Verificar mediante JavaScript que:

```js
document.documentElement.scrollWidth <= window.innerWidth
```

* Los botones y enlaces táctiles deben tener al menos 44 px.
* El contenido principal en móvil debe tener un tamaño mínimo efectivo de 16 px.
* La microcopy puede bajar ligeramente, pero nunca debe resultar difícil de leer.
* Evitar líneas de texto demasiado largas.
* No reducir elementos para conseguir que “quepan”.

2. ACLARA LA PROPUESTA PRINCIPAL

Reescribe el hero manteniendo el contenido en inglés.

Usa como base:

Eyebrow:

“CUSTOM CRM DEVELOPMENT FOR B2B TEAMS”

H1:

“Custom CRM development built around what your business actually needs.”

Subheadline:

“Replace CRM workarounds with the workflows, integrations and dashboards your teams actually use — without paying forever for seats, add-ons and features they don’t.”

Supporting brand statement:

“Your CRM should fit your business. Not the other way around.”

Primary CTA:

“Request My Free CRM Fit Review”

CTA microcopy:

“30 minutes · No obligation · Honest build-vs-buy recommendation”

Mantén en el hero:

* Senior-led from discovery to delivery.
* Control over data, hosting and roadmap.
* Projects typically start at $10k.

No utilices como claim:

* “Built in record time.”
* “The cheapest CRM.”
* “A fraction of the cost.”
* “Guaranteed savings.”
* “Delivered instantly with AI.”
* Cualquier superlativo o promesa que no se pueda demostrar.

3. ACLARA SERVICIO FRENTE A PRODUCTO

Añade cerca del principio una explicación inequívoca:

“We don’t sell another generic CRM subscription. We design and build a working CRM for your company.”

Explica de manera breve:

* Cuore Tech presta consultoría, diseño, desarrollo e integración.
* El cliente recibe un sistema funcional adaptado a su negocio.
* No se entrega una configuración genérica igual para todos.
* Los términos de hosting, código, mantenimiento y ownership se definen por adelantado.
* El cliente mantiene el control de sus datos y su roadmap.

No presentes Cuore Tech como un SaaS con planes mensuales predeterminados.

4. PRESENTA EL ALCANCE COMO MODULAR, SIN PARECER UN SAAS

El feedback de “venderlo por módulos” es útil únicamente como forma de hacer tangible un servicio abstracto.

Crea una sección visual titulada:

“Build only what your business needs.”

Supporting copy:

“Start with the capabilities that solve the highest-value problems. Add more only when the business case is clear.”

Representa estas capacidades como módulos combinables:

* Customer & Account Management.
* Sales Pipeline.
* Operations & Approvals.
* Integrations & Data.
* Reporting & Custom KPIs.
* Practical AI Assistance.

Cada módulo debe explicar en una frase el resultado empresarial.

No hagas:

* Plan Basic / Pro / Enterprise.
* Precios independientes por módulo.
* Checklists que parezcan una tabla SaaS.
* La impresión de que son seis productos prefabricados.

Debe quedar claro que son bloques de alcance adaptables y que la lógica de negocio conecta todo el sistema.

5. DEMUESTRA VISUALMENTE QUE “CUSTOM” SIGNIFICA CUSTOM

El dashboard genérico actual no demuestra suficientemente la personalización.

Crea una sección muy visual titulada:

“Different businesses need different CRMs.”

Supporting copy:

“A custom CRM does more than change field names. Its workflows, dashboards, permissions and KPIs reflect how that company actually operates.”

Añade tres dashboard mockups claramente diferentes:

A. Travel operator

KPIs y elementos sugeridos:

* Quote-to-booking conversion.
* Package margin.
* Tour and add-on attachment rate.
* Upcoming departures at risk.
* Comparison between packages, packages plus tours and ancillary services.

B. B2B distributor

KPIs y elementos sugeridos:

* Quote-to-order conversion.
* Reorder rate.
* Revenue and margin by account.
* Overdue accounts.
* Order pipeline.

C. Professional services firm

KPIs y elementos sugeridos:

* Pipeline coverage.
* Utilisation.
* Project margin.
* Renewals at risk.
* Active engagements.

Requisitos visuales:

* No limitarse a cambiar las etiquetas del mismo dashboard.
* Cambiar también jerarquía, componentes, visualización y distribución.
* Cada dashboard debe parecer diseñado para ese negocio.
* Incorporar un look and feel ligeramente diferente en cada ejemplo, manteniendo la marca Cuore Tech.
* Marcar claramente los tres como “Illustrative examples” para no presentarlos como clientes reales.
* En escritorio se pueden utilizar tabs o un selector accesible.
* En móvil deben apilarse o utilizar un control accesible que no genere desplazamiento horizontal.
* Todo el contenido relevante debe existir en el HTML; no depender únicamente de una interacción para que Google pueda verlo.
* No usar fotografías de stock ni pantallazos falsos de clientes.
* Crear visuales de producto limpios mediante HTML/CSS/SVG o assets propios del proyecto.
* Si se generan imágenes rasterizadas, usar WebP/PNG optimizado, dimensiones explícitas, `alt` descriptivo y `loading="lazy"` cuando estén below the fold.

6. MEJORA EL COLOR SIN PERDER CREDIBILIDAD B2B

Mantén la base:

* Navy.
* Blue.
* White/off-white.

Añade color estratégicamente mediante:

* Pale blue.
* Soft teal.
* Soft violet.
* Un accent cálido moderado para alertas o métricas.

El color debe concentrarse en:

* Dashboards.
* KPI cards.
* Módulos.
* Iconos.
* Chips.
* Separadores de sección.
* Estados visuales.

No conviertas toda la página en un arcoíris.

No uses degradados decorativos excesivos.

El objetivo es que la página tenga más vida y diferenciación visual, sin parecer una app B2C barata.

7. MEJORA LEGIBILIDAD Y JERARQUÍA

Las capturas muestran que algunos textos secundarios e iconos se perciben demasiado pequeños.

Requisitos:

* Aumentar el tamaño del texto descriptivo en cards.
* En fondos navy, usar un gris más luminoso cercano a `#CBD5E1` para el texto importante.
* Mantener una ratio mínima de contraste de 4.5:1.
* Aumentar los icon containers aproximadamente a 46–48 px.
* Hacer que los SVG interiores sean visibles, aproximadamente 22–24 px.
* Reforzar los títulos de cards.
* Reducir texto repetido antes de reducir tamaños.
* Los mockups deben poder entenderse en móvil sin hacer zoom.
* Simplificar los mockups en pantallas pequeñas en lugar de miniaturizar toda la versión desktop.

8. CONSERVA LA SECCIÓN HONESTA DE BUILD VS. BUY

La sección que explica que no todo negocio necesita un CRM a medida es una de las partes más convincentes.

Consérvala y hazla más visible.

Debe mantener esta idea:

“If HubSpot, Salesforce or another off-the-shelf CRM is the better answer, we’ll tell you.”

No ataques a esas marcas.

No digas que un CRM custom es siempre más barato o mejor.

La comparación debe ayudar al comprador a autocalificarse:

Off-the-shelf puede ser adecuado cuando:

* El proceso comercial es estándar.
* Las integraciones son simples.
* Se necesita una solución inmediata.
* Los costes por usuario no son relevantes.

Custom puede ser adecuado cuando:

* El workflow es una ventaja competitiva.
* Existen workarounds constantes.
* Varias áreas dependen del mismo sistema.
* Hay integraciones complejas.
* Los costes de licencias, add-ons y consultoría están creciendo.
* Se necesita control sobre datos y roadmap.

9. MANTÉN LA IA COMO ARGUMENTO SECUNDARIO

No conviertas la IA en el claim principal.

Usa una formulación sobria como:

“We use AI-assisted engineering to shorten feedback loops and accelerate delivery where appropriate. Architecture, security, integrations and product decisions remain senior engineering responsibilities.”

La IA debe comunicar eficiencia y capacidad moderna.

No debe transmitir:

* Vibe coding.
* Software improvisado.
* Menor calidad.
* Entrega milagrosa.
* Sustitución de la ingeniería senior.

10. CONSERVA Y PROTEGE EL FUNNEL ACTUAL

No rompas ni reemplaces la integración de Google Forms.

Debe conservarse este endpoint:

```text
https://docs.google.com/forms/d/e/1FAIpQLSe98q9LdffZJThYr-Le6N9Yy1fGnYGBNlsxHgqKSUmL7QFijA/formResponse
```

Mappings obligatorios:

```text
entry.1467467639 → goal
entry.1006754821 → bottleneck/context
entry.2026813663 → email
entry.293749142 → name
```

Conservar:

* Envío silencioso mediante POST.
* El usuario permanece en la landing.
* Captura de `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, `gbraid`, `wbraid`, landing page y referrer.
* Inclusión de la atribución dentro del campo de contexto enviado a Google Forms.
* Protección contra doble envío.
* Estado “Sending…”.
* Mensaje de éxito en inglés.
* Validación nativa del navegador.
* `type="email"`.
* No añadir `novalidate`.

Regla crítica:

* Un clic en CTA es engagement, no una conversión.
* No ejecutar `sendConversion()` desde ningún CTA.
* Ejecutar `generate_lead` y la conversión de Google Ads solamente después del envío del formulario.
* No contabilizar `mailto:` como conversión principal.
* Mantener preparados `ga4Id`, `adsConversionId` y `adsConversionLabel`.

11. NO AÑADAS FRICCIÓN INNECESARIA AL FORMULARIO

Mantén aproximadamente estos datos:

* Primary goal.
* Current setup and biggest bottleneck.
* Company website dentro del contexto.
* Desired timeline dentro del contexto.
* Work email.
* Name.

No añadas por ahora:

* Teléfono obligatorio.
* Dirección.
* País.
* Cargo.
* Presupuesto mediante un nuevo campo.
* Formularios multipaso complejos.

El precio mínimo visible de $10k ya realiza parte de la cualificación.

12. SEO Y GOOGLE ADS

Mantén una única etiqueta H1.

El H1 debe contener “Custom CRM development”.

Conserva y actualiza coherentemente:

* `<title>`.
* Meta description.
* Canonical.
* Open Graph.
* ProfessionalService schema.
* FAQ visible y FAQ schema.
* `robots.txt`.
* `sitemap.xml`.
* Privacy Notice.

No hagas keyword stuffing.

El primer viewport debe mantener una relación directa con anuncios orientados a:

* Custom CRM development.
* Custom CRM development company.
* CRM development services.
* CRM replacement.
* CRM integrations.

No cambies el objetivo principal de la página hacia restaurantes, retail o travel. Los dashboards son ejemplos visuales de personalización, no nuevos mercados prioritarios.

13. RENDIMIENTO Y ACCESIBILIDAD

* No introduzcas React, Vue ni otro framework.
* Mantén la solución en HTML, CSS y JavaScript estático.
* No añadas dependencias pesadas.
* Evita librerías de sliders.
* Usa progressive enhancement.
* Respeta `prefers-reduced-motion`.
* Mantén navegación mediante teclado.
* Tabs y accordions deben tener estados ARIA correctos.
* No sacrifiques Core Web Vitals por imágenes decorativas.
* Añade `width` y `height` a imágenes.
* Lazy-load únicamente imágenes below the fold.
* No lazy-load el contenido principal del hero.

14. VALIDACIÓN OBLIGATORIA

Antes de terminar:

* Ejecuta `node --check` sobre JavaScript.
* Valida JSON-LD.
* Comprueba que solo existe un H1.
* Comprueba todas las anclas.
* Comprueba que no existen IDs duplicados.
* Comprueba el balance de llaves CSS.
* Sirve la web mediante HTTP local.
* Genera capturas completas en 390 × 844, 768 × 1024 y 1440 × 1000.
* Revisa visualmente todas las capturas.
* Verifica que no existe scroll horizontal en ningún viewport.
* Comprueba que el menú móvil funciona.
* Comprueba tabs/accordions mediante teclado.
* Intercepta o simula la petición a Google Forms para no contaminar respuestas reales.
* Confirma que el payload contiene los cuatro `entry.*` correctos y la atribución.
* Confirma que pulsar un CTA no dispara conversión.
* Confirma que un submit satisfactorio dispara una sola conversión.
* Comprueba la página de privacidad y todos los enlaces.
* Si Lighthouse está disponible, intenta superar 90 en Performance, Accessibility, Best Practices y SEO, pero no inventes resultados si la herramienta no puede ejecutarse.

15. ENTREGA FINAL

Implementa los cambios directamente.

No dejes contenido placeholder visible.

No me pidas confirmación durante el trabajo.

Crea `IMPLEMENTATION-REPORT.md` con:

* Archivos modificados.
* Cambios realizados.
* Feedback aceptado.
* Feedback rechazado y motivo.
* Copy final del hero.
* Explicación de los tres dashboards.
* Resultado de las pruebas.
* Problemas pendientes reales.
* Cualquier elemento que requiera posteriormente información verificable del fundador, clientes o contratos.

No declares la landing lista para Google Ads si los IDs reales de GA4 y Google Ads siguen vacíos. En ese caso, indica claramente que el diseño y el funnel están preparados, pero que la medición de producción permanece pendiente.
