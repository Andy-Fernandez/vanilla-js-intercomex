// cart.js
import { getProductos, actualizarStock } from './data_base.js';
// Importamos nuestras funciones helper (más adelante las usaremos en los event handlers)
import {
  incrementarCantidad,
  disminuirCantidad,
  actualizarCantidad,
  actualizarPrecio,
  calcularTotalItem
} from './cartHelpers.js';
import { iniciarlizarProductos } from './renderProducts.js';
import { actualizarProductos } from './renderProducts.js';

let carrito = [];
let cartTemplateHTML = "";


/**
 * Getter para obtener el carrito actual.
 * @returns {Array} Carrito de productos.
 */
export function getCarrito() {
  return carrito;
}

/**
 * Inicializa y renderiza el carrito con los productos.
 * @param {HTMLElement} cart_container - Elemento donde se renderizará el carrito.
 */
export async function inicializarCarrito(cart_container) {
  if (!cart_container) {
    console.error('cart-container no encontrado.');
    return;
  }

  // ✅ Recuperar el carrito desde localStorage si existe
  const carritoGuardado = localStorage.getItem("carrito");
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
  }


  // Cargar la plantilla HTML para un ítem del carrito
  try {
    const response = await fetch('./partials/producto-en-carrito.html');
    cartTemplateHTML = await response.text();
  } catch (error) {
    console.error('Error al cargar producto-en-carrito.html:', error);
    return;
  }
  
  actualizarCarritoHTML();
  actualizarTotal();
  actualizarContadorProductos();
}

/**
 * Renderiza el carrito completo en la interfaz.
 */
export async function actualizarCarritoHTML() {
  const cartContainer = document.getElementById("cart-container");
  if (!cartContainer) {
    console.error('cart-container no encontrado.');
    return;
  }

  // Borrar contenido previo
  cartContainer.innerHTML = "";
  
  // Si la plantilla no se ha cargado, intentamos cargarla
  if (!cartTemplateHTML) {
    try {
      const response = await fetch('./partials/producto-en-carrito.html');
      cartTemplateHTML = await response.text();
    } catch (error) {
      console.error('Error al cargar producto-en-carrito.html:', error);
      return;
    }
  }
  
  const fragment = document.createDocumentFragment();
  carrito.forEach(item => {
    // Es importante que el HTML tenga un atributo data con el id del producto para identificarlo en los event handlers.
    const totalItem = calcularTotalItem(item.producto_id);

    let productoHTML = cartTemplateHTML
      .replaceAll("{{producto_id}}", item.producto_id)
      .replaceAll("{{nombre}}", item.nombre)
      .replace("{{precio}}", item.precio)
      .replaceAll('{{foto}}', item.foto)
      .replaceAll('{{stock}}', `${item.stock}`)
      .replaceAll('{{cantidad}}', `${item.cantidad}`)
      .replace('{{totalItem}}', totalItem.toFixed(2));

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = productoHTML;
    while (tempDiv.firstChild) {
      fragment.appendChild(tempDiv.firstChild);
    }
  });
  cartContainer.appendChild(fragment);
  
  // Asignamos los eventos de eliminación y también los de cantidad (más adelante)
  const removeButtons = cartContainer.querySelectorAll('.remove-item-button');
  asignarEventosDeEliminacion(removeButtons);
  asignarEventosCantidad(cartContainer);
  asignarEventosCambioPrecio(cartContainer);
  asignarEventoReinicioCarrito();
}

/**
 * Asigna el evento para eliminar ítems del carrito.
 */
export function asignarEventosDeEliminacion(removeButtons) {
  if (!removeButtons) return;
  removeButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      // Tenemos que aumentar el stock del producto eliminado
      const productoEliminado = carrito[index];
      const productos = getProductos();
      const productoOriginal = productos.find(p => p.id === productoEliminado.producto_id);
      
      if (productoOriginal) {
        const nuevoStock = productoOriginal.stock + productoEliminado.cantidad;
        actualizarStock(productoEliminado.producto_id, nuevoStock);
      }
      // TODO: No esta funcionando, no se actualiza el stock en la base de datos, ni en el carrito.
      // Eliminar el ítem del carrito con base en el índice.
      carrito.splice(index, 1);

      actualizarCarritoHTML();
      actualizarTotal();
      actualizarContadorProductos();
      guardarCarritoEnLocalStorage();
      actualizarProductos();
    });
  });
}

/**
 * Asigna eventos a los controles de cantidad: botones increment, decrement y el input.
 * Usamos el atributo data-producto-id.
 */
export function asignarEventosCantidad(cartContainer) {
  // Botones para incrementar y decrementar cantidad
  const decrementButtons = cartContainer.querySelectorAll('.decrement-button');
  const incrementButtons = cartContainer.querySelectorAll('.increment-button');
  const quantityInputs = cartContainer.querySelectorAll('.quantity-input');

  incrementButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const cartItem = e.target.closest('.cart-item');
      const productId = Number(cartItem.getAttribute('data-producto-id'));
      const productos = getProductos();
      const productoOriginal = productos.find(p => p.id === productId);

      if (productoOriginal && productoOriginal.stock > 0) {
        // Reducimos el stock en 1
        actualizarStock(productId, productoOriginal.stock - 1);
        incrementarCantidad(productId);

        actualizarCarritoHTML();
        actualizarTotal();
        actualizarContadorProductos();
        guardarCarritoEnLocalStorage();
        actualizarProductos(); // actualiza vista tarjetas
      } else {
        alert("Stock insuficiente.");
      }
    });
  });

  decrementButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const cartItem = e.target.closest('.cart-item');
      const productId = Number(cartItem.getAttribute('data-producto-id'));
      const productos = getProductos();
      const productoOriginal = productos.find(p => p.id === productId);

      // Solo devolvemos stock si se puede disminuir
      const item = carrito.find(i => i.producto_id === productId);
      if (item && item.cantidad > 1 && productoOriginal) {
        actualizarStock(productId, productoOriginal.stock + 1);
        disminuirCantidad(productId);

        actualizarCarritoHTML();
        actualizarTotal();
        actualizarContadorProductos();
        guardarCarritoEnLocalStorage();
        actualizarProductos();
      }
    });
  });

  quantityInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      const nuevaCantidad = Number(e.target.value);
      const cartItem = e.target.closest('.cart-item');
      const productId = Number(cartItem.getAttribute('data-producto-id'));

      const productos = getProductos();
      const productoOriginal = productos.find(p => p.id === productId);
      const item = carrito.find(i => i.producto_id === productId);

      if (!productoOriginal || !item) return;

      const diferencia = nuevaCantidad - item.cantidad;

      if (diferencia > 0 && productoOriginal.stock >= diferencia) {
        actualizarCantidad(productId, nuevaCantidad);
        actualizarStock(productId, productoOriginal.stock - diferencia);
      } else if (diferencia < 0) {
        actualizarCantidad(productId, nuevaCantidad);
        actualizarStock(productId, productoOriginal.stock + Math.abs(diferencia));
      } else if (diferencia > 0 && productoOriginal.stock < diferencia) {
        alert("Stock insuficiente para la cantidad solicitada.");
        input.value = item.cantidad; // Revertimos visualmente
        return;
      }

      actualizarCarritoHTML();
      actualizarTotal();
      actualizarContadorProductos();
      guardarCarritoEnLocalStorage();
      actualizarProductos();
    });
  });
}

/**
 * Función para actualizar el total general del carrito.
 * Esta función puede seguir en cart.js o exportarse a cartHelpers.js si lo prefieres.
 */
export function actualizarTotal() {
  const totalElement = document.querySelector(".continue-btn-total");
  if (totalElement) {
    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    totalElement.textContent = `Bs. ${total.toFixed(2)}`;
  }
}

/**
 * Función para actualizar el contador de productos.
 */
export function actualizarContadorProductos() {
  const contadorElement = document.querySelector(".continue-btn-count");
  if (contadorElement) {
    const totalProductos = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    contadorElement.textContent = `${totalProductos} productos`;
  }
}

/**
 * Guarda el estado actual del carrito en LocalStorage.
 * Se utiliza para mantener persistencia entre sesiones del usuario.
 */
export function guardarCarritoEnLocalStorage() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

/**
 * Asigna los eventos necesarios para permitir la edición del precio de productos
 * directamente desde el carrito (campo editable).
 * Permite aplicar el cambio tanto al perder el foco como al presionar Enter.
 *
 * @param {HTMLElement} cartContainer - Elemento contenedor del carrito.
 */
export function asignarEventosCambioPrecio(cartContainer) {
  const priceFields = cartContainer.querySelectorAll('.item-price');

  priceFields.forEach(field => {
    // Aplica el cambio cuando se pierde el foco del campo
    field.addEventListener('blur', (e) => {
      procesarCambioPrecio(e.target);
    });

    // Aplica el cambio al presionar Enter
    field.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // Evita salto de línea en contenteditable
        procesarCambioPrecio(e.target);
        e.target.blur(); // Fuerza pérdida de foco para reflejar el cambio
      }
    });
  });
}

/**
 * Procesa la actualización del precio de un ítem del carrito a partir de un campo editable.
 *
 * @param {HTMLElement} elemento - Elemento DOM editable que contiene el nuevo precio.
 */
function procesarCambioPrecio(elemento) {
  const nuevoPrecio = parseFloat(elemento.textContent.replace('Bs', '').trim());
  if (!isNaN(nuevoPrecio)) {
    const cartItem = elemento.closest('.cart-item');
    const productId = Number(cartItem.getAttribute('data-producto-id'));
    actualizarPrecio(productId, nuevoPrecio);
    actualizarCarritoHTML();
    actualizarTotal();
    actualizarContadorProductos();
    guardarCarritoEnLocalStorage();
  }
}


// TODO: Esto se genero para la prueba, corregir para una correcta implementación.
/**
 * Confirma la venta actual y limpia el carrito y localStorage.
 * Se debe llamar al finalizar una venta exitosa.
 */
export function confirmarVenta() {
  // Limpiar el carrito y localStorage
  carrito = [];
  localStorage.removeItem("carrito");

  // Limpiar interfaz
  actualizarCarritoHTML();
  actualizarTotal();
  actualizarContadorProductos();
}

/**
 * TEMPORAL PARA TEST: Asigna el evento para reiniciar el carrito.
 * Lo que realmente hace es que llena al producto con todos los productos de la base de datos.
 */
export function asignarEventoReinicioCarrito() {
  const reiniciarButton = document.querySelector('.cart-view-btn');
  if (reiniciarButton) {
    reiniciarButton.addEventListener('click', () => {
      confirmarVenta();
    });
  }
}

/**
 * Agrega un producto al carrito, o aumenta su cantidad si ya existe.
 * @param {Number} productId - ID del producto a agregar.
 */
export function agregarProductoAlCarrito(productId) {
  const productos = getProductos();
  const productoOriginal = productos.find(p => p.id === productId);
  if (!productoOriginal) {
    alert("Producto no encontrado.");
    return;
  }

  const itemExistente = carrito.find(item => item.producto_id === productId);
  if (itemExistente) {
    // Aumentar cantidad si ya está en carrito (validando contra stock)
    if (itemExistente.cantidad < productoOriginal.stock) {
      itemExistente.cantidad += 1;
      itemExistente.stock -= 1;
      actualizarStock(productId, productoOriginal.stock - 1);
    } else {
      alert("No hay más stock disponible para este producto.");
    }
  } else {
    // Agregar nuevo ítem al carrito
    actualizarStock(productId, productoOriginal.stock - 1);
    carrito.push({
      producto_id: productoOriginal.id,
      nombre: productoOriginal.nombre,
      precio: productoOriginal.precioUnitario,
      cantidad: 1,
      foto: productoOriginal.foto,
      stock: productoOriginal.stock
    });
  }

  iniciarlizarProductos();
  actualizarCarritoHTML();
  actualizarTotal();
  actualizarContadorProductos();
  guardarCarritoEnLocalStorage();
}
