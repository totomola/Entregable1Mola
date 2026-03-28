let productos = [];
import { cargarPagina, activarRouter } from "./router.js";

export async function cargarProductos() {
  try {
    const response = await fetch(`${BASE_URL}data/productos.json`);
    productos = await response.json();
  } catch (error) {
    console.error("Error cargando productos:", error);
  }
}

 export const BASE_URL = location.hostname.includes("github.io")
  ? "/Entregable1Mola/"
  : "/";
  
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
          <img src="${BASE_URL}${p.imagen}" class="card-img-top img-producto">

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

  const navbar = await fetch(`${BASE_URL}componentes/navbar.html`);
  const footer = await fetch(`${BASE_URL}componentes/footer.html`);

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
      <div class="d-flex align-items-center justify-content-between bg-carrito" style="gap:1rem;">
        
        <div class="d-flex align-items-center ">
          <img src="${BASE_URL}${producto.imagen}" 
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
    li.style.borderWidth = "0.2rem";
    li.style.borderColor = "#9A7F8F";
    li.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)";

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

export function mostrarFormularioPago() {
  const carritoSection = document.getElementById("carrito");

  if (!carritoSection) return;

  if (document.getElementById("form-pago")) return;

  const formHTML = `
    <div id="form-pago" class="mt-5 pb-5 container">
      <h3 class="mb-4 text-center">Datos de pago</h3>

      <form id="formularioPago" class="p-4 border rounded bg-light">

        <div class="mb-3">
          <label class="form-label">Titular de la tarjeta</label>
          <input type="text" id="titular" class="form-control" required>
        </div>

        <div class="mb-3">
          <label class="form-label">Número</label>
          <input type="text" id="numero" class="form-control" maxlength="19" required>
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Caducidad (MM/AA)</label>
            <input type="text" id="caducidad" class="form-control" maxlength="5" required>
          </div>

          <div class="col-md-6 mb-3">
            <label class="form-label">CVV</label>
            <input type="text" id="cvv" class="form-control" maxlength="3" required>
          </div>
        </div>

        <button type="submit" class="btn btn-dark w-100 mt-3">
          Pagar
        </button>

      </form>
    </div>
  `;

  carritoSection.insertAdjacentHTML("afterend", formHTML);

  activarValidacionesPago();
}

function activarValidacionesPago() {
  const titular = document.getElementById("titular");
  const numero = document.getElementById("numero");
  const caducidad = document.getElementById("caducidad");
  const cvv = document.getElementById("cvv");
  const form = document.getElementById("formularioPago");

  titular.placeholder = "Tomas Mola";
  numero.placeholder = "4500 1234 5678 9012";
  caducidad.placeholder = "05/27";
  cvv.placeholder = "123";

  titular.addEventListener("input", () => {
    titular.value = titular.value.replace(/[^a-zA-Z\s]/g, "");
  });

  numero.addEventListener("input", () => {
    let value = numero.value.replace(/\D/g, "").substring(0,16);
    value = value.replace(/(.{4})/g, "$1 ").trim();
    numero.value = value;
  });

  caducidad.addEventListener("input", () => {
    let value = caducidad.value.replace(/\D/g, "").substring(0,4);

    if (value.length >= 3) {
      value = value.substring(0,2) + "/" + value.substring(2);
    }

    caducidad.value = value;
  });

  cvv.addEventListener("input", () => {
    cvv.value = cvv.value.replace(/\D/g, "").substring(0,3);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validarFecha(caducidad.value)) {
      Swal.fire({
      icon: 'error',
      title: 'Fecha inválida',
      text: 'Debe ser posterior a 04/26',
      confirmButtonText: 'Entendido'
      });
      return;
    }

    mostrarModalFinal();
  });
}

function validarFecha(fecha) {
  const [mes, anio] = fecha.split("/").map(Number);

  if (!mes || !anio) return false;

  if (mes < 1 || mes > 12) return false;

  // mínimo abril 2026
  if (anio < 26) return false;
  if (anio === 26 && mes < 4) return false;

  return true;
}

function mostrarModalFinal() {

  const modalHTML = `
    <div class="modal fade" id="modalFinal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content text-center p-4">

          <h4>Gracias por tu compra</h4>
          <p>Te desea Amatista </p>

          <button class="btn btn-dark mt-3" id="volverInicio">
            Seguir comprando
          </button>

        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  const modal = new bootstrap.Modal(document.getElementById("modalFinal"));
  modal.show();

  document.getElementById("volverInicio").addEventListener("click", () => {

    localStorage.removeItem("carrito");
    carrito = [];

    window.location.href = `${BASE_URL}index.html`;
  });
}

document.addEventListener("DOMContentLoaded", async () => {

  await cargarComponentes();
  await cargarProductos();

  activarRouter();

  const rutaInicial = window.location.pathname;

  if (rutaInicial === "/" || rutaInicial === "/index.html") {
   await cargarPagina("/");
  } else {
   await cargarPagina(rutaInicial);
  }

  });

