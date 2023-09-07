const productForm = document.getElementById("product-form");
const productTable = document.getElementById("product-table");
const searchInput = document.getElementById("inputBusqueda");

// Función para obtener productos desde el servidor
const productos = [];

function obtenerProductos() {
  fetch("/productos")
    .then((response) => response.json())
    .then((data) => {
      productos.push(...data);
      actualizarTabla();
    })
    .catch((error) => {
      console.error("Error al obtener productos:", error);
    });
}

// Llama a la función para obtener productos cuando la página se carga

function actualizarTabla(productosEncontrados = productos) {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";
  productosEncontrados.forEach((producto, index) => {
    const row = document.createElement("tr");
    const fechaISO8601 = producto.fechaCaducidad;
    const fecha = new Date(fechaISO8601);
    const opciones = { year: "numeric", month: "numeric", day: "numeric" };
    const fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);
    row.innerHTML = `
        <td>${producto.nombre}</td>
        <td>${producto.referencia}</td>
        <td>${fechaFormateada}</td>
        <td>${producto.categoria}</td>
        <td class="editable" contentEditable="true" data-index="${index}">${producto.stock}</td>
        <td>
            <button class="delete" data-index="${index}">Eliminar</button>
        </td>
    `;
    tbody.appendChild(row);
  });
}

function limpiarFormulario() {
  document.getElementById("nombre").value = "";
  document.getElementById("referencia").value = "";
  document.getElementById("fecha-caducidad").value = "";
  document.getElementById("categoria").value = "";
  document.getElementById("stock").value = "";
}

function eliminarProducto(event) {
  if (event.target.classList.contains("delete")) {
    const id = event.target.getAttribute("data-id");

    // Realiza una solicitud al servidor para eliminar el producto por ID
    fetch(`/productos/eliminar/${id}`, {
      method: "GET", // Utiliza el método GET para esta solicitud
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Si la eliminación fue exitosa, actualiza la interfaz de usuario
          const index = event.target.getAttribute("data-index");
          productos.splice(index, 1);
          actualizarTabla();
        } else {
          // Manejo de errores: muestra un mensaje de error o realiza otra acción en caso de error
          console.error("Error al eliminar el producto.");
        }
      })
      .catch((error) => {
        console.error("Error al eliminar el producto:", error);
      });
  }
}

function filtrarProductos() {
  // Obtén el valor del input de búsqueda
  const filtro = document.getElementById("inputBusqueda").value;

  // Verifica si filtro no es null ni una cadena vacía antes de hacer la búsqueda
  if (filtro !== null && filtro.trim() !== "") {
    // Realiza una solicitud al servidor Express para buscar productos por nombre
    fetch(`/productos/buscar?nombre=${filtro}`)
      .then((response) => response.json())
      .then((data) => {
        // Procesa los resultados y actualiza la vista con los productos encontrados
        const productosEncontrados = data.productosEncontrados;
        actualizarTabla(productosEncontrados);
      })
      .catch((error) => {
        console.error("Error al buscar productos:", error);
      });
  } else {
    // Si el campo de búsqueda está vacío, restablece la lista de productos al estado inicial
    // Reemplaza esto con la lógica para obtener los productos iniciales
    actualizarTabla(productos);
  }
}

function guardarCambiosStock(event) {
  if (event.target.classList.contains("editable")) {
    const index = event.target.getAttribute("data-index");
    const nuevoStock = event.target.textContent.trim();

    if (nuevoStock === "") {
      event.target.textContent = productos[index].stock;
    } else if (!isNaN(nuevoStock)) {
      productos[index].stock = parseInt(nuevoStock, 10);
    } else {
      event.target.textContent = productos[index].stock;
      alert("Por favor, ingrese un valor numérico válido.");
    }
  }
}
productTable.addEventListener("keydown", (event) => {
  if (event.target.classList.contains("editable")) {
    if (event.key === "Delete" || event.key === "Backspace") {
      event.target.textContent = "";
      event.preventDefault();
    }
  }
});

productTable.addEventListener("click", eliminarProducto);
searchInput.addEventListener("input", filtrarProductos);
productTable.addEventListener("input", guardarCambiosStock);

obtenerProductos();
