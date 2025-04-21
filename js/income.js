const productosSemanaActual = [ 
  { id: 1, nombre: 'Camisa', precio: 150, cantidad: 4 },
  { id: 2, nombre: 'Pantalón', precio: 250, cantidad: 2 }
];

const productosSemanaPasada = [
  { id: 3, nombre: 'Gorra', precio: 80, cantidad: 4 },
  { id: 4, nombre: 'Calcetas', precio: 30, cantidad: 6 },
  { id: 5, nombre: 'Sacapuntas', precio: 30, cantidad: 6 }
];

let ordenAscendente = {};

function renderizarTabla(tablaId, productos, filtro = '') {
  const tbody = document.querySelector(`#${tablaId} tbody`);
  tbody.innerHTML = '';

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  let totalGeneral = 0;

  productosFiltrados.forEach(producto => {
    const total = producto.precio * producto.cantidad;
    totalGeneral += total;

    const fila = `
      <tr>
        <td>${producto.id}</td>
        <td>${producto.nombre}</td>
        <td>$${producto.precio}</td>
        <td>${producto.cantidad}</td>
        <td>$${total}</td>
      </tr>
    `;
    tbody.innerHTML += fila;
  });

  document.getElementById('totalVenta').innerHTML = `
    <span class="total-label">TOTAL VENTA:</span>
    <span class="total-amount">$${totalGeneral}</span>
  `;
}

function obtenerRangoFechas(semana) {
  const hoy = new Date();
  const diaActual = hoy.getDay(); // 0 (Domingo) - 6 (Sábado)

  const lunesActual = new Date(hoy);
  lunesActual.setDate(hoy.getDate() - (diaActual === 0 ? 6 : diaActual - 1));

  let lunesInicio = new Date(lunesActual);
  if (semana === 'pasada') {
    lunesInicio.setDate(lunesInicio.getDate() - 7);
  }

  const domingoFin = new Date(lunesInicio);
  domingoFin.setDate(lunesInicio.getDate() + 6);

  const opciones = { day: 'numeric', month: 'long', year: 'numeric' };

  return `Reporte del ${lunesInicio.toLocaleDateString('es-MX', opciones)} al ${domingoFin.toLocaleDateString('es-MX', opciones)}`;
}

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const tab = btn.dataset.tab;

    document.querySelectorAll('.table').forEach(tabla => tabla.classList.add('hidden'));
    document.getElementById(`tablaProductos-${tab}`).classList.remove('hidden');

    const textoRango = document.getElementById('rango-fechas');
    const semana = tab === 'semana-actual' ? 'actual' : 'pasada';
    textoRango.textContent = obtenerRangoFechas(semana);

    const productos = semana === 'actual' ? productosSemanaActual : productosSemanaPasada;
    renderizarTabla(`tablaProductos-${tab}`, productos, filtroInput.value);
  });
});

const filtroInput = document.getElementById('filtroProducto');
filtroInput.addEventListener('input', () => {
  const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
  const productos = activeTab === 'semana-actual' ? productosSemanaActual : productosSemanaPasada;
  renderizarTabla(`tablaProductos-${activeTab}`, productos, filtroInput.value);
});

document.getElementById('rango-fechas').textContent = obtenerRangoFechas('actual');
renderizarTabla('tablaProductos-semana-actual', productosSemanaActual);
