window.ctrlsobres = "ctrl/ctrl-sobres.php";
const conta = new Contabilidad();
const soft = new Soft(ctrlsobres);
const turn = new Turnos(ctrlsobres);
const ing = new Ingresos(ctrlsobres);
const pagos = new Pagos(ctrlsobres);
const compras = new Compras(ctrlsobres);
const clientes = new Clientes(ctrlsobres);
const proveedores = new Proveedores(ctrlsobres);
const archivos = new Archivos(ctrlsobres);
const facturas = new Facturas(ctrlsobres);

listTables = [];

$(async () => {
    $("#cbDate").val(fecha_actual()).attr("max", fecha_actual());
    await initComponent();
    createTabs();
    historyTabs();

    appSoft = new AppSoftRestaurant(ctrl_Soft, "");

    $("#cbUDN").on("change", () => changeUDN());
    $("#ckSaldos").on("click", () => $(".saldos").toggleClass("hides"));
});

// INICIO
async function selectAyer() {
    let today = new Date();

    // Restar un día a la fecha actual
    let yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Formatear la fecha en el formato deseado (por ejemplo, YYYY-MM-DD)
    let year = yesterday.getFullYear();
    let month = String(yesterday.getMonth() + 1).padStart(2, "0"); // Los meses en JS son base 0
    let day = String(yesterday.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}
async function initComponent() {
    const data = await fn_ajax({ opc: "initComponent" }, ctrlsobres);
    sessionStorage.setItem("fecha", data.ayer);
    $("#cbUDN").option_select({ data: data.udn });
    if (data.udn.length == 1) $("#cbUDN").parent().addClass("hide");

    loadUDN(data);
}
async function loadUDN(data) {
    $("#cbDate").option_select({ data: data.fechas });
    $("#txtSaldoInicial").text(data.saldos.saldo_inicial);
    $("#txtEgresos").text(data.saldos.egreso);
    $("#bd_egresos").title(`Gastos: ${data.saldos.gasto} | Anticipos: ${data.saldos.anticipos} | Proveedores: ${data.saldos.proveedores}`);
    $("#txtSaldoFinal").text(data.saldos.saldo_final);
}
async function changeUDN() {
    const data = await fn_ajax({ opc: "initComponent", idE: $("#cbUDN").val() }, ctrlsobres);

    await loadUDN(data);
    await historyTabs();
}
function saldos() {
    const datos = { opc: "saldoFondoFijo", idE: $("#cbUDN").val() };
    fn_ajax(datos, ctrlsobres).then((data) => {
        $("#txtSaldoInicial").text(data.saldo_inicial);
        $("#txtEgresos").text(data.egreso);
        $("#bd_egresos").title(`Gastos: ${data.gasto} | Anticipos: ${data.anticipos} | Proveedores: ${data.proveedores}`);
        $("#txtSaldoFinal").text(data.saldo_final);
    });
}
// TABS
async function createTabs() {
    const idE = getCookies()["IDE"];
    let turnos = [];
    if (idE == 1) {
        turnos = [
            {
                tab: "Turnos",
                fn: "tabTurnos()",
                class: "text-dark",
                card: { head: { html: $("#cbUDN option:selected").text() + " - Turnos" },body:{class:'row '} },
                contenedor: [
                    { class: "col-12 col-md-6 col-lg-4 line", id: "Container" },
                    { class: "col-12 col-md-6 col-lg-8 line", id: "tbContainer" },
                ],
            },
        ];
    }

    const data = [
        ...turnos,
        {
            tab: "Ingresos",
            fn: "tabIngresos()",
            class: "text-dark",
            active: true,
            card: { head: { html: $("#cbUDN option:selected").text() + " - Ingresos" }, body: { id: "cardIngresos" } },
        },
        {
            tab: "Compras",
            fn: "tabCompras()",
            class: "text-dark",
            card: { head: { html: $("#cbUDN option:selected").text() + " - Compras" } },
            contenedor: [
                { class: "row d-flex justify-content-end", id: "datosCompras" },
                { class: "row", id: "tbDatosCompras" },
            ],
        },
        {
            tab: "Pagos y salidas",
            id: "pagos",
            fn: "tabPagos()",
            class: "text-dark",
            card: { head: { html: $("#cbUDN option:selected").text() + " - Pagos y salidas" } },
            contenedor: [
                { class: "row mb-3 d-flex justify-content-end", id: "datosPagos" },
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
    $("#bodySobres").simple_json_nav(data);
}
async function historyTabs() {
    const tab = sessionStorage.getItem("tab");
    if ($("#" + tab).length) $("#" + tab).click();
    else $("#ingresos").click();
}
// TURNOS
function tabTurnos() {
    sessionStorage.setItem("tab", "turnos");
    turn.Container   = "#Container";
    turn.tbContainer = "#tbContainer";
    turn.Dates       = "#cbDate";
    turn.UDN         = "#cbUDN";
    turn.render();
}
// INGRESOS
function tabIngresos() {
    sessionStorage.setItem("tab", "ingresos");
    ing.Container = "#cardIngresos";
    ing.UDN = "#cbUDN";
    ing.Dates = "#cbDate";
    clientes.Dates = ing.Dates;
    ing.incomes();
}
const incomeFile = () => $("#btnIncomeFile").click();
const uploadFile = () => ing.uploadFile();
const showBox = () => ing.showBox();
const showSales = () => ing.showSales();
const saveIncome = () => ing.saveIncome();
const randoom = () => ing.saveIncome();
const uploadBitacoraCCTV = () => ing.uploadBitacoraCCTV();
const fileCCTV = () => ing.fileCCTV();

// SOFTRESTAURANT
function softRestaurant() {
    // soft.UDN = "#cbUDN";
    // soft.Dates = "#cbDate";
    // soft.soft();

    appSoft.modalProductosVendidos();
}

// CLIENTES
const payDebt = () => clientes.payDebt(sessionStorage.getItem("tab"));

// COMPRAS
function tabCompras() {
    sessionStorage.setItem("tab", "compras");
    compras.Container = "#datosCompras";
    compras.tbContainer = "#tbDatosCompras";
    compras.UDN = "#cbUDN";
    compras.Dates = "#cbDate";
    compras.buys();
}
const newBuyFile = () => compras.newBuyFile();
const newBuy = () => compras.newBuy();
const editBuy = (folio) => compras.editBuy(folio);
const deleteBuy = (folio) => compras.deleteBuy(folio);
const viewObsBuy = (folio) => compras.viewObsBuy(folio);
const fileBill = (idSobre) => compras.fileBill(idSobre);

// PAGOS
function tabPagos() {
    sessionStorage.setItem("tab", "pagos");
    pagos.Container = "#datosPagos";
    pagos.tbContainer = "#tbDatosPagos";
    pagos.UDN = "#cbUDN";
    pagos.Dates = "#cbDate";
    pagos.pays();
}
const newPay = () => pagos.newPay();
const viewObsPay = (folio) => pagos.viewObsPay(folio);
const editPay = (folio) => pagos.editPay(folio);
const deletePay = (folio) => pagos.deletePay(folio);

function tabClientes() {
    sessionStorage.setItem("tab", "clientes");
    clientes.Container = "#datosClientes";
    clientes.tbContainer = "#tbDatosClientes";
    clientes.UDN = "#cbUDN";
    clientes.Dates = "#cbDate";
    clientes.customers();
}

const tbDayCustomer = (customer) => clientes.tbDayCustomer(customer);
const editMovCustomer = (folio) => clientes.editMovCustomer(folio);
const deleteMovCustomer = (folio) => clientes.deleteMovCustomer(folio);

function tabProveedor() {
    sessionStorage.setItem("tab", "proveedores");
    proveedores.Container = "#datosProveedor";
    proveedores.tbContainer = "#tbDatosProveedor";
    proveedores.UDN = "#cbUDN";
    proveedores.Dates = "#cbDate";
    proveedores.suppliers();
}
const tbSuppliersDay = (supplier) => proveedores.tbSuppliersDay(supplier);
const deleteMovSuppliers = (folio) => proveedores.deleteMovSuppliers(folio);
const editMovSuppliers = (folio) => proveedores.editMovSuppliers(folio);

function tabArchivos() {
    sessionStorage.setItem("tab", "archivos");
    archivos.Container = "#datosArchivos";
    archivos.tbContainer = "#tbDatosArchivos";
    archivos.UDN = "#cbUDN";
    archivos.Dates = "#cbDate";
    archivos.files();
}
const deleteFile = (opc) => archivos.deleteFile(opc);
