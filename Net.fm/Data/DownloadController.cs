using Microsoft.AspNetCore.Mvc;
using Net.fm.Pages;
using System.Diagnostics;
using System.Net;
using System.Text;
using FluentFTP;
using Microsoft.AspNetCore.Hosting;
using IHostingEnvironment = Microsoft.AspNetCore.Hosting.IHostingEnvironment;
using System.Runtime.InteropServices;

namespace Net.fm.Data
{
    public class DownloadController : Controller
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private bool isWindows = System.Runtime.InteropServices.RuntimeInformation.IsOSPlatform(OSPlatform.Windows);

        public DownloadController(IHostingEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        [HttpGet]
        [Route("/Download")]
        public async Task<FileResult> Get()
        {
            string ip = "127.0.0.1";
            string filename = "Tayler_Skirvin_Resume.pdf";
            string webroot = _hostingEnvironment.WebRootPath.ToString();

            // Always download most recent file if possible
            FtpService ftpService = new FtpService(ip);
            FtpStatus status = await ftpService.GetFile(filename, webroot);
            Debug.WriteLine($"FtpStatus: {status}");
            byte[] fileBytes = isWindows ? System.IO.File.ReadAllBytes($"{webroot}\\{filename}") : System.IO.File.ReadAllBytes($"{webroot}/{filename}");
            return File(fileBytes, System.Net.Mime.MediaTypeNames.Application.Octet, filename);
        }

    }
}
