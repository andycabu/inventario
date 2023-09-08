const productForm = document.getElementById("productForm");
const productTable = document.getElementById("product-table");
const searchInput = document.getElementById("inputBusqueda");
// Función para obtener productos desde el servidor
let productos = [];

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

// Llama a la función para obtener productos cuando la página se carga

function actualizarTabla(productosEncontrados = productos) {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";
  productosEncontrados.forEach((producto) => {
    const editableElements = document.querySelectorAll(".editable");

    editableElements.forEach((element) => {
      element.addEventListener("blur", guardarCambiosStock);
    });
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
        <td class="editable"  contenteditable="true" data-id="${producto._id}">${producto.stock}</td>
        <td>
            <button  class="delete" data-id="${producto._id}">Eliminar</button>
        </td>
    `;
    tbody.appendChild(row);
  });
}

async function añadirProducto(event) {
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

  try{
    const res = await fetch("/.netlify/functions/api/productos/agregar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(producto),
    });
    if (!res.ok) {throw new Error("Error al añadir el producto");}
    const data = await res.json();
    productos = data;
    actualizarTabla(productos);
  }catch(error){
    console.error(error);
  }
  limpiarFormulario();
}

function limpiarFormulario() {
  document.getElementById("nombre").value = "";
  document.getElementById("referencia").value = "";
  document.getElementById("fechaCaducidad").value = "";
  document.getElementById("categoria").value = "";
  document.getElementById("stock").value = "";
}



async function eliminarProducto(event) {
  if (event.target.classList.contains("delete")) {
    const id = event.target.getAttribute("data-id");
    // Realiza una solicitud al servidor para eliminar el producto por ID
   try{
    const res = await fetch(`/.netlify/functions/api/productos/eliminar/${id}`, {
      method: "GET",
    });
    if (!res.ok) {throw new Error("Error al eliminar el producto");}
    const data = await res.json();
    productos = data;
    actualizarTabla(productos);
    }catch(error){
      console.error(error);
   }
  }
}

async function filtrarProductos() {
  // Obtén el valor del input de búsqueda
  const filtro = document.getElementById("inputBusqueda").value;

  // Verifica si filtro no es null ni una cadena vacía antes de hacer la búsqueda
  if (filtro !== null && filtro.trim() !== "") {
    // Realiza una solicitud al servidor Express para buscar productos por nombre
    try{
      const res = await fetch(`/.netlify/functions/api/productos/buscar?nombre=${filtro}`);
      if (!res.ok) {throw new Error("Error al filtrar los productos");}
      const data = await res.json();
      productos = data.productosEncontrados;
      actualizarTabla(productos);
    }catch(error){
      console.error(error);
    }  
  } else {
    // Si el campo de búsqueda está vacío, restablece la lista de productos al estado inicial
    // Reemplaza esto con la lógica para obtener los productos iniciales
    actualizarTabla(productos);
  }
}

async function guardarCambiosStock(event) {
  if (event.target.classList.contains("editable")) {
    const index = event.target.getAttribute("data-id");
    const nuevoStock = event.target.textContent.trim() || 0;
    if (event.type === "blur") {
      try{
        const res = await fetch(`/.netlify/functions/api/productos/editar/${index}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stock: nuevoStock }),
        });
        if (!res.ok) {throw new Error("Error al editar el producto");}
        const data = await res.json();
       
      }catch(error){
        console.error(error);
      }
    }
  }
}
obtenerProductos();
productTable.addEventListener("click", eliminarProducto);
searchInput.addEventListener("input", filtrarProductos);
productForm.addEventListener("submit", añadirProducto);
