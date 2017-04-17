import angular from "angular";
import "angular-mocks";
import registerApp from "../../src/app";
import { SiteSectionService } from "../../src/services/siteSectionService";
import { navControllerName, NavController, IWindowWithAnalyticsService } from "../../src/controllers/navController";

const appName = registerApp();

function getInjectable() {
    angular.mock.module(appName);

    let $controller: Function;

    let $scope: ng.IScope;
    let $rootScope: ng.IRootScopeService;
    let siteSectionService: SiteSectionService;
    let $location: ng.ILocationService;
    let $window: IWindowWithAnalyticsService;

    angular.mock.inject((
        _$controller_: Function,
        _$rootScope_: ng.IRootScopeService,
        _siteSectionService_: SiteSectionService,
        _$location_: ng.ILocationService,
        _$window_: IWindowWithAnalyticsService
    ) => {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        siteSectionService = _siteSectionService_;
        $location = _$location_;
    });

    return { $controller, $scope, $rootScope, siteSectionService, $location, $window };
}

function getNavController($controller: Function, dependencies: {}) {
    return $controller(navControllerName, dependencies) as NavController;
}

﻿describe("Controllers", () => {
    describe("NavController", () => {
        it("should set the default value of isCollapsed", () => {
            const { $controller, $scope } = getInjectable();
            const controller = getNavController($controller, { $scope });

            expect(controller.isCollapsed).toBe(true);
        });

        it("should toggle the value of isCollapsed when toggleCollapsed is called", () => {
            const { $controller, $scope } = getInjectable();
            const controller = getNavController($controller, { $scope });
            const isCollapsed = controller.isCollapsed;

            controller.toggleCollapsed();

            expect(controller.isCollapsed).toBe(!isCollapsed);
        });

        it("should set isCollapsed to true on $stateChangeStart event", function () {
            const { $controller, $rootScope, $scope } = getInjectable();
            const controller = getNavController($controller, { $scope });

            controller.isCollapsed = false;

            $rootScope.$broadcast("$stateChangeStart", null);

            expect(controller.isCollapsed).toBe(true);
        });

        it("should send a pageview to Google Analytics on $stateChangeSuccess event", function () {
            const { $controller, $rootScope, $scope, $location } = getInjectable();
            const $window = {
              ga(command: string, hitType: string, fields: {
                  page: string;
                  title?: string;
              }) { }
            };
            const controller = getNavController($controller, { $scope, $window });
            spyOn($window, "ga");

            $rootScope.$broadcast("$stateChangeSuccess", null);

            expect($window.ga).toHaveBeenCalledWith("send", "pageview", { page: $location.path() });
        });
    });
});
