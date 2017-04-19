using System.ComponentModel.DataAnnotations;

namespace PoorClaresArundel.Models
{
    public class PrayerRequest
    {
        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string PrayFor { get; set; }
    }
}