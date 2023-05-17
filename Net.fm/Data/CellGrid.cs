using System.Collections;

namespace Net.fm.Data
{
    public class CellGrid
    {
        public Cell[] cellArray { set; get; }

        // integer arraylist of which cells to update/toggle on each cycle
        List<Int32> toToggle = new List<Int32>(); 

        public CellGrid(int sideLength)
        {
            cellArray = new Cell[sideLength * sideLength];
            for(int i = 0; i < cellArray.Length; i++)
            {
                cellArray[i] = new Cell();
            }
        }

        private void UpdateGrid()
        {
            CheckWhichCellsToUpdate();
            ToggleList();
        }

        // adds indices to toggle list of which items in grid need to change
        private void CheckWhichCellsToUpdate()
        {
            for(int i = 0; i < cellArray.Length; i++)
            {
                toToggle.Add(i);
            }
        }

        private void ToggleList()
        {
            foreach (var num in toToggle)
            {
                cellArray[num].ToggleStatus();
            }
            toToggle.Clear();
        }

    }
}
