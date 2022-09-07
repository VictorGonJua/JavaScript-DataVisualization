function PlayerStats() {    
    // Name for the visualisation to appear in the menu bar.
    this.name = 'Premier League: Top players stats';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'player-statistics';

    // Title to display above the plot.
    this.title = 'Premier League: Season 18-19 Players Statistics';
    
    // radius of two polygons.
    this.radiusLarge = 200;
    this.radiusSmall = 100;
    
    // List of labels.
    var statsList = ['Apperances', 'Goals Home','Conceded','Goals Away', 'Assist', 'Yellow Cards'];
    
    // A map to put players as key and row number as value.
    var playerSelector = new Map();
    
    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    this.preload = function() {
        var self = this;
        
        this.data = loadTable('./data/player-stats/players-stats.csv', 'csv', 'header',
        // Callback function to set the value this.loaded to true.
        function(table) {
            self.loaded = true;
        });
    };
    

    this.setup = function() {
        // Get the list of all players after data loaded.
        var playerList = this.data.getColumn('Player');
        
        // Create a select DOM element.
        this.select = createSelect();
        this.select.position(410, 50);
        
        for (var i = 0; i < playerList.length; i++) {
            // Put player and row number into a list for later use.
            playerSelector.set(playerList[i], i);
            // Create select list.
            this.select.option(playerList[i]);
        }
    };
    
    // Remove the dropdown list when other menu-item is clicked.
    this.destroy = function() {
        this.select.remove();
    };
    
    this.draw = function() {
        if (!this.loaded) {
          console.log('Data not yet loaded');
          return;
        }
        this.drawTitle();
        
        // Draw two polygons to create radar chart.      
        this.drawPolygon(width / 2, height / 2, this.radiusLarge, 6);
        this.drawPolygon(width / 2, height / 2, this.radiusSmall, 6);
        
        // Draw axis labels
        push();
        textSize(16);
        fill('black');
        color(0);
        text('20', 
             width / 2 - this.radiusSmall * cos(TWO_PI / 6), 
             height / 2 - this.radiusSmall * sin(TWO_PI / 6));
        text('40', 
             width / 2 - this.radiusLarge * cos(TWO_PI / 6), 
             height / 2 - this.radiusLarge * sin(TWO_PI / 6));
        
        //Stats labeling
        text('Assist', 
        width / 2 - 230 * cos(TWO_PI / 6), 
        height / 2 - 230 * sin(TWO_PI / 6));
        
        text('Yellow Cards', 
        width / 2 + 230 * cos(TWO_PI / 6), 
        height / 2 - 230 * sin(TWO_PI / 6));
        
        text('Apperances', 
        width / 2 + 250, 
        height / 2 );

        text('Goals Home', 
        width / 2 + 230 * cos(TWO_PI / 6), 
        height / 2 + 230 * sin(TWO_PI / 6));
        
        text('Conceded', 
        width / 2 - 230 * cos(TWO_PI / 6), 
        height / 2 + 230 * sin(TWO_PI / 6));
        
        text('Goals Away', 
        width / 2 - 250 , 
        height / 2 );
        
        
        //this.drawLabels(width / 2, height / 2, this.radiusLarge + 20, 6, statsList);
        pop();
        
        // Plot data of user selected player on the chart.
        // Default is Aguero.
        var selectedPlayer = this.select.value();
        // Get row number of selected player.
        var rowNum = playerSelector.get(selectedPlayer); 
        
        

            
        // Get supply amount of different stats type.
        var apperances = this.data.getColumn('Apperances')[rowNum];
        var goalshome = this.data.getColumn('Goals Home')[rowNum];
        var conceded = this.data.getColumn('Conceded')[rowNum];
        var goalsaway = this.data.getColumn('Goals Away')[rowNum];
        var assist = this.data.getColumn('Assist')[rowNum];
        var yellowcard = this.data.getColumn('Yellow Cards')[rowNum];

        // Plot data on the chart.
        push();
        stroke(0,135,90);
        strokeWeight(5);
        // Calculate xy position of all the points and connect them.
        beginShape();
        // apperances.
        vertex(width / 2 + this.radiusLarge * (apperances / 50), height / 2);
        // goalshome.
        vertex(width / 2 + this.radiusLarge * (goalshome / 50) * cos(TWO_PI / 6),
              height / 2 + this.radiusLarge * (goalshome / 50) * sin(TWO_PI / 6));
        // conceded.
        vertex(width / 2 - this.radiusLarge * (conceded / 50) * cos(TWO_PI / 6),
              height / 2 + this.radiusLarge * (conceded / 50) * sin(TWO_PI / 6));
        // goalsaway.
        vertex(width / 2 - this.radiusLarge * (goalsaway / 50), height / 2);
        // assist
        vertex(width / 2 - this.radiusLarge * (assist / 50) * cos(TWO_PI / 6),
              height / 2 - this.radiusLarge * (assist / 50) * sin(TWO_PI / 6));
        // yellowcard.
        vertex(width / 2 + this.radiusLarge * (yellowcard / 50) * cos(TWO_PI / 6),
              height / 2 - this.radiusLarge * (yellowcard / 50) * sin(TWO_PI / 6));
        // Connect the last point with the first.
        vertex(width / 2 + this.radiusLarge * (apperances / 50), height / 2);
        endShape();
        pop();
            

    }
    
    this.drawTitle = function() {
        fill(0);
        noStroke();
        textAlign('center', 'center');
        // Start a new drawing state
        push();
        textSize(20);
        text(this.title, width / 2, 20);
        // Restore previous state
        pop();
    };
    
    // X, y is the center position of the polygon.
    // Radius indicates the size of polygon.
    // Npoint means number of points the polygon has.
    this.drawPolygon = function(x, y, radius, npoints) {
        stroke('black');
        noFill();
        let angle = TWO_PI / npoints;
        let i = 0;
        beginShape();
        // Increase the angle each time by value of 2 pi / number of points.
        for (let a = 0; a < TWO_PI; a += angle) {
            // Calculate the x y position of each vertex and connect them.
            let sx = x + cos(a) * radius;
            let sy = y + sin(a) * radius;
            vertex(sx, sy);
            
            // Draw a line between center and each vertex.
            line(x, y, sx, sy);
        }
        endShape(CLOSE);
    }
    
    this.drawLabels = function(x, y, radius, npoints, labelList) {
        let angle = TWO_PI / npoints;
        let i = 0;
        beginShape();
        // Increase the angle each time by value of 2 pi / number of points.
        for (let a = 0; a < TWO_PI; a += angle) {
            // Calculate the x y position of each vertex and connect them.
            let sx = x + cos(a) * radius;
            let sy = y + sin(a) * radius;
            // Draw the label.
            text(labelList[i], sx, sy);
            i++;
        }
        endShape(CLOSE);
    }
    
}