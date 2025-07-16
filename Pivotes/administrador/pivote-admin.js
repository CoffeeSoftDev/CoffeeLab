let api = "/alpha/admin/ctrl/ctrl-admin.php";
let app, usuarios, sucursales, company, clausules;
let rol, sucursal, nameCompany, idCompany;

$(function () {

    fn_ajax({ opc: "init" }, api).then((data) => {

        // request.
        idCompany   = data.companies.id;
        rol         = data.rol;
        sucursal    = data.sucursal;
        nameCompany = data.nameCompany;

        // instancias.
        app        = new App(api, "root");
        usuarios   = new Usuarios(api, "root");
        sucursales = new Sucursales(api, "root");
        company    = new Company(api, "root");
        clausules  = new Clausulas(api, "root");

        app.render();

    });
});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Admin";
    }

    render() {
        this.layout();
    }

    layout() {
        let nameCompany = '';

        this.primaryLayout({
            parent: `root`,
            id: this.PROJECT_NAME,
            class: "flex mx-2 my-2 h-full mt-5 p-2",
            card: {
                filterBar: { class: "w-full my-3 ", id: "filterBar" + this.PROJECT_NAME },
                container: { class: "w-full my-3 h-full bg-[#1F2A37] rounded-lg p-3", id: "container" + this.PROJECT_NAME },
            },
        });

        this.tabLayout({
            parent: "container" + this.PROJECT_NAME,
            id: "tabComponent",
            content: { class: "" },
            theme: "dark",
            type: 'short',
            json: [
                {
                    id: "company",
                    tab: "Empresa",
                    active: true,
                    onClick: () => { },
                },

                {
                    id: "usuarios",
                    tab: "usuarios",
                    icon: "",
                    onClick: () => { },
                },

                {
                    id: "sucursal",
                    tab: "Sucursal",
                    icon: "",
                    onClick: () => { },
                },
            ],
        });



        // Titulo del modulo.

        $("#containerAdmin").prepend(`
            <div class="px-4 pt-3 pb-3">
                <h2 class="text-2xl font-semibold text-white">⚙️ Configuración de ${nameCompany}</h2>
                <p class="text-gray-400">Administra los datos de la empresa, los usuarios y sucursales de la aplicación.</p>
            </div>
        `);

        usuarios.render();
        sucursales.render();
        company.render();
        clausules.render();
    }
}

class Usuarios extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Usuarios";

    }

    render() {

        this.layout();
    }

    layout() {
        const container = $("#tab-usuarios");
        container.html('<div id="filterbar-usuarios" class="mb-2"></div><div id="tabla-usuarios" class="row"></div>');

        // 🧱 Filtro
        this.createfilterBar({
            parent: "filterbar-usuarios",
            data: [
                {
                    opc: "select",
                    id: "active",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "1", valor: "Activos" },
                        { id: "0", valor: "Inactivos" }
                    ],
                    'onchange': 'usuarios.ls()'
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnNuevoUsuario",
                    text: "Nuevo Usuario",
                    onClick: () => this.addUsuario(),
                },
            ],
        });

        this.ls();


    }

    addUsuario() {
        this.createModalForm({
            id: "formModalUsuario",
            data: { opc: "addUser" },
            bootbox: {
                title: "<strong>Nuevo Usuario</strong>",
            },
            json: this.jsonUser(),
            success: (res) => {
                if (res.status == 200) {
                    alert({ icon: "success", text: res.message });
                    this.ls();
                } else {
                    alert({ icon: "error", title: 'Oops...', text: res.message, btn1: true, btn1Text: 'Ok' });
                }
            },
        });
    }

    async editUser(id) {
        const res = await useFetch({ url: this._link, data: { opc: "getUser", id: id } });

        this.createModalForm({
            id: "formModalUsuario",
            data: { opc: "editUser", id: id },
            bootbox: {
                title: "<strong>Editar Usuario</strong>",
            },
            json: this.jsonUser(),
            autofill: res.data,
            success: (res) => {
                if (res.status === 200) {
                    alert({ icon: "success", text: res.message });
                    this.ls();
                } else {
                    alert({ icon: "error", title: 'Oops...', text: res.message, btn1: true, btn1Text: 'Ok' });
                }
            },
        });
    }

    statusUser(id, active) {
        let tr = $(event.target).closest("tr");
        let title = tr.find("td").eq(0).text();
        let accion = active == 1 ? "activar" : "desactivar";

        this.swalQuestion({
            opts: {
                title: `¿Deseas ${accion} al usuario ${title}?`
            },
            data: {
                opc: "deleteUser",
                active: active,
                id: id,
            },
            methods: {
                request: (response) => {
                    if (response.status == 200) {
                        alert({ icon: "success", text: response.message });
                        this.ls();
                    } else {
                        alert({ icon: "error", text: response.message });
                    }
                }
            }
        });
    }

    deleteUser(id) {
        let tr = $(event.target).closest("tr");
        let title = tr.find("td").eq(0).text();

        this.swalQuestion({
            opts: { title: `¿Deseas eliminar al usuario ${title} ?` },
            data: {
                opc: "deleteUser",
                active: 0,
                id: id,
            },
            methods: {
                request: (response) => {
                    if (response.status == 200) {
                        alert({ icon: "success", text: response.message });
                        this.ls();
                    } else {
                        alert({ icon: "error", text: response.message });
                    }
                },
            },
        });
    }

    ls() {
        this.createTable({
            parent: "tabla-usuarios",
            idFilterBar: "filterbar-usuarios",
            coffeesoft: true,
            data: { opc: "lsUsers", idCompany: idCompany },
            conf: { datatable: true, pag: 10 },
            attr: {
                id: "tbUsuarios",
                theme: 'dark'
            },
        });
    }

    jsonUser() {
        return [
            {
                opc: "select",
                lbl: "Rol",
                id: "usr_rols_id",
                class: "col-12 mb-3",
                data: rol,
            },
            {
                opc: "select",
                lbl: "Sucursal",
                id: "subsidiaries_id",
                class: "col-12 mb-3",
                data: sucursal,
            },
            {
                opc: "input",
                lbl: "Usuario",
                id: "user",
                class: "col-12 mb-3",
                tipo: "texto",
                required: true
            },
            {
                opc: "input",
                lbl: "Nombre completo",
                id: "fullname",
                class: "col-12 mb-3",
                tipo: "texto",
                required: true
            },
            {
                opc: "input-group",
                lbl: "Contraseña",
                id: "key",
                icon: "icon-key",
                type: "password",
                onkeyup: "validarPassword(this)",
                class: "col-12",
                required: false
            },
        ]
    }
}

class Company extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Companies";
    }

    render() {
        this.layoutCompanies();
    }

    async layoutCompanies() {
        let data = await useFetch({
            url: api,
            data: { opc: 'init' }
        });

        let companie = data.companies;
        $("#tab-company").html(`
            <div class="flex gap-3">
                <div class="w-[30%] rounded-lg p-6">
                <div class="flex flex-col items-center gap-4">
                    <div class="relative">
                                <div class="w-48 h-48 rounded-full bg-slate-700 border-4 border-slate-600 flex items-center justify-center overflow-hidden">
                                    <img
                                        src="https://huubie.com.mx/alpha/src/img/logo/huubie.svg"
                                        alt="Foto de perfil"
                                        class="w-full h-full object-cover"
                                        id="logo"
                                    />
                                </div>
                                <button class="absolute bottom-2 right-2 rounded-full w-10 h-10 p-0 bg-blue-700 hover:bg-blue-800 flex items-center justify-center" id="btnEditLogo">
                                    <i class="icon-pencil text-white text-sm"></i>
                                </button>
                                <input type="file" accept="image/*" id="inputLogoUpload" class="hidden" />
                            </div>
                    </div>
                </div>
                <div class="w-[70%] rounded-lg p-6" id="container-info-companies"></div>
            </div>
        `);

        if (companie.id) {
            let fotito = 'https://huubie.com.mx/alpha' + companie.logo;
            $('#logo').attr('src', fotito);
        }

        // Activar input file al hacer clic en el botón
        $('#btnEditLogo').on('click', function () {
            $('#inputLogoUpload').click();
        });

        // Subir imagen y mostrar preview
        $('#inputLogoUpload').on('change', async function (e) {
            let file = e.target.files[0];
            if (!file) return;

            let url = URL.createObjectURL(file);
            $('#logo').attr('src', url);

            let formData = new FormData();
            formData.append('opc', 'editPhotoCompany');
            formData.append('id', companie.id);
            const fileC = $('#inputLogoUpload')[0].files[0];
            if (fileC) {
                formData.append('logo', fileC); // ✅ Asegura que sea con el mismo nombre usado en PHP ($_FILES['photo'])
            }

            Swal.fire({
                title: 'Subiendo imagen...',
                text: 'Por favor, espera un momento. 😊',
                background: '#1f2937',
                color: '#f9fafb',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            fetch(api, {
                method: 'POST',
                body: formData
            }).then(response => {
                Swal.close();
                if (response.status == 200) {
                    alert({ icon: "success", title: "Éxito", text: response.message, btn1: true, btn1Text: "Ok" });
                } else {
                    alert({ icon: "error", title: "Oops!...", text: response.message, btn1: true, btn1Text: "Ok" });
                }
            }).catch(error => {
                console.error('Error:', error);
                alert({ icon: "error", title: "Error", text: "No se pudo completar la solicitud." });
            });
        });

        this.createForm({
            parent: "container-info-companies",
            id: "formPerfilUsuario2",
            data: { opc: "editCompany", id: companie.id },
            autofill: companie,
            json: [
                {
                    opc: "input",
                    lbl: '<i class="icon-building mr-2"></i> Nombre de la compañía',
                    id: "social_name",
                    class: "col-6 mb-3",
                },
                {
                    opc: "input",
                    lbl: '<i class="icon-location mr-2"></i> Ubicación',
                    id: "ubication",
                    class: "col-6 mb-3",
                },
                {
                    opc: "input",
                    lbl: '<i class="icon-location mr-2"></i> Dirección',
                    id: "address",
                    class: "col-6 mb-3",
                },
                {
                    opc: "input",
                    lbl: '<i class="icon-user mr-2"></i> RFC ',
                    id: "rfc",
                    class: "col-6 mb-3",
                },
                {
                    opc: "input",
                    lbl: '<i class="icon-phone mr-2"></i> Teléfono',
                    id: "phone",
                    class: "col-6 mb-3",
                },
                {
                    opc: "btn-submit",
                    id: "btnGuardarPerfil",
                    text: "Actualizar datos",
                    class: "col-sm-4 offset-8",
                },
            ],
            success: (res) => {
                if (res.status == 200) {
                    alert({ icon: "success", text: res.message });
                } else {
                    alert({ icon: "error", title: 'Oops...', text: res.message, btn1: true, btn1Text: 'Ok' });
                }
            },
        });
    }
}



class Sucursales extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Sucursales";
    }

    async render() {
        this.layout();
    }

    layout() {
        const container = $("#tab-sucursales");
        container.html('<div id="filterbar-sucursales" class="mb-2"></div><div id="tabla-sucursales"></div>');

        this.createfilterBar({
            parent: "filterbar-sucursales",
            data: [
                {
                    opc: "select",
                    id: "active",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "1", valor: "Activos" },
                        { id: "0", valor: "Inactivos" }
                    ],
                    'onchange': 'sucursales.lsSucursales()'
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnNuevaSucursal",
                    text: "Nueva Sucursal",
                    onClick: () => this.addSucursal(),
                },
            ],
        });

        setTimeout(() => this.lsSucursales(), 100);
    }

    lsSucursales() {
        this.createTable({
            parent: "tabla-sucursales",
            idFilterBar: "filterbar-sucursales",
            data: { opc: "lsSucursales", idCompany: idCompany },
            coffeesoft: true,
            conf: { datatable: true, pag: 10 },
            attr: {
                id: "tbSucursales",
                theme: "dark",
            },
        });
    }

    addSucursal() {
        this.createModalForm({
            id: "formModalSucursal",
            data: { opc: "addSucursal" },

            bootbox: {
                title: "<strong>Nueva Sucursal</strong>",
            },
            json: this.jsonSucursal(),
            success: (res) => {
                if (res.status === 200) {
                    alert({ icon: "success", text: res.message });
                    this.lsSucursales();
                } else {
                    alert({ icon: "error", text: res.message });
                }
            },
        });
    }

    async editSucursal(id) {
        const res = await useFetch({ url: this._link, data: { opc: "getSucursal", id } });
        this.createModalForm({
            id: "formModalSucursal",
            data: { opc: "editSucursal", id },
            bootbox: {
                title: "<strong>Editar Sucursal</strong>",
            },
            autofill: res.data,
            json: this.jsonSucursal(),
            autofill: res.data,
            success: (res) => {
                if (res.status === 200) {
                    alert({ icon: "success", text: res.message });
                    this.lsSucursales();
                } else {
                    alert({ icon: "error", text: res.message });
                }
            },
        });
    }

    statusSucursal(id, active) {
        let tr = $(event.target).closest("tr");
        let title = tr.find("td").eq(0).text();
        let accion = active === 1 ? "activar" : "desactivar";

        this.swalQuestion({
            opts: {
                title: `¿Deseas ${accion} la sucursal ${title}?`
            },
            data: {
                opc: "statusSucursal",
                active: active,
                id: id,
            },
            methods: {
                request: (response) => {
                    if (response.status === 200) {
                        alert({ icon: "success", text: response.message });
                        this.lsSucursales();
                    } else {
                        alert({ icon: "error", text: response.message });
                    }
                }
            }
        });
    }

    time() {
        const ahora = new Date();

        const dia = ahora.getDate().toString().padStart(2, '0');
        const mes = (ahora.getMonth() + 1).toString().padStart(2, '0'); // +1 porque enero es 0
        const anio = ahora.getFullYear();

        const horas = ahora.getHours().toString().padStart(2, '0');
        const minutos = ahora.getMinutes().toString().padStart(2, '0');
        const segundos = ahora.getSeconds().toString().padStart(2, '0');

        return `${dia}${mes}${anio}-${horas}${minutos}${segundos}`;
    }

    viewLogo(id, url) {
        if (url == '') {
            bootbox.hideAll();
            $('#file').click();
            $('#file').on('change', () => this.editLogo(id));
        } else {
            const ahora = new Date();
            let dialog = bootbox.dialog({
                message: `<div class="p-4 rounded-xl shadow-md text-center">
                            <img src="../../${url}?t=${this.time()}" alt="Imagen" class="w-[300px] h-[300px] object-contain mx-auto rounded-md">
                          </div>
                          <div class="p-1 rounded-xl shadow-md text-center">
                            <button class="bg-[#523A8F] text-white px-4 py-2 rounded-md hover:bg-[#0B5ED7] transition-colors duration-300" onClick="sucursales.viewLogo(${id},'')">
                              Actualizar logo
                            </button>
                          </div>
                          `,
                closeButton: true
            });
        }
    }

    async editLogo(id) {
        let foto = $("#file")[0].files[0];
        if (foto) {
            let datos = new FormData();
            datos.append("opc", "editLogo");
            datos.append("foto", foto);
            datos.append("id", id);
            await send_ajax(datos, this._link).then((response) => {
                if (response.status == 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsSucursales();
                }
                else console.error(response);
            });
        }
    }

    jsonSucursal() {
        return [
            {
                opc: "input",
                lbl: "Nombre de la sucursal",
                id: "name",
                class: "col-12 mb-3",
                tipo: "texto",
                required: true,
            },
            {
                opc: "input",
                lbl: "Ubicación",
                id: "ubication",
                class: "col-12 mb-3",
                tipo: "texto",
                required: true,
            },
        ]
    }
}

class Clausulas extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Admin";
    }

    render() {
        this.layout();
    }

    layout() {
        const container = $("#tab-clausules");
        container.html('<div id="container-clausules" class="my-3 "></div>');
        this.ls();
    }

    ls() {
        this.createTable({
            parent: "container-clausules",
            idFilterBar: "filterbar-usuarios",
            coffeesoft: true,
            data: { opc: "lsUsers", idCompany: idCompany },
            conf: { datatable: true, pag: 10 },
            attr: {
                id: "tbUsuarios",
                theme: 'dark'
            },
        });
    }
}

// function auxiliar

function validarPassword(input) {
    const messageId = "msg-password";
    const $input = $(input);
    const $inputGroup = $input.closest(".input-group");
    const $form = $("#formModalUsuario");

    // Eliminar mensaje previo si existe
    $inputGroup.next("#" + messageId).remove();

    if (input.value.length < 5) {
        // Mostrar mensaje justo después del bloque input-group
        $("<div>", {
            id: messageId,
            class: "text-red-500 text-sm mt-1",
            text: "⚠️ La contraseña debe tener al menos 5 caracteres.",
        }).insertAfter($inputGroup);

        // Bloquear el botón Aceptar
        $form.find("#btnSuccess").prop("disabled", true);
    } else {
        // Quitar mensaje de error
        $inputGroup.next("#" + messageId).remove();

        // Habilitar el botón Aceptar
        $form.find("#btnSuccess").prop("disabled", false);
    }
}
