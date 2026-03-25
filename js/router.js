import { renderizarProductos, irAPagina, activarCards, activarNavegacion, cargarCarrito, renderizarCarrito, } from "./index.js";
import { productos } from "./productos.js";

//activación de la página
export async function cargarPagina(ruta){

  const app = document.getElementById("app");

  const rutas = {
    "/": "/pages/home.html",
    "/aros": "/pages/aros.html",
    "/collares": "/pages/collares.html",
    "/pulseras": "/pages/pulseras.html",
    "/tobilleras": "/pages/tobilleras.html",
    "/anillos": "/pages/anillos.html",
    "/combos": "/pages/combos.html", 
    "/carrito": "pages/carrito.html"
  };
  
  const pagina = rutas[ruta] || "pages/home.html";
  
  app.classList.add("page-hidden");

  const response = await fetch(pagina);
  const html = await response.text();


  setTimeout(() => {

    app.innerHTML = html;

    if (ruta === "/") renderizarProductos("home");
    if (ruta === "/anillos") renderizarProductos("anillos");
    if (ruta === "/aros") renderizarProductos("aros");
    if (ruta === "/collares") renderizarProductos("collares"); 
    if (ruta === "/pulseras") renderizarProductos("pulseras");
    if (ruta === "/tobilleras") renderizarProductos("tobilleras");
    if (ruta === "/combos") renderizarProductos("combos");
    if (ruta === "/carrito") {
      cargarCarrito();
    };

    activarCards();
    activarNavegacion();

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


    app.classList.remove("page-hidden");
    app.classList.add("page-visible");

  },150);
}

export function activarRouter() {

  document.addEventListener("click", function(e){

    const link = e.target.closest("[data-link]");

    if(!link) return;

    e.preventDefault();

    const pagina = link.dataset.link;

    irAPagina(pagina);

  });

}