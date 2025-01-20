
//MODAL DE LISTA DE PRODUCTOS
// Variables globales
let productos = [];
const modalProducto = new bootstrap.Modal(document.getElementById('modalPaciente'));
const formProducto = document.getElementById('formPaciente');

// Función para abrir modal de nuevo producto
function abrirModalNuevo() {
    editandoId = null;
    formProducto.reset();
    document.querySelector('.modal-title').textContent = 'Nuevo Producto';
    modalProducto.show();
}

// Función para cargar productos desde localStorage
function cargarProductos() {
    const productosGuardados = localStorage.getItem('productos');
    if (productosGuardados) {
        productos = JSON.parse(productosGuardados);
        actualizarTablaProductos();
    }
}

// Función para actualizar tabla de productos
function actualizarTablaProductos() {
    const tbody = document.getElementById('tablaPacientes');
    tbody.innerHTML = '';
    
    productos.forEach(producto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${producto.nombres}</td>
            <td>$${producto.precio.toFixed(2)}</td>
            <td>${producto.stock}</td>
            <td>${producto.categoria}</td>
            <td>${producto.descripcion}</td>
            <td>${producto.activo ? 'Sí' : 'No'}</td>
            <td>
                <button class="btn btn-warning btn-sm me-1" onclick="editarProducto(${producto.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${producto.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Función para guardar producto
function guardarProducto(e) {
    e.preventDefault();

    // Validar el formulario
    if (!formProducto.checkValidity()) {
        e.stopPropagation();
        formProducto.classList.add('was-validated');
        return;
    }

    // Recoger datos del formulario
    const producto = {
        id: editandoId || Date.now(),
        nombres: document.getElementById('nombres').value.trim(),
        precio: parseFloat(document.getElementById('precio').value),
        stock: parseInt(document.getElementById('stock').value),
        categoria: document.getElementById('sexo').value,
        descripcion: document.getElementById('descripcion').value.trim(),
        activo: true,
    };

    try {
        if (editandoId) {
            // Actualizar producto existente
            const index = productos.findIndex(p => p.id === editandoId);
            productos[index] = producto;
        } else {
            // Agregar nuevo producto
            productos.push(producto);
        }

        // Guardar en localStorage
        localStorage.setItem('productos', JSON.stringify(productos));
        
        // Actualizar tabla
        actualizarTablaProductos();
        
        // Cerrar modal y resetear formulario
        modalProducto.hide();
        formProducto.reset();
        formProducto.classList.remove('was-validated');
        
        alert('Producto guardado exitosamente');
        
    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error al guardar el producto');
    }
}

// Función para editar producto
function editarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        editandoId = id;
        document.querySelector('.modal-title').textContent = 'Editar Producto';
        
        // Llenar formulario
        document.getElementById('nombres').value = producto.nombres;
        document.getElementById('precio').value = producto.precio;
        document.getElementById('stock').value = producto.stock;
        document.getElementById('sexo').value = producto.categoria;
        document.getElementById('descripcion').value = producto.descripcion;
        
        modalProducto.show();
    }
}

// Función para eliminar producto
function eliminarProducto(id) {
    if (confirm('¿Está seguro de eliminar este producto?')) {
        productos = productos.filter(p => p.id !== id);
        localStorage.setItem('productos', JSON.stringify(productos));
        actualizarTablaProductos();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();

    // Limpiar validación al cerrar modal
    document.getElementById('modalPaciente').addEventListener('hidden.bs.modal', () => {
        formProducto.classList.remove('was-validated');
        formProducto.reset();
    });
});

// Event listener para el formulario
formProducto.addEventListener('submit', guardarProducto);
