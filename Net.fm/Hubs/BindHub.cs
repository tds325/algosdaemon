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
            /*var oldCellArray = new bool[array.Length];
            for(int index = 0; index < oldCellArray.Length; index++)
            {
                oldCellArray[index] = false;
            }

            for(int index = 0; index < array.Length; index++)
            {
                cellGrid.cellArray[index].SetStatus(array[index]);
            }*/
            for(int i = 0; i < array.Length; i++)
            {
                array[i] = !array[i];
            }
            await SendMessage(array);
            
        }
        
    }
}
