import angular from "angular";
import "angular-mocks";
import registerApp from "../../src/app";
import { PrayerRequestService } from "../../src/services/prayerRequestService";

const appName = registerApp();

function getInjectable() {
    angular.mock.module(appName);

    let prayerRequestService: PrayerRequestService;
    let $httpBackend: ng.IHttpBackendService;

    angular.mock.inject((
        _prayerRequestService_: PrayerRequestService,
        _$httpBackend_: ng.IHttpBackendService
    ) => {
        prayerRequestService = _prayerRequestService_;
        $httpBackend = _$httpBackend_;
    });

    return { prayerRequestService, $httpBackend };
}

function cleanup($httpBackend: ng.IHttpBackendService) {
  $httpBackend.verifyNoOutstandingExpectation();
  $httpBackend.verifyNoOutstandingRequest();
}

describe("Services", () => {
    describe("prayerRequestService", () => {
        it("should send http post", () => {
            const { $httpBackend, prayerRequestService } = getInjectable();
            const stubResponse = { success: true, text: "Done!" };

            $httpBackend
                .expectPOST("/api/PrayerRequest", { email: "johnny_reilly@hotmail.com", prayFor: "Me" })
                .respond(200, stubResponse);

            // make the call
            const promise = prayerRequestService.sendPrayerRequest("johnny_reilly@hotmail.com", "Me");

            // set up to collect the result
            let result: any;
            promise.then(response => result = response);

            // execute the request to do the expectPOST (which will populate result)
            $httpBackend.flush();

            expect(result.success).toBe(stubResponse.success);
            expect(result.text).toBe(stubResponse.text);
        });
    });
});
