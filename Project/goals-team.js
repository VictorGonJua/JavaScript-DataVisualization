function GoalsTeam() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Premier League: Goals Team';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'goals-team';

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/player-stats/goals-team.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });
  };

  this.setup = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    // Create a select DOM element.
    this.select = createSelect();
    this.select.position(400, 100);

    // Fill the options with all team names.
    var teams = this.data.columns;
    // First entry is empty.
    for (let i = 1; i < teams.length; i++) {
      this.select.option(teams[i]);
    }
  };

  this.destroy = function() {
    this.select.remove();
  };

  // Create a new pie chart object.
  this.pie = new PieChart(width / 2, height / 2, width * 0.4);

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    // Get the value of the team we're interested in from the
    // select item.
    var year = this.select.value();

    // Get the column of raw data for year.
    var col = this.data.getColumn(year);

    // Convert all data strings to numbers.
    col = stringsToNumbers(col);

    // Copy the row labels from the table (the first item of each row).
    var labels = this.data.getColumn(0);

    // Colour to use for each category.
    var colours = ['#006400','green','yellow','orange', 'red','Gold','PaleTurquoise','DimGray','Violet','Navy'];

    // Make a title.
    var title = 'Total goals scored by Premier League historical top 10 teams in the year ' + year;

    // Draw the pie chart!
    this.pie.draw(col, labels, colours, title);
      
    fill('white');
    stroke(10);
    ellipse(width / 2, height / 2, width * 0.2, width * 0.2);
    fill(0,0,0);
    text('Total Goals:', width / 2, height / 2-20);
    text(sum(this.data.getColumn(year)), width / 2, height / 2+20);
    
    
    
  };
}
