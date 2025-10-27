// Método updateTotals actualizado con cálculo automático de impuestos

updateTotals() {
    let totalCategories = 0;
    let totalIva = 0;
    let totalIeps = 0;
    let totalHospedaje = 0;

    // Calcular totales de categorías con sus impuestos correspondientes
    $('.category-input').each(function () {
        const amount = parseFloat($(this).val()) || 0;
        const taxIva = parseInt($(this).data('tax-iva')) || 0;
        const taxIeps = parseInt($(this).data('tax-ieps')) || 0;
        const taxHospedaje = parseInt($(this).data('tax-hospedaje')) || 0;

        totalCategories += amount;

        // Aplicar IVA solo si tax_iva = 1
        if (taxIva === 1) {
            totalIva += amount * 0.08;
        }
        // Aplicar IEPS solo si tax_ieps = 1
        if (taxIeps === 1) {
            totalIeps += amount * 0.03;
        }
        // Aplicar Hospedaje solo si tax_hospedaje = 1
        if (taxHospedaje === 1) {
            totalHospedaje += amount * 0.03;
        }
    });

    // Calcular descuentos y cortesías con sus impuestos
    let totalDiscounts = 0;
    $('.discount-input').each(function () {
        const amount = parseFloat($(this).val()) || 0;
        const taxIva = parseInt($(this).data('tax-iva')) || 0;
        const taxIeps = parseInt($(this).data('tax-ieps')) || 0;
        const taxHospedaje = parseInt($(this).data('tax-hospedaje')) || 0;

        totalDiscounts += amount;

        // Restar impuestos de descuentos
        if (taxIva === 1) {
            totalIva -= amount * 0.08;
        }
        if (taxIeps === 1) {
            totalIeps -= amount * 0.03;
        }
        if (taxHospedaje === 1) {
            totalHospedaje -= amount * 0.03;
        }
    });

    const subtotal = totalCategories - totalDiscounts;
    const totalTax = totalIva + totalIeps + totalHospedaje;
    const totalSale = subtotal + totalTax;

    // Actualizar campo de IVA
    $('#tax_iva').val(totalIva.toFixed(2));

    // Actualizar resumen visual
    $('#summary_sales').text(`$ ${totalCategories.toFixed(2)}`);
    $('#summary_discounts').text(`$ ${totalDiscounts.toFixed(2)}`);
    $('#summary_taxes').text(`$ ${totalTax.toFixed(2)}`);
    $('#summary_total').text(`$ ${totalSale.toFixed(2)}`);

    return { 
        totalCategories, 
        totalDiscounts, 
        subtotal, 
        totalTax, 
        totalSale,
        totalIva,
        totalIeps,
        totalHospedaje
    };
}

// Método saveDailySale actualizado para guardar detalles de impuestos

async saveDailySale() {
    const totals = this.updateTotals();
    const categories = [];
    const discountsList = [];

    // Recopilar datos de categorías con sus impuestos
    $('.category-input').each(function () {
        const amount = parseFloat($(this).val()) || 0;
        if (amount > 0) {
            const taxIva = parseInt($(this).data('tax-iva')) || 0;
            const taxIeps = parseInt($(this).data('tax-ieps')) || 0;
            const taxHospedaje = parseInt($(this).data('tax-hospedaje')) || 0;

            categories.push({
                sale_category_id: $(this).data('id'),
                total: amount,
                subtotal: amount,
                tax_iva: taxIva === 1 ? amount * 0.08 : 0,
                tax_ieps: taxIeps === 1 ? amount * 0.03 : 0,
                tax_hospedaje: taxHospedaje === 1 ? amount * 0.03 : 0
            });
        }
    });

    // Recopilar datos de descuentos con sus impuestos
    $('.discount-input').each(function () {
        const amount = parseFloat($(this).val()) || 0;
        if (amount > 0) {
            const taxIva = parseInt($(this).data('tax-iva')) || 0;
            const taxIeps = parseInt($(this).data('tax-ieps')) || 0;
            const taxHospedaje = parseInt($(this).data('tax-hospedaje')) || 0;

            discountsList.push({
                discount_courtesy_id: $(this).data('id'),
                total: amount,
                subtotal: amount,
                tax_iva: taxIva === 1 ? amount * 0.08 : 0,
                tax_ieps: taxIeps === 1 ? amount * 0.03 : 0,
                tax_hospedaje: taxHospedaje === 1 ? amount * 0.03 : 0
            });
        }
    });

    const response = await useFetch({
        url: this._link,
        data: {
            opc: 'saveDailySale',
            udn_id: 5,
            operation_date: moment().format('YYYY-MM-DD'),
            total_sale_without_tax: totals.totalCategories,
            subtotal: totals.subtotal,
            tax: totals.totalTax,
            total_sale: totals.totalSale,
            categories: categories,
            discounts: discountsList
        }
    });

    if (response.status === 200) {
        this.currentClosureId = response.closure_id;
        alert({ icon: "success", text: response.message });
    } else {
        alert({ icon: "error", text: response.message });
    }
}
