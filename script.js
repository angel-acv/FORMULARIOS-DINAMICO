var CURSOS_DISPONIBLES = [
  { id: 'c1', nombre: 'Desarrollo Web con HTML y CSS',     precio: 120000 },
  { id: 'c2', nombre: 'JavaScript Avanzado',               precio: 180000 },
  { id: 'c3', nombre: 'React.js desde Cero',               precio: 200000 },
  { id: 'c4', nombre: 'Node.js y APIs REST',               precio: 190000 },
  { id: 'c5', nombre: 'Base de Datos con SQL',             precio: 150000 },
  { id: 'c6', nombre: 'Python para Ciencia de Datos',      precio: 210000 },
  { id: 'c7', nombre: 'Diseño UX/UI Fundamentos',          precio: 140000 },
  { id: 'c8', nombre: 'Git y Control de Versiones',        precio:  80000 }
];

var contadorTel   = 0;
var contadorCurso = 0;

document.addEventListener('DOMContentLoaded', function () {
  agregarTelefono();
  agregarCurso();

  document.getElementById('btn-agregar-tel').addEventListener('click', agregarTelefono);
  document.getElementById('btn-agregar-curso').addEventListener('click', agregarCurso);
  document.getElementById('formulario').addEventListener('submit', manejarEnvio);

  document.getElementById('cedula').addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '');
  });
});

function agregarTelefono() {
  contadorTel++;
  var id = 'tel-' + contadorTel;

  var fila = document.createElement('div');
  fila.className = 'fila-dinamica';
  fila.id = 'fila-' + id;

  var input = document.createElement('input');
  input.type = 'tel';
  input.id   = id;
  input.placeholder = 'Ej: 3001234567';
  input.maxLength = 10;
  input.inputMode = 'numeric';
  input.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '');
  });

  var btnEliminar = document.createElement('button');
  btnEliminar.type = 'button';
  btnEliminar.className = 'btn-eliminar';
  btnEliminar.textContent = '×';
  btnEliminar.setAttribute('aria-label', 'Eliminar teléfono');
  btnEliminar.addEventListener('click', function () {
    eliminarFila('fila-' + id);
  });

  fila.appendChild(input);
  fila.appendChild(btnEliminar);

  document.getElementById('contenedor-telefonos').appendChild(fila);
  input.focus();
}

function agregarCurso() {
  contadorCurso++;
  var id = 'curso-' + contadorCurso;

  var fila = document.createElement('div');
  fila.className = 'fila-dinamica';
  fila.id = 'fila-' + id;

  var select = document.createElement('select');
  select.id = id;

  var opcionVacia = document.createElement('option');
  opcionVacia.value = '';
  opcionVacia.textContent = '— Selecciona un curso —';
  select.appendChild(opcionVacia);

  for (var i = 0; i < CURSOS_DISPONIBLES.length; i++) {
    var curso = CURSOS_DISPONIBLES[i];
    var opcion = document.createElement('option');
    opcion.value = curso.precio;
    opcion.textContent = curso.nombre + '  —  ' + formatearPrecio(curso.precio);
    select.appendChild(opcion);
  }

  select.addEventListener('change', actualizarTotal);

  var btnEliminar = document.createElement('button');
  btnEliminar.type = 'button';
  btnEliminar.className = 'btn-eliminar';
  btnEliminar.textContent = '×';
  btnEliminar.setAttribute('aria-label', 'Eliminar curso');
  btnEliminar.addEventListener('click', function () {
    eliminarFila('fila-' + id);
    actualizarTotal();
  });

  fila.appendChild(select);
  fila.appendChild(btnEliminar);

  document.getElementById('contenedor-cursos').appendChild(fila);
}

function eliminarFila(idFila) {
  var fila = document.getElementById(idFila);
  if (fila) {
    fila.parentNode.removeChild(fila);
  }
}

function actualizarTotal() {
  var total   = 0;
  var selects = document.getElementById('contenedor-cursos').querySelectorAll('select');

  for (var i = 0; i < selects.length; i++) {
    var valor = parseFloat(selects[i].value);
    if (!isNaN(valor)) {
      total += valor;
    }
  }

  document.getElementById('total-display').textContent = '$ ' + formatearPrecio(total);
}

function formatearPrecio(valor) {
  return valor.toLocaleString('es-CO');
}

function validarFormulario() {
  var valido = true;

  limpiarErrores();

  var nombres = document.getElementById('nombres').value.trim();
  if (nombres === '') {
    mostrarError('err-nombres', 'El nombre es obligatorio.');
    marcarInvalido('nombres');
    valido = false;
  }

  var apellidos = document.getElementById('apellidos').value.trim();
  if (apellidos === '') {
    mostrarError('err-apellidos', 'Los apellidos son obligatorios.');
    marcarInvalido('apellidos');
    valido = false;
  }

  var cedula = document.getElementById('cedula').value.trim();
  if (cedula === '') {
    mostrarError('err-cedula', 'La cédula es obligatoria.');
    marcarInvalido('cedula');
    valido = false;
  } else if (!/^\d{6,12}$/.test(cedula)) {
    mostrarError('err-cedula', 'Ingresa solo números (6 a 12 dígitos).');
    marcarInvalido('cedula');
    valido = false;
  }

  var correo = document.getElementById('correo').value.trim();
  var regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (correo === '') {
    mostrarError('err-correo', 'El correo es obligatorio.');
    marcarInvalido('correo');
    valido = false;
  } else if (!regexCorreo.test(correo)) {
    mostrarError('err-correo', 'Formato de correo inválido.');
    marcarInvalido('correo');
    valido = false;
  }

  var inputsTel    = document.getElementById('contenedor-telefonos').querySelectorAll('input');
  var hayTelValido = false;

  for (var i = 0; i < inputsTel.length; i++) {
    if (inputsTel[i].value.trim() !== '') {
      hayTelValido = true;
      break;
    }
  }

  if (!hayTelValido) {
    mostrarError('err-telefonos', 'Ingresa al menos un número de teléfono.');
    valido = false;
  }

  var selectsCurso         = document.getElementById('contenedor-cursos').querySelectorAll('select');
  var hayCursoSeleccionado = false;

  for (var j = 0; j < selectsCurso.length; j++) {
    if (selectsCurso[j].value !== '') {
      hayCursoSeleccionado = true;
      break;
    }
  }

  if (!hayCursoSeleccionado) {
    mostrarError('err-cursos', 'Selecciona al menos un curso.');
    valido = false;
  }

  return valido;
}

function mostrarError(idSpan, mensaje) {
  document.getElementById(idSpan).textContent = mensaje;
}

function marcarInvalido(idInput) {
  document.getElementById(idInput).classList.add('invalido');
}

function limpiarErrores() {
  var spans = document.querySelectorAll('.error');
  for (var i = 0; i < spans.length; i++) {
    spans[i].textContent = '';
  }
  var inputs = document.querySelectorAll('input.invalido, select.invalido');
  for (var j = 0; j < inputs.length; j++) {
    inputs[j].classList.remove('invalido');
  }
}

function manejarEnvio(evento) {
  evento.preventDefault();

  if (!validarFormulario()) {
    var primerError = document.querySelector('.error:not(:empty)');
    if (primerError) {
      primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  mostrarResumen();
}

function mostrarResumen() {
  var nombres   = document.getElementById('nombres').value.trim();
  var apellidos = document.getElementById('apellidos').value.trim();
  var cedula    = document.getElementById('cedula').value.trim();
  var correo    = document.getElementById('correo').value.trim();

  var telefonos = [];
  var inputsTel = document.getElementById('contenedor-telefonos').querySelectorAll('input');
  for (var i = 0; i < inputsTel.length; i++) {
    var tel = inputsTel[i].value.trim();
    if (tel !== '') {
      telefonos.push(tel);
    }
  }

  var cursosSeleccionados = [];
  var totalFinal          = 0;
  var selectsCurso        = document.getElementById('contenedor-cursos').querySelectorAll('select');

  for (var j = 0; j < selectsCurso.length; j++) {
    var sel = selectsCurso[j];
    if (sel.value !== '') {
      var precio      = parseFloat(sel.value);
      var nombreCurso = sel.options[sel.selectedIndex].text.split('  —  ')[0];
      cursosSeleccionados.push({ nombre: nombreCurso, precio: precio });
      totalFinal += precio;
    }
  }

  var html = '';

  html += '<div class="resumen-bloque">';
  html += '<table class="tabla-resumen">';
  html += '<caption>Datos Personales</caption><tbody>';
  html += '<tr><th>Nombres</th><td>'  + nombres + ' ' + apellidos + '</td></tr>';
  html += '<tr><th>Cédula</th><td>'   + cedula  + '</td></tr>';
  html += '<tr><th>Correo</th><td>'   + correo  + '</td></tr>';
  html += '</tbody></table></div>';

  html += '<div class="resumen-bloque">';
  html += '<table class="tabla-resumen">';
  html += '<caption>Teléfonos</caption><tbody>';
  for (var t = 0; t < telefonos.length; t++) {
    html += '<tr><th>Teléfono ' + (t + 1) + '</th><td>' + telefonos[t] + '</td></tr>';
  }
  html += '</tbody></table></div>';

  html += '<div class="resumen-bloque">';
  html += '<table class="tabla-resumen">';
  html += '<caption>Cursos Inscritos</caption>';
  html += '<thead><tr><th>Curso</th><th>Valor</th></tr></thead><tbody>';
  for (var c = 0; c < cursosSeleccionados.length; c++) {
    html += '<tr>';
    html += '<td>' + cursosSeleccionados[c].nombre + '</td>';
    html += '<td>$ ' + formatearPrecio(cursosSeleccionados[c].precio) + '</td>';
    html += '</tr>';
  }
  html += '</tbody></table></div>';

  html += '<div class="resumen-total">';
  html += '<span>Total a pagar</span>';
  html += '<strong>$ ' + formatearPrecio(totalFinal) + '</strong>';
  html += '</div>';

  document.getElementById('resumen-contenido').innerHTML = html;
  var seccionResumen = document.getElementById('resumen');
  seccionResumen.classList.remove('hidden');
  seccionResumen.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
