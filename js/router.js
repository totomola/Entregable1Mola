
//activación de la página

async function cargarPagina(ruta){

  const app = document.getElementById("app");

  app.classList.add("page-hidden");

  const rutas = {
    "/": "pages/home.html",
    "/aros": "pages/aros.html",
    "/collares": "pages/collares.html",
    "/pulseras": "pages/pulseras.html",
    "/tobilleras": "pages/tobilleras.html",
    "/anillos": "pages/anillos.html",
    "/combos": "pages/combos.html", 
    "/carrito": "pages/carrito.html"
  };
  
  const pagina = rutas[ruta] || "pages/home.html";
  
  app.classList.add("page-hidden");

  const response = await fetch(pagina);
  const html = await response.text();


  setTimeout(() => {

    app.innerHTML = html;

    activarCards();
    activarNavegacion();

    app.classList.remove("page-hidden");
    app.classList.add("page-visible");

  },150);
}

function activarRouter() {

  document.addEventListener("click", function(e){

    const link = e.target.closest("[data-link]");

    if(!link) return;

    e.preventDefault();

    const pagina = link.dataset.link;

    cargarPagina(pagina);

  });

}