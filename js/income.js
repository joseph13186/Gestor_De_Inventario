let productosSemanaActual = [];
let productosSemanaPasada = [];
$(document).ready(function () {

  // Esto llenará el array products con la respuesta del servidor (una lista de objetos con id, name, season, description, price, etc.).
  let products = [];

  $.ajax({
    url: 'http://127.0.0.1:8000/php-bd/products-query-income.php',
    method: 'GET',
    success: function (data) {
      //console.log(data);  // Esto ayuda a ver lo que devuelve el servidor
      productosSemanaActual = data.semanaActual;
      productosSemanaPasada = data.semanaPasada;

      // Renderiza la tabla actual
      renderizarTabla('tablaProductos-semana-actual', productosSemanaActual);
      document.getElementById('rango-fechas').textContent = obtenerRangoFechas('actual');



      //products = data;
    },
    error: function () {
      alert('No se pudieron cargar los productos desde el servidor.');
    }
  });



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
        <td>${producto.id_producto}</td>
        <td>${producto.nombre}</td>
        <td>${producto.publico}</td>
        <td>${producto.stock}</td>
        <td>${producto.temporada}</td>
        <td>${producto.descripcion}</td>
        <td>${producto.fecha_registro}</td>
        <td>${producto.fecha_ultima_compra}</td>
        <td>${producto.hora_ultima_compra}</td>
        <td>$${producto.precio}</td>
        <td>${producto.cantidad}</td>

        <td>$${total}</td>
      </tr>
    `;
      tbody.innerHTML += fila;
    });

    document.getElementById('totalVenta').innerHTML = `
    <span class="total-label">TOTAL VENTA:</span>
    <span class="total-amount">$${totalGeneral.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
  `;
  }

  window.obtenerRangoFechas = function (semana) {
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



}); // <-- llave, paréntesis, y punto y coma para cerrar la función y la llamada
function calcularTotalVentas(tablaId) {
  let total = 0;
  $(`#${tablaId} tbody tr`).each(function () {
    const texto = $(this).find("td").eq(11).text();
    //console.log('Valor leído:', texto); // <-- DEBUG
    const valor = parseFloat(texto.replace('$', '').replace(',', ''));
    if (!isNaN(valor)) {
      total += valor;
    }
  });
  //console.log('Total sumado:', total); // <-- DEBUG FINAL

  return total;
}




async function descargarPDF() {
  await generarPDF('semanaActual', 'tablaProductos-semana-actual', 'reporte-semana-actual.pdf', productosSemanaActual, productosSemanaPasada);
  await generarPDF('semanaPasada', 'tablaProductos-semana-pasada', 'reporte-semana-pasada.pdf', productosSemanaActual, productosSemanaPasada);

}




async function generarPDF(rango, tablaId, nombreArchivo, productosSemanaActual, productosSemanaPasada) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();


  // Cargar imagen (puede ser base64 o una URL local)
  const img = new Image();
  img.src = '/img/Logo Panda.png'; // reemplaza con la ruta de tu imagen o usa base64


  img.onload = function () {
    // Insertar imagen (x, y, width, height)
    doc.addImage(img, 'PNG', 10, 10, 30, 30);
    const productos = (rango === 'semanaActual') ? productosSemanaActual : productosSemanaPasada;

    // Total
    const total = productos.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);

    // Obtener rango de fechas dependiendo del rango
    const rangoFechas = obtenerRangoFechas(rango === 'semanaActual' ? 'actual' : 'pasada');


    const leyendaSemana = (rango === 'semanaActual') ? 'Semana Actual' : 'Semana Pasada';

    doc.setFontSize(14);
    doc.text(`Reporte de ventas - ${leyendaSemana}`, 50, 20);
    doc.setFontSize(11);
    doc.text(rangoFechas, 50, 27);

    // Agregamos el total
    doc.setFontSize(12);
    doc.setTextColor(0, 102, 0); // Verde oscuro
    doc.setFont("helvetica", "bold");

    doc.text(`Total de las ventas: $${total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 50, 34);





    // Columnas
    const columns = [
      { header: 'ID', dataKey: 'id' },
      { header: 'Producto', dataKey: 'nombre' },
      { header: 'Público', dataKey: 'publico' },
      { header: 'Stock Actual', dataKey: 'cantidad' },
      { header: 'Temporada', dataKey: 'temporada' },
      { header: 'Descripción', dataKey: 'descripcion' },
      { header: 'Fecha de ingreso', dataKey: 'fechaIngreso' },
      { header: 'Fecha última compra', dataKey: 'fechaUltimaCompra' },
      { header: 'Hora última compra', dataKey: 'horaUltimaCompra' },
      { header: 'Precio (c/u)', dataKey: 'precio' },
      { header: 'Cantidad de la compra', dataKey: 'cantidadVendida' },
      { header: 'Total ($)', dataKey: 'total' },
    ];



    // Filas
    const rows = productos.map(p => ({
      id: p.id_producto,
      nombre: p.nombre,
      publico: p.publico,
      cantidad: p.stock,
      temporada: p.temporada,
      descripcion: p.descripcion,
      fechaIngreso: p.fecha_registro,
      fechaUltimaCompra: p.fecha_ultima_compra,
      horaUltimaCompra: p.hora_ultima_compra,
      precio: `$${parseFloat(p.precio).toFixed(2)}`,
      cantidadVendida: p.cantidad,
      total: `$${(p.precio * p.cantidad).toFixed(2)}`
    }));


    // Crear tabla
    doc.autoTable({
      startY: 45,
      columns: columns,
      body: rows,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [0, 102, 204],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { left: 10, right: 10 },
    });

    // Guardar
    doc.save(nombreArchivo);
  };
}
