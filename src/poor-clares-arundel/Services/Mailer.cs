using MailKit.Net.Smtp;
using MimeKit;
using MailKit.Security;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace PoorClaresArundel.Services
{
    public interface IMailer
    {
        void SendMail(string smtpClientHost, int smtpClientHostPort, string smtpUserName, string smtpPassword,
            string fromEmail, string toEmail, string subject, string text, string html = null);

        string ReadTextFromFile(string filePath);
    }

    public class Mailer : IMailer
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        public Mailer(IHostingEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }
        
        public void SendMail(string smtpClientHost, int smtpClientHostPort, string smtpUserName, string smtpPassword,
    string fromEmail, string toEmail, string subject, string text, string html = null)
        {
            var mailMsg = new MimeMessage();
            mailMsg.To.Add(new MailboxAddress(toEmail, toEmail));

            // From
            mailMsg.From.Add(new MailboxAddress(fromEmail, fromEmail));
            //mailMsg.Bcc.Add(new MailAddress(toEmail, toEmail));

            // Subject and multipart/alternative Body
            mailMsg.Subject = subject;

            var builder = new BodyBuilder ();

            builder.TextBody = text;
            if (!string.IsNullOrEmpty(html)) builder.HtmlBody = html;

            mailMsg.Body = builder.ToMessageBody();

            // Init SmtpClient and send
            using (var client = new SmtpClient())
            {
                client.LocalDomain = "some.domain.com";                
                client.Connect("smtp.relay.uri", 25, SecureSocketOptions.None);
                client.Send(mailMsg);
                client.Disconnect(true);
            }
        }

        public string ReadTextFromFile(string filePath)
        {
            return File.ReadAllText(Path.Combine(_hostingEnvironment.ContentRootPath, filePath));
        }
    }
}