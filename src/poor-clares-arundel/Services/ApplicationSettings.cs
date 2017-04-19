namespace PoorClaresArundel.Services
{
    public class ApplicationSettings
    {
        public ApplicationSettings()
        {
            
        }
        
        public string SmtpUserName { get; set; }
        public string SmtpPassword { get; set; }
        public string SmtpClientHost { get; set; }
        public int SmtpClientPort { get; set; }
        public string PrayerResponseEmailSubject { get; set; }
        public string PrayerResponseEmailFilePathHtml { get; set; }
        public string PrayerResponseEmailFilePathText { get; set; }
        public string PrayerRequestEmailSubject { get; set; }
        public string PrayerRequestEmailAddress { get; set; }
    }
}