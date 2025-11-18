categorySelector(options) {
    const defaults = {
        parent: "root",
        id: "categorySelector",
        title: "Seleccionar Categoría",
        class: "bg-white rounded-lg shadow-md p-4",
        data: {},
        json: [],
        multiple: false,
        searchable: true,
        showFogaza: false,
        selected: null,
        onChange: () => {}
    };

    const opts = Object.assign({}, defaults, options);

    const container = $("<div>", {
        id: opts.id,
        class: opts.class
    });

    if (opts.title) {
        const title = $("<h3>", {
            class: "text-lg font-semibold text-gray-800 mb-3",
            text: opts.title
        });
        container.append(title);
    }

    if (opts.searchable) {
        const searchBox = $("<input>", {
            type: "text",
            id: `search${opts.id}`,
            class: "w-full px-4 py-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500",
            placeholder: "Buscar categoría..."
        });

        searchBox.on('input', (e) => {
            this.filterCategories(e.target.value, opts);
        });

        container.append(searchBox);
    }

    const categoriesContainer = $("<div>", {
        id: `categories${opts.id}`,
        class: "space-y-2 max-h-96 overflow-y-auto"
    });

    this.renderCategories(categoriesContainer, opts);

    container.append(categoriesContainer);

    $(`#${opts.parent}`).html(container);
}

renderCategories(container, opts) {
    container.empty();

    const categories = opts.json.length > 0 ? opts.json : [];

    if (categories.length === 0) {
        const empty = $("<div>", {
            class: "text-center py-8 text-gray-500",
            html: '<i class="icon-folder-open text-4xl mb-2"></i><p>No hay categorías disponibles</p>'
        });
        container.append(empty);
        return;
    }

    categories.forEach(category => {
        const isSelected = opts.selected && (
            opts.multiple 
                ? opts.selected.includes(category.id)
                : opts.selected == category.id
        );

        const categoryItem = $("<div>", {
            class: `p-3 border rounded-md cursor-pointer transition-colors ${
                isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`,
            'data-id': category.id,
            'data-name': category.valor || category.nombre
        });

        const content = $("<div>", {
            class: "flex items-center justify-between"
        });

        const leftSection = $("<div>", {
            class: "flex items-center"
        });

        if (opts.multiple) {
            const checkbox = $("<input>", {
                type: "checkbox",
                class: "mr-3 w-4 h-4 text-blue-600",
                checked: isSelected
            });
            leftSection.append(checkbox);
        }

        const icon = $("<i>", {
            class: `icon-tag text-2xl mr-3 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`
        });

        const info = $("<div>");
        const name = $("<p>", {
            class: `font-semibold ${isSelected ? 'text-blue-600' : 'text-gray-800'}`,
            text: category.valor || category.nombre
        });

        info.append(name);

        if (category.descripcion) {
            const desc = $("<p>", {
                class: "text-sm text-gray-600",
                text: category.descripcion
            });
            info.append(desc);
        }

        leftSection.append(icon, info);

        const rightSection = $("<div>");

        if (category.total_productos) {
            const badge = $("<span>", {
                class: "px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-semibold",
                text: `${category.total_productos} productos`
            });
            rightSection.append(badge);
        }

        if (opts.showFogaza && category.es_fogaza) {
            const fogaza = $("<span>", {
                class: "ml-2 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold",
                text: "🍞 Fogaza"
            });
            rightSection.append(fogaza);
        }

        content.append(leftSection, rightSection);
        categoryItem.append(content);

        categoryItem.on('click', () => {
            this.handleCategoryClick(category, opts);
        });

        container.append(categoryItem);
    });
}

handleCategoryClick(category, opts) {
    if (opts.multiple) {
        if (!opts.selected) opts.selected = [];
        
        const index = opts.selected.indexOf(category.id);
        if (index > -1) {
            opts.selected.splice(index, 1);
        } else {
            opts.selected.push(category.id);
        }
    } else {
        opts.selected = category.id;
    }

    const container = $(`#categories${opts.id}`);
    this.renderCategories(container, opts);

    if (typeof opts.onChange === 'function') {
        opts.onChange(opts.selected, category);
    }
}

filterCategories(searchTerm, opts) {
    const filtered = opts.json.filter(cat => {
        const name = (cat.valor || cat.nombre || '').toLowerCase();
        const desc = (cat.descripcion || '').toLowerCase();
        const term = searchTerm.toLowerCase();
        return name.includes(term) || desc.includes(term);
    });

    const tempOpts = Object.assign({}, opts, { json: filtered });
    const container = $(`#categories${opts.id}`);
    this.renderCategories(container, tempOpts);
}

getSelectedCategories(id) {
    const opts = this[`_opts_${id}`];
    if (!opts) return null;
    return opts.selected;
}

clearSelection(id) {
    const opts = this[`_opts_${id}`];
    if (!opts) return;
    
    opts.selected = opts.multiple ? [] : null;
    const container = $(`#categories${id}`);
    this.renderCategories(container, opts);
}
