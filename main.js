let nombreGuardado = "";
let apellidoGuardado = "";
let dniGuardado = "";
let correoGuardado = "";
const selectMarca = document.getElementById("marca");
const selectModelo = document.getElementById("modelo");
const selectAnio = document.getElementById("anio");

class Vehiculo {
  constructor(marca) {
    this.marca = marca;
  }
}

fetch('vehiculos.json')
  .then(response => response.json()) 
  .then(data => {
    data.forEach(vehiculo => {
      const option = document.createElement("option");
      option.value = vehiculo.marca;
      option.textContent = vehiculo.marca;
      selectMarca.appendChild(option);
    });
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
  });

function llenarSelectAnio(marca, modelo) {
  const opciones = opcionesAnio[marca][modelo] || [];
  selectAnio.innerHTML = '<option value="">Año...</option>';

  opciones.forEach((anio) => {
    const option = document.createElement("option");
    option.value = anio;
    option.text = anio;
    selectAnio.appendChild(option);
  });
}

selectMarca.addEventListener("change", () => {
  selectModelo.disabled = false;

  const marcaSeleccionada = selectMarca.value;
  const modelos = opcionesModelo[marcaSeleccionada];
  
  const opcionesHTML = modelos.map(modelo => `<option value="${modelo}">${modelo || "Elegir"}</option>`).join('');
  selectModelo.innerHTML = opcionesHTML;

  llenarSelectAnio(marcaSeleccionada, selectModelo.value);
});

selectModelo.addEventListener("change", () => {
  selectAnio.disabled = false;

  const marcaSeleccionada = selectMarca.value;
  const modeloSeleccionado = selectModelo.value;

  llenarSelectAnio(marcaSeleccionada, modeloSeleccionado);
});

const fechaHoy = new Date();
const dia = fechaHoy.getDate();
const mes = fechaHoy.getMonth() + 1;
const anio = fechaHoy.getFullYear();
const fechaActual = `${dia}/${mes}/${anio}`;
localStorage.setItem('fecha', fechaActual);
const fechaAlmacenada = localStorage.getItem('fecha');
const elementoFecha = document.getElementById('fecha');
elementoFecha.textContent = fechaAlmacenada;

function controlarPestanas() {
  const selectMarca = document.getElementById("marca");
  const selectModelo = document.getElementById("modelo");
  const selectAnio = document.getElementById("anio");
  const nombreInput = document.getElementById("nombre");
  const apellidoInput = document.getElementById("apellido");
  const dniInput = document.getElementById("dni");
  const correoInput = document.getElementById("correo");

  const botonSiguiente = document.getElementById("botonSiguiente");
  const botonSiguiente2 = document.getElementById("botonSiguiente2");

  const pestanas = document.querySelectorAll('.nav-link');
  pestanas.forEach(pestaña => {
    if (pestaña.id !== "home-tab") {
      pestaña.setAttribute('disabled', true);
    }
  });

  botonSiguiente.addEventListener("click", () => {
    if (selectMarca.value && selectModelo.value && selectAnio.value) {
      pestanas.forEach(pestaña => {
        if (pestaña.id === "profile-tab") {
          pestaña.removeAttribute('disabled');
        } else {
          pestaña.setAttribute('disabled', true);
        }
      });

      document.getElementById("home-tab-pane").classList.remove("show", "active");
      document.getElementById("home-tab").classList.remove("active");
      document.getElementById("profile-tab-pane").classList.add("show", "active");
      document.getElementById("profile-tab").classList.add("active");
      calcularCotizacion();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, complete todos los campos antes de continuar.',
      });
    }
  });

  botonSiguiente2.addEventListener("click", (e) => {
    e.preventDefault();
    if (nombreInput.value && apellidoInput.value && dniInput.value && correoInput.value) {
      pestanas.forEach(pestaña => {
        if (pestaña.id === "contact-tab") {
          pestaña.removeAttribute('disabled');
        } else {
          pestaña.setAttribute('disabled', true);
        }
      });

      document.getElementById("profile-tab-pane").classList.remove("show", "active");
      document.getElementById("profile-tab").classList.remove("active");
      document.getElementById("contact-tab-pane").classList.add("show", "active");
      document.getElementById("contact-tab").classList.add("active");
      calcularCotizacion();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, complete todos los campos antes de continuar.',
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", controlarPestanas);

function calcularCotizacion() {
  return new Promise((resolve, reject) => {
    const marca = selectMarca.value;
    const modelo = selectModelo.value;
    const anio = selectAnio.value;

    let precioBase = preciosBase[marca] || 0;

    if (modelo === "Agile") {
      precioBase += 1000;
    } else if (modelo === "Aveo") {
      precioBase += 1200;
    }

    const añoActual = 2023;
    const factorDeDescuento = 0.05;

    if (anio >= "1954" && anio <= "2023") {
      const añosDiferencia = añoActual - anio;
      const descuento = añosDiferencia * factorDeDescuento;
      const precioConDescuento = precioBase - precioBase * descuento;

      precioBase = Math.max(Math.ceil(precioConDescuento), 14000);
    }

    const resultado = {
      precioBase: precioBase,
      precioTotal: precioBase
    };

    resolve(resultado);
  });
}

function mostrarResultadoEnDOM(resultado) {
  let resultadoHTML = `
    <div class="resultado-container">
      <h2>Costo:</h2>
      <p>Nombre:<span class="var"> ${nombreGuardado}</span></p>
      <p>Apellido: <span class="var"> ${apellidoGuardado}</span></p>
      <p>DNI: <span class="var"> ${dniGuardado}</span></p>
      <p>Correo: <span class="var"> ${correoGuardado}</span></p>
      <p>Marca: <span class="var"> ${selectMarca.value}</span></p>
      <p>Modelo: <span class="var"> ${selectModelo.value}</span></p>
      <p>Año: <span class="var"> ${selectAnio.value}</span></p>
      <p class= "costo">Precio Total: <span class="var"> $${resultado.precioTotal}</span></p>
    </div>
  `;

  let resultadoElement = document.getElementById("resultado");
  resultadoElement.innerHTML = resultadoHTML;
}

document.getElementById("botonSiguiente2").addEventListener("click", () => {
  nombreGuardado = document.getElementById("nombre").value;
  apellidoGuardado = document.getElementById("apellido").value;
  dniGuardado = document.getElementById("dni").value;
  correoGuardado = document.getElementById("correo").value;
  calcularCotizacion()
    .then(resultado => {
      mostrarResultadoEnDOM(resultado);
    })
    .catch(error => {
      console.error("Error al calcular la cotización:", error);
    });
});
