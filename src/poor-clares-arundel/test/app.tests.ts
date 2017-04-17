import angular from "angular";
import "angular-mocks";
import registerApp from "../src/app";
import { SiteSectionService } from "../src/services/siteSectionService";

const appName = registerApp();

function getInjectable() {
    angular.mock.module(appName);

    let $state: angular.ui.IStateService;
    let $location: ng.ILocationService;
    let $rootScope: ng.IRootScopeService;
    let $templateCache: ng.ITemplateCacheService;

    angular.mock.inject(($injector: ng.auto.IInjectorService) => {
        $state = $injector.get<angular.ui.IStateService>("$state");
        $location = $injector.get<ng.ILocationService>("$location");
        $rootScope = $injector.get<ng.IRootScopeService>("$rootScope");
        $templateCache = $injector.get<ng.ITemplateCacheService>("$templateCache");
    });

    $templateCache.put("templates/home.html", "");

    return { $state, $location, $rootScope };
}

describe("Routes", () => {
    describe("$routeProvider", () => {
        it("should map the root url to the home screen", () => {
            const { $state } = getInjectable();
            expect($state.href("home")).toEqual("/");
        });

        it("should map urls that start '/theConvent/' to 'the Convent' site section", () => {
            const { $state } = getInjectable();
            expect($state.href("the-convent.content", { view: "home" })).toEqual("/theConvent/home");
        });

        it("should map urls to the main site section", () => {
            const { $state } = getInjectable();
            expect($state.href("main.content", { view: "us" })).toEqual("/us");
        });

        xit("should redirect other urls to the home screen", () => {
            const { $state, $rootScope } = getInjectable();

            $state.go("i am not a state");
            $rootScope.$digest();
            expect($state.current.name).toBe("home");

            // expect($route.routes[(<any>null)].redirectTo).toBe("/");
        });
    });
});
