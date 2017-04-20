using Microsoft.VisualStudio.TestTools.UnitTesting;
using PoorClaresArundel.Controllers;
using PoorClaresArundel.Models;
using PoorClaresArundel.Services;
using Moq;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;

namespace PoorClaresArundel.UnitTests.Controllers
{
    [TestClass]
    public class PrayerRequestControllerUnitTests
    {
        private PrayerRequestController _controller;
        private Mock<IOptions<ApplicationSettings>> _applicationSettingsMock;
        private Mock<IMailer> _mailerMock;
        private Mock<ILogger<PrayerRequestController>> _loggerMock;

        [TestInitialize]
        public void Setup()
        {
            _applicationSettingsMock = new Mock<IOptions<ApplicationSettings>>();
            _applicationSettingsMock.SetupGet(x => x.Value).Returns(_applicationSettings);
            _mailerMock = new Mock<IMailer>();
            _loggerMock = new Mock<ILogger<PrayerRequestController>>();

            _controller = new PrayerRequestController(_applicationSettingsMock.Object, _mailerMock.Object, _loggerMock.Object);
        }

        [TestMethod]
        public void SendPrayerRequest_should_return_an_OkObjectResult()
        {
            var result = _controller.SendPrayerRequest(new PrayerRequest { Email = "fds@fdsfs", PrayFor = "pray for me" }) as OkObjectResult;
            var resultValue = result.Value as PrayerRequestResponse;

            Assert.IsInstanceOfType(result, typeof(OkObjectResult));
            Assert.IsInstanceOfType(resultValue, typeof(PrayerRequestResponse));
        }

        [TestMethod]
        public void SendPrayerRequest_should_return_ModelState_error_messages()
        {
            // Arrange
            _controller.ModelState.AddModelError("TestError", "Something went wrong..."); // Force ModelState to not IsValid

            // Act
            var result = _controller.SendPrayerRequest(new PrayerRequest { Email = "fds@fdsfs", PrayFor = "pray for me" }) as OkObjectResult;
            var resultValue = result.Value as PrayerRequestResponse;

            // Assert
            Assert.AreEqual(false, resultValue.Success);
            Assert.AreEqual("Sorry your email was not sent because: Something went wrong...", resultValue.Text);
        }

        [TestMethod]
        public void SendPrayerRequest_should_return_success_message()
        {
            var result = _controller.SendPrayerRequest(new PrayerRequest { Email = "fds@fdsfs", PrayFor = "pray for me" }) as OkObjectResult;
            var resultValue = result.Value as PrayerRequestResponse;

            Assert.AreEqual(true, resultValue.Success);
            Assert.AreEqual("Thanks for sending your prayer request - we will pray.", resultValue.Text);
        }

        private ApplicationSettings _applicationSettings = new ApplicationSettings{
            SmtpClientHost = "SmtpClientHost",
            SmtpClientPort = 999,
            SmtpUserName = "username",
            SmtpPassword = "password",
            PrayerRequestEmailAddress = "praying@poorclares",
            PrayerRequestEmailSubject = "request",
            PrayerResponseEmailSubject = "response",
            PrayerResponseEmailFilePathText = "text path",
            PrayerResponseEmailFilePathHtml = "HTML path"
        };
        private string _text = "text";
        private string _html = "Html";

        private void SendPrayerRequest_shared_setup()
        {
            _mailerMock.Setup(x => x.ReadTextFromFile(_applicationSettings.PrayerResponseEmailFilePathText)).Returns(_text);
            _mailerMock.Setup(x => x.ReadTextFromFile(_applicationSettings.PrayerResponseEmailFilePathHtml)).Returns(_html);
        }

        [TestMethod]
        public void SendPrayerRequest_should_send_2_emails_driven_by_application_settings()
        {
            // Arrange
            SendPrayerRequest_shared_setup();

            // Act
            var prayerRequest = new PrayerRequest { Email = "fds@fdsfs", PrayFor = "pray for me" };
            var result = _controller.SendPrayerRequest(prayerRequest) as OkObjectResult;
            var resultValue = result.Value as PrayerRequestResponse;

            // Assert
            _mailerMock.Verify(x => x.ReadTextFromFile(_applicationSettings.PrayerResponseEmailFilePathText));
            _mailerMock.Verify(x => x.ReadTextFromFile(_applicationSettings.PrayerResponseEmailFilePathHtml));
            _mailerMock.Verify(x =>
                x.SendMail(_applicationSettings.SmtpClientHost, _applicationSettings.SmtpClientPort, _applicationSettings.SmtpUserName, _applicationSettings.SmtpPassword, prayerRequest.Email, _applicationSettings.PrayerRequestEmailAddress, _applicationSettings.PrayerRequestEmailSubject, prayerRequest.PrayFor, null)
                );
            _mailerMock.Verify(x =>
                x.SendMail(_applicationSettings.SmtpClientHost, _applicationSettings.SmtpClientPort, _applicationSettings.SmtpUserName, _applicationSettings.SmtpPassword, _applicationSettings.PrayerRequestEmailAddress, prayerRequest.Email, _applicationSettings.PrayerResponseEmailSubject, _text, _html)
                );
        }

/*
        [TestMethod]
        public void SendPrayerRequest_should_encode_prayFor_to_prevent_XSS_attacks()
        {
            // Arrange
            SendPrayerRequest_shared_setup();

            // Act
            var prayerRequest = new PrayerRequest { Email = "fds@fdsfs", PrayFor = "<script>alert()</script>" };
            var result = _controller.SendPrayerRequest(prayerRequest) as OkObjectResult;
            var resultValue = result.Value as PrayerRequestResponse;

            // Assert
            _mailerMock.Verify(x =>
                x.SendMail(_smtpClientHost, _smtpClientPort, _smtpUserName, _smtpPassword, prayerRequest.Email,
                           _prayerRequestEmailAddress, _prayerRequestEmailSubject, prayerRequest.PrayFor, null), 
                           Times.Never
                );
            _mailerMock.Verify(x =>
                x.SendMail(_smtpClientHost, _smtpClientPort, _smtpUserName, _smtpPassword, prayerRequest.Email,
                           _prayerRequestEmailAddress, _prayerRequestEmailSubject,
                           Security.AntiXss.AntiXssEncoder.HtmlEncode(prayerRequest.PrayFor, true), null),
                           Times.Once
                );
        }
 */
     }
}
