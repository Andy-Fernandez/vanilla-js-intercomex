
# 🛒 Sistema de Ventas – Proyecto Web

Este es un sistema de ventas web desarrollado en **JavaScript Vanilla**, con estructura modular, uso de plantillas HTML y estilo responsive en CSS. Diseñado para gestionar productos, carrito de compras y la creación dinámica de nuevos ítems desde una interfaz amigable.

---

## 📁 Estructura de Carpetas

```
2 Ventas/
│
├── index.html
├── app.js
├── cart.js
├── cartHelpers.js
├── data_base.js
├── crear-producto-form.js
├── renderProducts.js
│
├── partials/
│   ├── crear-producto-form.html
│   ├── create-product.html
│   ├── product-card.html
│   ├── producto-en-carrito.html
│   ├── header.html
│   ├── sidebar.html
│   └── sells-container.html
│
├── assets/
│   ├── logo-difuminado.png
│   ├── minus.svg
│   ├── plus.svg
│   └── trash.svg
│
├── styles/
│   ├── styles.css
│   ├── crear-producto-form.css
│   ├── create-product.css
│   ├── global.css
│   ├── header.css
│   ├── product-list.css
│   ├── producto-en-carrito.css
│   ├── sells.css
│   └── sidebar.css
```

---

## ⚙️ Funcionalidades Implementadas

- 🛒 Carrito de compras interactivo con edición de cantidad y precios.
- 🧮 Cálculo automático de totales y persistencia en `localStorage`.
- 📦 Control de stock sincronizado entre productos y carrito.
- 🧩 Estructura modular con archivos separados por función (`cart`, `renderProducts`, etc).
- 🔲 Modal emergente para creación de nuevos productos con fondo oscuro y cierre por click fuera o "Escape".
- 🔃 Plantillas HTML dinámicas (productos, carrito, botón de creación).
- 🎨 Estilos organizados por componente y comportamiento responsive.

---

## 🧪 ¿Cómo probarlo?

1. Cloná o abrí el proyecto localmente.
2. Asegurate de tener un servidor local (puede ser una extensión como **Live Server** de VSCode).
3. Abrí `index.html` desde el navegador.
4. Navegá por la lista de productos, agregá al carrito o probá el botón "Crear producto".

---

## 📌 Tareas Pendientes

- 🔧 Conectar el formulario de creación al sistema de productos (`crearProductoDesdeFormulario()`).
- ✅ Validar campos antes de agregar el producto.
- 🧹 Eliminar los `alert()` del sistema en producción.
- 🔘 Mejorar comportamiento de botones de cantidad (más/menos).
- 🔄 Eliminar precarga masiva del carrito en inicio.
- 📝 Agregar histórico de ventas y módulo de clientes (segunda fase).

---

## 👨‍💻 Autor

Proyecto desarrollado por Pablo Andres Fernandez Cari.  
Inspirado en sistemas de punto de venta modernos y prácticas modulares en desarrollo web.

---

