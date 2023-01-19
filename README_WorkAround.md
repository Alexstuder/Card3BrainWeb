### OpenApi runterladen unter unter /src/app/openapi/api.docs.yaml ablegen

- url: http://localhost:9001 durch 
- url: http://167.86.76.193:9001 ersetzen

openapi generieren
```
openapi-generator-cli generate -g typescript-angular -i src/app/openapi/api-docs.yaml -o src/app/openapi-gen
```

###  Angular für die Produktion builden
```
npm run build --configuration production
```

###  Docker Image erstellen
```
docker build  . --tag rojo1/card2brainweb
```

### Push Dockerimage to DockerHub
Damit dies funktioniert muss man in der DockerDesktop App eingeloggt sein
```
docker card2brainweb push rojo1/card2brainweb:latest
```

###  Auf den Prod Server(167.86.76.193) mit dem user card2brain einloggen und das Image runterladen
```
docker pull
```

###  In den Container laden
```
docker-compose up -d
```
