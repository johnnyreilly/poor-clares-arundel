import angular from "angular";
import "angular-mocks";
import registerApp from "../../src/app";
import { PrayerRequestService } from "../../src/services/prayerRequestService";
import { prayerRequestControllerName, PrayerRequestController } from "../../src/controllers/prayerRequestController";

const appName = registerApp();

function getInjectable() {
    angular.mock.module(appName);

    let $controller: Function;

    let $scope: ng.IScope;
    let $rootScope: ng.IRootScopeService;
    let $q: ng.IQService;
    let prayerRequestService: PrayerRequestService;

    angular.mock.inject((
        _$controller_: Function,
        _$rootScope_: ng.IRootScopeService,
        _$q_: ng.IQService,
        _prayerRequestService_: PrayerRequestService
    ) => {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $q = _$q_;
        prayerRequestService = _prayerRequestService_;
    });

    return { $controller, $scope, $rootScope, $q, prayerRequestService };
}

function getPrayerRequestController($controller: Function, dependencies: {}) {
    return $controller(prayerRequestControllerName, dependencies) as PrayerRequestController;
}

describe("Controllers", () => {
    describe("PrayerRequestController", () => {
        it('should set the message to "Sending..."', () => {
            const { $controller, $scope, $q, prayerRequestService } = getInjectable();
            spyOn(prayerRequestService, "sendPrayerRequest").and.returnValue($q.when());
            const controller = getPrayerRequestController($controller, { $scope, prayerRequestService });
            const prayerRequest = { email: "johnny_reilly@hotmail.com", prayFor: "Me" };

            controller.send(prayerRequest);

            const message = controller.message;
            expect(message.success).toBe(true);
            expect(message.text).toBe("Sending...");
        });

        it("should set the message to be the resolved promise values", function () {
            const { $controller, $rootScope, $scope, $q, prayerRequestService } = getInjectable();
            const stubResponse = { success: true, text: "worked!" };
            spyOn(prayerRequestService, "sendPrayerRequest").and.returnValue($q.when(stubResponse));
            const controller = getPrayerRequestController($controller, { $scope, prayerRequestService });
            const prayerRequest = { email: "johnny_reilly@hotmail.com", prayFor: "Me" };

            controller.send(prayerRequest);
            $rootScope.$digest(); // So Angular processes the resolved promise

            const { success, text } = controller.message;
            expect(success).toBe(stubResponse.success);
            expect(text).toBe(stubResponse.text);
        });

        it("should call prayerRequestService.sendPrayerRequest with appropriate values", function () {
            const { $controller, $scope, $q, prayerRequestService } = getInjectable();
            spyOn(prayerRequestService, "sendPrayerRequest").and.returnValue($q.when());
            const controller = getPrayerRequestController($controller, { $scope, prayerRequestService });
            const prayerRequest = { email: "johnny_reilly@hotmail.com", prayFor: "Me" };

            controller.send(prayerRequest);

            expect(prayerRequestService.sendPrayerRequest).toHaveBeenCalledWith(prayerRequest.email, prayerRequest.prayFor);
        });

        it("should set the message on promise rejection", function () {
            const { $controller, $rootScope, $scope, $q, prayerRequestService } = getInjectable();
            spyOn(prayerRequestService, "sendPrayerRequest").and.returnValue($q.reject("Go away"));
            const controller = getPrayerRequestController($controller, { $scope, prayerRequestService });
            const prayerRequest = { email: "johnny_reilly@hotmail.com", prayFor: "Me" };

            controller.send(prayerRequest);
            $rootScope.$digest(); // So Angular processes the resolved promise

            const { success, text } = controller.message;
            expect(success).toBe(false);
            expect(text).toBe("Sorry your email was not sent");
        });
    });
});
