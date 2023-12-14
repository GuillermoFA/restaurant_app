#.NET CORE SDK
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
#Seteamos el directorio de trabajo
WORKDIR /Backend_Sabores_Autenticos

#Copiamos todos los archivos del proyecto "Backend_Sabores_autenticos"
COPY . .


#publicamos la aplicación en modo PRODUCTION con nombre /app pero con el parametro de no-restore (para evitar volver a repetir el procedimiento de dotnet restore)
RUN dotnet publish -c release -o /app 

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime

#Nos ubicamos en la carpeta raiz con el nuevo nombre de "app"
WORKDIR /app

#Hacemos copy del buld ubicado en  la carpeta raiz
COPY --from=build /app ./
#Hacemos un copy desde la raiz de nuestro proyecto hacia la direccion dentro del contenedor
COPY ./DataApi.db /app/DataApi.db

EXPOSE 80

ENTRYPOINT ["dotnet", "Backend_Sabores_Autenticos.dll"]