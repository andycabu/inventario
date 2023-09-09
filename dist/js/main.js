const productForm = document.getElementById("productForm");
const productTable = document.getElementById("product-table");
const searchInput = document.getElementById("inputBusqueda");
const fechaCaducidad = document.getElementById("fechaCaducidad");
const fechaActual = new Date();

let productos = [];

const fechaActualFormateada = fechaActual.toISOString().slice(0, 10);
fechaCaducidad.value = fechaActualFormateada;

async function obtenerProductos() {
try {
    const res = await fetch("/.netlify/functions/api/productos");
    if (!res.ok) {throw new Error("Error al obtener los productos");}
    const data = await res.json();
    productos.push(...data);
    actualizarTabla(productos);
  } catch (error) {
  console.error(error);
  }
}

function actualizarTabla(productosEncontrados = productos) {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";
  productosEncontrados.forEach((producto) => {
    const row = document.createElement("tr");
    const fechaISO8601 = producto.fechaCaducidad;
    const fecha = new Date(fechaISO8601);
    const opciones = { year: "numeric", month: "numeric", day: "numeric" };
    const fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);
    row.innerHTML = `
        <td class="editable">${producto.nombre}</td>
        <td>${producto.referencia}</td>
        <td>${fechaFormateada}</td>
        <td>${producto.categoria}</td>
        <td class="editable"  contenteditable="true" data-id="${producto._id}">${producto.stock}</td>
        <td>
            <button  class="delete" data-id="${producto._id}">Eliminar</button>
        </td>
    `;
    tbody.appendChild(row);
  });
  const editableElements = document.querySelectorAll(".editable");
  editableElements.forEach((element) => {
    element.addEventListener("blur", guardarCambiosStock);
  });
}

function añadirProducto(event) {
  event.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const referencia = document.getElementById("referencia").value;
  const fechaCaducidad = document.getElementById("fechaCaducidad").value;
  const categoria = document.getElementById("categoria").value;
  const stock = document.getElementById("stock").value;

  const producto = {
    nombre,
    referencia,
    fechaCaducidad,
    categoria,
    stock,
  };

  fetch("/.netlify/functions/api/productos/agregar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(producto),
  }).then((res) => {
    if (!res.ok) {throw new Error("Error al añadir el producto");}
    return res.json();
  }).then((data) => {
    productos = data;
    actualizarTabla(productos);
  }).catch((error) => {
    console.error(error);
  });
  limpiarFormulario();
}

function limpiarFormulario() {
  document.getElementById("nombre").value = "";
  document.getElementById("referencia").value = "";
  document.getElementById("fechaCaducidad").value = "";
  document.getElementById("categoria").value = "";
  document.getElementById("stock").value = "";
}
function eliminarProducto(event) {
  if (event.target.classList.contains("delete")) {
    const id = event.target.getAttribute("data-id");

    fetch(`/.netlify/functions/api/productos/eliminar/${id}`).then((res) => {
      if (!res.ok) {throw new Error("Error al eliminar el producto");}
      return res.json();
    }).then((data) => {
      productos = data;
      actualizarTabla(productos);
    }).catch((error) => {
      console.error(error);
    });
  }
}

function filtrarProductos() {
  const filtro = document.getElementById("inputBusqueda").value;
  fetch(`/.netlify/functions/api/productos/buscar?nombre=${filtro}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Error al filtrar los productos");
      }
      return res.json();
    })
    .then((data) => {
      const { productosEncontrados } = data;
      actualizarTabla(productosEncontrados);
    })
    .catch((error) => {
      console.error(error);
    });
}

  
function guardarCambiosStock(event) {
  if (event.target.classList.contains("editable")) {
    const index = event.target.getAttribute("data-id");
    const nuevoStock = event.target.textContent.trim() 
    if (nuevoStock === "") {
      actualizarTabla(productos);
      return;
    }
    if (event.type === "blur") {
     fetch(`/.netlify/functions/api/productos/editar/${index}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stock: nuevoStock }),
      }).then((res) => {
        if (!res.ok) {throw new Error("Error al editar el stock");}
        return res.json();
      }).then((data) => {
        productos = data;
        actualizarTabla(productos);
      }).catch((error) => {
        console.error(error);
      });
    }
  }
}

obtenerProductos();

productTable.addEventListener("click", eliminarProducto);
searchInput.addEventListener("input", filtrarProductos);
productForm.addEventListener("submit", añadirProducto);
