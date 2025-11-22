# Requirements Document

## Introduction

Este documento define los requisitos para solucionar el error "Trying to access array offset on value of type null" que ocurre en el archivo `pedidos/ctrl/ctrl-pedidos.php` en la línea 122. El error se produce cuando el método `getSucursalByID()` retorna `null` y se intenta acceder a sus propiedades como array (`$Sucursal['name']` y `$Sucursal['sucursal']`).

## Glossary

- **Sistema**: El módulo de gestión de pedidos de la aplicación web
- **Sucursal**: Una ubicación física o subsidiaria de la empresa donde se procesan pedidos
- **Pedido**: Una orden de compra realizada por un cliente
- **Usuario**: Persona autenticada que utiliza el sistema

## Requirements

### Requirement 1

**User Story:** Como desarrollador, quiero que el sistema maneje correctamente los casos donde no se encuentra una sucursal, para que no se generen errores de tipo null pointer.

#### Acceptance Criteria

1. WHEN el método `getSucursalByID()` retorna null THEN el Sistema SHALL validar el resultado antes de acceder a sus propiedades
2. WHEN no se encuentra una sucursal válida THEN el Sistema SHALL utilizar valores por defecto para continuar la operación
3. WHEN ocurre un error al obtener la sucursal THEN el Sistema SHALL registrar el error en los logs
4. WHEN el usuario tiene rol de administrador y no proporciona `subsidiaries_id` THEN el Sistema SHALL utilizar la sucursal de la sesión como fallback
5. WHEN se intenta acceder a propiedades de un array null THEN el Sistema SHALL prevenir el acceso mediante validación previa

### Requirement 2

**User Story:** Como usuario del sistema, quiero que la lista de pedidos se muestre correctamente incluso cuando hay problemas con los datos de sucursales, para que pueda continuar trabajando sin interrupciones.

#### Acceptance Criteria

1. WHEN se lista pedidos y hay datos de sucursal faltantes THEN el Sistema SHALL mostrar un folio genérico o placeholder
2. WHEN se procesa un pedido con sucursal inválida THEN el Sistema SHALL completar la operación con valores seguros
3. WHEN se detecta una inconsistencia en los datos THEN el Sistema SHALL notificar al usuario mediante un mensaje apropiado
4. WHEN se genera un folio de pedido THEN el Sistema SHALL garantizar que siempre se genera un identificador válido

### Requirement 3

**User Story:** Como administrador del sistema, quiero que se validen correctamente los parámetros de entrada en las operaciones de pedidos, para que el sistema sea más robusto y confiable.

#### Acceptance Criteria

1. WHEN se recibe un `subsidiaries_id` desde POST THEN el Sistema SHALL validar que el valor no sea null o vacío
2. WHEN se accede a variables de sesión THEN el Sistema SHALL verificar que existan antes de usarlas
3. WHEN se procesan parámetros opcionales THEN el Sistema SHALL proporcionar valores por defecto seguros
4. WHEN se detecta un parámetro inválido THEN el Sistema SHALL retornar un mensaje de error descriptivo
