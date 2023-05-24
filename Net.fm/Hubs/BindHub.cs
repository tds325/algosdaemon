using Microsoft.AspNetCore.SignalR;
using Net.fm.Data;

namespace Net.fm.Hubs
{
    public class BindHub : Hub
    {
        public CellGrid cellGrid { get; set; }


        public async Task SendMessage(bool[] cellArray)
        {
            await Clients.Caller.SendAsync("ReceiveMessage", cellArray);
        }

        public async Task SetCellGrid(bool[] array)
        {
            this.cellGrid = new CellGrid((int)Math.Sqrt(array.Length));
            this.cellGrid.SetCellGrid(array);
        }
        
        public async Task ConwayStep(bool[] array)
        {
            await SetCellGrid(array);
            while (cellGrid == null) { }
            this.cellGrid.UpdateGrid();
            await Clients.Caller.SendAsync("ReceiveMessage", cellGrid.GetBoolArray());
        }
        
    }
}
