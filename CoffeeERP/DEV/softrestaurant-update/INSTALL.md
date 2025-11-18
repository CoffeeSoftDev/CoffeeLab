# 🚀 Guía de Instalación - SoftRestaurant

## Requisitos Previos

### Software Requerido
- ✅ PHP 7.4 o superior
- ✅ MySQL 5.7 o superior
- ✅ Apache/Nginx
- ✅ Extensiones PHP: mysqli, json, mbstring, session

### Opcional
- Composer (para dependencias futuras)
- Git (para control de versiones)

---

## Instalación Paso a Paso

### 1. Copiar Archivos

```bash
# Copiar el proyecto al servidor
cp -r softrestaurant-update /var/www/html/produccion/

# O clonar desde repositorio
git clone [url-repositorio] /var/www/html/produccion/softrestaurant-update
```

### 2. Configurar Permisos

```bash
cd /var/www/html/produccion/softrestaurant-update

# Dar permisos de escritura
chmod -R 755 .
chown -R www-data:www-data .

# Crear carpetas necesarias
mkdir -p logs uploads temp
chmod -R 777 logs uploads temp
```

### 3. Configurar Base de Datos

#### Opción A: Usar configuración existente
```bash
# Si ya existe _CRUD.php en conf/
# Verificar que apunte a la BD correcta
```

#### Opción B: Crear nueva configuración
```bash
# Copiar plantilla
cp conf/database.example.php conf/database.php

# Editar con tus credenciales
nano conf/database.php
```

**Configuración típica:**
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'tu_usuario');
define('DB_PASS', 'tu_contraseña');
define('DB_NAME', 'rfwsmqex_softrestaurant');
```

### 4. Verificar Instalación

Acceder a:
```
http://tu-dominio.com/produccion/softrestaurant-update/system-check.php
```

Este script verificará:
- ✅ Versión de PHP
- ✅ Extensiones requeridas
- ✅ Archivos del sistema
- ✅ Permisos de carpetas
- ✅ Configuración de BD

### 5. Importar Base de Datos (si es necesario)

```bash
# Si tienes un dump SQL
mysql -u usuario -p rfwsmqex_softrestaurant < database.sql

# O crear tablas manualmente
mysql -u usuario -p rfwsmqex_softrestaurant < sql/create_tables.sql
```

### 6. Acceder al Sistema

```
http://tu-dominio.com/produccion/softrestaurant-update/
```

**Credenciales:** Usar las mismas del sistema ERP principal

---

## Estructura de Carpetas

```
softrestaurant-update/
├── index.php                    # Dashboard principal
├── administracion.php           # Módulo administración
├── productos-vendidos.php       # Módulo ventas
├── salidas.php                  # Módulo salidas
├── system-check.php            # Verificación del sistema
│
├── conf/                        # Configuración
│   ├── database.example.php    # Plantilla de configuración
│   └── .gitignore              # No versionar credenciales
│
├── ctrl/                        # Controladores (4 archivos)
├── mdl/                         # Modelos (5 archivos)
├── js/                          # JavaScript principal (3 archivos)
│
├── src/
│   ├── js/                      # Framework CoffeeSoft
│   ├── components/              # Componentes personalizados (3)
│   └── css/                     # Estilos
│
├── layout/                      # Layouts compartidos
│   ├── head.php
│   ├── navbar.php
│   └── footer.php
│
├── logs/                        # Logs del sistema
├── uploads/                     # Archivos subidos
└── temp/                        # Archivos temporales
```

---

## Configuración de Apache

### VirtualHost Recomendado

```apache
<VirtualHost *:80>
    ServerName softrestaurant.tu-dominio.com
    DocumentRoot /var/www/html/produccion/softrestaurant-update
    
    <Directory /var/www/html/produccion/softrestaurant-update>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/softrestaurant-error.log
    CustomLog ${APACHE_LOG_DIR}/softrestaurant-access.log combined
</VirtualHost>
```

### .htaccess (opcional)

```apache
# Proteger archivos sensibles
<FilesMatch "^(database\.php|_CRUD\.php|_Utileria\.php)$">
    Order allow,deny
    Deny from all
</FilesMatch>

# Habilitar compresión
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Cache de recursos estáticos
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

---

## Configuración de Nginx

```nginx
server {
    listen 80;
    server_name softrestaurant.tu-dominio.com;
    root /var/www/html/produccion/softrestaurant-update;
    index index.php index.html;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\. {
        deny all;
    }

    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## Solución de Problemas

### Error: "Cannot connect to database"

**Solución:**
1. Verificar credenciales en `conf/database.php`
2. Verificar que MySQL esté corriendo: `systemctl status mysql`
3. Verificar que el usuario tenga permisos: `GRANT ALL ON rfwsmqex_softrestaurant.* TO 'usuario'@'localhost';`

### Error: "coffeSoft.js not found"

**Solución:**
1. Verificar que exista: `ls -la src/js/coffeSoft.js`
2. Verificar permisos: `chmod 644 src/js/coffeSoft.js`
3. Limpiar cache del navegador

### Error: "Permission denied" en logs/

**Solución:**
```bash
chmod -R 777 logs/
chown -R www-data:www-data logs/
```

### Tablas no cargan datos

**Solución:**
1. Abrir consola del navegador (F12)
2. Verificar errores en Network tab
3. Verificar que el endpoint responda: `curl -X POST http://localhost/produccion/softrestaurant-update/ctrl/ctrl-administracion.php -d "opc=init"`

---

## Actualización

### Desde versión anterior

```bash
# Backup
cp -r softrestaurant-update softrestaurant-update.backup

# Actualizar archivos
git pull origin main

# O copiar manualmente
cp -r softrestaurant-update-new/* softrestaurant-update/

# Mantener configuración
cp softrestaurant-update.backup/conf/database.php softrestaurant-update/conf/

# Verificar
http://tu-dominio.com/produccion/softrestaurant-update/system-check.php
```

---

## Seguridad

### Recomendaciones

1. **Cambiar permisos de archivos sensibles:**
```bash
chmod 600 conf/database.php
chmod 600 conf/_CRUD.php
```

2. **Proteger carpetas:**
```bash
# Crear .htaccess en conf/
echo "Deny from all" > conf/.htaccess
```

3. **Habilitar HTTPS:**
```bash
certbot --apache -d softrestaurant.tu-dominio.com
```

4. **Actualizar PHP regularmente:**
```bash
apt update && apt upgrade php
```

---

## Soporte

Para soporte técnico:
- 📧 Email: soporte@tu-empresa.com
- 📚 Documentación: [README.md](README.md)
- 🐛 Reportar bugs: [Issues](https://github.com/tu-repo/issues)

---

**Última actualización:** Noviembre 2025  
**Versión:** 2.0.0
