import angular from "angular";
import "angular-mocks";
import registerApp from "../../src/app";
import { SiteSectionService } from "../../src/services/siteSectionService";

const appName = registerApp();

function getInjectable() {
    angular.mock.module(appName);

    let siteSectionService: SiteSectionService;

    angular.mock.inject((
        _siteSectionService_: SiteSectionService
    ) => {
        siteSectionService = _siteSectionService_;
    });

    return { siteSectionService };
}

describe("Services", () => {
    describe("siteSectionService", () => {
        it("should set the default value of siteSection", () => {
            const { siteSectionService } = getInjectable();
            expect(siteSectionService.getSiteSection()).toBe("home");
        });

        it('should set siteSection to "home"', () => {
            const { siteSectionService } = getInjectable();
            siteSectionService.determineSiteSection("/");
            expect(siteSectionService.getSiteSection()).toBe("home");
        });

        it('should set siteSection to "main"', () => {
            const { siteSectionService } = getInjectable();
            siteSectionService.determineSiteSection("/hello");
            expect(siteSectionService.getSiteSection()).toBe("main");
        });

        it('should set siteSection to "theConvent"', () => {
            const { siteSectionService } = getInjectable();
            siteSectionService.determineSiteSection("/theConvent/");
            expect(siteSectionService.getSiteSection()).toBe("theConvent");
        });
    });
});
