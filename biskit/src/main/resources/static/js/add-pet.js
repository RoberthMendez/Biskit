const input = document.getElementById("clienteSearch");
const dropdown = document.getElementById("clienteDropdown");
const hiddenInput = document.getElementById("clienteCedula");
const options = document.querySelectorAll(".cliente-option");

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
        const cedula = option.dataset.cedula;

        input.value = nombre;        // Muestra nombre
        hiddenInput.value = cedula;  // Guarda cédula
        dropdown.classList.add("hidden");
    });
});

// Cerrar si se hace click afuera
document.addEventListener("click", (e) => {
    if (!e.target.closest(".relative")) {
        dropdown.classList.add("hidden");
    }
});