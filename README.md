<div align="center">

# 📦 StockFácil

**Sistema web CRUD para la gestión y el control de inventario de un negocio**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![localStorage](https://img.shields.io/badge/localStorage-Web_Storage_API-4c1?style=for-the-badge)

Proyecto realizado para el seminario **"Gestión de Software Ágil asistido por IA"**

</div>

---

## 🔗 Enlace del proyecto

👉 **[PEGA_AQUÍ_EL_TEXTO_DEL_ENLACE](PEGA_AQUÍ_TU_ENLACE)**

---

## 📖 Descripción

StockFácil permite registrar, consultar, editar y eliminar productos de un inventario, con persistencia local en el navegador mediante `localStorage`. No requiere servidor, instalación ni librerías externas.

## ✨ Funcionalidades

| Acción | Descripción |
|--------|-------------|
| **Crear** | Formulario de 9 campos con validación personalizada bajo cada campo y SKU único. |
| **Leer** | Tabla dinámica, buscador en tiempo real (nombre, código o categoría) y resumen con total de productos, unidades y valor del inventario. |
| **Actualizar** | Botón "Editar" por fila que carga el producto en el mismo formulario. |
| **Eliminar** | Modal de confirmación propio, que muestra nombre y código del producto. |
| **Alertas** | Las filas con stock menor o igual al mínimo se resaltan en rojo con la etiqueta **"Stock bajo"**. |

**Campos del producto:** nombre, código (SKU), categoría, cantidad en stock, stock mínimo, precio unitario, proveedor, fecha de ingreso y notas.

---

## 🛠️ Tecnologías utilizadas

* **HTML5:** estructura semántica, formulario de registro/edición, tabla de inventario y modal de confirmación.
* **CSS3:** diseño responsivo con CSS Grid y Flexbox, variables CSS (`:root`) y estilos para alertas y modal.
* **JavaScript (ES6+ / Vanilla JS):** manipulación segura del DOM (`textContent`, `createElement`), validación de formularios, búsqueda en tiempo real y cálculo de métricas.
* **Web Storage API (`localStorage`):** persistencia bajo la clave `stockfacil_productos`, con manejo de errores ante datos corruptos.

---

## 🚀 Instrucciones para ejecutar

1. Descarga o clona el proyecto y mantén `index.html`, `styles.css` y `app.js` en el mismo directorio.
2. Abre `index.html` con doble clic en tu navegador (Chrome, Edge, Firefox o Safari).
3. Listo: no requiere dependencias, compilación ni servidor local.

```bash
git clone <URL_DEL_REPOSITORIO>
cd StockFacil
# Abre index.html en tu navegador
```

---

## 📁 Estructura de archivos

```text
StockFácil/
├── index.html    # Formulario, tabla de inventario y modal de eliminación
├── styles.css    # Estilos, cuadrícula responsiva y diseño del modal
├── app.js        # Lógica CRUD en 4 secciones: Datos, Validación, Renderizado y Eventos
└── README.md     # Documentación del proyecto y registro de prompts
```

---

## 🤖 Prompts utilizados

Registro cronológico de los prompts empleados en el desarrollo incremental asistido por IA. Haz clic en cada uno para desplegarlo.

<details>
<summary><b>Prompt 1 — Estructura base y capa de datos</b></summary>

```text
Eres un desarrollador web senior que enseña a estudiantes de ingeniería de software.

<task>
Crea una aplicación web CRUD llamada "StockFácil" para controlar el inventario de un negocio.
</task>

<constraints>
- Solo HTML, CSS y JavaScript puro, sin frameworks ni servidor. Persistencia con localStorage.
- Tres archivos, con estos nombres exactos en minúscula: index.html, styles.css, app.js. index.html debe cargar "app.js" tal cual.
- Campos del producto: nombre, código (SKU), categoría, cantidad en stock, stock mínimo, precio unitario, proveedor, fecha de ingreso, notas.
- En este paso SOLO crea la estructura: formulario, tabla vacía y capa de datos en app.js (getAll, saveAll). No implementes aún crear, editar ni eliminar.
- No agregues autenticación, librerías externas ni funciones que no pedí.
- Comenta el código en español.
</constraints>

<output_format>
Los 3 archivos completos, cada uno en su bloque con el nombre arriba. Al final, 3 líneas de cómo abrirlo.
</output_format>
```

* **Qué pedí:** Crear los tres archivos base (`index.html`, `styles.css`, `app.js`) con el formulario de 9 campos, la tabla vacía y únicamente las funciones de lectura/escritura inicial en `localStorage` (`getAll`, `saveAll`).
* **Para qué:** Establecer una arquitectura limpia y desacoplada antes de implementar las operaciones CRUD una por una.

</details>

<details>
<summary><b>Prompt 2 — Implementación de Create (Crear)</b></summary>

```text
Sobre el proyecto anterior, implementa SOLO la acción Create (crear) en app.js.

<constraints>
- Valida al enviar: nombre y código no vacíos, código único (no se repite entre productos), cantidad y stock mínimo enteros >= 0, precio > 0, fecha obligatoria. Errores debajo de cada campo, sin alert().
- Genera un id único por producto, guarda en localStorage y limpia el formulario.
- No toques las demás funciones.
</constraints>

<output_format>
Solo el código nuevo o modificado y una explicación de 5 líneas de la validación.
</output_format>
```

* **Qué pedí:** Programar el registro de nuevos productos con validación personalizada debajo de cada campo, unicidad de SKU, generación de ID único y guardado en `localStorage`.
* **Para qué:** Garantizar la integridad de los datos sin depender de alertas nativas del navegador ni permitir códigos duplicados o valores numéricos inválidos.

</details>

<details>
<summary><b>Prompt 3 — Implementación de Read (Leer)</b></summary>

```text
Implementa SOLO la acción Read (leer) en app.js.

<constraints>
- Renderiza los productos en la tabla al cargar y tras cada cambio. Si no hay, muestra "Aún no hay productos en el inventario".
- Buscador en tiempo real por nombre, código o categoría.
- Resumen arriba: total de productos, unidades en stock y valor total del inventario (cantidad x precio) con formato de moneda.
- Marca en rojo las filas con cantidad menor o igual al stock mínimo, con la etiqueta "Stock bajo".
- Usa textContent, no innerHTML con datos del usuario.
</constraints>

<output_format>
Solo el código nuevo o modificado y 3 líneas de cómo se leen los datos de localStorage.
</output_format>
```

* **Qué pedí:** Renderizar dinámicamente la tabla de inventario usando `textContent`, añadir un buscador en tiempo real, mostrar el resumen estadístico superior y destacar en rojo los productos con stock bajo.
* **Para qué:** Visualizar el inventario de forma segura (previniendo XSS), facilitar la búsqueda y alertar sobre productos próximos a agotarse.

</details>

<details>
<summary><b>Prompt 4 — Implementación de Update (Actualizar)</b></summary>

```text
Implementa SOLO la acción Update (actualizar).

<constraints>
- Botón "Editar" en cada fila que carga el producto en el mismo formulario.
- En modo edición, el botón dice "Guardar cambios" y aparece "Cancelar".
- Al guardar, actualiza por id sin duplicar, reutiliza la misma validación (el código puede repetirse solo consigo mismo) y refresca tabla y resumen.
- Modifica lo mínimo; no reescribas lo que ya funciona.
</constraints>

<output_format>
Solo el código nuevo o modificado y 3 líneas de cómo se distingue crear de editar.
</output_format>
```

* **Qué pedí:** Agregar el botón "Editar" en cada fila para cargar el producto en el formulario existente, cambiar los botones a "Guardar cambios" y "Cancelar", y actualizar el registro por `id` reutilizando la validación.
* **Para qué:** Permitir modificar productos sin duplicar registros ni la lógica de validación.

</details>

<details>
<summary><b>Prompt 5 — Implementación de Delete (Eliminar)</b></summary>

```text
Implementa SOLO la acción Delete (eliminar).

<constraints>
- Botón "Eliminar" en cada fila.
- Pide confirmación con un modal propio en HTML/CSS (no confirm()), mostrando el nombre y el código del producto.
- Al confirmar, elimina por id, actualiza localStorage y refresca tabla y resumen.
- Si se elimina el producto que se está editando, resetea el formulario.
</constraints>

<output_format>
Solo el código nuevo o modificado, con comentarios en español.
</output_format>
```

* **Qué pedí:** Incorporar el botón "Eliminar" por fila junto con un modal personalizado en HTML/CSS que confirme el borrado por `id` y limpie el formulario si el producto eliminado estaba en edición.
* **Para qué:** Evitar eliminaciones accidentales y mantener sincronizados la interfaz y `localStorage`.

</details>

<details>
<summary><b>Prompt 6 — Revisión y refactorización de <code>app.js</code></b></summary>

```text
Revisa y refactoriza el app.js completo que generaste en esta conversación, con todos los cambios hechos hasta ahora.

<constraints>
- Sepáralo en secciones comentadas: Datos (localStorage), Validación, Renderizado, Eventos.
- Elimina código repetido y usa nombres claros.
- No cambies el comportamiento ni agregues funciones nuevas.
- Maneja el caso en que localStorage tenga datos corruptos sin que la app se rompa.
- Lista al final los problemas que encontraste y qué cambiaste en cada uno.
</constraints>

<output_format>
Primero la lista de problemas, luego el app.js completo refactorizado.
</output_format>
```

* **Qué pedí:** Auditar y reorganizar todo `app.js` en cuatro capas (`Datos`, `Validación`, `Renderizado`, `Eventos`), eliminar código duplicado y blindar la lectura ante datos corruptos en `localStorage`.
* **Para qué:** Mejorar la mantenibilidad, legibilidad y resiliencia del código tras construirlo de forma incremental.

</details>

<details>
<summary><b>Prompt 7 — Generación de capturas de pantalla</b></summary>

```text
Tienes acceso a mi carpeta [RUTA DE TU CARPETA], donde están index.html, styles.css y app.js de StockFácil. Usa el navegador para abrir la app y tomar las capturas del README.

<constraints>
- Abre index.html en una pestaña nueva. NO modifiques index.html, styles.css ni app.js; si hay un bug, avísame y detente.
- Crea la carpeta "capturas" y guarda PNG con estos nombres exactos: 01-lista-vacia, 02-validacion (formulario vacío con errores), 03-crear (formulario lleno), 04-lista-con-datos (al menos 5 productos de ejemplo, uno con stock bajo, y el resumen visible), 05-busqueda, 06-editar, 07-eliminar (modal abierto).
- Usa productos de ejemplo realistas para el negocio.
- Pregúntame antes de borrar archivos o hacer algo fuera de esa carpeta.
- Al terminar, lista: nombre del archivo y qué muestra.
</constraints>
```

* **Qué pedí:** Abrir la aplicación en el navegador para capturar 7 escenarios clave de funcionamiento y guardarlos en la carpeta `capturas/`.
* **Para qué:** Documentar visualmente cada estado y funcionalidad del CRUD.

</details>

<details>
<summary><b>Prompt 8 — Redacción del <code>README.md</code></b></summary>

```text
Redacta el README.md en español para StockFácil, un CRUD de inventario hecho con HTML, CSS y JavaScript (localStorage) con ayuda de IA para el seminario "Gestión de Software Ágil asistido por IA". Guárdalo en [RUTA DE TU CARPETA]\README.md.

<constraints>
- Secciones en orden: Nombre del proyecto, Descripción breve, Tecnologías utilizadas, Instrucciones para ejecutar, Capturas de pantalla, Estructura de archivos, Prompts utilizados.
- En "Capturas de pantalla" incrusta las 7 imágenes de capturas/ con ![descripción](capturas/nombre.png) y una línea de qué muestra cada una. Verifica que existan.
- En "Prompts utilizados" recorre esta conversación y lista TODOS los prompts que te envié, en orden, copiados textualmente, cada uno con "Qué pedí:" y "Para qué:".
- Basa la estructura y funcionalidades solo en el código real de la carpeta. No inventes funciones.
- No modifiques ningún otro archivo.
</constraints>
```

* **Qué pedí:** Redactar la documentación completa en español (`README.md`) con las secciones requeridas y el historial textual de todos los prompts utilizados.
* **Para qué:** Consolidar la documentación técnica y metodológica del proyecto para el seminario.

</details>
