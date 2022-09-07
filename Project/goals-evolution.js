function GoalsEvolution() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Premier League: Top teams goals evolution';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'goals-evolution';

  // Title to display above the plot.
  this.title = 'Evolution of goals scored by top hisotrical Premier League teams (2010 - 2019)';

    // Names for each axis.
  this.xAxisLabel = 'Year';
  this.yAxisLabel = 'Number of goals';

  this.colors = [];

  var marginSize = 35;

  // Layout object to store all common plot layout parameters and
  // methods.
  this.layout = {
    marginSize: marginSize,

    // Locations of margin positions. Left and bottom have double margin
    // size due to axis and tick labels.
    leftMargin: marginSize * 2,
    rightMargin: width - marginSize,
    topMargin: marginSize,
    bottomMargin: height - marginSize * 2,
    pad: 5,

    plotWidth: function() {
      return this.rightMargin - this.leftMargin;
    },

    plotHeight: function() {
      return this.bottomMargin - this.topMargin;
    },

    // Boolean to enable/disable background grid.
    grid: false,

    // Number of axis tick labels to draw so that they are not drawn on
    // top of one another.
    numXTickLabels: 10,
    numYTickLabels: 10,
  };

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/player-stats/goals-evolution.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });

  };

  var checkbox1,checkbox2,checkbox3,checkbox4,checkbox5,checkbox6,checkbox7,checkbox8,checkbox9
    
  this.setup = function() {
    // Font defaults.
    textSize(16);
      
    checkbox1 = createCheckbox('Chelsea', true);
    checkbox1.position(375,600);
      
    checkbox2 = createCheckbox('Everton', true);
    checkbox2.position(375,625);  
    
    checkbox3 = createCheckbox('Tottenham', true);
    checkbox3.position(375,650); 
      
    checkbox4 = createCheckbox('Liverpool', true);
    checkbox4.position(525,600);   
      
    checkbox5 = createCheckbox('Man United', true);
    checkbox5.position(525,625);
      
    checkbox6 = createCheckbox('West Ham', true);
    checkbox6.position(525,650);  
      
    checkbox7 = createCheckbox('Arsenal', true);
    checkbox7.position(675,600);  
    
    
    checkbox8 = createCheckbox('Newcastle', true);
    checkbox8.position(675,625);  
      
    checkbox9 = createCheckbox('Man City', true);
    checkbox9.position(675,650);   

    // Set min and max years: assumes data is sorted by date.
    this.startYear = Number(this.data.columns[1]);
    this.endYear = Number(2021);

    for (var i = 0; i < this.data.getRowCount(); i++) {
      this.colors.push(color(random(0, 255), random(0, 255), random(0, 255)));
    }

    // Find min and max pay gap for mapping to canvas height.
    this.minGoals = 0;         // Pay equality (zero pay gap).
    this.maxGoals = 110;
  };

this.destroy = function() {
 checkbox1.remove();checkbox2.remove();checkbox3.remove();checkbox4.remove();checkbox5.remove();checkbox6.remove();checkbox7.remove();checkbox8.remove();checkbox9.remove();
  };

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    // Draw the title above the plot.
    this.drawTitle();

    // Draw all y-axis labels.
    drawYAxisTickLabels(this.minGoals,
                        this.maxGoals,
                        this.layout,
                        this.mapGoalsToHeight.bind(this),
                        0);

    // Draw x and y axis.
    drawAxis(this.layout);

    // Draw x and y axis labels.
    drawAxisLabels(this.xAxisLabel,
                   this.yAxisLabel,
                   this.layout);

    // Plot all pay gaps between startYear and endYear using the width
    // of the canvas minus margins.
    var numYears = this.endYear - this.startYear;

    // Loop over all rows and draw a line from the previous value to
    // the current.
    for (var i = 0; i < this.data.getRowCount(); i++) {

      // will give us teams
      var row = this.data.getRow(i);
      var previous = null;

      var l = row.getString(0);

      // will give us columns (data for each year)
      for (var j = 1; j < numYears; j++) {
        // Create an object to store data for the current year.
        var current = {
        
        // Convert strings to numbers.
        'year': this.startYear + (j - 1),
        'goals': row.getNum(j), 
        };

        //console.log(current);

        if (previous != null) {
          // Draw line segment connecting previous year to current
          // year pay gap.
          if(checkbox1.checked() && l==checkbox1.value() || checkbox2.checked() && l==checkbox2.value() || checkbox3.checked() && l==checkbox3.value() || checkbox4.checked() && l==checkbox4.value() || checkbox5.checked() && l==checkbox5.value() || checkbox6.checked() && l==checkbox6.value() || checkbox7.checked() && l==checkbox7.value() || checkbox8.checked() && l==checkbox8.value() || checkbox9.checked() && l==checkbox9.value()){
                    
            stroke(this.colors[i]);
          line(this.mapYearToWidth(previous.year),
              this.mapGoalsToHeight(previous.goals),
              this.mapYearToWidth(current.year),
              this.mapGoalsToHeight(current.goals));
              }

          // The number of x-axis labels to skip so that only
          // numXTickLabels are drawn.
          var xLabelSkip = ceil(numYears / this.layout.numXTickLabels);
          
          // Draw the tick label marking the start of the previous year.
          if (i % xLabelSkip == 0) {
            textSize(16);
            drawXAxisTickLabel(previous.year, this.layout, this.mapYearToWidth.bind(this));
          }
          textSize(16);
        } else {
          noStroke();
          fill(this.colors[i]);
          text(l, 100, this.mapGoalsToHeight(current.goals))
        }
        // Assign current year to previous year so that it is available
        // during the next iteration of this loop to give us the start
        // position of the next line segment.
        previous = current;
      }
    }
  };

  this.drawTitle = function() {
    fill(0);
    noStroke();
    textAlign('center', 'center');

    text(this.title,
         (this.layout.plotWidth() / 2) + this.layout.leftMargin,
         this.layout.topMargin - (this.layout.marginSize / 2));
  };

  this.mapYearToWidth = function(value) {
    return map(value,
               this.startYear,
               this.endYear,
               this.layout.leftMargin,   // Draw left-to-right from margin.
               this.layout.rightMargin);
  };

  this.mapGoalsToHeight = function(value) {
    return map(value,
               this.minGoals,
               this.maxGoals,
               this.layout.bottomMargin, // Smaller pay gap at bottom.
               this.layout.topMargin);   // Bigger pay gap at top.
  };
}
