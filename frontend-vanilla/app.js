// app.js
import { productos } from './data_base.js';
import { iniciarlizarProductos } from './renderProducts.js';
import { inicializarCarrito,
  asignarEventosDeEliminacion,
  actualizarTotal,
  actualizarContadorProductos,
  guardarCarritoEnLocalStorage
} from './cart.js';
import { inicializarCrearProducto } from './crear-producto-form.js';
import { cargarProductosDesdeBackend } from './renderProducts.js';


// Función helper para cargar un fragmento HTML en un contenedor por su ID
async function loadPartial(url, containerId) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    document.getElementById(containerId).innerHTML = html;
  } catch (error) {
    console.error(`Error al cargar ${url}:`, error);
  }
}

// Función principal para cargar la interfaz
async function loadHTML() {
  // Cargar sidebar y sells-container en paralelo
  await Promise.all([
    loadPartial('./partials/sidebar.html', 'sidebar-container'),
    loadPartial('./partials/sells-container.html', 'sells-container')
  ]);

  // Una vez cargado sells-container, renderizamos los productos y el carrito
  const productsContainer = document.getElementById('products-container');
  const cartContainer = document.getElementById('cart-container');
  const crearProductsContainer = document.getElementById('form-create-product-container');

  await Promise.all([
    iniciarlizarProductos(productsContainer),
    inicializarCarrito(cartContainer),
    inicializarCrearProducto(crearProductsContainer)
  ]);
}

document.addEventListener('DOMContentLoaded', () => {
  loadHTML();
  // Load products from backend, async function
  cargarProductosDesdeBackend()
    .then(() => {
      console.log('Productos cargados desde el backend');
    })
    .catch((error) => {
      console.error('Error al cargar productos desde el backend:', error);
    });
});


