

<?php
# Este archivo contiene el 
# formulario que se mostrará en la ventana modal al dar clic en “Agregar Producto”.
# modalAddProducto.php: Formulario para agregar un producto 
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");  // Asegura CORS si accedes desde tu frontend
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");
?>

<div class="modal fade" id="agregarProductoModal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <form id="formularioProducto">
        <div class="modal-header">
          <h5 class="modal-title" id="modalLabel">Agregar nuevo producto</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="nombre" class="form-label">Nombre del producto</label>
            <input type="text" class="form-control" name="nombre" required>
          </div>
          <div class="mb-3">
            <label for="Descripción" class="form-label">Descripción</label>
            <textarea class="form-control" name="descripcion"  rows="3" required></textarea>
          </div>
          
          <div class="mb-3">
            <label for="precio" class="form-label">Precio</label>
            <div class="input-group">
              <span class="input-group-text px-2 py-1 w-5">$</span>
              <input type="number" step="0.01" class="form-control" name="precio"  min="1" required>
            </div>
          </div>

          <div class="mb-3">
            <label for="stock" class="form-label">Cantidad en stock</label>
            <input type="number" class="form-control" name="stock"  min="1" required>
          </div>
          <div class="mb-3">
            <!-- 
            <label for="temporada" class="form-label">Temporada</label>
            <input type="text" class="form-control" name="temporada" required>
            -->
            <br>
            <label for="temporada">Temporada:</label>
            <br>
            <select  name="temporada" class="form-control" required>
              <option value="">Selecciona una temporada</option>
              <option value="Primavera">Primavera</option>
              <option value="Verano">Verano</option>
              <option value="Otoño">Otoño</option>
              <option value="Invierno">Invierno</option>
            </select>
          </div>

          <div class="mb-3">
          <br>
<!--  
            <label for="id_publico" class="form-label">Publico</label>
            <input type="number" class="form-control" name="id_publico" required>
-->
            <label for="id_publico" class="form-label">Público</label>
            <select class="form-control" id="id_publico" name="id_publico" required>
              <option value="">Selecciona un público</option>
              <option value="1">Hombres</option>
              <option value="2">Mujeres</option>
              <option value="3">Niños</option>
            </select>
          </div>
          

        </div>

        <div class="modal-footer">
          <button type="submit" class="btn btn-success">Guardar</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        </div>

      </form>
    </div>
  </div>
</div>
