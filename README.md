# Card2brainweb

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.0.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Create API with Openapi 

Run `npm run generate:api` to execute OpenAPI Tool to create the interface to the backend based on the file api-docs.yaml.
If openapi-generator-cli is not installe, run `npm i -D @openapitools/openapi-generator-cli`

## Create an Image for Docker
docker build  . --tag rojo1/card2brainweb


## Push Dockerimage to DockerHub
docker card2brainweb push rojo1/card2brainweb:latest



## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
