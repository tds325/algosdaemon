using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Net.fm.Data;

namespace Net.fm.Pages
{
    public class ConwayModel : PageModel
    {
        private int _gridSideLen = 35;

        [FromQuery(Name = "side")]
        public int GridSideLen
        {
            get { return GridSideLen; }
            set
            {
                if (value < 10 || value > 50)
                {
                    _gridSideLen = 35;
                }
                else _gridSideLen = value;
            }
        } 

        public CellGrid cellGrid;

        public void OnGet()
        {
            cellGrid = new CellGrid(_gridSideLen);
        }

        public void UpdateModel()
        {
            foreach(var cell in cellGrid.cellArray)
            {
                cell.ToggleStatus();
            }
        }

        public void OnGetUpdateModel()
        {
            UpdateModel();
        }

    }
}
