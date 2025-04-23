// renderProducts.js
import { getProductos } from './data_base.js';
import { agregarProductoAlCarrito } from './cart.js';
import { mostrarCrearProducto } from './crear-producto-form.js';

let productCardTemplate = null; // Variable global para almacenar la plantilla
let createProductTemplate = null; // Variable global para almacenar la plantilla

/**
 * Carga las plantillas HTML necesarias para renderizar:
 * - Las tarjetas de productos (`product-card.html`)
 * - El botón "Crear producto" (`create-product.html`)
 * 
 * Luego llama a `actualizarProductos()` para pintar la interfaz.
 * 
 * Esta función debe ejecutarse una única vez al iniciar el sistema o al recargar el módulo.
 */
export async function iniciarlizarProductos() {
  try {
    const productCart = await fetch('./partials/product-card.html');
    productCardTemplate = await productCart.text();
  } catch (error) {
    console.error('Error al cargar product-card.html:', error);
    return;
  }

  try {
    const createProduct = await fetch('./partials/create-product.html');
    createProductTemplate = await createProduct.text();
  } catch (error) {
    console.error('Error al cargar create-product.html:', error);
    return;
  }

  // Después de cargar la plantilla, llamamos a la función que renderiza
  actualizarProductos();
}

/**
 * Renderiza visualmente todas las tarjetas de productos en el contenedor #products-container.
 * 
 * Este método utiliza:
 * - `productCardTemplate`: plantilla HTML de cada producto
 * - `createProductTemplate`: plantilla HTML del botón "Crear producto"
 * 
 * También asigna eventos de clic a cada tarjeta para permitir la adición al carrito.
 * 
 * Este método se debe llamar cada vez que la lista de productos cambie.
 */
export function actualizarProductos() {
  const container = document.getElementById('products-container');
  if (!container) {
    console.error('products-container no encontrado.');
    return;
  }
  if (!productCardTemplate) {
    console.error('No se ha cargado la plantilla de productos (productCardTemplate).');
    return;
  }

  if (!createProductTemplate) {
    console.error('No se ha cargado la plantilla de productos (createProductTemplate).');
    return;
  }

  // Limpiar contenedor antes de re-renderizar
  container.innerHTML = '';

  // *Revisar*
  // Agregamos el botón de crear producto al contenedor
  const createProductHTML = createProductTemplate;
  // Crear nodo desde plantilla y agregarlo
  const tempDivCreate = document.createElement('div');
  tempDivCreate.innerHTML = createProductTemplate;
  const createCard = tempDivCreate.querySelector('.create-product-card');

  if (createCard) {
    createCard.addEventListener('click', () => {
      mostrarCrearProducto();
    });
  }

  while (tempDivCreate.firstChild) {
    container.appendChild(tempDivCreate.firstChild);
  }


  const fragment = document.createDocumentFragment();

  const productos = getProductos();
  productos.forEach(producto => {
    // Reemplazamos los marcadores de posición por los datos del producto

    let productoHTML = productCardTemplate
      .replaceAll('{{producto_id}}', producto.id)
      .replaceAll('{{nombre}}', producto.nombre)
      .replaceAll('{{precio}}', `Bs ${producto.precioUnitario}`)
      .replaceAll('{{foto}}', producto.foto)
      .replaceAll('{{stock}}', `${producto.stock} unidades`);

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = productoHTML; 

    const card = tempDiv.querySelector('.product-card');
    if (card) {
      card.addEventListener('click', () => {
        agregarProductoAlCarrito(producto.id);
      });
    } else {
      console.warn(`No se encontró la tarjeta para el producto con ID: ${producto.id}`);
    }

    // Agregamos los nodos hijos al fragment
    while (tempDiv.firstChild) {
      fragment.appendChild(tempDiv.firstChild);
    }
  });
  
  container.appendChild(fragment);
}
