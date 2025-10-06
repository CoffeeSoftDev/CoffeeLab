<?php 
    if( empty($_COOKIE["IDU"]) )  require_once('../acceso/ctrl/ctrl-logout.php');
?>
<script>
        window.location.href = "gestion-de-ventas.php";
</script>
