/**
 * StockFácil - Lógica principal de la aplicación CRUD de inventario.
 * Arquitectura organizada en 4 capas: Datos, Validación, Renderizado y Eventos.
 */

// ============================================================================
// 1. DATOS (localStorage y estado de la aplicación)
// ============================================================================

const STORAGE_KEY = 'stockfacil_productos';

// Estado global de interfaz para edición y eliminación
let editingProductId = null;
let pendingDeleteId = null;

/**
 * Obtiene todos los productos almacenados en localStorage.
 * Protege la aplicación contra JSON malformado o estructuras corruptas.
 * @returns {Array<Object>} Arreglo válido de productos.
 */
function getAll() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) return [];

    const parsedData = JSON.parse(rawData);

    // Si el contenido guardado no es un arreglo (ej. objeto, número o null), está corrupto
    if (!Array.isArray(parsedData)) {
      console.warn('Datos corruptos detectados en localStorage. Reiniciando almacenamiento.');
      saveAll([]);
      return [];
    }

    // Filtramos solo elementos que sean objetos válidos con las propiedades mínimas requeridas
    return parsedData.filter(
      (item) =>
        item !== null &&
        typeof item === 'object' &&
        typeof item.id === 'string' &&
        typeof item.nombre === 'string' &&
        typeof item.sku === 'string'
    );
  } catch (error) {
    console.error('Error al leer o parsear datos desde localStorage:', error);
    return [];
  }
}

/**
 * Persiste el arreglo completo de productos en localStorage.
 * @param {Array<Object>} productos - Lista actualizada de productos.
 */
function saveAll(productos) {
  try {
    const serializedData = JSON.stringify(productos);
    localStorage.setItem(STORAGE_KEY, serializedData);
  } catch (error) {
    console.error('Error al guardar los datos en localStorage:', error);
  }
}

/**
 * Genera un identificador único para cada nuevo producto.
 * @returns {string} Identificador único.
 */
function generateId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `prod_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// ============================================================================
// 2. VALIDACIÓN
// ============================================================================

/**
 * Comprueba si una cadena representa un número entero mayor o igual a cero.
 * @param {string} value - Valor en texto proveniente del input.
 * @returns {boolean} True si es un entero >= 0.
 */
function isNonNegativeInteger(value) {
  if (value === '') return false;
  const num = Number(value);
  return Number.isInteger(num) && num >= 0;
}

/**
 * Muestra un mensaje de error debajo de un campo específico del formulario.
 * @param {string} fieldId - ID del campo en el DOM.
 * @param {string} message - Mensaje descriptivo del error.
 */
function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;

  field.style.borderColor = '#dc2626';
  const errorSpan = document.createElement('span');
  errorSpan.className = 'error-message';
  errorSpan.style.cssText = 'color: #dc2626; font-size: 0.8rem; margin-top: 0.25rem;';
  errorSpan.textContent = message;

  field.insertAdjacentElement('afterend', errorSpan);
}

/**
 * Limpia todos los mensajes y estilos de error del formulario.
 * @param {HTMLFormElement} form - Formulario a limpiar.
 */
function clearErrors(form) {
  form.querySelectorAll('.error-message').forEach((el) => el.remove());
  form.querySelectorAll('input, select, textarea').forEach((el) => {
    el.style.borderColor = '';
  });
}

/**
 * Valida todos los campos del producto según las reglas de negocio.
 * @param {Object} rawData - Valores crudos capturados del formulario.
 * @param {Array<Object>} existingProducts - Lista de productos actuales.
 * @param {string|null} ignoreId - ID del producto a excluir al validar unicidad de SKU (modo edición).
 * @returns {boolean} True si la validación es exitosa.
 */
function validateProduct(rawData, existingProducts, ignoreId = null) {
  let isValid = true;

  if (!rawData.nombre) {
    showFieldError('nombre', 'El nombre del producto es obligatorio.');
    isValid = false;
  }

  if (!rawData.sku) {
    showFieldError('sku', 'El código (SKU) es obligatorio.');
    isValid = false;
  } else {
    const skuExists = existingProducts.some(
      (prod) => prod.id !== ignoreId && prod.sku.toLowerCase() === rawData.sku.toLowerCase()
    );
    if (skuExists) {
      showFieldError('sku', 'Este código (SKU) ya está registrado en otro producto.');
      isValid = false;
    }
  }

  if (!isNonNegativeInteger(rawData.stock)) {
    showFieldError('stock', 'La cantidad debe ser un número entero mayor o igual a 0.');
    isValid = false;
  }

  if (!isNonNegativeInteger(rawData.stockMinimo)) {
    showFieldError('stockMinimo', 'El stock mínimo debe ser un número entero mayor o igual a 0.');
    isValid = false;
  }

  const precioNum = Number(rawData.precio);
  if (rawData.precio === '' || Number.isNaN(precioNum) || precioNum <= 0) {
    showFieldError('precio', 'El precio unitario debe ser mayor a 0.');
    isValid = false;
  }

  if (!rawData.fechaIngreso) {
    showFieldError('fechaIngreso', 'La fecha de ingreso es obligatoria.');
    isValid = false;
  }

  return isValid;
}

// ============================================================================
// 3. RENDERIZADO
// ============================================================================

const CURRENCY_FORMATTER = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 2,
});

/**
 * Inyecta la barra de resumen superior y el campo de búsqueda en tiempo real.
 */
function setupInventoryControls() {
  const tableSection = document.getElementById('inventory-table')?.closest('.card');
  if (!tableSection || document.getElementById('inventory-summary')) return;

  const summaryBar = document.createElement('div');
  summaryBar.id = 'inventory-summary';
  summaryBar.style.cssText =
    'display: flex; flex-wrap: wrap; gap: 1.5rem; background: #f8fafc; padding: 0.85rem 1rem; border-radius: 6px; margin-bottom: 1rem; border: 1px solid #cbd5e1; font-size: 0.95rem;';

  summaryBar.innerHTML = `
    <div><strong>Total de productos:</strong> <span id="summary-total-products">0</span></div>
    <div><strong>Unidades en stock:</strong> <span id="summary-total-units">0</span></div>
    <div><strong>Valor total del inventario:</strong> <span id="summary-total-value">$0.00</span></div>
  `;

  const searchWrapper = document.createElement('div');
  searchWrapper.style.marginBottom = '1rem';

  const searchInput = document.createElement('input');
  searchInput.type = 'search';
  searchInput.id = 'inventory-search';
  searchInput.placeholder = 'Buscar por nombre, código (SKU) o categoría...';
  searchInput.style.width = '100%';

  searchWrapper.appendChild(searchInput);

  const tableResponsive = tableSection.querySelector('.table-responsive');
  tableSection.insertBefore(summaryBar, tableResponsive);
  tableSection.insertBefore(searchWrapper, tableResponsive);
}

/**
 * Actualiza los indicadores globales del inventario (total productos, unidades y valor).
 * @param {Array<Object>} productos - Lista completa de productos.
 */
function updateSummary(productos) {
  const totalProductsEl = document.getElementById('summary-total-products');
  const totalUnitsEl = document.getElementById('summary-total-units');
  const totalValueEl = document.getElementById('summary-total-value');
  if (!totalProductsEl || !totalUnitsEl || !totalValueEl) return;

  const totalProducts = productos.length;
  const totalUnits = productos.reduce((acc, prod) => acc + (Number(prod.stock) || 0), 0);
  const totalValue = productos.reduce(
    (acc, prod) => acc + (Number(prod.stock) || 0) * (Number(prod.precio) || 0),
    0
  );

  totalProductsEl.textContent = totalProducts;
  totalUnitsEl.textContent = totalUnits;
  totalValueEl.textContent = CURRENCY_FORMATTER.format(totalValue);
}

/**
 * Crea una celda <td> con texto plano seguro usando textContent.
 * @param {string|number} text - Contenido textual de la celda.
 * @returns {HTMLTableCellElement} Celda construida.
 */
function createTextCell(text) {
  const td = document.createElement('td');
  td.textContent = text;
  return td;
}

/**
 * Crea un botón de acción para las filas de la tabla.
 * @param {string} label - Texto del botón.
 * @param {string} bgColor - Color de fondo hexadecimal.
 * @param {Function} onClick - Manejador del evento click.
 * @returns {HTMLButtonElement} Botón configurado.
 */
function createActionButton(label, bgColor, onClick) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.style.cssText = `padding: 0.35rem 0.7rem; font-size: 0.82rem; background-color: ${bgColor}; color: #ffffff;`;
  button.addEventListener('click', onClick);
  return button;
}

/**
 * Renderiza la tabla de inventario aplicando el filtro de búsqueda y alertas de stock bajo.
 */
function renderInventory() {
  const tbody = document.getElementById('inventory-tbody');
  if (!tbody) return;

  const productos = getAll();
  updateSummary(productos);

  const searchInput = document.getElementById('inventory-search');
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

  const filteredProducts = productos.filter(
    (prod) =>
      prod.nombre.toLowerCase().includes(query) ||
      prod.sku.toLowerCase().includes(query) ||
      (prod.categoria || '').toLowerCase().includes(query)
  );

  tbody.replaceChildren();

  if (filteredProducts.length === 0) {
    const emptyRow = document.createElement('tr');
    const emptyCell = document.createElement('td');
    emptyCell.colSpan = 10;
    emptyCell.style.cssText = 'text-align: center; padding: 1.5rem; color: #64748b;';
    emptyCell.textContent =
      productos.length === 0
        ? 'Aún no hay productos en el inventario'
        : 'No se encontraron productos que coincidan con la búsqueda';

    emptyRow.appendChild(emptyCell);
    tbody.appendChild(emptyRow);
    return;
  }

  filteredProducts.forEach((producto) => {
    const row = document.createElement('tr');
    const isLowStock = producto.stock <= producto.stockMinimo;

    if (isLowStock) {
      row.style.backgroundColor = '#fee2e2';
      row.style.color = '#991b1b';
    }

    row.appendChild(createTextCell(producto.sku));
    row.appendChild(createTextCell(producto.nombre));
    row.appendChild(createTextCell(producto.categoria));

    // Celda de stock con etiqueta visual si está en nivel crítico
    const stockCell = document.createElement('td');
    stockCell.textContent = `${producto.stock} `;
    if (isLowStock) {
      const badge = document.createElement('span');
      badge.textContent = 'Stock bajo';
      badge.style.cssText =
        'display: inline-block; background: #dc2626; color: #ffffff; font-size: 0.72rem; font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 999px; margin-left: 0.25rem;';
      stockCell.appendChild(badge);
    }
    row.appendChild(stockCell);

    row.appendChild(createTextCell(producto.stockMinimo));
    row.appendChild(createTextCell(CURRENCY_FORMATTER.format(producto.precio)));
    row.appendChild(createTextCell(producto.proveedor || '—'));
    row.appendChild(createTextCell(producto.fechaIngreso));
    row.appendChild(createTextCell(producto.notas || '—'));

    // Celda de acciones (Editar y Eliminar)
    const actionsCell = document.createElement('td');
    actionsCell.style.whiteSpace = 'nowrap';

    const editBtn = createActionButton('Editar', '#f59e0b', () => startEditing(producto));
    editBtn.style.marginRight = '0.4rem';

    const deleteBtn = createActionButton('Eliminar', '#dc2626', () => openDeleteModal(producto));

    actionsCell.appendChild(editBtn);
    actionsCell.appendChild(deleteBtn);
    row.appendChild(actionsCell);

    tbody.appendChild(row);
  });
}

/**
 * Carga los datos de un producto en el formulario y activa el modo edición.
 * @param {Object} producto - Producto a editar.
 */
function startEditing(producto) {
  const form = document.getElementById('product-form');
  if (!form) return;

  clearErrors(form);
  editingProductId = producto.id;

  form.nombre.value = producto.nombre;
  form.sku.value = producto.sku;
  form.categoria.value = producto.categoria;
  form.stock.value = producto.stock;
  form.stockMinimo.value = producto.stockMinimo;
  form.precio.value = producto.precio;
  form.proveedor.value = producto.proveedor || '';
  form.fechaIngreso.value = producto.fechaIngreso;
  form.notas.value = producto.notas || '';

  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.textContent = 'Guardar cambios';

  const cancelBtn = document.getElementById('btn-cancel-edit');
  if (cancelBtn) cancelBtn.style.display = 'inline-block';

  form.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Restaura el formulario al modo creación y limpia los campos.
 */
function cancelEditing() {
  const form = document.getElementById('product-form');
  if (!form) return;

  editingProductId = null;
  form.reset();

  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.textContent = 'Guardar Producto';

  const cancelBtn = document.getElementById('btn-cancel-edit');
  if (cancelBtn) cancelBtn.style.display = 'none';
}

/**
 * Abre el modal de confirmación de borrado mostrando nombre y código del producto.
 * @param {Object} producto - Producto candidato a eliminar.
 */
function openDeleteModal(producto) {
  const modal = document.getElementById('delete-modal');
  const messageEl = document.getElementById('delete-modal-message');
  if (!modal || !messageEl) return;

  pendingDeleteId = producto.id;
  messageEl.textContent = `¿Estás seguro de que deseas eliminar el producto "${producto.nombre}" (Código: ${producto.sku})? Esta acción no se puede deshacer.`;
  modal.hidden = false;
}

/**
 * Cierra el modal de confirmación de borrado.
 */
function closeDeleteModal() {
  const modal = document.getElementById('delete-modal');
  if (!modal) return;

  pendingDeleteId = null;
  modal.hidden = true;
}

// ============================================================================
// 4. EVENTOS Y CONTROLADORES DE FLUJO
// ============================================================================

/**
 * Extrae y limpia los valores crudos de los campos del formulario.
 * @param {HTMLFormElement} form - Formulario de productos.
 * @returns {Object} Objeto con los valores en texto.
 */
function getFormRawData(form) {
  return {
    nombre: form.nombre.value.trim(),
    sku: form.sku.value.trim(),
    categoria: form.categoria.value,
    stock: form.stock.value.trim(),
    stockMinimo: form.stockMinimo.value.trim(),
    precio: form.precio.value.trim(),
    proveedor: form.proveedor.value.trim(),
    fechaIngreso: form.fechaIngreso.value,
    notas: form.notas.value.trim(),
  };
}

/**
 * Construye una entidad producto tipada lista para persistirse.
 * @param {Object} rawData - Datos validados del formulario.
 * @param {string} id - Identificador único del producto.
 * @returns {Object} Entidad producto normalizada.
 */
function buildProductEntity(rawData, id) {
  return {
    id,
    nombre: rawData.nombre,
    sku: rawData.sku,
    categoria: rawData.categoria,
    stock: Number(rawData.stock),
    stockMinimo: Number(rawData.stockMinimo),
    precio: Number(rawData.precio),
    proveedor: rawData.proveedor,
    fechaIngreso: rawData.fechaIngreso,
    notas: rawData.notas,
  };
}

/**
 * Maneja el envío del formulario para crear o actualizar un producto.
 * @param {SubmitEvent} event - Evento submit del formulario.
 */
function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  clearErrors(form);

  const rawData = getFormRawData(form);
  const productosActuales = getAll();

  if (!validateProduct(rawData, productosActuales, editingProductId)) {
    return;
  }

  if (editingProductId) {
    const productosActualizados = productosActuales.map((prod) =>
      prod.id === editingProductId ? buildProductEntity(rawData, editingProductId) : prod
    );
    saveAll(productosActualizados);
    cancelEditing();
  } else {
    const nuevoProducto = buildProductEntity(rawData, generateId());
    productosActuales.push(nuevoProducto);
    saveAll(productosActuales);
    form.reset();
  }

  renderInventory();
}

/**
 * Ejecuta la eliminación definitiva del producto confirmado en el modal.
 */
function handleConfirmDelete() {
  if (!pendingDeleteId) return;

  const productosRestantes = getAll().filter((prod) => prod.id !== pendingDeleteId);
  saveAll(productosRestantes);

  if (editingProductId === pendingDeleteId) {
    cancelEditing();
  }

  closeDeleteModal();
  renderInventory();
}

// Inicialización de la aplicación cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('product-form');

  if (form) {
    // Agregamos el botón "Cancelar" oculto por defecto para el modo edición
    const actionsContainer = form.querySelector('.form-actions');
    if (actionsContainer && !document.getElementById('btn-cancel-edit')) {
      const cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.id = 'btn-cancel-edit';
      cancelBtn.className = 'btn-secondary';
      cancelBtn.textContent = 'Cancelar';
      cancelBtn.style.display = 'none';
      cancelBtn.addEventListener('click', cancelEditing);
      actionsContainer.appendChild(cancelBtn);
    }

    form.setAttribute('novalidate', true);
    form.addEventListener('submit', handleFormSubmit);
    form.addEventListener('reset', () => clearErrors(form));
  }

  // Inicialización de controles de lectura y buscador en tiempo real
  setupInventoryControls();
  renderInventory();

  const searchInput = document.getElementById('inventory-search');
  if (searchInput) {
    searchInput.addEventListener('input', renderInventory);
  }

  // Eventos del modal de confirmación de eliminación
  const cancelDeleteBtn = document.getElementById('btn-cancel-delete');
  const confirmDeleteBtn = document.getElementById('btn-confirm-delete');
  const deleteModal = document.getElementById('delete-modal');

  if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', closeDeleteModal);
  if (confirmDeleteBtn) confirmDeleteBtn.addEventListener('click', handleConfirmDelete);
  if (deleteModal) {
    deleteModal.addEventListener('click', (event) => {
      if (event.target === deleteModal) closeDeleteModal();
    });
  }
});
