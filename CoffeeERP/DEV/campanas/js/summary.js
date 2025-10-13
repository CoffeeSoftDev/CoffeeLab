class CampaignSummary extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Summary";
    }

    render() {
        $(`#container-summary`).html(`
            <div class="px-4 py-6 text-center">
                <h2 class="text-2xl font-semibold text-white mb-4">📋 Resumen de Campaña</h2>
                <p class="text-gray-400">Módulo en desarrollo...</p>
            </div>
        `);
    }
}
