
window.ctrlPrecios = window.ctrlPrecios || 'costsys/ctrl/ctrl-lista-de-precios.php';
$(function(){
    let datos = new FormData();
    datos.append('opc', 'listUDN');
    send_ajax(datos, ctrlPrecios).then((data) => {
        let option = '';
        data.forEach((p) => {
          option += `<option value="${p.id}">${p.valor}</option>`;
        });
        $("#cbUDN").html(option);
    });

    $('#iptDate').next('span').on('click',()=>{
        $('#iptDate').click();
    });

    $('#btnOk').on('click',()=>{
        swal_question('多Esta seguro de realizar esta acci坦n?').then((result)=>{
            if(result.isConfirmed){
                alert();
            }
        });
    });
});

function updateModal(id,title){
    modal = bootbox.dialog({
        title: ` EDITAR "${title.toUpperCase()}" `,
        message: `
              <div class="col-12 mb-3">
                  <label for="iptModalLabel" class="form-label fw-bold"> LABEL</label>
                  <input type="text" class="form-control" id="iptModalLabel" value="${title}">
                  <span class="form-text text-danger hide">
                      <i class="icon-warning-1"></i>
                      El campo es requerido.
                  </span>
              </div>
              <div class="col-12 mb-3 d-flex justify-content-between">
                  <button  class="btn btn-primary col-5" onclick="update(${id},'#iptModalLabel');">Actualizar</button>
                  <button class="btn btn-outline-danger col-5 offset-2 bootbox-close-button col-5" id="btnCerrarModal">Cancelar</button>
              </div>
        `,
    });
}

function update(id,input){
    let INPUT = $(input);
    if (!INPUT.val()) {
        INPUT.focus();
        INPUT.addClass('is-invalid');
        INPUT.next('span').removeClass('hide');
    }
    else {
        INPUT.removeClass('is-invalid');
        INPUT.next('span').addClass('hide');
         $('#btnCerrarModal').click();
         swal_success();
    }
}

function toggleStatus(id){
    const BTN = $('#btnStatus'+id);
    const ESTADO = BTN.attr('estado');
  
    let estado = 0;
    let iconToggle = '<i class="icon-toggle-off"></i>';
    let question = '多DESEA DESACTIVARLO?';
    if ( ESTADO == 0 ) {
        estado = 1;
        iconToggle = '<i class="icon-toggle-on"></i>';
        question = '多DESEA ACTIVARLO?';
    }
  
    swal_question(question).then((result)=>{
        if(result.isConfirmed){
            BTN.html(iconToggle);
            BTN.attr('estado',estado);
        }
    });  
}
