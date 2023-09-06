const productForm = document.getElementById("product-form");
const productTable = document.getElementById("product-table");
const searchInput = document.getElementById("search");

// main.js

// Función para obtener productos desde el servidor
function obtenerProductos() {
  fetch("/") // Reemplaza "/productos" con la ruta correcta de tu servidor
    .then((response) => {
      console.log(response.json());
      if (!response.ok) {
        throw new Error("No se pudo obtener la respuesta del servidor.");
      }
      return response.json(); // Analizar la respuesta JSON
    })
    .then((data) => {
      const productos = data.productos; // Supongamos que los productos están en data.productos
      // Haz lo que necesites con los productos aquí, por ejemplo, actualizar la tabla
      actualizarTabla(productos);
    })
    .catch((error) => {
      console.error("Error al obtener productos:", error);
    });
}

// Llama a la función para obtener productos cuando la página se carga
window.addEventListener("load", obtenerProductos);

function actualizarTabla(productosMostrar) {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";

  productosMostrar.forEach((producto, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${producto.nombre}</td>
        <td>${producto.referencia}</td>
        <td>${producto.fechaCaducidad}</td>
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
    const index = event.target.getAttribute("data-index");
    productos.splice(index, 1);
    actualizarTabla();
  }
}

function filtrarProductos(filtro) {
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

actualizarTabla();
