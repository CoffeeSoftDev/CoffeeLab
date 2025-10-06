// $.fn.simple_json_form = function (options) {
//   var prefijo = "txt";

//   var defaults = {
//     data: [],
//     clase: "",
//     type_btn: "btn",
//     bs3: false,
//     name_fn: "EnviarDatos",
//     icon: "icon-dollar",
//   };

//   var opts = $.fn.extend(defaults, options);

//   // Creamos el formulario
//   var div = $(this);

//   // Recorremos el arreglo json
//   for (const x of opts.data) {
//     //Propiedades de los elementos
//     var required = true;
//     if (x.required == false) {
//       required = false;
//     }

//     opt_class = opts.clase;

//     add_class = x.class;

//     var div_hijo = $("<div>", {
//       class: `col mb-3 ${opt_class} ${add_class}`,
//     });

//     // Etiqueta del componente
//     div_hijo.append(
//       $(`<label>`, {
//         class: "fw-bold ",
//         html: x.lbl,
//       })
//     );

//     // ¿Que tipo de componente vas a crear ?

//     switch (x.opc) {
//       case "input":
//       case "Input":
//         var align = "";
//         if (x.tipo == "cifra" || x.tipo == "numero") {
//           align = "text-end";
//         }

//         div_hijo.append(
//           $(`<input>`, {
//             class: `form-control input-sm ${align}   `,
//             id: prefijo + x.id,
//             tipo: x.tipo,
//             name: x.id,
//             required: required,
//             value: x.value,
//             atrr: x.atrr,
//             placeholder: x.placeholder,
//           })
//         );

//         break;

//       case "btn-input-group":
//         var inputGroup = $("<div>", {
//           class: "input-group",
//         });

//         color_btn = "primary";

//         if (x.btn_color) {
//           color_btn = x.btn_color;
//         }

//         var btn_group = $("<a>", {
//           class: "input-group-text btn-" + color_btn,
//         }).append(
//           $("<i>", {
//             class: "icon-plus pointer",
//             onclick: x.fn + "()",
//           })
//         );

//         inputGroup.append(btn_group);

//         var select = $(`<select>`, {
//           class: "form-control input-sm text-uppercase",
//           id: prefijo + x.id,
//           name: x.id,
//           required: required,
//         });

//         select.html(
//           '<option value="0" hidden selected > - Seleccionar - </option>'
//         );

//         $.each(x.data, function (index, item) {
//           option = item.id;
//           option_selected = x.value;
//           bandera = false;

//           if (option == option_selected) {
//             bandera = true;
//           }

//           select.append(
//             $("<option>", {
//               value: option,
//               text: item.valor,
//               selected: bandera,
//             })
//           );
//         });

//         inputGroup.append(select);

//         div_hijo.append(inputGroup);

//         break;

//       case "input-group":
//         var align = "";
//         var inputGroup = $("<div>", {
//           class: "input-group",
//         });

//         // El valor es de tipo numero o cifra
//         let val_type = "text";

//         if (x.tipo == "cifra" || x.tipo == "numero") {
//           align = "text-end";
//           val_type = "number";

//           var iconSpan = $("<span>", {
//             class: "input-group-text",
//           }).append(
//             $("<i>", {
//               class: x.icon,
//             })
//           );

//           inputGroup.append(iconSpan);
//         }

//         inputGroup.append(
//           $(`<input>`, {
//             class: `form-control input-sm ${align}`,
//             id: prefijo + x.id,
//             tipo: x.tipo,
//             name: x.id,
//             required: required,
//             value: x.value,
//             type: val_type,
//             placeholder: x.placeholder,
//             disabled: x.disabled,
//             cat: x.cat,
//             attr: x.attr,
//             // LO COMENTE POR CULPA DE ROSA REVISAR!!!!
//             // onblur: x.onblur + "()",
//           })
//         );

//         if (x.tipo != "cifra") {
//           var iconSpan = $("<span>", {
//             class: "input-group-text",
//           }).append(
//             $("<i>", {
//               class: x.icon,
//             })
//           );

//           inputGroup.append(iconSpan);
//         }

//         div_hijo.append(inputGroup);

//         break;

//       case "select_input":
//         var align = "";
//         if (x.tipo == "Cifra") {
//           align = "text-end";
//         }

//         var inputGroup = $("<div>", {
//           class: "input-group date calendariopicker",
//         });

//         inputGroup.append(
//           $(`<input>`, {
//             class: `select_input form-control input-sm ${align}`,
//             id: prefijo + x.id,
//             tipo: x.tipo,
//             name: x.id,
//             required: required,
//           })
//         );

//         var iconSpan = $("<span>", {
//           class: "input-group-addon ",
//           id: "basic-addon2",
//         }).append(
//           $("<label>", {
//             class: "icon-calendar",
//           })
//         );

//         inputGroup.append(iconSpan);

//         div_hijo.append(inputGroup);

//         break;

//       case "Select":
//       case "select":
//         var select = $(`<select>`, {
//           class: "form-control input-sm",
//           id: prefijo + x.id,
//           name: x.id,
//           required: required,
//         });

//         select.html(
//           '<option value="0" hidden selected > - Seleccionar - </option>'
//         );

//         $.each(x.data, function (index, item) {
//           option = item.id;
//           option_selected = x.value;
//           bandera = false;

//           if (option == option_selected) {
//             bandera = true;
//           }

//           select.append(
//             $("<option>", {
//               value: option,
//               text: item.valor,
//               selected: bandera,
//             })
//           );
//         });

//         div_hijo.append(select);

//         break;

//       case "textarea":
//         div_hijo.append(
//           $(`<textarea>`, {
//             class: `form-control resize`,
//             id: prefijo + x.id,
//             tipo: x.tipo,
//             name: x.id,

//             value: x.value,
//             placeholder: x.placeholder,
//             cols: x.col,
//             rows: x.row,
//           })
//         );

//         break;

//       case "select2-input":
//         var select = $(`<select>`, {
//           class: "form-control input-sm",
//           id: prefijo + x.id,
//           name: x.id,
//         });

//         $.each(x.data, function (index, item) {
//           option = item.id;

//           select.append(
//             $("<option>", {
//               value: option,
//               text: item.valor,
//               selected: bandera,
//             })
//           );
//         });

//         select.css("width", "100%");

//         $(window).on("resize", () => {
//           select.next("span.select2").css("width", "100%");
//         });

//         div_hijo.append(select);

//         break;
//     }

//     div.append(div_hijo);
//   }

//   if (opts.type_btn == "btn") {
//     if (opts.bs3 == false) {
//       //   col-12 d-flex justify-content-center
//       // Configuracion de bootstrap 5
//       var div_btn = $("<div >", {
//         class: `col  mb-3`,
//       });

//       var btn_submit = $("<button>", {
//         class: "btn btn-primary mb-3 bt-sm col-12",
//         text: "Aceptar",
//         id: "btnAceptar",
//         type: "submit",
//       });

//       div_btn.append(btn_submit);
//       div.append(div_btn);
//     } else {
//       // Configuracion bootstrap 3
//       var div_btn = $("<div>", {
//         class: `text-center`,
//       });

//       var btn_submit = $("<button>", {
//         class: "btn btn-primary bt-sm col-12",
//         text: "Aceptar",
//         id: "btnAceptar",
//         type: "submit",
//       });

//       div_btn.append(btn_submit);
//       div.append(div_btn);
//     }
//   } else if (opts.type_btn == "simple_btn") {
//     // Configuracion de bootstrap 5
//     // var div_btn = $("<div>", {
//     //   class: `col-12 d-flex justify-content-center`,
//     // });

//     var div_btn = $("<div>", {
//       class: `col-12 d-flex justify-content-center`,
//     });

//     var btn_submit = $("<a>", {
//       class: "btn btn-outline-primary bt-sm col-12",
//       text: "Aceptar",
//       id: "btnAceptar",
//       onclick: opts.name_fn + "()",
//     });

//     div_btn.append(btn_submit);
//     div.append(div_btn);
//   } else if (opts.type_btn == "two_btn") {
//     var div_btn = $("<div>", {
//       class: `col-12 col-md-12 d-sm-flex justify-content-between`,
//     });

//     var btn_submit = $("<button>", {
//       class: "btn btn-primary mb-3 bt-sm col-12 col-sm-5 col-md-5",
//       text: "Aceptar",
//       id: "btnAceptar",
//       type: "submit",
//     });

//     var btn_cancel = $("<button>", {
//       class:
//         "btn btn-outline-danger mb-3 bt-sm col-12 col-sm-5 col-md-5 bootbox-close-button",
//       text: "Cancelar",
//       id: "btnCancelar",
//       type: "button",
//     });

//     div_btn.append(btn_submit);
//     div_btn.append(btn_cancel);

//     div.append(div_btn);
//   } else {
//   }
// };

$.fn.btn_json_table = function (options) {
  //Variables para la creacion de una tabla
  console.log("tabla btn");
  thead = "";
  tbody = "";
  table = "";

  var defaults = {
    tipo: "simple",
    data: json,
    name: "simple-table",
    right: [3],
    center: [0],
    color: null,
    th: "bg-default",
    grupo: "bg-default",
  };

  // Carga opciones por defecto
  var opts = $.fn.extend(defaults, options);

  var r = opts.right;
  var ct = opts.center;
  var th = opts.th;

  // Imprime las columnas de la tabla
  for (const k of opts.data.thead) {
    thead += `<th class="text-center  ${th}">${k}</th>`;
  }

  for (const x of opts.data.row) {
    const columnas = Object.values(x);
    let dimension = columnas.length;
    let ultima_col = dimension - 1;

    btn = "";

    clase = "";
    if (columnas[ultima_col] == 1) {
      clase = opts.grupo;
    }

    tbody += `<tr class="${clase}">`;

    for (let col = 1; col < dimension - 1; col++) {
      color = "";
      right = "";
      center = "";

      for (let $i = 0; $i < r.length; $i++) {
        if (r[$i] == col) {
          right = "text-right text-end";
        }
      }

      for (let $c = 0; $c < ct.length; $c++) {
        if (ct[$c] == col) {
          center = "text-center ";
        }
      }

      tbody += `<td style="font-size:14px; " class="${right} ${center} " >  ${columnas[col]}  </td>`;
    }

    if (x.btn != null) {
      for (const y of x.btn) {
        btn += `<a class="btn btn-outline-${y.color} btn-sm" onclick="${y.fn}(${x.id} )"> <i class="${y.icon}"></i>  </a> `;
      }
    }
    tbody += `<td class="text-center col-sm-2"> ${btn}  </td>`;
    tbody += `</tr>`;
  } // end row

  // Imprime los resultados en una tabla
  table = `
        <table style="margin-top:15px; "
        class="table table-bordered table-condensed table-sm" width="100%" id="${opts.name}">
  
        <thead>
        <tr>
        ${thead}
        </tr>
        </thead>
  
        <tbody>
        ${tbody}
        </tbody>
        </table>   
      `;

  $(this).html(table);
};
