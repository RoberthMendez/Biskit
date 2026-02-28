const input = document.getElementById("clienteSearch");
const dropdown = document.getElementById("clienteDropdown");
const hiddenInput = document.getElementById("clienteId");
const options = document.querySelectorAll(".cliente-option");
const tituloFormulario = document.getElementById("titulo-formulario");

// Mostrar dropdown al enfocar
input.addEventListener("focus", () => {
    dropdown.classList.remove("hidden");
});

// Filtrar mientras escribe
input.addEventListener("input", () => {
    const value = input.value.toLowerCase();

    options.forEach(option => {
        const nombre = option.dataset.nombre.toLowerCase();
        const cedula = option.dataset.cedula.toLowerCase();

        if (nombre.includes(value) || cedula.includes(value)) {
        option.style.display = "block";
        } else {
        option.style.display = "none";
        }
    });
});

// Al hacer click
options.forEach(option => {
    option.addEventListener("click", () => {
        const nombre = option.dataset.nombre;
        const id = option.dataset.id;

        input.value = nombre;        
        hiddenInput.value = id;  
        dropdown.classList.add("hidden");
    });
});

// Cerrar si se hace click afuera
document.addEventListener("click", (e) => {
    if (!e.target.closest(".relative")) {
        dropdown.classList.add("hidden");
    }
});




