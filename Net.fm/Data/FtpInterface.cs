using FluentFTP;
namespace Net.fm.Data
{
    public interface FtpInterface
    {
        public Task<FtpStatus> GetFile(string filename, string path = "");
    }
}
