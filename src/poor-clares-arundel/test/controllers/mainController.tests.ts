import angular from "angular";
import "angular-mocks";
import registerApp from "../../src/app";
import { SiteSectionService } from "../../src/services/siteSectionService";
import { mainControllerName, MainController } from "../../src/controllers/mainController";

const appName = registerApp();

function getInjectable() {
    angular.mock.module(appName);

    let $controller: Function;
    let $location: ng.ILocationService;
    let siteSectionService: SiteSectionService;

    angular.mock.inject((
        _$controller_: Function,
        _$location_: ng.ILocationService,
        _siteSectionService_: SiteSectionService
    ) => {
        $controller = _$controller_;
        $location = _$location_;
        siteSectionService = _siteSectionService_;
    });

    return { $controller, $location, siteSectionService };
}

function getMainController($controller: Function, dependencies: {}) {
    return $controller(mainControllerName, dependencies) as MainController;
}

describe("Controllers", () => {
    describe("MainController", () => {
        it('should call siteSectionService.determineSiteSection with "theConvent"', () => {
            const { $controller, $location, siteSectionService } = getInjectable();
            const path = "/theConvent/";
            spyOn($location, "path").and.returnValue(path);
            spyOn(siteSectionService, "determineSiteSection").and.callThrough();

            const controller = getMainController($controller, { $location, siteSectionService });

            expect(siteSectionService.determineSiteSection).toHaveBeenCalledWith(path);
        });
    });
});
