
# 🗺️ Mapa de Arquitectura – Sistema de Ventas

Este esquema describe cómo está organizado el sistema de ventas, qué módulos lo componen y cómo interactúan entre sí.

---

## 📦 Estructura General

```
index.html
│
├── app.js  🔄 Punto de entrada principal
│   ├── carga sidebar + sells-container
│   ├── carga y renderiza productos (renderProducts.js)
│   ├── inicializa carrito (cart.js)
│   └── carga modal "crear producto" (crear-producto-form.js)
│
├── data_base.js 🗃️
│   ├── productos (array estático)
│   ├── getProductos(), actualizarStock()
│   └── (futuro) agregarProducto()
│
├── cart.js 🛒
│   ├── getCarrito(), agregarProductoAlCarrito()
│   ├── actualizarCarritoHTML()
│   ├── sincroniza con localStorage
│   └── calcula totales, actualiza stock
│
├── renderProducts.js 🧱
│   ├── cargarProductos()
│   ├── actualizarProductos()
│   └── asigna eventos a tarjetas y botón "crear producto"
│
├── crear-producto-form.js 🆕
│   ├── inicializarCrearProducto()
│   ├── mostrar/ocultar modal
│   ├── cierre por click fuera o "Escape"
│   └── (pendiente) validación y agregar producto dinámico
│
├── partials/ (vistas HTML dinámicas)
│   ├── product-card.html           🔹 Tarjeta individual de producto
│   ├── create-product.html         ➕ Tarjeta "crear producto"
│   ├── crear-producto-form.html    📝 Modal de creación
│   ├── producto-en-carrito.html    🛒 Item en carrito
│   └── sidebar, header, sells-container (UI estática)
│
├── styles/ 🎨
│   ├── crear-producto-form.css     Estilo del modal
│   ├── create-product.css          Estilo de la tarjeta "crear"
│   ├── producto-en-carrito.css     Carrito visual
│   └── global.css, header.css, etc.
```

---

## 🔁 Interacciones clave

- Clic en tarjeta "Crear producto" → muestra modal desde `crear-producto-form.js`.
- Formulario enviado → (futuro) se valida, agrega a `productos[]` y se re-renderiza.
- Clic en producto → lo agrega al carrito (`cart.js`), actualiza totales y stock.

---

## 📌 Estado actual

- ✅ Modal funcionando con estilos.
- ✅ Productos renderizados desde plantillas.
- ✅ Carrito con edición, totales, localStorage y sincronización de stock.
- 🔧 En desarrollo: validación + registro dinámico de productos.

---

## 📝 Cómo usar este mapa

- Como guía para desarrollar nuevas funcionalidades.
- Como referencia rápida para ubicar módulos.
- Como base para documentación de entrega final o defensa.

