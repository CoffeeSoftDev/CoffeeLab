window.ctrlsobres = "ctrl/ctrl-sobres.php";
const clase = new Caratula(ctrlsobres);

$(() => caratula());

async function caratula() {
    const udn = {
        1 : "QUINTA TABACHINES",
        4 : "BAOS",
        5 : "SONORA'S MEAT",
        6 : "FOGAZA",
        7 : "PUNTO MODELO",
        8 : "CORPORATIVO",
    };

    const idE = sessionStorage.getItem("udn");
    const date = sessionStorage.getItem("date");

    $('#strUDN').html(udn[idE])
    $('#strDate').html(date);
    
    $("#cbUDN").val(idE);
    $("#iptDate").val(date);
    $("#iptDate").daterangepicker();
    clase.UDN = "#cbUDN";
    clase.Dates = "#iptDate";
    clase.Container = "#tbDatos";
    await clase.caratula();
    imprimir();
}

function imprimir() {
    window.print();
    sessionStorage.removeItem("udn");
    sessionStorage.removeItem("date");
    window.close();
}