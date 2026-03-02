
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

  carrito.forEach((producto, index) => {

    const li = document.createElement("li");
    li.classList.add("list-group-item", "d-flex", "align-items-center", "justify-content-between");

    li.innerHTML = `
      <div class="d-flex align-items-center gap-3">
        <img src="${producto.imagen}" width="60" height="60" style="object-fit:cover; border-radius:8px;">
        <div>
          <strong>${producto.nombre}</strong><br>
          $${producto.precio}
        </div>
      </div>

      <button class="btn btn-sm btn-outline-danger" onclick="eliminarProducto(${index})">
        <i class="bi bi-trash"></i>
      </button>
    `;

    lista.appendChild(li);
  });

  totalSpan.textContent = calcularTotal();
}

function eliminarProducto(index) {
  carrito.splice(index, 1);
  guardarEnStorage();
  renderizarCarrito();
  actualizarContador();
}

function activarCards() {
  const cards = document.querySelectorAll(".producto-card");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      const nombre = card.dataset.nombre;
      const precio = Number(card.dataset.precio);
      const imagen = card.querySelector("img").src;

      carrito.push({ nombre, precio, imagen });

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

  const botonComprar = document.getElementById("comprar");

if (botonComprar) {
  botonComprar.addEventListener("click", () => {

    if (carrito.length === 0) {
      alert("Tu carrito está vacío");
      return;
    }

    carrito = [];
    guardarEnStorage();
    renderizarCarrito();
    actualizarContador();

    const mensaje = document.getElementById("mensaje-compra");
    mensaje.innerHTML = `
      <div class="alert alert-success">
        ¡El equipo Amatista agradece por tu compra! Volve cuando quieras.
      </div>
    `;
  });
}

});