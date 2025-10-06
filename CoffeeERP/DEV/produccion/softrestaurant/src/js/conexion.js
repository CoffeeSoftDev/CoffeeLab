$(function () {
  dataTable_responsive("#tb", [{ responsivePriority: 1, targets: 0 }]);
  $("#btnSalidaAlmacen").on("click", () => {
    redireccion("ch/reclutamiento.php");
  });
});
