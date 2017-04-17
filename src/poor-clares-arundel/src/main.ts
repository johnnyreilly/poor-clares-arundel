import "babel-polyfill";
import angular from "angular";
import "angular-mocks";
import registerApp from "./app";

const appName = registerApp();
angular.element(document).ready(() => angular.bootstrap(document, [appName]));
