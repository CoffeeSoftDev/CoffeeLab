window.ctrlAdminCostys = window.ctrlAdminCostys || 'ctrl/ctrl-administracion.php';
$(function(){
    let datos = new FormData();
    datos.append('opc', 'listUDN');
    send_ajax(datos, ctrlAdminCostys).then((data) => {
        $("#cbUDN").option_select({data:data});
    });

    $('#btnOk').on('click',()=>{
        swal_question('¿Esta seguro de realizar esta acción?').then((result)=>{
            if(result.isConfirmed) swal_success();
        });
    });
    
    $('#tbDatos').create_table();

});
