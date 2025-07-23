# PIVOTE ADMIN PEDIDOS

## DESCRIPCION


### ADMIN.JS [ FRONT-JS]
```javascript

let app;
const api = "../pedidos/ctrl/ctrl-admin.php";

$(() => {
    app = new App(api, "root");
    app.render();
});


class App extends Templates {

    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Admin";
        this.dataProducto = [];
    }

    render() {
        this.layout();

        this.filterBarProductos();
        this.lsProductos();
        // this.lsCategoria();
        // this.lsClientes();
    }

    layout() {
        this.primaryLayout({
            parent: `root`,
            id: this.PROJECT_NAME,
            class: 'flex mx-2 my-2 h-100 mt-5 p-2',
            card: {
                filterBar: { class: 'w-full my-3', id: 'filterBar' + this.PROJECT_NAME },
                container: { class: 'w-full my-3 h-full bg-[#1F2A37] rounded-lg p-3', id: 'container' + this.PROJECT_NAME }
            }
        });

        this.layoutTabs();
    }

    layoutTabs() {
        this.tabLayout({
            parent: "container" + this.PROJECT_NAME,
            id: "tabsPedidos",
            content: { class: "" },
            theme: "dark",
            type: 'short',
            json: [
                {
                    id: "productos",
                    tab: "Productos",
                    class:'mb-1',
                    onClick: () => this.lsProductos(),
                    active: true,
                },
                {
                    id: "categoria",
                    tab: "Categoría",
                    // onClick: () => this.filterBarCategoria()
                },
                {
                    id: "clientes",
                    tab: "Clientes",
                    // onClick: () => this.filterBarClientes()
                }
            ]
        });

        $("#container" + this.PROJECT_NAME).prepend(`
        <div class="px-4 pt-3 pb-3">
            <h2 class="text-2xl font-semibold text-white">📦 Administrador</h2>
            <p class="text-gray-400">Gestiona productos, categorías y clientes.</p>
        </div>`);
    }

    filterBarProductos() {
        const container = $("#container-productos");
        container.html('<div id="filterbar-productos" class="mb-2"></div><div id="tabla-productos"></div>');

        this.createfilterBar({
            parent: "filterbar-productos",
            data: [
                {
                    opc: "select",
                    id: "estado-productos",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "1", valor: "Disponibles" },
                        { id: "0", valor: "No disponibles" }
                    ],
                    onchange: () => this.lsProductos()
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnNuevoProducto",
                    text: "Nuevo Producto",
                    onClick: () => this.addProducto(),
                },
            ],
        });


       
    }

    filterBarCategoria() {
        const container = $("#container-categoria");
        container.html('<div id="filterbar-categoria" class="mb-2"></div><div id="tabla-categoria"></div>');

        this.createfilterBar({
            parent: "filterbar-categoria",
            data: [
                {
                    opc: "button",
                    class: "col-12 col-md-2",
                    id: "btnNuevaCategoria",
                    text: "Nueva Categoría",
                    onClick: () => this.addCategoria(),
                },
            ],
        });

        setTimeout(() => this.lsCategoria(), 50);
    }

    filterBarClientes() {
        const container = $("#container-clientes");
        container.html('<div id="filterbar-clientes" class="mb-2"></div><div id="tabla-clientes"></div>');

        this.createfilterBar({
            parent: "filterbar-clientes",
            data: [
                {
                    opc: "button",
                    class: "col-12 col-md-2",
                    id: "btnNuevoCliente",
                    text: "Nuevo Cliente",
                    onClick: () => this.addCliente(),
                },
            ],
        });

        setTimeout(() => this.lsClientes(), 50);
    }

    // Productos

    lsProductos() {
        this.createTable({
            parent: "tabla-productos",
            idFilterBar: "idFilterBar",
            data: { opc: "listProductos" },
            coffeesoft: true,
            conf: { datatable: true, pag: 10 },
            attr: {
                id: "tbProductos",
                theme: 'dark',
                right:[2],
                center:[3,6]
            },
        });
    }

    addProducto() {

        this.createModalForm({
            id: 'formProductoAdd',
            data: { opc: 'addProducto' },
            bootbox: {
                title: 'Agregar Producto',
            },
            json: [
                {
                    opc: "input",
                    id: "name",
                    lbl: "Nombre del Producto",
                    class: "col-12 mb-3"
                },
                {
                    opc: "input",
                    id: "price",
                    lbl: "Precio",
                    tipo: "cifra",
                    class: "col-12 mb-3",
                    onkeyup: "validationInputForNumber('#price')"
                },
                {
                    opc: "textarea",
                    id: "description",
                    lbl: "Descripción",
                    class: "col-12 mb-3"
                },
                // {
                //     opc: "select",
                //     id: "category_id",
                //     lbl: "Clasificación",
                //     class: "col-12",
                //     data: await this.getClasificaciones(),
                //     text: "classification",
                //     value: "id"
                // },
                {
                    opc: "div",
                    id: "image",
                    lbl: "Fotos o videos del producto",
                    class: "col-12 mt-3",
                    html: `
                        <div class="w-full p-4 border-2 border-dashed border-violet-500 rounded-xl bg-[#1F2A37] text-center">
                            <div class="flex flex-col items-center justify-center py-6">
                                <div class="w-12 h-12 bg-violet-600 rounded-full flex items-center justify-center mb-4">
                                    <i class="fas fa-upload text-white"></i>
                                </div>
                                <p class="text-white text-sm">
                                    Drag & Drop or <span class="text-violet-400 cursor-pointer underline">choose file</span> to upload
                                </p>
                                <p class="text-xs text-gray-400 mt-2">Supported formats : Jpeg, pdf</p>
                            </div>
                        </div>
                        `
                },
              
            ],
            success: () => this.lsProductos()
        });

    }

    // EDITAR PRODUCTO
    async editProducto(id) {

        const request = await useFetch({
            url: this._link,
            data: {
                opc: "getProducto",
                id: id,
            },
        });

        const producto = request.data;

        this.createModalForm({
            id: 'formProductoEdit',
            data: { opc: 'editProducto', id: producto.id },
            bootbox: {
                title: 'Editar Producto',
            },
            autofill: producto,
            json: [
                {
                    opc: "input",
                    id: "name",
                    lbl: "Nombre del Producto",
                    class: "col-12 mb-3"
                },
                {
                    opc: "input",
                    id: "price",
                    lbl: "Precio",
                    tipo: "cifra",
                    class: "col-12 mb-3",
                    onkeyup: "validationInputForNumber('#price')"
                },
                {
                    opc: "textarea",
                    id: "description",
                    lbl: "Descripción",
                    class: "col-12 mb-3"
                },
                // {
                //     opc: "select",
                //     id: "category_id",
                //     lbl: "Clasificación",
                //     class: "col-12",
                //     data: await this.getClasificaciones(),
                //     text: "classification",
                //     value: "id"
                // },
                {
                    opc: "div",
                    id: "image",
                    lbl: "Fotos o videos del producto",
                    class: "col-12 mt-3",
                    html: `
                    <div class="w-full p-4 border-2 border-dashed border-violet-500 rounded-xl bg-[#1F2A37] text-center">
                        <div class="flex flex-col items-center justify-center py-6">
                            <div class="w-12 h-12 bg-violet-600 rounded-full flex items-center justify-center mb-4">
                                <i class="fas fa-upload text-white"></i>
                            </div>
                            <p class="text-white text-sm">
                                Drag & Drop or <span class="text-violet-400 cursor-pointer underline">choose file</span> to upload
                            </p>
                            <p class="text-xs text-gray-400 mt-2">Supported formats : Jpeg, pdf</p>
                        </div>
                    </div>
                `
                }


            ],
            success: (request) => {
                this.lsProductos();
            },
        });
    }

    statusProducto(id, active) {
        this.swalQuestion({
            opts: {
                title: "¿Desea cambiar el estado del Producto? " + active,
                text: "Esta acción ocultará o reactivará el producto.",
                icon: "warning",
            },
            data: {
                opc: "statusProducto",
                id: id,
                active: active === 1 ? 0 : 1,
            },
            methods: {
                send: () => this.lsProductos(),
            },
        });
    }



    // Category



    lsCategoria() {
        this.createTable({
            parent: "tabla-categoria",
            idFilterBar: "filterbar-categoria",
            data: { opc: "listCategoria" },
            coffeesoft: true,
            conf: { datatable: true, pag: 10 },
            attr: {
                id: "tbCategoria",
                theme: 'dark'
            },
        });
    }

    lsClientes() {
        this.createTable({
            parent: "tabla-clientes",
            idFilterBar: "filterbar-clientes",
            data: { opc: "listClientes" },
            coffeesoft: true,
            conf: { datatable: true, pag: 10 },
            attr: {
                id: "tbClientes",
                theme: 'dark'
            },
        });
    }
}

```

### ctrl-admin.php [ CTRL]
 ```php
    <?php
    session_start();
    if (empty($_POST['opc'])) exit(0);

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

    require_once '../mdl/mdl-admin.php';

    class ctrl extends mdl {

        function listProductos() {
            $active = $_POST['estado-productos'];
            $data   = $this->getProductos([$active,$_SESSION['SUB']]);
            $rows   = [];

            foreach ($data as $item) {
                $a = [];

                if ($active == 1) {
                    $a[] = [
                        'class'   => 'btn btn-sm btn-primary me-1',
                        'html'    => '<i class="icon-pencil"></i>',
                        'onclick' => 'app.editProducto(' . $item['id'] . ')'
                    ];

                    $a[] = [
                        'class'   => 'btn btn-sm btn-danger',
                        'html'    => '<i class="icon-toggle-on"></i>',
                        'onclick' => 'app.statusProducto(' . $item['id'] . ', ' . $item['active'] . ')'
                    ];
                } else {
                    $a[] = [
                        'class'   => 'btn btn-sm btn-outline-danger',
                        'html'    => '<i class="icon-toggle-off"></i>',
                        'onclick' => 'app.statusProducto(' . $item['id'] . ', ' . $item['active'] . ')'
                    ];
                }

                $rows[] = [
                    'id'              => $item['id'],
                    'Producto'  => [
                            'class' => ' justify-start  px-2 py-2 ',
                            'html'  => renderProductImage($costsys,$item['valor'])
                    ],
                    'Precio'          => evaluar($item['price']),
                    'Estado'          => renderStatus($item['active']),

                    'Inventario'  => '',
                    'Categoria'   => $item['classification'],
                    'Descripción' => $item['description'],

                    'a'               => $a
                ];
            }

            return [
                'row' => $rows,
                'ls'  => $data,
                $_SESSION['SUB']
            ];
        }

        function getProducto() {
            $id = $_POST['id'];
            $status = 404;
            $message = 'Producto no encontrado';
            $data = null;

            $producto = $this->getProductoById($id);

            if ($producto > 0) {
                $status  = 200;
                $message = 'Producto encontrado';
                $data    = $producto;
            }

            return [
                'status'  => $status,
                'message' => $message,
                'data'    => $data
            ];
        }

        function addProducto() {
            $status = 500;
            $message = 'No se pudo agregar el producto';
            $_POST['date_creation'] = date('Y-m-d H:i:s');
            $_POST['subsidiaries_id'] = $_SESSION['SUB'];

            if (!$this->existsProductoByName([$_POST['name'], $_SESSION['SUB']])) {
                $create = $this->createProducto($this->util->sql($_POST));
                if ($create) {
                    $status = 200;
                    $message = 'Producto agregado correctamente';
                }
            } else {
                $status = 409;
                $message = 'Ya existe un producto con ese nombre.';
            }

            return [
                'status' => $status,
                'message' => $message
            ];
        }

        function editProducto() {
            $id = $_POST['id'];
            $status = 500;
            $message = 'Error al editar producto';

            // if (!$this->existsOtherProductoByName([$_POST['name'], $id, $_SESSION['SUB']])) {
            //     $status = 409;
            //     $message = 'Ya existe otro producto con ese nombre.';
            // } else {
                $edit = $this->updateProducto($this->util->sql($_POST, 1));
                if ($edit) {
                    $status = 200;
                    $message = 'Producto editado correctamente';
                }
            // }

            return [
                'status' => $status,
                'message' => $message
            ];
        }

        function statusProducto() {
            $status = 500;
            $message = 'No se pudo actualizar el estado del producto';

            $update = $this->updateProducto($this->util->sql($_POST, 1));

            if ($update) {
                $status = 200;
                $message = 'El estado del producto se actualizó correctamente';
            }

            return [
                'status' => $status,
                'message' => $message
            ];
        }

    }

// Complements.


  function renderProductImage($foto, $nombre) {
    $src = !empty($foto) ? 'https://erp-varoch.com/' . $foto : '';

    $img = !empty($src)
        ? '<img src="' . $src . '" alt="Imagen Producto" class="w-10 h-10 bg-gray-500 rounded-md object-cover" />'
        : '<div class="w-10 h-10 bg-[#1F2A37] rounded-md flex items-center justify-center">
                <i class=" icon-birthday text-gray-500"></i>
        </div>';

    return '
        <div class="flex items-center justify-start gap-2">
            ' . $img . '
            <div class="text-sm text-white">' . htmlspecialchars($nombre) . '</div>
        </div>';
  }

  function renderStatus($estatus) {
        switch ($estatus) {
            case 1:
                return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-[#014737] text-[#3FC189]">Activo</span>';
            case 0:
                return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-[#721c24] text-[#ba464d]">Inactivo</span>';
            case 2:
                return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-[#8a4600] text-[#f0ad28]">Borrador</span>';
            default:
                return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-gray-500 text-white">Desconocido</span>';
        }
  }




$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());
```

### mdl-admin.PHP [ mdl ]
```php
    <?php
require_once '../../conf/_CRUD.php';
require_once '../../conf/_Utileria.php';
session_start();

class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "{$_SESSION['DB']}.";
    }

    // 🛍️ PRODUCTOS ---------------------

    function getProductos($array)
    {
        $leftjoin = [
            $this->bd . 'pedidos_category' => 'pedidos_products.category_id = pedidos_category.id'
        ];

        return $this->_Select([
            'table'    => $this->bd . 'pedidos_products',
            'values'   =>
                "pedidos_products.id,
                pedidos_products.name AS valor,
                pedidos_products.price,
                pedidos_products.description,
                pedidos_products.image,
                pedidos_category.classification,
                DATE_FORMAT(pedidos_products.date_creation, '%d %M %Y') as date_creation,
                pedidos_products.active",

            'leftjoin' => $leftjoin,
            'where'    => 'pedidos_products.active = ? AND pedidos_products.subsidiaries_id = ?',
            'order'    => ['DESC' => 'pedidos_products.id'],
            'data'     => $array
        ]);
    }


    function getProductoById($id){
        return $this->_Select([
            'table'  => $this->bd . 'pedidos_products',
            'values' => "*",
            'where'  => 'id = ?',
            'data'   => [$id]
        ])[0];
    }

    function existsProductoByName($array)
    {
        $exists = $this->_Select([
            'table'  => $this->bd . 'pedidos_products',
            'values' => 'id',
            'where'  => 'LOWER(name) = LOWER(?) AND active = 1 AND subsidiaries_id = ?',
            'data'   => $array
        ]);
        return count($exists) > 0;
    }

    function existsOtherProductoByName($array) {
        $res = $this->_Select([
            'table'  => $this->bd . 'pedidos_products',
            'values' => 'id',
            'where'  => 'LOWER(name) = LOWER(?) AND id != ? AND active = 1 AND subsidiaries_id = ?',
            'data'   => $array
        ]);
        return count($res) <= 0;
    }

    function createProducto($array) {
        return $this->_Insert([
            'table'  => $this->bd . 'pedidos_products',
            'values' => $array['values'],
            'data'   => $array['data']
        ]);
    }

    function updateProducto($array) {
        return $this->_Update([
            'table'  => $this->bd . 'pedidos_products',
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
    }
}

```