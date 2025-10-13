class AnnualHistory extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "History";
    }

    render() {
        $(`#container-history`).html(`
            <div class="px-4 py-6 text-center">
                <h2 class="text-2xl font-semibold text-white mb-4">📈 Historial Anual</h2>
                <p class="text-gray-400">Módulo en desarrollo...</p>
            </div>
        `);
    }
}
