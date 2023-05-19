namespace Net.fm.Data
{

    public class Cell
    {
        public bool IsAlive { set; get; }

        public Cell() 
        {
            this.IsAlive = false;
        }

        public void SetStatus(bool status)
        {
            this.IsAlive = status;
        }

        public void ToggleStatus()
        {
            this.IsAlive = !this.IsAlive;
        }

        public string GetStatusClass()
        {
            if (this.IsAlive)
            {
                return "alive";
            }
            return "dead";
        }
    }
}
