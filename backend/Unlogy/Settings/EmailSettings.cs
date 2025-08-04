using System.Net;
using System.Net.Mail;
using Unlogy.Entities;

namespace Unlogy.Settings
{
    public class EmailSettings
    {
        public static void SendEmail( Email email)
        {
            var client = new SmtpClient("smtp.gmail.com", 587);
            client.EnableSsl = true;
            client.Credentials = new NetworkCredential("lojienbarrham@gmail.com", "hrni ghtb cnjy bwni");
            client.Send("lojienbarrham@gmail.com", email.Recivers, email.Subject, email.Body);
        }
    }
}
