excelUploader(options) {
    const defaults = {
        parent: "root",
        id: "excelUploader",
        title: "Subir Archivo Excel",
        class: "bg-white rounded-lg shadow-md p-6",
        data: { opc: 'uploadExcel' },
        acceptedFormats: ['.xlsx', '.xls', '.csv'],
        maxSize: 5, // MB
        showCompare: true,
        onUpload: () => {},
        onCompare: () => {},
        onValidate: () => {}
    };

    const opts = Object.assign({}, defaults, options);

    const container = $("<div>", {
        id: opts.id,
        class: opts.class
    });

    const title = $("<h3>", {
        class: "text-xl font-bold text-gray-800 mb-4",
        text: opts.title
    });

    const dropZone = $("<div>", {
        id: `dropZone${opts.id}`,
        class: "border-2 border-dashed border-blue-400 rounded-lg p-8 text-center bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
    });

    const dropIcon = $("<div>", {
        class: "w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4",
        html: '<i class="icon-upload text-white text-3xl"></i>'
    });

    const dropText = $("<p>", {
        class: "text-gray-700 text-lg mb-2",
        html: 'Arrastra y suelta tu archivo aquí o <span class="text-blue-600 underline">haz clic para seleccionar</span>'
    });

    const dropHint = $("<p>", {
        class: "text-sm text-gray-500",
        text: `Formatos aceptados: ${opts.acceptedFormats.join(', ')} | Tamaño máximo: ${opts.maxSize}MB`
    });

    dropZone.append(dropIcon, dropText, dropHint);

    const fileInput = $("<input>", {
        type: "file",
        id: `fileInput${opts.id}`,
        class: "hidden",
        accept: opts.acceptedFormats.join(',')
    });

    const fileInfo = $("<div>", {
        id: `fileInfo${opts.id}`,
        class: "mt-4 hidden"
    });

    const progressBar = $("<div>", {
        id: `progress${opts.id}`,
        class: "w-full bg-gray-200 rounded-full h-2 mt-4 hidden"
    });

    const progressFill = $("<div>", {
        id: `progressFill${opts.id}`,
        class: "bg-blue-600 h-2 rounded-full transition-all duration-300",
        css: { width: '0%' }
    });

    progressBar.append(progressFill);

    const actions = $("<div>", {
        class: "flex gap-3 mt-6"
    });

    if (opts.showCompare) {
        const btnCompare = $("<button>", {
            id: `btnCompare${opts.id}`,
            class: "flex-1 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
            html: '<i class="icon-eye"></i> Comparar',
            disabled: true,
            click: () => this.handleCompare(opts)
        });
        actions.append(btnCompare);
    }

    const btnUpload = $("<button>", {
        id: `btnUpload${opts.id}`,
        class: "flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        html: '<i class="icon-upload"></i> Subir',
        disabled: true,
        click: () => this.handleUpload(opts)
    });

    const btnCancel = $("<button>", {
        id: `btnCancel${opts.id}`,
        class: "px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors",
        html: '<i class="icon-cancel"></i> Cancelar',
        click: () => this.resetUploader(opts)
    });

    actions.append(btnUpload, btnCancel);

    container.append(title, dropZone, fileInput, fileInfo, progressBar, actions);

    dropZone.on('click', () => {
        $(`#fileInput${opts.id}`).click();
    });

    dropZone.on('dragover', (e) => {
        e.preventDefault();
        dropZone.addClass('border-blue-600 bg-blue-200');
    });

    dropZone.on('dragleave', () => {
        dropZone.removeClass('border-blue-600 bg-blue-200');
    });

    dropZone.on('drop', (e) => {
        e.preventDefault();
        dropZone.removeClass('border-blue-600 bg-blue-200');
        const files = e.originalEvent.dataTransfer.files;
        if (files.length > 0) {
            this.handleFileSelect(files[0], opts);
        }
    });

    fileInput.on('change', (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            this.handleFileSelect(files[0], opts);
        }
    });

    $(`#${opts.parent}`).html(container);
}

handleFileSelect(file, opts) {
    const fileSize = file.size / 1024 / 1024;
    const fileExt = '.' + file.name.split('.').pop().toLowerCase();

    if (!opts.acceptedFormats.includes(fileExt)) {
        alert({
            icon: "error",
            text: `Formato no válido. Solo se aceptan: ${opts.acceptedFormats.join(', ')}`,
            btn1: true,
            btn1Text: "Ok"
        });
        return;
    }

    if (fileSize > opts.maxSize) {
        alert({
            icon: "error",
            text: `El archivo es muy grande. Tamaño máximo: ${opts.maxSize}MB`,
            btn1: true,
            btn1Text: "Ok"
        });
        return;
    }

    $(`#fileInfo${opts.id}`).removeClass('hidden').html(`
        <div class="flex items-center justify-between p-3 bg-gray-100 rounded-md">
            <div class="flex items-center">
                <i class="icon-file-excel text-green-600 text-2xl mr-3"></i>
                <div>
                    <p class="font-semibold text-gray-800">${file.name}</p>
                    <p class="text-sm text-gray-600">${fileSize.toFixed(2)} MB</p>
                </div>
            </div>
            <i class="icon-check-circle text-green-600 text-2xl"></i>
        </div>
    `);

    $(`#btnUpload${opts.id}`).prop('disabled', false);
    if (opts.showCompare) {
        $(`#btnCompare${opts.id}`).prop('disabled', false);
    }

    opts.selectedFile = file;
}

handleCompare(opts) {
    if (!opts.selectedFile) return;

    const formData = new FormData();
    formData.append('archivo', opts.selectedFile);
    formData.append('opc', 'compare');

    this.showProgress(opts, 0);

    $.ajax({
        url: opts.url || this._link,
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        xhr: () => {
            const xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percent = (e.loaded / e.total) * 100;
                    this.showProgress(opts, percent);
                }
            });
            return xhr;
        },
        success: (response) => {
            this.showProgress(opts, 100);
            if (typeof opts.onCompare === 'function') {
                opts.onCompare(response);
            }
        },
        error: () => {
            alert({ icon: "error", text: "Error al comparar archivo" });
            this.resetUploader(opts);
        }
    });
}

handleUpload(opts) {
    if (!opts.selectedFile) return;

    const formData = new FormData();
    formData.append('archivo', opts.selectedFile);
    formData.append('opc', opts.data.opc);

    Object.keys(opts.data).forEach(key => {
        if (key !== 'opc') {
            formData.append(key, opts.data[key]);
        }
    });

    this.showProgress(opts, 0);

    $.ajax({
        url: opts.url || this._link,
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        xhr: () => {
            const xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percent = (e.loaded / e.total) * 100;
                    this.showProgress(opts, percent);
                }
            });
            return xhr;
        },
        success: (response) => {
            this.showProgress(opts, 100);
            if (typeof opts.onUpload === 'function') {
                opts.onUpload(response);
            }
            this.resetUploader(opts);
        },
        error: () => {
            alert({ icon: "error", text: "Error al subir archivo" });
            this.resetUploader(opts);
        }
    });
}

showProgress(opts, percent) {
    $(`#progress${opts.id}`).removeClass('hidden');
    $(`#progressFill${opts.id}`).css('width', `${percent}%`);
}

resetUploader(opts) {
    $(`#fileInput${opts.id}`).val('');
    $(`#fileInfo${opts.id}`).addClass('hidden');
    $(`#progress${opts.id}`).addClass('hidden');
    $(`#progressFill${opts.id}`).css('width', '0%');
    $(`#btnUpload${opts.id}`).prop('disabled', true);
    if (opts.showCompare) {
        $(`#btnCompare${opts.id}`).prop('disabled', true);
    }
    opts.selectedFile = null;
}
