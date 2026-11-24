# Golden Greens Spatial Product System

**MVP 0.1 — catálogo 3D paramétrico y configurador en navegador para productos CEA e infraestructura de instalaciones.**

El proyecto explora una familia configurable de productos que incluye viveros, growboxes, salas de cultivo, sistemas multicámara, instalaciones en contenedores, invernaderos y campus de producción integrados.

> **Límite de madurez:** es un prototipo inicial de visualización y configuración de productos. No es un sistema CAD/CAE terminado, un conjunto de modelos listo para fabricar, un diseño de ingeniería aprobado, una especificación de compra ni un diseño de instalación certificado.

## Aplicación en vivo

- Interfaz en español: https://vitoog.github.io/golden-greens-spatial-system/es/
- Interfaz en ruso: https://vitoog.github.io/golden-greens-spatial-system/

La aplicación es estática y se ejecuta en el navegador. No requiere Go, Node.js, base de datos, API del servidor, CDN ni servicios externos en tiempo de ejecución. La visualización WebGL y los cálculos se ejecutan en el navegador del visitante.

## Capacidades implementadas en el MVP

- 11 familias de productos: vivero, vegetario, growbox, sala de cultivo, sistemas de 3, 9 y 10 cámaras, contenedor 40 HC, hub de 10 contenedores, invernadero y campus integral.
- Escena WebGL interactiva con órbita, desplazamiento, zoom, selección de objetos y controles de visibilidad por capas.
- Edición de dimensiones, cámaras/módulos, estanterías/bancales, niveles y parámetros de cálculo.
- Geometría conceptual generada para bastidores, estanterías, bancales, luminarias LED, depósitos, equipos de mezcla y bombeo, riego, climatización, armarios PLC, equipos Edge/servidor, laboratorio y logística.
- Indicadores preliminares de superficie de suelo, volumen bruto, superficie de cultivo, carga/energía LED estimada y volumen de aire según ACH.
- Exportación desde el navegador de pasaporte de configuración (JSON), lista de materiales (BOM CSV) y escena 3D (OBJ/MTL).
- Fuentes de componentes OpenSCAD, macro inicial para FreeCAD y activos OBJ para flujos posteriores de visualización.

## Alcance de los cálculos y limitaciones

El núcleo de cálculo actual ofrece estimaciones preliminares de superficie de suelo, volumen bruto, superficie de cultivo, potencia y energía LED aproximadas, y caudal de aire según ACH.

No son cálculos de selección de equipos ni de diseño de ingeniería. No modelan uniformidad PPFD, pérdidas ópticas y de drivers, balance térmico, HVAC/psicrometría completa, deshumidificación, balance hídrico del cultivo, pérdidas hidráulicas, punto de funcionamiento/NPSH de bombas, diseño eléctrico, capacidad estructural, cimentaciones, requisitos contra incendios/edificación ni cumplimiento normativo. Los valores de equipos en los perfiles son indicativos y no han sido validados por proveedores.

Antes de comprar, construir u operar cualquier sistema se requiere un diseño de ingeniería independiente, selección de componentes basada en fuentes, revisión normativa aplicable y verificación independiente.

## Ejecución local

Se necesita un servidor HTTP estático local porque los navegadores restringen los módulos JavaScript abiertos directamente mediante `file://`.

En Linux/macOS:

```bash
./run-local.sh
```

Abre `http://127.0.0.1:8000`. Para ejecutar las pruebas:

```bash
python3 scripts/validate_catalog.py
node scripts/test_calculation_kernel.mjs
```

Consulta [README.md](README.md) para la documentación técnica en inglés y [README.ru.md](README.ru.md) para la versión rusa.


## Verificación de la versión española

La comprobación automatizada `node scripts/test_spanish_localization.mjs` valida la ruta `/es/`, los 11 productos, la correspondencia de identificadores y parámetros con el catálogo original, la biblioteca de componentes y los nombres y descripciones de los objetos de la escena 3D.
