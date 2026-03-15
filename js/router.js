
//activación de la página

async function cargarPagina(pagina) {

  const respuesta = await fetch(pagina);
  const html = await respuesta.text();

  document.getElementById("app").innerHTML = html;

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