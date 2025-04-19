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