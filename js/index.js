
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

function calcularTotal() {
  return carrito.reduce((acc, producto) => acc + producto.precio, 0);
}

function renderizarCarrito() {
  const lista = document.getElementById("lista-carrito");
  const totalSpan = document.getElementById("total");

  if (!lista || !totalSpan) return;
  
  lista.innerHTML = "";

  carrito.forEach(producto => {
    const li = document.createElement("li");
    li.classList.add("list-group-item");
    li.textContent = `${producto.nombre} - $${producto.precio}`;
    lista.appendChild(li);
  });

  totalSpan.textContent = calcularTotal();
}

function activarCards() {
  const cards = document.querySelectorAll(".producto-card");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      const nombre = card.dataset.nombre;
      const precio = Number(card.dataset.precio);

      carrito.push({ nombre, precio });

      renderizarCarrito();
      actualizarContador();
      guardarEnStorage();
    });
  });
}

function actualizarContador() {
  const contador = document.getElementById("contador-carrito");

  if (contador) {
    contador.textContent = carrito.length;
  }
}

function guardarEnStorage() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargarCarrito() {
  const carritoGuardado = localStorage.getItem("carrito");

  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);

    renderizarCarrito();
    actualizarContador();
  }
}

document.addEventListener("DOMContentLoaded", () => {

  activarCards();
  cargarCarrito();
  actualizarContador();

  const botonVaciar = document.getElementById("vaciar-carrito");

  if (botonVaciar) {
    botonVaciar.addEventListener("click", () => {
      carrito = [];

      guardarEnStorage();
      renderizarCarrito();
      actualizarContador();
    });
  }

});