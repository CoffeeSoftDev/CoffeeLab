let url = 'https://huubie.com.mx/dev/pedidos/ctrl/ctrl-admin.php';
let api = "https://huubie.com.mx/dev/pedidos/ctrl/ctrl-pedidos.php";
let app, pos;
let modifier, products;
let idFolio;

$(async () => {

    // instancias.
    app = new App(api, 'root');
    app.init();


});



class App extends Templates {

    constructor(link, divModule) {
        super(link, divModule);
        this.PROJECT_NAME = "Order";
    }

    init() {
        this.render();
    }

    render() {
        this.layoutDashboard();
        // this.historyPay(4);

    }




}




