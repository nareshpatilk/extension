
    // Specify data
    const continentData = [
        {
          id: "NA",
          label: "North America",
          value: "16.3",
          showLabel: "1"
    
        },
        {
          id: "SA",
          label: "South America",
          value: "12.0",
          showLabel: "1"
        },
        {
          id: "AS",
          label: "Asia",
          value: "30.0",
          showLabel: "1"
        },
        {
          id: "EU",
          label: "Europe",
          value: "6.7",
          showLabel: "1"
        },
        {
          id: "AF",
          label: "Africa",
          value: "20.3",
          showLabel: "1"
        },
        {
          id: "AU",
          label: "Australia",
          value: "5.2",
          showLabel: "1"
        }
      ];
    
      var chartConfig = {
        type: "", 
        renderAt: "", 
        dataFormat: "json", 
        dataSource: {
          chart: {
            caption: "Percentage of Land Area on Planet Earth",
            subCaption: "Data Source: www.enchantedlearning.com",
            xAxisName: "Continent", 
            yAxisName: "% Land Area", 
            numberSuffix: "%",
            theme: "fusion"   
    
          },
          // Connect the data
          data: continentData
        }
      }; 
        
        function renderBar(){
            chartConfig.type = 'column2d';
            chartConfig.renderAt = 'bar-chart-container';
            var fusioncharts = new FusionCharts(chartConfig);
            fusioncharts.render();
        }
    
        function renderLine(){
            chartConfig.type = 'line';   	
            chartConfig.renderAt = 'line-chart-container';        
            var fusioncharts = new FusionCharts(chartConfig);
            fusioncharts.render();
        }    
    
        function renderMap(){
            chartConfig.type = 'world';     
            chartConfig.renderAt = 'map-container';         
            var fusioncharts = new FusionCharts(chartConfig);
            fusioncharts.render();
        }        
        
        FusionCharts.ready(renderBar);
        // FusionCharts.ready(renderLine)
        // FusionCharts.ready(renderMap);