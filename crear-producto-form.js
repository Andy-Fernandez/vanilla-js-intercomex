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
  } catch (error) {
    console.error('Error al cargar el formulario de creación de producto:', error);
    return;
  }

  containerId.innerHTML = formHTML;

  // Evento de cierre del modal al hacer clic fuera de él
  window.addEventListener("click", function (event) {
    const modal = document.getElementById("form-create-product-container");
    if (modal && event.target === modal) {
      ocultarCrearProducto();
    }
  });

  // Evento de cierre del modal al presionar la tecla "Escape"
  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      ocultarCrearProducto();
    }
  });
  
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


export async function asignarEventosCrearProdcuto(createProductTemplate) {
  await inicializarCrearProducto("form-create-product-container");
  const botonAbrirFormularioCrearProducto = document.querySelector(createProductTemplate);
  if (botonAbrirFormularioCrearProducto) {
    botonAbrirFormularioCrearProducto.addEventListener('click', () => {
      mostrarCrearProducto();
    });
  }
}
