// Clase Templates básica para el módulo KPI
class Templates {
    constructor(link, div_modulo) {
        this._link = link;
        this._div_modulo = div_modulo;
    }

    primaryLayout(options) {
        const html = `
            <div id="${options.id}" class="${options.class || ''}">
                ${options.card ? `
                    <div id="${options.card.filterBar.id}" class="${options.card.filterBar.class || ''}"></div>
                    <div id="${options.card.container.id}" class="${options.card.container.class || ''}"></div>
                ` : ''}
            </div>
        `;
        $(`#${options.parent}`).html(html);
    }

    tabLayout(options) {
        let tabsHtml = `<ul class="nav nav-tabs" id="${options.id}-tabs">`;
        let contentHtml = '<div class="tab-content mt-3">';

        options.json.forEach((tab, index) => {
            const activeClass = tab.active ? 'active' : '';
            const showClass = tab.active ? 'show active' : '';
            
            tabsHtml += `
                <li class="nav-item">
                    <button class="nav-link ${activeClass}" 
                            id="${tab.id}-tab" 
                            data-bs-toggle="tab" 
                            data-bs-target="#container-${tab.id}" 
                            type="button" 
                            onclick="if(${tab.onClick}) { ${tab.onClick.toString().replace('() => ', '').replace('()', '')}(); }">
                        ${tab.tab}
                    </button>
                </li>
            `;
            
            contentHtml += `
                <div class="tab-pane fade ${showClass}" 
                     id="container-${tab.id}" 
                     role="tabpanel" 
                     aria-labelledby="${tab.id}-tab">
                    <div class="p-3">
                        <p class="text-muted">Cargando contenido de ${tab.tab}...</p>
                    </div>
                </div>
            `;
        });

        tabsHtml += '</ul>';
        contentHtml += '</div>';

        $(`#${options.parent}`).html(tabsHtml + contentHtml);
    }

    createfilterBar(options) {
        let html = '<div class="row g-3 mb-3">';
        
        options.data.forEach(item => {
            html += `<div class="${item.class || 'col-12'}">`;
            
            switch(item.opc) {
                case 'select':
                    html += `
                        <label class="form-label">${item.lbl || ''}</label>
                        <select class="form-select" id="${item.id}" onchange="${item.onchange || ''}">
                            <option value="">Seleccionar...</option>
                    `;
                    if (item.data && Array.isArray(item.data)) {
                        item.data.forEach(option => {
                            const selected = option.id == item.valor ? 'selected' : '';
                            html += `<option value="${option.id}" ${selected}>${option.valor}</option>`;
                        });
                    }
                    html += '</select>';
                    break;
                    
                case 'button':
                    html += `
                        <button class="btn btn-primary w-100" 
                                id="${item.id}" 
                                onclick="${item.onClick ? item.onClick.toString().replace('() => ', '').replace('()', '') + '()' : ''}">
                            ${item.text || 'Button'}
                        </button>
                    `;
                    break;
                    
                case 'input':
                    html += `
                        <label class="form-label">${item.lbl || ''}</label>
                        <input type="${item.type || 'text'}" 
                               class="form-control" 
                               id="${item.id}" 
                               placeholder="${item.placeholder || ''}">
                    `;
                    break;
            }
            
            html += '</div>';
        });
        
        html += '</div>';
        
        $(`#${options.parent}`).html(html);
    }

    createTable(options) {
        const loadingHtml = `
            <div class="text-center p-4">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-2">Cargando datos...</p>
            </div>
        `;
        
        $(`#${options.parent}`).html(loadingHtml);
        
        // Simular carga de datos
        setTimeout(async () => {
            try {
                const formData = new FormData();
                
                // Obtener valores de filtros si existe filterBar
                if (options.idFilterBar) {
                    $(`#${options.idFilterBar} select, #${options.idFilterBar} input`).each(function() {
                        const value = $(this).val();
                        if (value) {
                            formData.append($(this).attr('id'), value);
                        }
                    });
                }
                
                // Agregar datos adicionales
                if (options.data) {
                    for (const key in options.data) {
                        formData.append(key, options.data[key]);
                    }
                }
                
                const response = await fetch(this._link, {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (data && data.row && Array.isArray(data.row)) {
                    this.renderTable(options.parent, data, options.attr || {});
                } else {
                    $(`#${options.parent}`).html(`
                        <div class="alert alert-warning">
                            <i class="fas fa-exclamation-triangle"></i>
                            No se encontraron datos para mostrar.
                        </div>
                    `);
                }
                
            } catch (error) {
                console.error('Error loading table data:', error);
                $(`#${options.parent}`).html(`
                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-circle"></i>
                        Error al cargar los datos: ${error.message}
                    </div>
                `);
            }
        }, 500);
    }

    renderTable(parent, data, attr) {
        if (!data.row || data.row.length === 0) {
            $(`#${parent}`).html(`
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i>
                    No hay datos disponibles.
                </div>
            `);
            return;
        }

        const firstRow = data.row[0];
        const headers = Object.keys(firstRow).filter(key => key !== 'id' && key !== 'a');
        
        let html = `
            <div class="card">
                ${attr.title ? `
                    <div class="card-header">
                        <h5 class="mb-0">${attr.title}</h5>
                        ${attr.subtitle ? `<small class="text-muted">${attr.subtitle}</small>` : ''}
                    </div>
                ` : ''}
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped table-hover">
                            <thead class="table-dark">
                                <tr>
        `;
        
        headers.forEach(header => {
            html += `<th>${header}</th>`;
        });
        
        if (firstRow.a) {
            html += '<th>Acciones</th>';
        }
        
        html += '</tr></thead><tbody>';
        
        data.row.forEach(row => {
            html += '<tr>';
            
            headers.forEach(header => {
                const cellData = row[header];
                if (typeof cellData === 'object' && cellData.html) {
                    html += `<td class="${cellData.class || ''}">${cellData.html}</td>`;
                } else {
                    html += `<td>${cellData || ''}</td>`;
                }
            });
            
            if (row.a && Array.isArray(row.a)) {
                html += '<td>';
                row.a.forEach(action => {
                    html += `<button class="${action.class}" onclick="${action.onclick}">${action.html}</button> `;
                });
                html += '</td>';
            }
            
            html += '</tr>';
        });
        
        html += '</tbody></table></div></div></div>';
        
        $(`#${parent}`).html(html);
    }

    createModalForm(options) {
        // Implementación básica de modal form
        console.log('createModalForm called with:', options);
        
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: options.bootbox?.title || 'Formulario',
                html: '<p>Formulario modal (implementación básica)</p>',
                showCancelButton: true,
                confirmButtonText: 'Guardar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed && options.success) {
                    options.success({ status: 200, message: 'Operación simulada' });
                }
            });
        } else {
            alert('Función de formulario modal no disponible');
        }
    }

    swalQuestion(options) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: options.opts?.title || '¿Confirmar?',
                text: options.opts?.text || '',
                icon: options.opts?.icon || 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí',
                cancelButtonText: 'No'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const formData = new FormData();
                        for (const key in options.data) {
                            formData.append(key, options.data[key]);
                        }
                        
                        const response = await fetch(this._link, {
                            method: 'POST',
                            body: formData
                        });
                        
                        const data = await response.json();
                        
                        if (options.methods?.send) {
                            options.methods.send(data);
                        }
                        
                    } catch (error) {
                        console.error('Error in swalQuestion:', error);
                    }
                }
            });
        } else {
            if (confirm(options.opts?.title || '¿Confirmar?')) {
                // Ejecutar acción
                console.log('Confirmed action with data:', options.data);
            }
        }
    }
}