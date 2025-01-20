// Variables globales
let pacientes = [];
let editandoId = null;
const modal = new bootstrap.Modal(document.getElementById('modalPaciente'));
const form = document.getElementById('formPaciente');

// Función para abrir modal nuevo
function abrirModalNuevo() {
    editandoId = null;
    form.reset();
    document.querySelector('.modal-title').textContent = 'Nuevo Paciente';
    modal.show();
}

// Función para cargar pacientes
function cargarPacientes() {
    const pacientesGuardados = localStorage.getItem('pacientes');
    if (pacientesGuardados) {
        pacientes = JSON.parse(pacientesGuardados);
        actualizarTablaPacientes();
    }
}

// Función para actualizar tabla
function actualizarTablaPacientes() {
    const tbody = document.getElementById('tablaPacientes');
    tbody.innerHTML = '';

    pacientes.forEach(paciente => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${paciente.nombres}</td>
            <td>${paciente.apellidos}</td>
            <td>${paciente.telefono}</td>
            <td>${paciente.email}</td>
            <td>${paciente.tipoEcografia}</td>
            <td>$${paciente.precio}</td>
            <td>
                <button class="btn btn-warning btn-sm me-1" onclick="editarPaciente(${paciente.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="eliminarPaciente(${paciente.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Función para guardar paciente
function guardarPaciente(e) {
    e.preventDefault();

    // Validar el formulario
    if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
        return;
    }

    // Recoger datos del formulario
    const paciente = {
        id: editandoId || Date.now(),
        nombres: document.getElementById('nombres').value.trim(),
        apellidos: document.getElementById('apellidos').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        email: document.getElementById('email').value.trim(),
        fechaNacimiento: document.getElementById('fechaNacimiento').value,
        sexo: document.getElementById('sexo').value,
        tipoEcografia: document.getElementById('tipoEcografia').value,
        precio: document.getElementById('precio').value,
        descripcion: document.getElementById('descripcion').value.trim()
    };

    try {
        if (editandoId) {
            // Actualizar paciente existente
            const index = pacientes.findIndex(p => p.id === editandoId);
            pacientes[index] = paciente;
        } else {
            // Agregar nuevo paciente
            pacientes.push(paciente);
        }

        // Guardar en localStorage
        localStorage.setItem('pacientes', JSON.stringify(pacientes));

        // Actualizar tabla
        actualizarTablaPacientes();

        // Cerrar modal y resetear formulario
        modal.hide();
        form.reset();
        form.classList.remove('was-validated');

        // Mostrar mensaje de éxito
        alert('Paciente guardado exitosamente');

    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error al guardar el paciente');
    }
}

// Función para editar paciente
function editarPaciente(id) {
    const paciente = pacientes.find(p => p.id === id);
    if (paciente) {
        editandoId = id;
        document.querySelector('.modal-title').textContent = 'Editar Paciente';

        // Llenar formulario
        document.getElementById('nombres').value = paciente.nombres;
        document.getElementById('apellidos').value = paciente.apellidos;
        document.getElementById('telefono').value = paciente.telefono;
        document.getElementById('email').value = paciente.email;
        document.getElementById('fechaNacimiento').value = paciente.fechaNacimiento;
        document.getElementById('sexo').value = paciente.sexo;
        document.getElementById('tipoEcografia').value = paciente.tipoEcografia;
        document.getElementById('precio').value = paciente.precio;
        document.getElementById('descripcion').value = paciente.descripcion;

        modal.show();
    }
}

// Función para eliminar paciente
function eliminarPaciente(id) {
    if (confirm('¿Está seguro de eliminar este paciente?')) {
        pacientes = pacientes.filter(p => p.id !== id);
        localStorage.setItem('pacientes', JSON.stringify(pacientes));
        actualizarTablaPacientes();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    cargarPacientes();
    // Evitar que el modal se cierre al hacer clic fuera
    document.getElementById('modalPaciente').addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.stopPropagation();
        }
    });
});

// Event listener para el formulario
form.addEventListener('submit', guardarPaciente);

// Event listener para limpiar validación al cerrar modal
document.getElementById('modalPaciente').addEventListener('hidden.bs.modal', () => {
    form.classList.remove('was-validated');
    form.reset();
});

// Espera a que el DOM se cargue completamente
document.addEventListener('DOMContentLoaded', function () {
    // Referencia al elemento del calendario
    const calendarEl = document.getElementById('calendar');

    // Inicializar FullCalendar
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        events: [
            { title: 'Ecografía General - Juan Pérez', date: '2025-01-20' },
            { title: 'Ecografía Abdominal - María González', date: '2025-01-22' },
        ],
        dateClick: handleDateClick // Se llama cuando se hace clic en una fecha
    });

    // Renderizar el calendario
    calendar.render();

    // Función para manejar el clic en las fechas del calendario
    function handleDateClick(info) {
        openModal(info.dateStr); // Abre el modal con la fecha seleccionada
    }

    // Función para abrir el modal de citas
    window.openModal = function (fecha) {
        const modal = document.getElementById('citaModal');
        document.getElementById('citaForm').reset(); // Resetea el formulario
        document.getElementById('citaForm').fecha = fecha; // Asocia la fecha con el formulario
        modal.style.display = 'block';
    }

    // Función para cerrar el modal de citas
    window.closeModal = function () {
        const modal = document.getElementById('citaModal');
        modal.style.display = 'none';
    }

    // Función para manejar el envío del formulario
    document.getElementById('citaForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Previene el comportamiento por defecto del formulario

        const nombre = document.getElementById('nombre').value;
        const cedula = document.getElementById('cedula').value;
        const celular = document.getElementById('celular').value;
        const tipo = document.getElementById('tipo').value;
        const hora = document.getElementById('hora').value;
        const fecha = document.getElementById('citaForm').fecha;

        // Agregar cita a la lista de citas y al calendario
        addCitaToList(fecha, tipo, nombre, hora);
        addCitaToCalendar(fecha, hora, tipo, nombre);

        // Cerrar el modal después de agregar la cita
        closeModal();
    });

    // Función para agregar la cita a la lista de citas
    function addCitaToList(fecha, tipo, nombre, hora) {
        const citaList = document.getElementById('citas-list');
        const citaItem = document.createElement('tr');
        citaItem.innerHTML = `<td>${fecha}</td><td>Ecografía ${tipo}</td><td>${nombre}</td><td>${hora}</td>`;
        citaList.appendChild(citaItem);
    }

    // Función para agregar la cita al calendario
    function addCitaToCalendar(fecha, hora, tipo, nombre) {
        calendar.addEvent({
            title: `Ecografía ${tipo} - ${nombre}`,
            start: `${fecha}T${hora}`,
            allDay: false
        });
    }

    // Función para abrir el modal de próximas citas
    window.openCitasModal = function () {
        document.getElementById('citasModal').style.display = 'block';
    }

    // Función para cerrar el modal de próximas citas
    window.closeCitasModal = function () {
        document.getElementById('citasModal').style.display = 'none';
    }
});

//USUARIOS

// Función para abrir el modal de usuarios
window.abrirModalUsu = function () {
    const modal = new bootstrap.Modal(document.getElementById('modalUsuario'));
    modal.show();
};

// Manejo del formulario para agregar un nuevo usuario
document.getElementById('formUsuario').addEventListener('submit', function (e) {
    e.preventDefault();
    const cedula = document.getElementById('cedula').value;
    const nombres = document.getElementById('nombres').value;
    const apellidos = document.getElementById('apellidos').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const direccion = document.getElementById('direccion').value;

    // Añadir una nueva fila a la tabla
    const nuevaFila = document.createElement('tr');
    nuevaFila.innerHTML = `
                    <td>${cedula}</td>
                    <td>${nombres}</td>
                    <td>${apellidos}</td>
                    <td>${email}</td>
                    <td>${telefono}</td>
                    <td>${direccion}</td>
                    <td><button class="btn btn-warning btn-sm">Editar</button> <button class="btn btn-danger btn-sm">Eliminar</button></td>
                `;
    document.getElementById('tablaUsuario').appendChild(nuevaFila);

    // Cerrar el modal
    const modal = new bootstrap.Modal(document.getElementById('modalUsuario'));
    modal.hide();

    // Limpiar el formulario
    document.getElementById('formUsuario').reset();
});

