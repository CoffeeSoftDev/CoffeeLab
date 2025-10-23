



class App extends Templates {
    
    constructor(link, div_modulo) {
        super(link, div_modulo);
    }

    render(){

        this.layout();
        this.filterBar();
    }

    layout() {
        this.primaryLayout({
            parent: `root`,
            id: this.PROJECT_NAME,
            card: {
                filterBar: { class: 'w-full  pb-3 ', id: `filterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full mt-5 bg-white rounded-lg p-3 h-[calc(100vh-6rem)] ', id: `container${this.PROJECT_NAME}` }
            }
        });

       

    }

    filterBar(options = {}) {
        this.createfilterBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            data: [
                {
                    opc: "input-calendar",
                    class: "col-3",
                    id: "calendar",
                    lbl: "Fecha: "
                },
                {
                    opc: "input-file",
                    text: "Subir",
                    id: "btnSubir",
                    color_btn: "primary",
                    fn: "appSoft.SubirArchivo()",
                    class: "col-12 col-sm-6 col-lg-2",
                },
                
            ],
        });

        // Inicializar el datepicker
        dataPicker({
            parent: "calendar",
            onSelect: (start, end) => {
                this.loadData();
            },
        });
    }

    fileUpload() {
        
        var InputFile = document.getElementById("btnSubir");
        var file      = InputFile.files;
        var data      = new FormData();
        let cant_file = file.length;

        for (let i = 0; i < file.length; i++) {
            data.append("excel_file" + i, file[i]);
        }

        let udn = $('#udn').val();
        data.append("udn", udn);

        data.append("fecha_archivo", $("#iptSoftFecha").val());
        
        form_data_ajax(data, url_file, "#productos_vendidos").then((data) => {
            this.ls();
            document.getElementById("btnSubir").value = "";
        });


    }





}