productCard(options) {
    const defaults = {
        parent: "root",
        id: "productCard",
        class: "bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow",
        data: {},
        json: [],
        onClick: () => {},
        onEdit: () => {},
        onDelete: () => {}
    };

    const opts = Object.assign({}, defaults, options);

    const container = $("<div>", {
        id: opts.id,
        class: `${opts.class} p-4 cursor-pointer`
    });

    if (opts.json.length > 0) {
        opts.json.forEach(item => {
            const card = this.buildCard(item, opts);
            container.append(card);
        });
    } else if (Object.keys(opts.data).length > 0) {
        const card = this.buildCard(opts.data, opts);
        container.append(card);
    }

    $(`#${opts.parent}`).html(container);
}

buildCard(item, opts) {
    const card = $("<div>", {
        class: "border border-gray-200 rounded-lg p-4 mb-3 hover:border-blue-500 transition-colors"
    });

    const imageUrl = item.imagen || 'https://via.placeholder.com/150';
    const image = $("<img>", {
        src: imageUrl,
        alt: item.nombre || 'Producto',
        class: "w-full h-48 object-cover rounded-md mb-3"
    });

    const title = $("<h3>", {
        class: "text-lg font-semibold text-gray-800 mb-2",
        text: item.nombre || 'Sin nombre'
    });

    const category = $("<p>", {
        class: "text-sm text-gray-600 mb-2",
        html: `<i class="icon-tag"></i> ${item.categoria || 'Sin categoría'}`
    });

    const price = $("<p>", {
        class: "text-xl font-bold text-blue-600 mb-3",
        text: item.precio ? `$${parseFloat(item.precio).toFixed(2)}` : 'N/A'
    });

    const status = $("<span>", {
        class: item.activo == 1 
            ? "px-2 py-1 rounded-md text-xs font-semibold bg-green-100 text-green-800"
            : "px-2 py-1 rounded-md text-xs font-semibold bg-red-100 text-red-800",
        text: item.activo == 1 ? 'Activo' : 'Inactivo'
    });

    const actions = $("<div>", {
        class: "flex gap-2 mt-3 pt-3 border-t border-gray-200"
    });

    const btnEdit = $("<button>", {
        class: "flex-1 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm",
        html: '<i class="icon-pencil"></i> Editar',
        click: (e) => {
            e.stopPropagation();
            opts.onEdit(item.id);
        }
    });

    const btnDelete = $("<button>", {
        class: "flex-1 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm",
        html: '<i class="icon-trash"></i> Eliminar',
        click: (e) => {
            e.stopPropagation();
            opts.onDelete(item.id);
        }
    });

    actions.append(btnEdit, btnDelete);

    card.append(image, title, category, price, status, actions);

    card.on('click', () => {
        opts.onClick(item);
    });

    return card;
}
