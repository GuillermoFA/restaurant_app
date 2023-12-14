# Proyecto Integrador Software: Restaurant App
Parte web gestión de administración
Parte móvil gestión de clientes

## Frontend (Ionic Con Angular) & Angular Web

### 1. Instalación de Node.js y npm

Asegúrate de tener Node.js y npm instalados en tu máquina. Puedes descargarlos desde el sitio oficial: [Node.js](https://nodejs.org/).

### 2. Navegación a la Carpeta del Proyecto Angular

Abre la carpeta del proyecto y mediante comando cmd ejecuta la terminal de Visual Studio Code o la ide que tengas, para ejecutarlo con Visual Studio es lo siguiente:
```cli
code .
```

### 3. Una vez abierto Visual Studio Code vamos a la terminal del mismo y navegamos entre la carpeta de Frontend.
```cli
cd /
```

### 4. Instalacion de Dependencias.

Ejecuta el siguiente comando para instalar las dependencias del proyecto:
```cli
npm install
```
### 5. Instalación de Ionic CLI.

Asegúrate de que Angular CLI 16.2.3 está instalado globalmente ejecutando:
```cli
npm install -g @ionic/cli
npm install -g @angular/cli
```

### 6. Ejecución del servidor de desarrollo.

Inicia el servidor de desarrollo para tu aplicacion Angular:
```cli
ionic serve
ng serve
```
La aplicación estará disponible en http://localhost:4200/



## Backend (Dotnet 7 Entity Framework con SQLITE)

### 1. Instalación de Dotnet SDK 7

Descarga e instala el SDK de Dotnet 7 desde el sitio oficial: : [Dotnet7](https://dotnet.microsoft.com/es-es/download/dotnet/7.0).

### 2. Navegación a la carpeta del Proyecto Backend

Siguiendo los mismos pasos que realizó con el Frontend, ahora con el backend abra una terminal y navege a la carpeta del proyecto backend:
```cli
cd /
```

### 3. Restauración de Dependencias:

Ejecuta el siguiente comando para restaurar las dependencias del proyecto:
```cli
dotnet restore
```

### 4. Asegurate que la base de datos esté operativa. (Opcional)

Ejecuta el siguiente comando para corroborrar que existe una base de datos en el sistema.
```cli
dotnet ef database update
```

### 5. Ejecucion del proyecto Dotnet 
```cli
dotnet run
```
