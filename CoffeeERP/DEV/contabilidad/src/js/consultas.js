window.ctrlsobres = "ctrl/ctrl-sobres.php";

const conta = new Contabilidad();
const ing = new Ingresos(ctrlsobres);
const pagos = new Pagos(ctrlsobres);
const compras = new Compras(ctrlsobres);
const clientes = new Clientes(ctrlsobres);
const proveedores = new Proveedores(ctrlsobres);
const archivos = new Archivos(ctrlsobres);

$(async () => {
    $("#cbDate").daterangepicker(
        {
            startDate: moment().subtract(8, "days"),
            endDate: moment().subtract(1, "days"),
            showDropdowns: true,
            ranges: {
                "Últimos 7 días": [moment().subtract(8, "days"), moment().subtract(1, "days")],
                "Mes actual": [moment().startOf("month"), moment().subtract(1, "days")],
                "Mes anterior": [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")],
                "Año actual": [moment().startOf("year"), moment().subtract(1, "days")],
                "Año anterior": [moment().subtract(1, "year").startOf("year"), moment().subtract(1, "year").endOf("year")],
            },
        },
        () => historyTabs()
    );
    $("#cbUDN").on("change", () => changeUDN());
    const data = await init();
    
    saldos(data.saldos);
    await udn(data.udn);
    await createTabs();
    await historyTabs();
});
async function changeUDN() {
    const data = await fn_ajax({ opc: "initComponent", idE: $("#cbUDN").val() }, ctrlsobres);
    saldos(data.saldos);
    historyTabs();
}
async function udn(data) {
    if (data.length > 1) $("#cbUDN").parent().removeClass("hide");
    $("#cbUDN").option_select({ data });
}
function saldos(balance) {
    conta.Container = "#saldos";
    conta.callSaldos({
        titulo: "Saldo de fondo",
        clase: "saldoFondo",
        saldos: [{ valor: balance.saldo_inicial }, {}, { text: "Egreso", valor: balance.egreso }, { valor: balance.saldo_final }],
    });
}
async function init() {
    return await fn_ajax({ opc: "initComponent" }, ctrlsobres);
}

// TABS
async function createTabs() {
    const data = [
        {
            tab: "Ingresos",
            fn: "tabIngresos()",
            class: "text-dark",
            active: true,
            card: { head: { html: $("#cbUDN option:selected").text() + " - Ingresos" }, body: { id: "tbIngresos" } },
        },
        {
            tab: "Compras",
            fn: "tabCompras()",
            class: "text-dark",
            card: { head: { html: $("#cbUDN option:selected").text() + " - Compras" } },
            contenedor: [
                { class: "row mb-3 d-flex justify-content-end", id: "datosCompras" },
                { class: "row", id: "tbDatosCompras" },
            ],
        },
        {
            tab: "Almacén y costos",
            id: "pagos",
            fn: "tabPagos()",
            class: "text-dark",
            card: { head: { html: $("#cbUDN option:selected").text() + " - Pagos y salidas" } },
            contenedor: [
                { class: "row d-flex justify-content-end", id: "datosPagos" },
                { class: "row mb-3", id: "saldosPagos" },
                { class: "row", id: "tbDatosPagos" },
            ],
        },
        {
            tab: "Clientes",
            fn: "tabClientes()",
            class: "text-dark",
            card: { head: { html: $("#cbUDN option:selected").text() + " - Clientes" } },
            contenedor: [
                { class: "row mb-3 d-flex justify-content-end", id: "datosClientes" },
                { class: "row", id: "tbDatosClientes" },
            ],
        },
        {
            tab: "Proveedores",
            fn: "tabProveedor()",
            class: "text-dark",
            card: { head: { html: $("#cbUDN option:selected").text() + " - Proveedores" } },
            contenedor: [
                { class: "row mb-3 d-flex justify-content-end", id: "datosProveedor" },
                { class: "row", id: "tbDatosProveedor" },
            ],
        },
        {
            tab: "Archivos",
            fn: "tabArchivos()",
            class: "text-dark",
            card: { head: { html: $("#cbUDN option:selected").text() + " - Archivos" } },
            contenedor: [
                { class: "row mb-3 d-flex justify-content-end", id: "datosArchivos" },
                { class: "row", id: "tbDatosArchivos" },
            ],
        },
    ];
    $("#bodyConsulta").simple_json_nav(data);
}
async function historyTabs() {
    const tab = sessionStorage.getItem("tab");
    if ($("#" + tab).length) $("#" + tab).click();
    else $("#ingresos").click();
}
function tabIngresos() {
    sessionStorage.setItem("tab", "ingresos");
    $(".card-header").html($("#cbUDN option:selected").text() + " - " + "ingresos");
    ing.tbContainer = "#tbIngresos";
    ing.UDN = "#cbUDN";
    ing.Dates = "#cbDate";
    ing.tbIncomes();
}
function tabCompras() {
    sessionStorage.setItem("tab", "compras");
    $(".card-header").html($("#cbUDN option:selected").text() + " - " + "compras");
    compras.Container = "#datosCompras";
    compras.tbContainer = "#tbDatosCompras";
    compras.UDN = "#cbUDN";
    compras.Dates = "#cbDate";
    compras.initConsultBuy();
}
const viewDetails = (opc,fecha) => compras.viewDetails(opc,fecha);
function tabPagos() {
    sessionStorage.setItem("tab", "pagos");
    $(".card-header").html($("#cbUDN option:selected").text() + " - " + "almacén y costos");
    pagos.Container = "#saldosPagos";
    pagos.fillContainer = "#datosPagos";
    pagos.tbContainer = "#tbDatosPagos";
    pagos.UDN = "#cbUDN";
    pagos.Dates = "#cbDate";
    pagos.initConsultPays();
}
function tabClientes() {
    sessionStorage.setItem("tab", "clientes");
    $(".card-header").html($("#cbUDN option:selected").text() + " - " + "clientes");
    clientes.Container = "#datosClientes";
    clientes.tbContainer = "#tbDatosClientes";
    clientes.UDN = "#cbUDN";
    clientes.Dates = "#cbDate";
    clientes.initConsultCustomers();
}
function tabProveedor() {
    sessionStorage.setItem("tab", "proveedores");
    $(".card-header").html($("#cbUDN option:selected").text() + " - " + "proveedores");
    proveedores.Container = "#datosProveedor";
    proveedores.tbContainer = "#tbDatosProveedor";
    proveedores.UDN = "#cbUDN";
    proveedores.Dates = "#cbDate";
    proveedores.initConsultSuppliers();
}
function tabArchivos() {
    sessionStorage.setItem("tab", "archivos");
    $(".card-header").html($("#cbUDN option:selected").text() + " - " + "archivos");
    archivos.Container = "#datosArchivos";
    archivos.tbContainer = "#tbDatosArchivos";
    archivos.UDN = "#cbUDN";
    archivos.Dates = "#cbDate";
    archivos.filterFiles();
    archivos.tbFiles();
    archivos.changeFilter();
}
