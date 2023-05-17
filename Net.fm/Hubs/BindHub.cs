using Microsoft.AspNetCore.SignalR;
using Net.fm.Data;

namespace Net.fm.Hubs
{
    public class BindHub : Hub
    {
        public async Task SendMessage(CellGrid cellGrid) 
            => await Clients.Caller.SendAsync("RecieveMessage", cellGrid);

        
    }
}
