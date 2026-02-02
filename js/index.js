
//Variables y constantes de Amatista Bijouterie
const productos = [
  { id: 1, nombre: "Aros", precio: 5000 },
  { id: 2, nombre: "Pulsera", precio: 6000 },
  { id: 3, nombre: "Collar", precio: 8000 },
  { id: 4, nombre: "Anillo", precio: 10000 },
  { id: 5, nombre: "Tobillera", precio: 7000 },
  { id: 6, nombre: "Aros + Pulsera", precio: 20000 }
];

let carrito = [];

// Paso 0: Muestra los productos disponibles
function mostrarProductos() {
  let mensaje = "Productos disponibles:\n";

  for (let producto of productos) {
    mensaje += `- ${producto.nombre} ($${producto.precio})\n`;
  }

  alert(mensaje);
}

// Paso 1: Agrega un producto al carrito
function agregarAlCarrito() {
  let nombreProducto = prompt(
    "Ingresá el nombre del producto que querés comprar:"
  );

  if (!nombreProducto) {
    alert("No ingresaste ningún producto");
    return;
  }

  nombreProducto = nombreProducto.toLowerCase();

  let productoEncontrado = productos.find(
    producto => producto.nombre.toLowerCase() === nombreProducto
  );

  if (productoEncontrado) {
    carrito.push(productoEncontrado);
    alert(`${productoEncontrado.nombre} agregado al carrito`);
  } else {
    alert("Producto no encontrado. Revisá el nombre e intentá nuevamente.");
  }
}

// Paso 2: Calcula el total de la compra
function calcularTotal() {
  let total = 0;

  for (let producto of carrito) {
    total += producto.precio;
  }

  return total;
}

// PAso 4: Función principal del simulador, que permite finalizar o continuar comprando
function iniciarSimulador() {
  let continuar = true;

  while (continuar) {
    mostrarProductos();
    agregarAlCarrito();
    continuar = confirm("¿Querés agregar otro producto?");
  }

  let totalCompra = calcularTotal();
  alert(`El total de tu compra es: $${totalCompra}`);
  console.log("Carrito final:", carrito);
}

// Inicio del simulador
iniciarSimulador();