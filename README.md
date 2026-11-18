# StockFácil

Sistema web CRUD para la gestión y el control de inventario de un negocio, desarrollado con tecnologías web estándar y persistencia local en el navegador mediante `localStorage`. Proyecto realizado para el seminario **"Gestión de Software Ágil asistido por IA"**.

---

## Tecnologías utilizadas

* **HTML5:** Estructura semántica de la aplicación, formulario de registro/edición, tabla de inventario y modal de confirmación personalizado.
* **CSS3:** Diseño responsivo mediante CSS Grid y Flexbox, variables CSS (`:root`) y estilos para alertas visuales y ventana modal.
* **JavaScript (ES6+ puro / Vanilla JS):** Manipulación segura del DOM (`textContent`, `createElement`), validación de formularios, búsqueda en tiempo real y cálculo de métricas sin librerías ni frameworks externos.
* **Web Storage API (`localStorage`):** Persistencia de datos en el navegador bajo la clave `stockfacil_productos` con manejo de errores ante datos corruptos.

---

## Instrucciones para ejecutar

1. Descarga o clona la carpeta del proyecto en tu computadora asegurándote de mantener los archivos `index.html`, `styles.css` y `app.js` en el mismo directorio.
2. Haz doble clic sobre el archivo `index.html` para abrirlo directamente en tu navegador web preferido (Chrome, Edge, Firefox o Safari), o arrástralo hacia una pestaña abierta.
3. No requiere instalación de dependencias, compilación ni servidor web local.

---

## Capturas de pantalla

> **Nota:** Asegúrate de que la carpeta `capturas/` contenga los 7 archivos PNG generados en el paso anterior antes de publicar el repositorio.

### 1. Estado inicial (Lista vacía)
![Vista inicial del inventario vacío](capturas/01-lista-vacia.png)
Muestra la interfaz principal al iniciar la aplicación sin productos registrados, con el resumen en cero y el mensaje *"Aún no hay productos en el inventario"*.

### 2. Validación de campos
![Formulario con mensajes de error de validación](capturas/02-validacion.png)
Muestra la validación personalizada al intentar enviar el formulario vacío o con datos inválidos, resaltando cada campo en rojo con su mensaje de error específico.

### 3. Creación de producto
![Formulario diligenciado para crear un producto](capturas/03-crear.png)
Muestra el formulario completado con los datos de un producto (nombre, SKU, categoría, stock, stock mínimo, precio unitario, proveedor, fecha de ingreso y notas) listo para guardarse.

### 4. Inventario con datos y alerta de stock bajo
![Tabla de inventario con productos registrados y alerta de stock bajo](capturas/04-lista-con-datos.png)
Muestra la tabla poblada con productos de ejemplo, el resumen superior calculado (total de productos, unidades en stock y valor total en moneda) y la fila resaltada en rojo con la etiqueta **"Stock bajo"** cuando la cantidad es menor o igual al stock mínimo.

### 5. Búsqueda en tiempo real
![Filtrado en tiempo real del inventario](capturas/05-busqueda.png)
Muestra el filtrado instantáneo de la tabla al escribir en el buscador por nombre, código (SKU) o categoría.

### 6. Edición de producto
![Formulario en modo edición de producto](capturas/06-editar.png)
Muestra el formulario cargado con los datos de un producto existente al pulsar **Editar**, cambiando el botón principal a **"Guardar cambios"** y habilitando el botón **"Cancelar"**.

### 7. Confirmación de eliminación
![Modal de confirmación para eliminar producto](capturas/07-eliminar.png)
Muestra el modal propio de confirmación al pulsar **Eliminar**, indicando el nombre y el código (SKU) del producto antes de borrarlo definitivamente.

---

## Estructura de archivos

```text
StockFácil/
├── index.html          # Estructura HTML del formulario, tabla de inventario y modal de eliminación
├── styles.css          # Estilos visuales, cuadrícula responsiva y diseño del modal
├── app.js              # Lógica CRUD separada en 4 secciones: Datos, Validación, Renderizado y Eventos
├── README.md           # Documentación del proyecto y registro de prompts
└── capturas/           # Evidencias visuales de cada funcionalidad
    ├── 01-lista-vacia.png
    ├── 02-validacion.png
    ├── 03-crear.png
    ├── 04-lista-con-datos.png
    ├── 05-busqueda.png
    ├── 06-editar.png
    └── 07-eliminar.png
```

---

## Prompts utilizados

A continuación se documentan en orden cronológico todos los prompts empleados durante el desarrollo incremental y asistido por IA de **StockFácil**:

### Prompt 1 — Estructura base y capa de datos
> ```text
> Eres un desarrollador web senior que enseña a estudiantes de ingeniería de software.
> 
> <task>
> Crea una aplicación web CRUD llamada "StockFácil" para controlar el inventario de un negocio.
> </task>
> 
> <constraints>
> - Solo HTML, CSS y JavaScript puro, sin frameworks ni servidor. Persistencia con localStorage.
> - Tres archivos, con estos nombres exactos en minúscula: index.html, styles.css, app.js. index.html debe cargar "app.js" tal cual.
> - Campos del producto: nombre, código (SKU), categoría, cantidad en stock, stock mínimo, precio unitario, proveedor, fecha de ingreso, notas.
> - En este paso SOLO crea la estructura: formulario, tabla vacía y capa de datos en app.js (getAll, saveAll). No implementes aún crear, editar ni eliminar.
> - No agregues autenticación, librerías externas ni funciones que no pedí.
> - Comenta el código en español.
> </constraints>
> 
> <output_format>
> Los 3 archivos completos, cada uno en su bloque con el nombre arriba. Al final, 3 líneas de cómo abrirlo.
> </output_format>
> ```
* **Qué pedí:** Crear los tres archivos base (`index.html`, `styles.css`, `app.js`) con el formulario de 9 campos, la tabla vacía y únicamente las funciones de lectura/escritura inicial en `localStorage` (`getAll`, `saveAll`).
* **Para qué:** Establecer una arquitectura limpia y desacoplada antes de implementar las operaciones CRUD una por una.

---

### Prompt 2 — Implementación de Create (Crear)
> ```text
> Sobre el proyecto anterior, implementa SOLO la acción Create (crear) en app.js.
> 
> <constraints>
> - Valida al enviar: nombre y código no vacíos, código único (no se repite entre productos), cantidad y stock mínimo enteros >= 0, precio > 0, fecha obligatoria. Errores debajo de cada campo, sin alert().
> - Genera un id único por producto, guarda en localStorage y limpia el formulario.
> - No toques las demás funciones.
> </constraints>
> 
> <output_format>
> Solo el código nuevo o modificado y una explicación de 5 líneas de la validación.
> </output_format>
> ```
* **Qué pedí:** Programar el registro de nuevos productos con validación personalizada debajo de cada campo, unicidad de SKU, generación de ID único y guardado en `localStorage`.
* **Para qué:** Garantizar la integridad de los datos ingresados sin depender de alertas nativas del navegador ni permitir códigos duplicados o valores numéricos inválidos.

---

### Prompt 3 — Implementación de Read (Leer)
> ```text
> Implementa SOLO la acción Read (leer) en app.js.
> 
> <constraints>
> - Renderiza los productos en la tabla al cargar y tras cada cambio. Si no hay, muestra "Aún no hay productos en el inventario".
> - Buscador en tiempo real por nombre, código o categoría.
> - Resumen arriba: total de productos, unidades en stock y valor total del inventario (cantidad x precio) con formato de moneda.
> - Marca en rojo las filas con cantidad menor o igual al stock mínimo, con la etiqueta "Stock bajo".
> - Usa textContent, no innerHTML con datos del usuario.
> </constraints>
> 
> <output_format>
> Solo el código nuevo o modificado y 3 líneas de cómo se leen los datos de localStorage.
> </output_format>
> ```
* **Qué pedí:** Renderizar dinámicamente la tabla de inventario usando `textContent`, añadir un buscador en tiempo real, mostrar el resumen estadístico superior y destacar en rojo los productos con stock bajo.
* **Para qué:** Visualizar el estado del inventario de forma segura (previniendo ataques XSS), facilitar la búsqueda y alertar visualmente sobre productos próximos a agotarse.

---

### Prompt 4 — Implementación de Update (Actualizar)
> ```text
> Implementa SOLO la acción Update (actualizar).
> 
> <constraints>
> - Botón "Editar" en cada fila que carga el producto en el mismo formulario.
> - En modo edición, el botón dice "Guardar cambios" y aparece "Cancelar".
> - Al guardar, actualiza por id sin duplicar, reutiliza la misma validación (el código puede repetirse solo consigo mismo) y refresca tabla y resumen.
> - Modifica lo mínimo; no reescribas lo que ya funciona.
> </constraints>
> 
> <output_format>
> Solo el código nuevo o modificado y 3 líneas de cómo se distingue crear de editar.
> </output_format>
> ```
* **Qué pedí:** Agregar el botón "Editar" en cada fila para cargar el producto en el formulario existente, cambiar los botones a "Guardar cambios" y "Cancelar", y actualizar el registro por `id` reutilizando la validación.
* **Para qué:** Permitir modificar productos existentes sin duplicar registros ni duplicar la lógica de validación del formulario.

---

### Prompt 5 — Implementación de Delete (Eliminar)
> ```text
> Implementa SOLO la acción Delete (eliminar).
> 
> <constraints>
> - Botón "Eliminar" en cada fila.
> - Pide confirmación con un modal propio en HTML/CSS (no confirm()), mostrando el nombre y el código del producto.
> - Al confirmar, elimina por id, actualiza localStorage y refresca tabla y resumen.
> - Si se elimina el producto que se está editando, resetea el formulario.
> </constraints>
> 
> <output_format>
> Solo el código nuevo o modificado, con comentarios en español.
> </output_format>
> ```
* **Qué pedí:** Incorporar el botón "Eliminar" por fila junto con una ventana modal personalizada en HTML/CSS que confirme el borrado por `id` y limpie el formulario si el producto eliminado estaba en edición.
* **Para qué:** Evitar eliminaciones accidentales mediante una confirmación clara y mantener sincronizado el estado de la interfaz y de `localStorage`.

---

### Prompt 6 — Revisión y refactorización de `app.js`
> ```text
> Revisa y refactoriza el app.js completo que generaste en esta conversación, con todos los cambios hechos hasta ahora.
> 
> <constraints>
> - Sepáralo en secciones comentadas: Datos (localStorage), Validación, Renderizado, Eventos.
> - Elimina código repetido y usa nombres claros.
> - No cambies el comportamiento ni agregues funciones nuevas.
> - Maneja el caso en que localStorage tenga datos corruptos sin que la app se rompa.
> - Lista al final los problemas que encontraste y qué cambiaste en cada uno.
> </constraints>
> 
> <output_format>
> Primero la lista de problemas, luego el app.js completo refactorizado.
> </output_format>
> ```
* **Qué pedí:** Auditar y reorganizar todo `app.js` en cuatro capas definidas (`Datos`, `Validación`, `Renderizado`, `Eventos`), eliminar código duplicado y blindar la lectura ante datos corruptos en `localStorage`.
* **Para qué:** Mejorar la mantenibilidad, legibilidad y resiliencia del código tras haberlo construido de manera incremental.

---

### Prompt 7 — Generación de capturas de pantalla para el README
> ```text
> Tienes acceso a mi carpeta [RUTA DE TU CARPETA], donde están index.html, styles.css y app.js de StockFácil. Usa el navegador para abrir la app y tomar las capturas del README.
> 
> <constraints>
> - Abre index.html en una pestaña nueva. NO modifiques index.html, styles.css ni app.js; si hay un bug, avísame y detente.
> - Crea la carpeta "capturas" y guarda PNG con estos nombres exactos: 01-lista-vacia, 02-validacion (formulario vacío con errores), 03-crear (formulario lleno), 04-lista-con-datos (al menos 5 productos de ejemplo, uno con stock bajo, y el resumen visible), 05-busqueda, 06-editar, 07-eliminar (modal abierto).
> - Usa productos de ejemplo realistas para el negocio.
> - Pregúntame antes de borrar archivos o hacer algo fuera de esa carpeta.
> - Al terminar, lista: nombre del archivo y qué muestra.
> </constraints>
> ```
* **Qué pedí:** Abrir la aplicación en el navegador para capturar 7 escenarios clave de funcionamiento y guardarlos en la carpeta `capturas/`.
* **Para qué:** Documentar visualmente cada estado y funcionalidad del CRUD en el repositorio del proyecto.

---

### Prompt 8 — Redacción del `README.md`
> ```text
> Redacta el README.md en español para StockFácil, un CRUD de inventario hecho con HTML, CSS y JavaScript (localStorage) con ayuda de IA para el seminario "Gestión de Software Ágil asistido por IA". Guárdalo en [RUTA DE TU CARPETA]\README.md.
> 
> <constraints>
> - Secciones en orden: Nombre del proyecto, Descripción breve, Tecnologías utilizadas, Instrucciones para ejecutar, Capturas de pantalla, Estructura de archivos, Prompts utilizados.
> - En "Capturas de pantalla" incrusta las 7 imágenes de capturas/ con ![descripción](capturas/nombre.png) y una línea de qué muestra cada una. Verifica que existan.
> - En "Prompts utilizados" recorre esta conversación y lista TODOS los prompts que te envié, en orden, copiados textualmente, cada uno con "Qué pedí:" y "Para qué:".
> - Basa la estructura y funcionalidades solo en el código real de la carpeta. No inventes funciones.
> - No modifiques ningún otro archivo.
> </constraints>
> ```
* **Qué pedí:** Redactar la documentación completa en español (`README.md`) con las secciones requeridas, las referencias a las 7 capturas de pantalla y el historial textual de todos los prompts utilizados en el desarrollo.
* **Para qué:** Consolidar la documentación técnica y metodológica del proyecto para el seminario *"Gestión de Software Ágil asistido por IA"*.
#   C R U D  
 