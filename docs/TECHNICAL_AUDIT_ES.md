# Golden Greens Spatial Product System
## Informe de auditoría técnica

**Fecha de evaluación:** 24 de noviembre de 2026  
**Repositorio:** [VitoOG/golden-greens-spatial-system](https://github.com/VitoOG/golden-greens-spatial-system)  
**Rama y revisión examinadas:** `main` — `863aea61414834a82e891331ef11ef4bc3bc5c9a`  
**Etapa del producto:** MVP 0.1  
**Tipo de evaluación:** revisión técnica y arquitectónica del repositorio

> **Conclusión general:** una plataforma inicial prometedora para la configuración espacial de productos e infraestructuras CEA. Su alcance supera el de un visor 3D estático de invernaderos, pero todavía no es una herramienta de ingeniería lista para producción, un sistema CAD/CAE validado, un sistema de compras ni un entorno de diseño preparado para fabricación.

---

## 1. Evaluación ejecutiva

El proyecto establece un catálogo paramétrico de productos y un configurador espacial basado en navegador para la Agricultura en Ambiente Controlado (CEA). Su valor actual reside en combinar un catálogo de familias de productos, generación configurable de escenas, indicadores de cálculo preliminares y exportaciones portátiles.

La mejor descripción del producto es **una capa inicial de ingeniería espacial y configuración de productos**: permite comunicar conceptos de producto, apoyar conversaciones preliminares de configuración y proporcionar una referencia visual común para la coordinación temprana de ingeniería.

El límite de madurez debe mantenerse explícito: la configuración visual y paramétrica está implementada; la verificación de ingeniería, la definición para fabricación y la aprobación de diseños específicos de proyecto no lo están.

El potencial estratégico se evalúa en **8/10**. Esta puntuación expresa una valoración sobre la dirección y el posible papel del producto, no su grado de preparación para producción.

## 2. Alcance y evidencias

La revisión abarcó la documentación del repositorio, el código de la aplicación, los datos de productos, los esquemas, los scripts de validación y pruebas, los recursos CAD iniciales y el flujo de GitHub Actions. Se examinaron, entre otras, las siguientes áreas:

- Catálogos de productos y componentes: `src/catalog.js`, `src/catalog.es.js`, `data/product-catalog.json` y `data/components.json`.
- Generación de escenas, interacción del navegador y cálculos: `src/scene.js`, `src/main.js` y el código de renderizado relacionado.
- Contratos de datos y documentación de ingeniería: `schemas/` y `docs/`.
- Validación y pruebas: `scripts/validate_catalog.py`, `scripts/test_calculation_kernel.mjs` y `scripts/test_spanish_localization.mjs`.
- Fuentes de intercambio CAD: `openscad/`, `freecad/` y `assets/obj/`.
- Flujo de despliegue: `.github/workflows/pages.yml`.

### Evidencia actual de CI

La última ejecución del flujo asociada a la revisión examinada terminó correctamente el 24 de noviembre de 2026:

- [Ejecución de GitHub Actions 45355501369](https://github.com/VitoOG/golden-greens-spatial-system/actions/runs/45355501369) — **correcta**.
- El trabajo de validación superó el script del catálogo, las pruebas del núcleo de cálculo, las pruebas de localización al español y las comprobaciones del punto de entrada de GitHub Pages.
- El trabajo de despliegue completó la publicación en GitHub Pages.

Esto confirma que las comprobaciones actualmente definidas en el flujo pasaron para la revisión examinada. No demuestra la corrección completa del navegador/WebGL, la ejecución correcta en CAD, la validez de ingeniería ni la preparación para fabricación.

**No verificado en esta revisión:** pruebas interactivas en un navegador de destino, ejecución de la macro de FreeCAD dentro de FreeCAD, cálculos de ingeniería específicos de un proyecto y validación física o de fabricación. El documento de estado del proyecto registra comprobaciones anteriores con Trimesh y OpenSCAD; dichas comprobaciones no se vuelven a ejecutar en el flujo actual de Pages.

## 3. Capacidades presentes en MVP 0.1

El repositorio contiene actualmente 11 familias de productos: desde sistemas nursery y vegetarium hasta growboxes, growrooms, sistemas multicámara, instalaciones en contenedores, invernaderos y un campus de producción integrado.

Capacidades implementadas:

- Escena WebGL interactiva con órbita, desplazamiento, zoom, selección de objetos y controles de visibilidad de capas.
- Edición de parámetros para dimensiones, número de cámaras y unidades, niveles de estanterías, anchura de las unidades de cultivo y entradas de cálculo preliminar.
- Geometría conceptual generada proceduralmente para envolventes estructurales, estanterías, bancales, representaciones de luminarias LED, depósitos, equipos de mezcla y bombeo, riego, climatización, armarios de automatización y zonas del campus.
- Indicadores preliminares de superficie de suelo, volumen bruto, superficie estimada de cultivo, carga y energía eléctrica LED, caudal de aire basado en ACH y cargas auxiliares nominales conocidas.
- Exportación desde el navegador de un pasaporte de configuración/ingeniería JSON, una lista de materiales CSV (BOM) y geometría de escena OBJ/MTL.
- Fuentes de componentes OpenSCAD y una macro inicial de FreeCAD para inspección y modelado posterior.

La aplicación se entrega como un proyecto estático de navegador. El renderizado y los cálculos se ejecutan en el cliente; no requiere un backend de aplicación, base de datos, API de servidor ni runtime de gestor de paquetes.

## 4. Evaluación de la arquitectura

El MVP utiliza una estructura razonable y con pocas dependencias:

| Capa | Responsabilidad actual | Evaluación |
|---|---|---|
| Datos de productos y componentes | Familias de productos, valores iniciales y definiciones reutilizables | Implementada, con representaciones duplicadas |
| Estado de configuración | Dimensiones seleccionadas y supuestos operativos | Implementado a nivel de prototipo |
| Generación espacial | Objetos y mallas de escena procedurales | Implementada para distribuciones conceptuales |
| Núcleo de cálculo | Indicadores derivados de la geometría y estimaciones iniciales | Implementado; alcance de ingeniería limitado |
| Presentación en navegador | Renderizado WebGL, selección, cámara y capas | Implementada; E2E en navegador no verificado |
| Exportación | JSON, CSV, OBJ/MTL | Implementada para intercambio preliminar |
| Enlace con CAD | Recursos iniciales OpenSCAD y FreeCAD | Parcial; faltan validación de runtime y de geometría |

La decisión de mantener la aplicación estática y orientada al navegador es adecuada para esta etapa. Simplifica el despliegue, hace portátil el configurador y evita introducir infraestructura backend antes de que exista una necesidad demostrada.

La separación entre generación de escenas y lógica de cálculo también es acertada. El núcleo de cálculo puede evolucionar hacia módulos de ingeniería probados por separado sin convertir WebGL en responsable de las decisiones de ingeniería.

## 5. Hallazgos y limitaciones técnicas

### Hallazgo F-01 — Los datos de producto mantienen más de una representación
**Prioridad: P0 — resolver antes de ampliar el catálogo**

La aplicación en runtime importa las definiciones de productos y componentes desde `src/catalog.js`. El script de validación Python lee los datos de productos y componentes desde `data/product-catalog.json` y `data/components.json`.

La documentación de arquitectura identifica ambas ubicaciones como fuentes de los mismos contextos funcionales, pero el flujo actual no ejecuta una prueba de paridad que demuestre que los datos JavaScript utilizados en runtime y los datos JSON siguen siendo equivalentes.

Esto constituye un **riesgo de integridad de datos**, no una prueba de que los registros actuales ya sean diferentes. Las futuras modificaciones pueden actualizar una representación y dejar otra sin cambios.

**Recomendación:** establecer una única fuente canónica para cada dominio de datos. Se recomienda utilizar JSON versionado como catálogo canónico y generar el módulo de runtime de forma determinista, o cargar directamente el JSON en el navegador. Añadir pruebas automáticas de paridad y de esquema durante la migración. Aplicar la misma regla a la biblioteca de componentes.

### Hallazgo F-02 — Existen archivos JSON Schema, pero el CI actual no ejecuta su validación
**Prioridad: P1 — corregir la afirmación de verificación y automatizar la comprobación**

El repositorio incluye esquemas para productos y componentes. Sin embargo, la implementación actual de `scripts/validate_catalog.py` realiza comprobaciones personalizadas de campos y no carga ni ejecuta los archivos JSON Schema. El flujo actual de GitHub Actions invoca ese script Python, pero no instala ni llama a un validador JSON Schema.

El documento `docs/PROJECT_STATUS.md` registra “JSON Schema — PASS”. Tal afirmación no se reproduce mediante el flujo actual tal como está escrito. La evidencia disponible respalda una **validación personalizada del catálogo**, no una validación automatizada de conformidad con JSON Schema.

**Recomendación:** añadir una etapa reproducible de validación de esquemas para los registros de productos y componentes, fijar la versión de la dependencia del validador, incorporar casos de prueba negativos y distinguir la validación de esquema de las comprobaciones semánticas personalizadas en el informe de estado.

### Hallazgo F-03 — Los resultados de cálculo son indicadores preliminares, no cálculos de ingeniería
**Prioridad: P0 — mantener este límite de madurez en el producto y en su uso comercial**

El núcleo actual calcula indicadores iniciales útiles, entre ellos:

- Superficie de suelo y volumen bruto a partir de las dimensiones configuradas.
- Superficie estimada de cultivo según los supuestos de distribución específicos del producto.
- Potencia LED estimada a partir de la superficie de cultivo, el PPFD objetivo y el PPE.
- Energía LED diaria a partir de la potencia estimada y del fotoperiodo.
- Caudal de aire como volumen bruto multiplicado por los cambios de aire por hora (ACH).
- Total de cargas auxiliares nominales conocidas a partir de valores de potencia indicativos de los componentes.

Estas fórmulas son útiles para comparaciones iniciales, pero no constituyen un dimensionamiento completo del sistema. El modelo actual no determina uniformidad PPFD, pérdidas ópticas, distribución de luminarias, balance térmico, capacidad HVAC, psicrometría, transpiración del cultivo, deshumidificación, balance de agua, pérdidas hidráulicas, punto de trabajo/NPSH de bombas, protecciones y dimensionamiento de cables eléctricos, capacidad estructural, cimentaciones, seguridad contra incendios ni cumplimiento de normativa de edificación.

El indicador de “carga conocida” no debe interpretarse como la carga eléctrica total de una instalación: combina una estimación LED con un conjunto limitado de supuestos de potencia auxiliar y excluye sistemas principales que aún no están calculados.

En el modelo de campus, varias dimensiones de zonas y los cálculos derivados de superficie/volumen son valores de demostración fijos. Cambiar la envolvente del terreno no genera automáticamente un plano de implantación completamente actualizado y validado. La propia aplicación advierte que las zonas del campus pueden superar los límites de terrenos introducidos con dimensiones menores.

**Recomendación:** mantener el núcleo actual etiquetado explícitamente como preliminar. Desarrollar módulos deterministas separados para iluminación, térmica/HVAC, humedad, hidráulica, ingeniería eléctrica y entradas estructurales. Cada módulo debe definir unidades, validación de entradas, versión de ecuaciones, hipótesis, incertidumbre, casos de prueba y requisitos de evidencia.

### Hallazgo F-04 — La geometría espacial es conceptual, no un ensamblaje CAD basado en restricciones
**Prioridad: P1 — necesario para una colocación de nivel ingeniería**

La escena se genera principalmente mediante cajas, cilindros y ensamblajes simplificados procedurales. Esto funciona bien para la comunicación visual y las envolventes configurables de producto.

La implementación actual no ofrece un modelo completo de restricciones de ensamblaje, editor de colocación de nivel ingeniería, detección de colisiones, gestión de tolerancias, definición de uniones, detalles de conexiones estructurales ni geometría de fabricación. El movimiento de cámara y la selección de objetos no deben confundirse con la colocación de componentes ni con la resolución de restricciones de ingeniería.

Deben mantenerse tres niveles distintos de madurez geométrica:

1. **Geometría visual** — comunica la distribución y el concepto del producto.
2. **Geometría paramétrica de ingeniería** — restringe dimensiones, espacios libres, interfaces y colocación de componentes.
3. **Geometría de fabricación** — define piezas, uniones, tolerancias, materiales y detalles de fabricación validados.

El MVP actual se encuentra principalmente en el nivel 1, con determinados comportamientos controlados por parámetros.

**Recomendación:** introducir progresivamente capacidades de colocación y restricciones: coordenadas e identidad espacial, reglas de rejilla/snap, comprobaciones de colisión, espacios mínimos de servicio, acceso para mantenimiento y envolventes verificadas de equipos.

### Hallazgo F-05 — La BOM CSV es una plantilla preliminar, no una especificación de compras
**Prioridad: P1 — antes de flujos de oferta o adquisición**

La exportación CSV proporciona una lista inicial útil de categorías genéricas de sistemas y valores indicativos. Todavía no representa una lista de materiales completa y trazable con números de pieza de proveedores, cantidades verificadas, alternativas, precios, plazos de entrega, referencias a fichas técnicas, estado de revisión y reglas de adquisición específicas del proyecto.

**Recomendación:** evolucionar la BOM desde una exportación genérica hacia una estructura de producto trazable. Cada elemento debe referenciar una definición de componente y, cuando corresponda, un modelo exacto de proveedor, regla de cantidad, unidad, evidencia de origen, base de precio y restricciones de sustitución.

### Hallazgo F-06 — La transferencia a CAD es útil para exploración, pero no está liberada para fabricación
**Prioridad: P1 — validar antes de depender de los resultados CAD posteriores**

La exportación OBJ/MTL ofrece una vía práctica de intercambio visual. Los recursos iniciales de OpenSCAD y FreeCAD crean un puente hacia herramientas externas de modelado.

El propio repositorio advierte que los ensamblajes conceptuales de OpenSCAD pueden contener sólidos que se intersectan y generar geometría STL no-manifold. La macro de FreeCAD está documentada como no probada en runtime dentro del entorno de compilación; solo se registran comprobaciones a nivel de código fuente. Un flujo JavaScript/Pages correcto no verifica la ejecución de la macro de FreeCAD ni la integridad de un archivo STEP exportado.

**Recomendación:** definir un procedimiento de verificación CAD con casos de prueba representativos. Abrir los archivos generados en las herramientas de destino, inspeccionar dimensiones y jerarquía de objetos, comprobar la validez de los sólidos, verificar unidades y sistemas de coordenadas y registrar el resultado. No liberar las salidas conceptuales STL/OBJ/STEP actuales como datos de fabricación sin una validación independiente.

### Hallazgo F-07 — El estado de verificación del proyecto necesita mayor actualización y reproducibilidad
**Prioridad: P2 — mejorar la gestión de evidencias de ingeniería**

El documento de estado del proyecto está fechado el 17 de noviembre de 2026, mientras que la revisión del repositorio y el último flujo correcto examinados corresponden al 24 de noviembre de 2026. Además, algunas comprobaciones descritas en el documento de estado no forman parte del flujo actual de GitHub Actions.

**Recomendación:** actualizar el registro de estado en cada versión significativa. Para cada comprobación, indicar si es una condición automática de CI, una prueba local reproducible, una inspección manual con una herramienta o un elemento no verificado. Registrar la versión de la herramienta, el entorno, la entrada de prueba y el resultado de las comprobaciones que no forman parte de CI.

## 6. Matriz de madurez

| Área | Estado actual | Evaluación |
|---|---|---|
| Visualización 3D en navegador | Implementada | Adecuada para demostración MVP; E2E en navegador pendiente de verificar |
| Configuración basada en parámetros | Parcial | Los parámetros de producto reconstruyen las distribuciones; no existe editor general de colocación/restricciones |
| Catálogo de productos | Implementado | Las representaciones duplicadas generan riesgo de divergencia |
| Núcleo de cálculo | Preliminar | Indicadores útiles; no son cálculos de diseño |
| BOM | Exportación CSV | No apta para compras |
| Integración CAD | OBJ/MTL, OpenSCAD y base de FreeCAD | Parcial; runtime y validación de sólidos incompletos |
| Validación de ingeniería | No establecida | No hay evidencia aprobada de diseño específico de proyecto |
| Digital Twin / OT | En hoja de ruta | No implementado como integración operativa |

## 7. Uso y posicionamiento comercial

El MVP puede apoyar las siguientes actividades siempre que se indique claramente su nivel de madurez:

- Presentación de familias de productos y explicación visual.
- Configuración preliminar con clientes y discusión de opciones.
- Ingeniería comercial temprana y comparación de conceptos.
- Alineación visual del alcance para propuestas.
- Coordinación espacial inicial de zonas de cultivo, agua, climatización, automatización, laboratorio y logística.
- Exportación de configuraciones preliminares para revisión de ingeniería posterior.

Todavía no debe comercializarse ni utilizarse como una herramienta que produzca especificaciones de ingeniería aprobadas, selección final de equipos, documentación de construcción, BOM listas para compras, cálculos estructurales o MEP, ni archivos liberados para fabricación.

La dirección comercial más sólida no es simplemente la “visualización 3D de invernaderos”. Es una interfaz configurable para comunicar conceptos completos de instalaciones CEA, incluidas las áreas de producción y sus infraestructuras de soporte.

## 8. Secuencia de desarrollo recomendada

### P0 — Integridad de datos y contratos explícitos
- Elegir un único catálogo canónico de productos y una única biblioteca canónica de componentes.
- Añadir pruebas de paridad o generación determinista del catálogo.
- Ejecutar la validación JSON Schema en CI.
- Versionar los esquemas de configuración y exportación.
- Separar las identidades de Familia de Producto, Variante de Producto, Configuración de Proyecto, Definición de Componente e Instancia colocada.
- Definir unidades y procedencia de los valores relevantes para ingeniería.

### P1 — Ingeniería espacial
- Añadir un editor de colocación con coordenadas explícitas.
- Incorporar rejilla/snap y restricciones de colocación.
- Añadir comprobaciones de colisión y espacios de servicio.
- Utilizar envolventes y puntos de conexión de componentes verificados.
- Hacer que las distribuciones del campus respondan de forma predecible a los cambios de los límites del terreno.

### P2 — Datos de ingeniería respaldados por evidencias
- Crear un registro de equipos de proveedores con referencias exactas de fabricante/modelo.
- Almacenar revisión de ficha técnica, valores nominales, límites operativos, dimensiones, interfaces y procedencia de las fuentes.
- Generar una BOM trazable con cantidades, alternativas y estado comercial claro.
- Añadir módulos de cálculo separados con vectores de prueba, incertidumbre e informes auditables.
- Establecer procedimientos repetibles de validación OBJ/STEP/FreeCAD.

### P3 — Integración de sistemas
- Mantener Spatial Product System como capa espacial y de configuración de productos.
- Integrarlo con ERICA OS mediante contratos de datos versionados para conocimiento de proyectos, registros de ingeniería e historial de configuración.
- Integrarlo con CEA Runtime mediante identidad explícita de activos, mapeo PLC/I/O, topología SCADA y contratos de telemetría.
- Mantener la autoridad de control físico en controladores deterministas y sistemas de seguridad independientes. La IA puede apoyar el análisis y la revisión de configuraciones, pero no debe controlar directamente procesos críticos para la seguridad.

## 9. Calificaciones indicativas

Estas calificaciones representan un juicio cualitativo de ingeniería, no un rendimiento medido ni una certificación:

| Criterio | Calificación |
|---|---:|
| Concepto de producto | 9/10 |
| Arquitectura del MVP | 8/10 |
| Implementación del MVP | 7/10 |
| Validez de los cálculos de ingeniería | 3/10 |
| Preparación CAD | 3/10 |
| Potencial comercial | 9/10 |
| Preparación para producción | 2/10 |
| Potencial estratégico | **8/10** |

La puntuación de potencial estratégico no debe interpretarse como una indicación de que el sistema actual está preparado para producción, construcción, compras o certificación.

## 10. Conclusión arquitectónica

Se recomienda mantener Spatial Product System como un componente de producto independiente de Golden Greens. No debe fusionarse con ERICA OS en un monolito ni trasladar todo el procesamiento geométrico a un servidor sin una necesidad demostrada.

Deben mantenerse límites claros entre sistemas:

- **Spatial Product System** — familias de productos, geometría configurable, identidad espacial y configuración visual.
- **ERICA OS** — conocimiento de proyectos, registros de ingeniería, análisis asistido por IA y coordinación de proyectos e infraestructura.
- **CEA Runtime** — sensores, control determinista, ejecución PLC/edge, actuadores, alarmas y funciones de seguridad independientes.

La conexión entre estos dominios debe realizarse mediante contratos de datos versionados y validados.

**Evaluación final:** el proyecto es un activo inicial creíble y comercialmente útil para Golden Greens, siempre que se posicione como plataforma de visualización y configuración preliminar. El siguiente hito significativo no es reescribir el backend. Es cerrar las brechas de integridad de datos y verificación, definir criterios de aceptación medibles para MVP 0.2 e introducir progresivamente restricciones y cálculos de ingeniería respaldados por evidencias.

---

## Referencias

- [README del repositorio](../README.md)
- [Estado del proyecto](PROJECT_STATUS.md)
- [Arquitectura del sistema](ARCHITECTURE.md)
- [Método de ingeniería y límites de cálculo](ENGINEERING_METHOD.md)
- [Modelo de datos de producto](PRODUCT_DATA_MODEL.md)
- [Flujo de trabajo CAD](CAD_WORKFLOW.md)
- [Hoja de ruta](ROADMAP.md)
- [Catálogo de productos de runtime](../src/catalog.js)
- [Catálogo de productos JSON](../data/product-catalog.json)
- [Esquema de producto](../schemas/product.schema.json)
- [Script de validación del catálogo](../scripts/validate_catalog.py)
- [Pruebas del núcleo de cálculo y de escenas](../scripts/test_calculation_kernel.mjs)
- [Flujo CI actual](../.github/workflows/pages.yml)
- [Commit examinado](https://github.com/VitoOG/golden-greens-spatial-system/commit/863aea61414834a82e891331ef11ef4bc3bc5c9a)
- [Ejecución correcta del flujo](https://github.com/VitoOG/golden-greens-spatial-system/actions/runs/45355501369)
