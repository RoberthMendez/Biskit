const inputBusqueda = document.getElementById("busquedaMascota");
const cards = document.querySelectorAll(".card-mascota");
const sinResultados = document.getElementById("sinResultados");
const btnLimpiar = document.getElementById("limpiarBusqueda");

const filtrarMascotas = () => {

  const texto = inputBusqueda.value.toLowerCase().trim(); // Obtiene lo que el usuario escribió y lo normaliza
  let cardsVisibles = 0;

  cards.forEach(card => {

    const nombre = card.dataset.nombre.toLowerCase(); // Obtiene el nombre de la mascota desde el atributo data-nombre y lo normaliza
    const visible = nombre.startsWith(texto); // Verifica si el nombre de la mascota comienza con el texto ingresado por el usuario

    card.style.display = visible ? "block" : "none"; // Muestra la tarjeta si es visible, de lo contrario la oculta
    if (visible) 
      cardsVisibles++; // Incrementa el contador de tarjetas visibles si la tarjeta actual es visible

  });

  if (cardsVisibles === 0 && texto !== "")
    sinResultados.classList.remove("hidden");
  else
    sinResultados.classList.add("hidden");
  
};

inputBusqueda.addEventListener("input", filtrarMascotas);

btnLimpiar.addEventListener("click", () => {
  inputBusqueda.value = "";
  filtrarMascotas();
  inputBusqueda.focus();
});
