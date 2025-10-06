window.ctrlsobres = "ctrl/ctrl-sobres.php";
const clase = new Caratula(ctrlsobres);

$(async () => {
    $("#iptDate").daterangepicker(
        {
            startDate: moment().subtract(1, "days"),
            endDate: moment().subtract(1, "days"),
            showDropdowns: true,
            ranges: {
                Ayer: [moment().subtract(1, "days"), moment().subtract(1, "days")],
                Antier: [moment().subtract(2, "days"), moment().subtract(2, "days")],
                "Últimos 7 días": [moment().subtract(8, "days"), moment().subtract(1, "days")],
                "Mes actual": [moment().startOf("month"), moment().subtract(1, "days")],
                "Mes anterior": [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")],
                "Año actual": [moment().startOf("year"), moment().subtract(1, "days")],
                "Año anterior": [moment().subtract(1, "year").startOf("year"), moment().subtract(1, "year").endOf("year")],
            },
        },
        () => caratula()
    );
    $("#cbUDN").on("change", () => caratula());
    const data = await init();
    await udn(data);
    await caratula();
});

async function udn(data) {
    if (data.udn.length == 1) $("#cbUDN").parent().addClass("hide");
    else if (data.udn.length > 1) $("#cbUDN").parent().removeClass("hide");

    $("#cbUDN").option_select({ data: data.udn });
}
async function init() {
    return await fn_ajax({ opc: "initComponent" }, ctrlsobres);
}
async function caratula() {
    clase.UDN = "#cbUDN";
    clase.Dates = "#iptDate";
    clase.Container = "#tbDatos";
    clase.caratula();
}


function print(){
    sessionStorage.setItem('udn',$('#cbUDN').val());
    sessionStorage.setItem('date',$('#iptDate').val());
    window.open('caratula-print.php', '_blank');
}