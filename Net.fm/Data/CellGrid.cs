using System.Collections;

namespace Net.fm.Data
{
    public class CellGrid
    {
        public Cell[] cellArray { set; get; }
        public int sideLength;

        // integer arraylist of which cells to update/toggle on each cycle
        List<Int32> toToggle = new List<Int32>(); 

        public CellGrid(int sideLength)
        {
            this.sideLength = sideLength; 
            cellArray = new Cell[sideLength * sideLength];
            for(int i = 0; i < cellArray.Length; i++)
            {
                cellArray[i] = new Cell();
            }
        }

        public void SetCellGrid(bool[] boolCellArray)
        {
            for(int index = 0; index < cellArray.Length; index++)
            {
                cellArray[index].IsAlive = boolCellArray[index];
            }
        }

        public bool[] GetBoolArray()
        {
            return cellArray.Select(x => x.IsAlive).ToArray();
        }

        public void UpdateGrid()
        {
            CheckWhichCellsToUpdate();
            ToggleList();
        }

        // adds indices to toggle list of which items in grid need to change
        private void CheckWhichCellsToUpdate()
        {
            int surroundingCellCount = 0;
            for(int i = 0; i < cellArray.Length; i++)
            {
                surroundingCellCount = SurroundingCellStatus(i, this.GetBoolArray());
                if (cellArray[i].IsAlive != WillBeAlive(cellArray[i].IsAlive, surroundingCellCount))
                {
                    toToggle.Add(i);
                }
            }
        }

        private bool WillBeAlive(bool cellStatus, int surroundingCells)
        {
            if(cellStatus)
            {
                if(surroundingCells < 2 || surroundingCells >= 4)
                {
                    return false;
                }
                return true;
            }
            else
            {
                if(surroundingCells == 3)
                {
                    return true;
                }
            }
            return false;
        }

        // returns a number 0-4 of cell status
        private int SurroundingCellStatus(int index, bool[] isAliveArray)
        {
            int[] cellIndices = new int[8];
            int sum = 0;

            //top left
            cellIndices[0] = index - sideLength - 1;
            //top
            cellIndices[1] = index - sideLength;
            //top right
            cellIndices[2] = index - sideLength + 1;
            //left
            cellIndices[3] = index - 1;
            //right
            cellIndices[4] = index + 1;
            //bottom left
            cellIndices[5] = index + sideLength - 1;
            //bottom
            cellIndices[6] = index + sideLength;
            //bottom right
            cellIndices[7] = index + sideLength + 1;
            
            if(index % sideLength == 0)
            {
                cellIndices[0] = -1;
                cellIndices[3] = -1;
                cellIndices[5] = -1;
            }
            if((index + 1) % sideLength == 0)
            {
                cellIndices[2] = -1;
                cellIndices[4] = -1;
                cellIndices[7] = -1;
            }
            if((index) >= (sideLength*(sideLength-1)))
            {
                cellIndices[5] = -1;
                cellIndices[6] = -1;
                cellIndices[7] = -1;
            }
            
            for(int i = 0; i < cellIndices.Length; i++)
            {
                if (cellIndices[i] > 0 && /*cellIndices[i] < cellIndices.Length &&*/ isAliveArray[cellIndices[i]])
                {
                    sum = sum + 1;
                }

            }

            return sum;
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
