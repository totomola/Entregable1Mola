
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
  return carrito.reduce((acc, producto) => {
    return acc + (producto.precio * producto.cantidad);
  }, 0);
}

function renderizarCarrito() {
  const lista = document.getElementById("lista-carrito");
  const totalSpan = document.getElementById("total");

  if (!lista || !totalSpan) return;

  lista.innerHTML = "";

  carrito.forEach((producto, index) => {

    const li = document.createElement("li");
    li.classList.add("list-group-item");

    li.innerHTML = `
      <div class="d-flex align-items-center justify-content-between">
        
        <div class="d-flex align-items-center gap-3">
          <img src="${producto.imagen}" width="60" height="60" 
          style="object-fit:cover; border-radius:8px;">

          <div>
            <strong>${producto.nombre}</strong><br>
            $${producto.precio} c/u
          </div>
        </div>

        <div class="d-flex align-items-center gap-2">
          
          <button class="btn btn-sm btn-outline-secondary" 
            onclick="disminuirCantidad(${index})">-</button>

          <span>${producto.cantidad}</span>

          <button class="btn btn-sm btn-outline-secondary" 
            onclick="aumentarCantidad(${index})">+</button>

          <span class="ms-3">
            $${producto.precio * producto.cantidad}
          </span>

          <button class="btn btn-sm btn-outline-danger ms-2" 
            onclick="eliminarProducto(${index})">
            <i class="bi bi-trash"></i>
          </button>

        </div>
      </div>
    `;

    lista.appendChild(li);
  });

  totalSpan.textContent = calcularTotal();
}

function aumentarCantidad(index) {
  carrito[index].cantidad++;
  guardarEnStorage();
  renderizarCarrito();
  actualizarContador();
}

function disminuirCantidad(index) {
  if (carrito[index].cantidad > 1) {
    carrito[index].cantidad--;
  } else {
    carrito.splice(index, 1);
  }

  guardarEnStorage();
  renderizarCarrito();
  actualizarContador();
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

      const productoExistente = carrito.find(p => p.nombre === nombre);

      if (productoExistente) {
        productoExistente.cantidad++;
      } else {
        carrito.push({
          nombre,
          precio,
          imagen,
          cantidad: 1
        });
      }

      guardarEnStorage();
      actualizarContador();
    });
  });
}

function actualizarContador() {
  const contador = document.getElementById("contador-carrito");
  if (!contador) return;

  const totalCantidad = carrito.reduce((acc, p) => acc + p.cantidad, 0);
  contador.textContent = totalCantidad;
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

    if (carrito.length === 0) return;

    const modal = new bootstrap.Modal(document.getElementById("modalCompra"));
    modal.show();
  });
  }
    
  const confirmarBtn = document.getElementById("confirmarCompra");

  if (confirmarBtn) {
  confirmarBtn.addEventListener("click", () => {

    carrito = [];
    guardarEnStorage();
    renderizarCarrito();
    actualizarContador();

    const modal = bootstrap.Modal.getInstance(
      document.getElementById("modalCompra")
    );
    modal.hide();

    const mensaje = document.getElementById("mensaje-compra");
    mensaje.innerHTML = `
      <div class="alert alert-success mt-3">
      ¡El equipo Amatista te agradece por tu compra! Volve cuando quieras.
      </div>
    `;
  });
  }

});