import { productos } from "./productos.js";
import { cargarPagina, activarRouter } from "./router.js";

export function renderizarProductos(categoria) {
  const contenedor = document.getElementById("contenedor-productos");

  if (!contenedor) return;

  const filtrados = productos.filter(p => p.categoria === categoria);

  contenedor.innerHTML = filtrados.map(p => `
    <div class="col-md-4">
      <div class="card producto-card h-100 text-center p-3"
           data-nombre="${p.nombre}"
           data-precio="${p.precio}">

        <div class="card-img-wrapper">
          <img src="${p.imagen}" class="card-img-top img-producto">

          <div class="card-overlay">
            <button class="btn btn-light btn-sm btn-ver">
              <i class="bi bi-eye"></i>
            </button>
            <button class="btn btn-dark btn-sm btn-comprar">
              <i class="bi bi-cart-plus"></i>
            </button>
          </div>
        </div>

        <div class="card-body">
          <h5 class="fw-bold">${p.nombre}</h5>
          <p class="precio">$${p.precio}</p>
        </div>

      </div>
    </div>
  `).join("");

}

export function irAPagina(pagina) {
  history.pushState(null, null, pagina);
  cargarPagina(pagina);
}

export function activarNavegacion() {

  const links = document.querySelectorAll("[data-link]");

  links.forEach(link => {

    link.addEventListener("click", () => {

      const pagina = link.dataset.link;
      irAPagina(pagina);

    });

  });

}

window.addEventListener("popstate", () => {

  const ruta = window.location.pathname;

  if (ruta === "/" || ruta === "/index.html") {
    cargarPagina("/");
  } else {
    cargarPagina(ruta);
  }

});

async function cargarComponentes() {

  const navbar = await fetch("/componentes/navbar.html");
  const footer = await fetch("/componentes/footer.html");

  document.getElementById("navbar-container").innerHTML = await navbar.text();
  document.getElementById("footer-container").innerHTML = await footer.text();

}

let carrito = [];

function calcularTotal() {
  return carrito.reduce((acc, producto) => {
    return acc + (producto.precio * producto.cantidad);
  }, 0);
}

 export function renderizarCarrito() {
  const lista = document.getElementById("lista-carrito");
  const totalSpan = document.getElementById("total");

  if (!lista || !totalSpan) return;

  lista.innerHTML = "";

  carrito.forEach((producto, index) => {

    const li = document.createElement("li");
    li.classList.add("list-group-item");

    li.innerHTML = `
      <div class="d-flex align-items-center justify-content-between bg-carrito" style="gap:1rem; ">
        
        <div class="d-flex align-items-center ">
          <img src="${producto.imagen}" 
          style="width:10rem; height:10rem; object-fit:cover; border-radius: 0.1rem; ">

          <div class="ms-4" style="min-width: 10rem;">
            <strong style="font-size: 1.25rem;">${producto.nombre}</strong><br>
            <strong style="font-size: 2rem;">$${producto.precio} </strong> c/u
          </div>
        </div>

        <div class="d-flex align-items-center align-content-center gap-2">
          
          <button class="btn btn-sm btn-outline-dark" style="width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center;" 
            onclick="disminuirCantidad(${index})">-</button>

          <button class="btn btn-sm btn-outline-dark" style="width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center;"
            onclick="aumentarCantidad(${index})">+</button>

          <span class="font-weight-bold h4 m-1">${producto.cantidad}</span>
          
          <button class="btn btn-sm btn-outline-dark ms-2" style="width: 2.5rem; height: 2.5rem; display: flex; align-items: center; justify-content: center;"
            onclick="eliminarProducto(${index})">
            <i class="bi bi-trash"></i>
          </button>

          <span class="ms-3 h2"><strong>
            $${producto.precio * producto.cantidad}</strong>
          </span>

        </div>
      </div>
    `;

    li.style.marginBottom = "1rem";
    li.style.backgroundColor = "#F3DFC3";

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

export function activarCards() {
  const cards = document.querySelectorAll(".producto-card");

  cards.forEach(card => {

    const btnComprar = card.querySelector(".btn-comprar");
    
    btnComprar.addEventListener("click", (e) => {
      e.stopPropagation();

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

document.addEventListener("click", function(e){

  if(e.target.closest(".btn-ver")){

    const card = e.target.closest(".producto-card");
    const img = card.querySelector("img").src;

    const modalImg = document.getElementById("imagenModal");
    modalImg.src = img;

    const modal = new bootstrap.Modal(document.getElementById("modalImagen"));
    modal.show();
  }

});

function actualizarContador() {
  const contador = document.getElementById("contador-carrito");
  if (!contador) return;

  const totalCantidad = carrito.reduce((acc, p) => acc + p.cantidad, 0);
  contador.textContent = totalCantidad;
}

function guardarEnStorage() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

export function cargarCarrito() {
  const carritoGuardado = localStorage.getItem("carrito");

  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);

    renderizarCarrito();
    actualizarContador();
  }
}

window.aumentarCantidad = aumentarCantidad;
window.disminuirCantidad = disminuirCantidad;
window.eliminarProducto = eliminarProducto;
window.cargarCarrito = cargarCarrito;

document.addEventListener("DOMContentLoaded", async () => {

  await cargarComponentes();

  activarRouter();

  const rutaInicial = window.location.pathname;

  if (rutaInicial === "/" || rutaInicial === "/index.html") {
   await cargarPagina("/");
  } else {
   await cargarPagina(rutaInicial);
  }

  });

