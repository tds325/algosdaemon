using FluentFTP;
using System.Diagnostics;
using System.Net;
using System.Text;

namespace Net.fm.Data
{
    public class FtpService : FtpInterface
    {
        public string Ip { get; set; }
        private string username;
        private string password;

        // limit max stream to 30MB
        private int memoryStreamCapacity = Convert.ToInt32(Math.Pow(2, 20) * 30);
        public FtpService(string ip)
        {
            this.Ip = ip;
            this.username = "anonymous";
            this.password = "";
        }

        public async Task<FtpStatus> GetFile(string filename, string path = "")
        {
            try
            {
                var client = new AsyncFtpClient(Ip, this.username, this.password);
                await client.AutoConnect();
                var status = await client.DownloadFile($"{path}/{filename}", $"/{filename}", FtpLocalExists.Overwrite);
                return status;
            }
            catch (Exception ex) { Debug.WriteLine(ex); }
            return FtpStatus.Failed;
        }
    }
}
