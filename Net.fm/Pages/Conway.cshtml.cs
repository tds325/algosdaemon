using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Net.fm.Data;

namespace Net.fm.Pages
{
    public class ConwayModel : PageModel
    {
        public string Title { get; set; }
        public CellGrid cellGrid;

        public void OnGet(string title)
        {
            Title = title;
            cellGrid = new CellGrid(35);
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
