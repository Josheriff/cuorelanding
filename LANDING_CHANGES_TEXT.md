ActÃºa como un equipo formado por:

* Senior B2B product marketer.
* Conversion rate optimisation specialist.
* Google Ads landing-page specialist.
* Senior product designer.
* Senior frontend engineer.

Trabaja directamente sobre el proyecto actual de Cuore Tech. No me hagas preguntas ni te limites a recomendar cambios: inspecciona los archivos existentes, implementa las mejoras, compruÃ©balas y deja un informe final.

OBJETIVO COMERCIAL

Esta landing vende un servicio B2B de diseÃ±o y desarrollo de CRM a medida.

No vende un SaaS genÃ©rico, una plantilla, un constructor no-code ni â€œhoras de programaciÃ³nâ€.

Objetivo de adquisiciÃ³n:

* Presupuesto inicial de Google Ads: USD 1,500.
* Proyecto objetivo: aproximadamente USD 10,000â€“20,000 inicialmente o USD 5,000â€“10,000 mensuales.
* Necesitamos pocas oportunidades, pero con intenciÃ³n comercial alta.
* La mÃ©trica importante es qualified pipeline, no cantidad bruta de formularios.

POSICIONAMIENTO QUE DEBES CONSERVAR

* Custom CRM development for B2B teams.
* Senior-led engineering.
* Honest build-vs-buy recommendation.
* Free 30-minute CRM Fit Review.
* Typical first-phase engagements start at $10,000.
* Customer control over data, hosting, source code and roadmap according to the agreed project scope.
* â€œYour CRM should fit your business. Not the other way around.â€
* Custom CRM is not the right solution for every company.

NO INVENTES:

* Clientes.
* Testimonios.
* Logos.
* Casos de Ã©xito.
* Ratings.
* Premios.
* NÃºmero de proyectos.
* AÃ±os de experiencia.
* Resultados econÃ³micos.
* Plazos de entrega garantizados.
* Certificaciones.
* Propiedad absoluta del cÃ³digo si los tÃ©rminos actuales solo dicen que se define en el alcance.

1. CORRIGE PRIMERO LOS PROBLEMAS MÃ“VILES

Las capturas reales muestran desplazamiento horizontal y contenido cortado en mÃ³vil.

La causa principal conocida es:

```css
.compare-table {
  min-width: 560px;
}
```

La versiÃ³n mÃ³vil convierte la tabla en bloques, pero no elimina ese `min-width`.

Requisitos:

* En mÃ³vil, establecer el ancho mÃ­nimo correcto en la tabla y en todos sus descendientes.
* Convertir la comparaciÃ³n en tarjetas apiladas verdaderamente responsive.
* No solucionar el problema aÃ±adiendo simplemente `overflow-x: hidden` al `body`.
* Encontrar y corregir el elemento responsable de cada overflow.
* NingÃºn componente debe superar el ancho del viewport.
* Probar expresamente 320, 375, 390, 768, 1024 y 1440 px.
* Verificar mediante JavaScript que:

```js
document.documentElement.scrollWidth <= window.innerWidth
```

* Los botones y enlaces tÃ¡ctiles deben tener al menos 44 px.
* El contenido principal en mÃ³vil debe tener un tamaÃ±o mÃ­nimo efectivo de 16 px.
* La microcopy puede bajar ligeramente, pero nunca debe resultar difÃ­cil de leer.
* Evitar lÃ­neas de texto demasiado largas.
* No reducir elementos para conseguir que â€œquepanâ€.

2. ACLARA LA PROPUESTA PRINCIPAL

Reescribe el hero manteniendo el contenido en inglÃ©s.

Usa como base:

Eyebrow:

â€œCUSTOM CRM DEVELOPMENT FOR B2B TEAMSâ€

H1:

â€œCustom CRM development built around what your business actually needs.â€

Subheadline:

â€œReplace CRM workarounds with the workflows, integrations and dashboards your teams actually use â€” without paying forever for seats, add-ons and features they donâ€™t.â€

Supporting brand statement:

â€œYour CRM should fit your business. Not the other way around.â€

Primary CTA:

â€œRequest My Free CRM Fit Reviewâ€

CTA microcopy:

â€œ30 minutes Â· No obligation Â· Honest build-vs-buy recommendationâ€

MantÃ©n en el hero:

* Senior-led from discovery to delivery.
* Control over data, hosting and roadmap.
* Projects typically start at $10k.

No utilices como claim:

* â€œBuilt in record time.â€
* â€œThe cheapest CRM.â€
* â€œA fraction of the cost.â€
* â€œGuaranteed savings.â€
* â€œDelivered instantly with AI.â€
* Cualquier superlativo o promesa que no se pueda demostrar.

3. ACLARA SERVICIO FRENTE A PRODUCTO

AÃ±ade cerca del principio una explicaciÃ³n inequÃ­voca:

â€œWe donâ€™t sell another generic CRM subscription. We design and build a working CRM for your company.â€

Explica de manera breve:

* Cuore Tech presta consultorÃ­a, diseÃ±o, desarrollo e integraciÃ³n.
* El cliente recibe un sistema funcional adaptado a su negocio.
* No se entrega una configuraciÃ³n genÃ©rica igual para todos.
* Los tÃ©rminos de hosting, cÃ³digo, mantenimiento y ownership se definen por adelantado.
* El cliente mantiene el control de sus datos y su roadmap.

No presentes Cuore Tech como un SaaS con planes mensuales predeterminados.

4. PRESENTA EL ALCANCE COMO MODULAR, SIN PARECER UN SAAS

El feedback de â€œvenderlo por mÃ³dulosâ€ es Ãºtil Ãºnicamente como forma de hacer tangible un servicio abstracto.

Crea una secciÃ³n visual titulada:

â€œBuild only what your business needs.â€

Supporting copy:

â€œStart with the capabilities that solve the highest-value problems. Add more only when the business case is clear.â€

Representa estas capacidades como mÃ³dulos combinables:

* Customer & Account Management.
* Sales Pipeline.
* Operations & Approvals.
* Integrations & Data.
* Reporting & Custom KPIs.
* Practical AI Assistance.

Cada mÃ³dulo debe explicar en una frase el resultado empresarial.

No hagas:

* Plan Basic / Pro / Enterprise.
* Precios independientes por mÃ³dulo.
* Checklists que parezcan una tabla SaaS.
* La impresiÃ³n de que son seis productos prefabricados.

Debe quedar claro que son bloques de alcance adaptables y que la lÃ³gica de negocio conecta todo el sistema.

5. DEMUESTRA VISUALMENTE QUE â€œCUSTOMâ€ SIGNIFICA CUSTOM

El dashboard genÃ©rico actual no demuestra suficientemente la personalizaciÃ³n.

Crea una secciÃ³n muy visual titulada:

â€œDifferent businesses need different CRMs.â€

Supporting copy:

â€œA custom CRM does more than change field names. Its workflows, dashboards, permissions and KPIs reflect how that company actually operates.â€

AÃ±ade tres dashboard mockups claramente diferentes:

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
* Cambiar tambiÃ©n jerarquÃ­a, componentes, visualizaciÃ³n y distribuciÃ³n.
* Cada dashboard debe parecer diseÃ±ado para ese negocio.
* Incorporar un look and feel ligeramente diferente en cada ejemplo, manteniendo la marca Cuore Tech.
* Marcar claramente los tres como â€œIllustrative examplesâ€ para no presentarlos como clientes reales.
* En escritorio se pueden utilizar tabs o un selector accesible.
* En mÃ³vil deben apilarse o utilizar un control accesible que no genere desplazamiento horizontal.
* Todo el contenido relevante debe existir en el HTML; no depender Ãºnicamente de una interacciÃ³n para que Google pueda verlo.
* No usar fotografÃ­as de stock ni pantallazos falsos de clientes.
* Crear visuales de producto limpios mediante HTML/CSS/SVG o assets propios del proyecto.
* Si se generan imÃ¡genes rasterizadas, usar WebP/PNG optimizado, dimensiones explÃ­citas, `alt` descriptivo y `loading="lazy"` cuando estÃ©n below the fold.

6. MEJORA EL COLOR SIN PERDER CREDIBILIDAD B2B

MantÃ©n la base:

* Navy.
* Blue.
* White/off-white.

AÃ±ade color estratÃ©gicamente mediante:

* Pale blue.
* Soft teal.
* Soft violet.
* Un accent cÃ¡lido moderado para alertas o mÃ©tricas.

El color debe concentrarse en:

* Dashboards.
* KPI cards.
* MÃ³dulos.
* Iconos.
* Chips.
* Separadores de secciÃ³n.
* Estados visuales.

No conviertas toda la pÃ¡gina en un arcoÃ­ris.

No uses degradados decorativos excesivos.

El objetivo es que la pÃ¡gina tenga mÃ¡s vida y diferenciaciÃ³n visual, sin parecer una app B2C barata.

7. MEJORA LEGIBILIDAD Y JERARQUÃA

Las capturas muestran que algunos textos secundarios e iconos se perciben demasiado pequeÃ±os.

Requisitos:

* Aumentar el tamaÃ±o del texto descriptivo en cards.
* En fondos navy, usar un gris mÃ¡s luminoso cercano a `#CBD5E1` para el texto importante.
* Mantener una ratio mÃ­nima de contraste de 4.5:1.
* Aumentar los icon containers aproximadamente a 46â€“48 px.
* Hacer que los SVG interiores sean visibles, aproximadamente 22â€“24 px.
* Reforzar los tÃ­tulos de cards.
* Reducir texto repetido antes de reducir tamaÃ±os.
* Los mockups deben poder entenderse en mÃ³vil sin hacer zoom.
* Simplificar los mockups en pantallas pequeÃ±as en lugar de miniaturizar toda la versiÃ³n desktop.

8. CONSERVA LA SECCIÃ“N HONESTA DE BUILD VS. BUY

La secciÃ³n que explica que no todo negocio necesita un CRM a medida es una de las partes mÃ¡s convincentes.

ConsÃ©rvala y hazla mÃ¡s visible.

Debe mantener esta idea:

â€œIf HubSpot, Salesforce or another off-the-shelf CRM is the better answer, weâ€™ll tell you.â€

No ataques a esas marcas.

No digas que un CRM custom es siempre mÃ¡s barato o mejor.

La comparaciÃ³n debe ayudar al comprador a autocalificarse:

Off-the-shelf puede ser adecuado cuando:

* El proceso comercial es estÃ¡ndar.
* Las integraciones son simples.
* Se necesita una soluciÃ³n inmediata.
* Los costes por usuario no son relevantes.

Custom puede ser adecuado cuando:

* El workflow es una ventaja competitiva.
* Existen workarounds constantes.
* Varias Ã¡reas dependen del mismo sistema.
* Hay integraciones complejas.
* Los costes de licencias, add-ons y consultorÃ­a estÃ¡n creciendo.
* Se necesita control sobre datos y roadmap.

9. MANTÃ‰N LA IA COMO ARGUMENTO SECUNDARIO

No conviertas la IA en el claim principal.

Usa una formulaciÃ³n sobria como:

â€œWe use AI-assisted engineering to shorten feedback loops and accelerate delivery where appropriate. Architecture, security, integrations and product decisions remain senior engineering responsibilities.â€

La IA debe comunicar eficiencia y capacidad moderna.

No debe transmitir:

* Vibe coding.
* Software improvisado.
* Menor calidad.
* Entrega milagrosa.
* SustituciÃ³n de la ingenierÃ­a senior.

10. CONSERVA Y PROTEGE EL FUNNEL ACTUAL

No rompas ni reemplaces la integraciÃ³n de Google Forms.

Debe conservarse este endpoint:

```text
https://docs.google.com/forms/d/e/1FAIpQLSe98q9LdffZJThYr-Le6N9Yy1fGnYGBNlsxHgqKSUmL7QFijA/formResponse
```

Mappings obligatorios:

```text
entry.1467467639 â†’ goal
entry.1006754821 â†’ bottleneck/context
entry.2026813663 â†’ email
entry.293749142 â†’ name
```

Conservar:

* EnvÃ­o silencioso mediante POST.
* El usuario permanece en la landing.
* Captura de `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, `gbraid`, `wbraid`, landing page y referrer.
* InclusiÃ³n de la atribuciÃ³n dentro del campo de contexto enviado a Google Forms.
* ProtecciÃ³n contra doble envÃ­o.
* Estado â€œSendingâ€¦â€.
* Mensaje de Ã©xito en inglÃ©s.
* ValidaciÃ³n nativa del navegador.
* `type="email"`.
* No aÃ±adir `novalidate`.

Regla crÃ­tica:

* Un clic en CTA es engagement, no una conversiÃ³n.
* No ejecutar `sendConversion()` desde ningÃºn CTA.
* Ejecutar `generate_lead` y la conversiÃ³n de Google Ads solamente despuÃ©s del envÃ­o del formulario.
* No contabilizar `mailto:` como conversiÃ³n principal.
* Mantener preparados `ga4Id`, `adsConversionId` y `adsConversionLabel`.

11. NO AÃ‘ADAS FRICCIÃ“N INNECESARIA AL FORMULARIO

MantÃ©n aproximadamente estos datos:

* Primary goal.
* Current setup and biggest bottleneck.
* Company website dentro del contexto.
* Desired timeline dentro del contexto.
* Work email.
* Name.

No aÃ±adas por ahora:

* TelÃ©fono obligatorio.
* DirecciÃ³n.
* PaÃ­s.
* Cargo.
* Presupuesto mediante un nuevo campo.
* Formularios multipaso complejos.

El precio mÃ­nimo visible de $10k ya realiza parte de la cualificaciÃ³n.

12. SEO Y GOOGLE ADS

MantÃ©n una Ãºnica etiqueta H1.

El H1 debe contener â€œCustom CRM developmentâ€.

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

El primer viewport debe mantener una relaciÃ³n directa con anuncios orientados a:

* Custom CRM development.
* Custom CRM development company.
* CRM development services.
* CRM replacement.
* CRM integrations.

No cambies el objetivo principal de la pÃ¡gina hacia restaurantes, retail o travel. Los dashboards son ejemplos visuales de personalizaciÃ³n, no nuevos mercados prioritarios.

13. RENDIMIENTO Y ACCESIBILIDAD

* No introduzcas React, Vue ni otro framework.
* MantÃ©n la soluciÃ³n en HTML, CSS y JavaScript estÃ¡tico.
* No aÃ±adas dependencias pesadas.
* Evita librerÃ­as de sliders.
* Usa progressive enhancement.
* Respeta `prefers-reduced-motion`.
* MantÃ©n navegaciÃ³n mediante teclado.
* Tabs y accordions deben tener estados ARIA correctos.
* No sacrifiques Core Web Vitals por imÃ¡genes decorativas.
* AÃ±ade `width` y `height` a imÃ¡genes.
* Lazy-load Ãºnicamente imÃ¡genes below the fold.
* No lazy-load el contenido principal del hero.

14. VALIDACIÃ“N OBLIGATORIA

Antes de terminar:

* Ejecuta `node --check` sobre JavaScript.
* Valida JSON-LD.
* Comprueba que solo existe un H1.
* Comprueba todas las anclas.
* Comprueba que no existen IDs duplicados.
* Comprueba el balance de llaves CSS.
* Sirve la web mediante HTTP local.
* Genera capturas completas en 390 Ã— 844, 768 Ã— 1024 y 1440 Ã— 1000.
* Revisa visualmente todas las capturas.
* Verifica que no existe scroll horizontal en ningÃºn viewport.
* Comprueba que el menÃº mÃ³vil funciona.
* Comprueba tabs/accordions mediante teclado.
* Intercepta o simula la peticiÃ³n a Google Forms para no contaminar respuestas reales.
* Confirma que el payload contiene los cuatro `entry.*` correctos y la atribuciÃ³n.
* Confirma que pulsar un CTA no dispara conversiÃ³n.
* Confirma que un submit satisfactorio dispara una sola conversiÃ³n.
* Comprueba la pÃ¡gina de privacidad y todos los enlaces.
* Si Lighthouse estÃ¡ disponible, intenta superar 90 en Performance, Accessibility, Best Practices y SEO, pero no inventes resultados si la herramienta no puede ejecutarse.

15. ENTREGA FINAL

Implementa los cambios directamente.

No dejes contenido placeholder visible.

No me pidas confirmaciÃ³n durante el trabajo.

Crea `IMPLEMENTATION-REPORT.md` con:

* Archivos modificados.
* Cambios realizados.
* Feedback aceptado.
* Feedback rechazado y motivo.
* Copy final del hero.
* ExplicaciÃ³n de los tres dashboards.
* Resultado de las pruebas.
* Problemas pendientes reales.
* Cualquier elemento que requiera posteriormente informaciÃ³n verificable del fundador, clientes o contratos.

No declares la landing lista para Google Ads si los IDs reales de GA4 y Google Ads siguen vacÃ­os. En ese caso, indica claramente que el diseÃ±o y el funnel estÃ¡n preparados, pero que la mediciÃ³n de producciÃ³n permanece pendiente.
