const productos = [
    {
        "nombre": "a",
        "referencia": "REF001",
        "fechaCaducidad": "2023-12-31",
        "categoria": "Electrónica",
        "stock": 50
    },
    {
        "nombre": "b",
        "referencia": "REF002",
        "fechaCaducidad": "2023-10-15",
        "categoria": "Ropa",
        "stock": 30
    },
    {
        "nombre": "c",
        "referencia": "REF003",
        "fechaCaducidad": "2023-11-20",
        "categoria": "Hogar",
        "stock": 75
    },
    {
        "nombre": "d",
        "referencia": "REF004",
        "fechaCaducidad": "2023-09-05",
        "categoria": "Electrónica",
        "stock": 20
    },
    {
        "nombre": "f",
        "referencia": "REF005",
        "fechaCaducidad": "2023-10-30",
        "categoria": "Ropa",
        "stock": 40
    },
    {
        "nombre": "g",
        "referencia": "REF006",
        "fechaCaducidad": "2023-11-10",
        "categoria": "Hogar",
        "stock": 60
    },
    {
        "nombre": "h",
        "referencia": "REF007",
        "fechaCaducidad": "2023-12-20",
        "categoria": "Electrónica",
        "stock": 15
    },
    {
        "nombre": "i",
        "referencia": "REF008",
        "fechaCaducidad": "2023-09-15",
        "categoria": "Ropa",
        "stock": 35
    },
    {
        "nombre": "j",
        "referencia": "REF009",
        "fechaCaducidad": "2023-10-25",
        "categoria": "Hogar",
        "stock": 70
    },
    {
        "nombre": "k",
        "referencia": "REF010",
        "fechaCaducidad": "2023-11-05",
        "categoria": "Electrónica",
        "stock": 25
    }
]

const mongoose = require('mongoose');

// Configura la conexión a la base de datos
mongoose.connect('mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// Manejar eventos de conexión
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conexión exitosa a MongoDB');
});

// Define el esquema del producto
const productoSchema = new mongoose.Schema({
    nombre: String,
    referencia: String,
    fechaCaducidad: Date,
    categoria: String,
    stock: Number,
  });
  
  // Crea el modelo 'Producto' a partir del esquema
  const Producto = mongoose.model('Producto', productoSchema);

  const nuevoProducto = new Producto({
    nombre: 'Producto de ejemplo',
    referencia: 'REF123',
    fechaCaducidad: new Date('2023-12-31'),
    categoria: 'Electrónica',
    stock: 10,
  });
  
  // Guarda el nuevo producto en la base de datos
  nuevoProducto.save((err) => {
    if (err) {
      console.error('Error al guardar el producto:', err);
    } else {
      console.log('Producto guardado con éxito');
    }
  });


const productForm = document.getElementById('product-form');
const productTable = document.getElementById('product-table');
const searchInput = document.getElementById('search');



function agregarProducto(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const referencia = document.getElementById('referencia').value;
    const fechaCaducidad = document.getElementById('fecha-caducidad').value;
    const categoria = document.getElementById('categoria').value;
    const stock = document.getElementById('stock').value;

    productos.push({
        nombre,
        referencia,
        fechaCaducidad,
        categoria,
        stock
    });

    actualizarTabla();
    limpiarFormulario();
}


function actualizarTabla(productosMostrar = productos) {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    productosMostrar.forEach((producto, index) => {
        const row = document.createElement('tr');
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
    console.log(productos)
}



function limpiarFormulario() {
    document.getElementById('nombre').value = '';
    document.getElementById('referencia').value = '';
    document.getElementById('fecha-caducidad').value = '';
    document.getElementById('categoria').value = '';
    document.getElementById('stock').value = '';
}


function eliminarProducto(event) {
    if (event.target.classList.contains('delete')) {
        const index = event.target.getAttribute('data-index');
        productos.splice(index, 1);
        actualizarTabla();
    }
}


function filtrarProductos() {
    const filtro = searchInput.value.toLowerCase();
    const productosFiltrados = productos.filter(producto => producto.nombre.toLowerCase().includes(filtro));
    actualizarTabla(productosFiltrados);
}
function guardarCambiosStock(event) {
    if (event.target.classList.contains('editable')) {
        const index = event.target.getAttribute('data-index');
        const nuevoStock = event.target.textContent.trim(); 

        if (nuevoStock === '') {
            event.target.textContent = productos[index].stock;
        } else if (!isNaN(nuevoStock)) {
           
            productos[index].stock = parseInt(nuevoStock, 10);
        } else {
           
            event.target.textContent = productos[index].stock;
            alert('Por favor, ingrese un valor numérico válido.');
        }
    }
}
productTable.addEventListener('keydown', (event) => {
    if (event.target.classList.contains('editable')) {
        if (event.key === 'Delete' || event.key === 'Backspace') {
            event.target.textContent = ''; 
            event.preventDefault(); 
        }
    }
});


productForm.addEventListener('submit', agregarProducto);
productTable.addEventListener('click', eliminarProducto);
searchInput.addEventListener('input', filtrarProductos);
productTable.addEventListener('input', guardarCambiosStock);


actualizarTabla();
