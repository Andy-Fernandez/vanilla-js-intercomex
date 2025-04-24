import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding base de datos...");

  // Usuarios
  const usuarios = await prisma.usuario.createMany({
    data: [
      {
        username: 'pedro',
        nombre: 'Pedro Suárez',
        email: 'pedro@fiestabolivia.com',
        password: 'password_encriptado_1',
        telefono: '68754123',
        rol: 'vendedor'
      },
      {
        username: 'laura',
        nombre: 'Laura Flores',
        email: 'laura@fiestabolivia.com',
        password: 'password_encriptado_2',
        telefono: '69852147',
        rol: 'administrador'
      }
    ]
  });

  // Clientes
  const clientes = await prisma.cliente.createMany({
    data: [
      {
        nombre: 'Carlos Torrez',
        telefono: '70123456',
        documentoIdentidad: '4587621',
        tipoCliente: 'regular',
        email: 'carlos@gmail.com',
        direccion: 'Av. América #123'
      },
      {
        nombre: 'Tienda La Magia',
        telefono: '71234567',
        documentoIdentidad: '5698741',
        tipoCliente: 'preferencial',
        email: 'magia@tienda.com',
        direccion: 'Calle Bolívar #456'
      },
      {
        nombre: 'Eventos Happy Day',
        telefono: '72345678',
        documentoIdentidad: '1023654789',
        tipoCliente: 'mayorista',
        email: 'contacto@happyday.com',
        direccion: 'Av. Banzer #789'
      }
    ]
  });

  // Productos
  const productos = await prisma.producto.createMany({
    data: [
      {
        nombre: 'Globos',
        codigo: 'G001',
        categoria: 'Fiesta',
        stock: 1000,
        stockMinimo: 50,
        precioUnitario: 12.00,
        precioPorMayor: 10.00,
        precioPreferencial: 11.00,
        costoAdquisicion: 8.00,
        descripcion: 'Caja con 100 bolsas pequeñas de globos',
        foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcaFAlErs0hH7TI7XulA7WFyNA9CezD17p3w&s'
      },
      {
        nombre: 'Cohetillo',
        codigo: 'Q001',
        categoria: 'Fiesta',
        stock: 500,
        stockMinimo: 20,
        precioUnitario: 5.00,
        precioPorMayor: 4.50,
        precioPreferencial: 4.80,
        costoAdquisicion: 3.50,
        descripcion: 'Cohetillo para fiestas',
        foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkC72kfsSst-xXZreAIFEa3g7v42WiWUnIFA&s'
      },
      {
        nombre: 'Petardo',
        codigo: 'P001',
        categoria: 'Fiesta',
        stock: 800,
        stockMinimo: 30,
        precioUnitario: 20.00,
        precioPorMayor: 18.00,
        precioPreferencial: 19.00,
        costoAdquisicion: 15.00,
        descripcion: 'Petardo de alta potencia',
        foto: 'https://tuexpres.com/web/image/product.template/617/image_1024?unique=b41d76d'
      },
      {
        nombre: 'Cerpentina',
        codigo: 'C001',
        categoria: 'Fiesta',
        stock: 1200,
        stockMinimo: 50,
        precioUnitario: 8.00,
        precioPorMayor: 7.50,
        precioPreferencial: 7.80,
        costoAdquisicion: 6.00,
        descripcion: 'Cerpentina para decoración de fiestas',
        foto: 'https://bolmarket.com/cdn/shop/products/bolmarket-serpentina.png?v=1605723095'
      },
      {
        nombre: 'Inflador',
        codigo: 'I001',
        categoria: 'Fiesta',
        stock: 150,
        stockMinimo: 10,
        precioUnitario: 25.00,
        precioPorMayor: 22.00,
        precioPreferencial: 23.00,
        costoAdquisicion: 18.00,
        descripcion: 'Inflador manual para globos',
        foto: 'https://i5.walmartimages.com/asr/4ab50df9-0020-4ce1-90b7-007f769bf0ee.3727d9f7ea085432deb6d4c85790d1b5.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF'
      }
    ]
  });

  console.log("✅ Base de datos poblada correctamente");
}

main()
  .catch(e => {
    console.error("❌ Error al hacer seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
