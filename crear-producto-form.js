// crear-producto-form.js

let formHTML = "";

/**
 * Carga e inyecta el formulario de creación de producto en el DOM.
 * @param {string} containerId - El ID del contenedor donde se insertará el formulario (ej: 'form-create-product-container').
 */
export async function inicializarCrearProducto(containerId) {
  if (!containerId) {
    console.error(`Contenedor con ID "${containerId}" no encontrado.`);
    return;
  }

  try {
    const response = await fetch('./partials/crear-producto-form.html');
    formHTML = await response.text();
    containerId.innerHTML = formHTML;
    registrarEventosBasicos();
    registrarEventosImagen();
    registrarEventosFormulario(); 
  } catch (error) {
    console.error('Error al cargar el formulario de creación de producto:', error);
    return;
  }

}

export function mostrarCrearProducto() {
  const modal = document.getElementById("form-create-product-container");
  if (modal) {
    modal.classList.remove("hidden");
  }
}

export function ocultarCrearProducto() {
  const modal = document.getElementById("form-create-product-container");
  if (modal) {
    modal.classList.add("hidden");
  }
}

/**
 * Registra eventos generales del modal como cierre con clic externo o Escape.
 */
function registrarEventosBasicos() {
  const modal = document.getElementById("form-create-product-container");
  window.addEventListener("click", (event) => {
    if (modal && event.target === modal) {
      ocultarCrearProducto();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      ocultarCrearProducto();
    }
  });
}

/**
 * Registra eventos para manejo de imagen: drag, drop, click y paste.
 */
function registrarEventosImagen() {
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('imagenProducto');
  const uploadIcon = dropzone?.querySelector("img");
  const uploadText = dropzone?.querySelector("p");

  if (!dropzone || !fileInput || !uploadIcon || !uploadText) {
    console.error('Elementos necesarios para el drag & drop no encontrados.');
    return;
  }

  function handleFile(file) {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => {
        uploadIcon.src = e.target.result;
        uploadIcon.style.width = "100%";
        uploadIcon.style.height = "100%";
        uploadIcon.style.objectFit = "contain";
        uploadText.style.display = "none";
      };
      reader.readAsDataURL(file);
    }
  }

  dropzone.addEventListener('dragover', e => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
  });

  dropzone.addEventListener('drop', e => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    handleFile(file);
  });

  fileInput.addEventListener('change', () => {
    handleFile(fileInput.files[0]);
  });

  window.addEventListener('paste', e => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        handleFile(item.getAsFile());
      }
    }
  });
}

/**
 * Valida los campos del formulario de creación de producto.
 * 
 * Esta función revisa que los campos obligatorios estén presentes y tengan
 * un formato correcto, incluyendo:
 * - Nombre con al menos 3 caracteres.
 * - Stock como número entero positivo.
 * - Precio unitario mayor a cero.
 * - (Opcional) Precio por mayor y precio de adquisición positivos.
 * - (Opcional pero recomendado) Imagen del producto cargada.
 * 
 * En caso de errores, se muestra un mensaje emergente con el listado completo.
 * 
 * @returns {boolean} `true` si el formulario es válido, `false` si hay errores.
 */
function validarFormularioProducto() {
  const nombre = document.getElementById('nombreProducto').value.trim();
  const stock = parseInt(document.getElementById('stockProducto').value, 10);
  const precioUnitario = parseFloat(document.getElementById('precioUnitario').value);
  const precioMayor = parseFloat(document.getElementById('precioMayor').value) || null;
  const precioAdquisicion = parseFloat(document.getElementById('precioAdquisicion').value) || null;

  const errores = [];

  if (nombre.length < 3) errores.push("El nombre debe tener al menos 3 caracteres.");
  if (isNaN(stock) || stock < 0) errores.push("El stock debe ser un número entero positivo.");
  if (isNaN(precioUnitario) || precioUnitario <= 0) errores.push("El precio unitario debe ser mayor a cero.");
  if (precioMayor !== null && precioMayor < 0) errores.push("El precio por mayor debe ser positivo.");
  if (precioAdquisicion !== null && precioAdquisicion < 0) errores.push("El precio de adquisición debe ser positivo.");
  if (precioAdquisicion !== null && precioAdquisicion >= precioUnitario) {
    errores.push("El precio de adquisición debe ser menor que el precio unitario.");
  }

  if (errores.length > 0) {
    alert("Errores en el formulario:\n\n" + errores.join("\n"));
    return false;
  }

  return true;
}

/**
 * Registra el evento de envío del formulario.
 * 
 * Intercepta el submit del formulario de producto, valida los campos
 * y si todo es correcto, continúa con el procesamiento.
 */
function registrarEventosFormulario() {
  const formulario = document.querySelector('.crear-producto-formulario');
  if (!formulario) {
    console.error('Formulario de creación de producto no encontrado.');
    return;
  }

  formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validarFormularioProducto()) {
      console.log("Formulario válido. Procediendo al guardado...");
      // Aquí podrías llamar a guardarProducto() u otra lógica
    }
  });
}

