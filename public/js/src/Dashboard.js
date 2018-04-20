let ChartWidget = function(widget) {
    let self = this;
    this.widget = $(widget);

    this.selectedDataset = this.widget.data('selected-value');
    
    //this.prepareParameters();
    this.addEventHandlers();
  }

  // ChartWidget.prototype.prepareParameters = function() {
  //   let self = this;

  //   this.formula = this.widget.find('[data-element="formula"]').val();
  //   this.aggregation = this.widget.find('[data-element="aggregation"]').val();
  //   this.dimension = this.widget.find('[data-element="dimension"]').val();
  // }
  ChartWidget.prototype.changeCollection = function(collection){
    let pathname =  window.location.pathname.split('/');
    pathname[2] = collection;
    window.location.pathname = pathname.join('/');
  }
  ChartWidget.prototype.buildGraph = function(graphData){
    let myChart = document.getElementById('chart').getContext('2d');

    // Global Options
    Chart.defaults.global.defaultFontFamily = 'Lato';
    Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = '#777';
    let data = graphData;
    let massPopChart = new Chart(myChart, {
      type:'bar', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
      data:{
        labels: data.key1,
        datasets:[{
          label:data.formula, //Needs to be changed dynamically
          data: data.data,
          backgroundColor:"rgb(54, 162, 235)",
          borderWidth:3,
          borderColor:"rgb(54, 162, 235)",
          hoverBorderWidth:3,
          hoverBorderColor:"rgb(255, 99, 132)",
          fill: false
        }]
      },
      options:{
        scales: {
          xAxes: [{
            ticks: {
              maxRotation: 90,
              fontSize: 18 // angle in degrees
            }
          }]
        },
        title:{
          display:true,
          text:'',
          fontSize:18
        },
        legend:{
          display:true,
          position:'right',
          labels:{
            fontColor:'#000'
          }
        },
        layout:{
          padding:{
            left:50,
            right:0,
            bottom:0,
            top:0
          }
        },
        tooltips:{
          enabled:true
        }
      }
    });

  }
  
  ChartWidget.prototype.updateChart = function() {
    if (this.formula != null && this.dimension != null && this.aggregation != null) {
      //register data
      let data = $.ajax({ 
        url: "/dashboards/"+this.selectedDataset+"/chartData",
        type:"GET",
        data: {
          formula: this.formula,
          dimension : this.dimension,
          agg: this.aggregation
        },
      }).done(response=>this.buildGraph(response))
    }
  }

  ChartWidget.prototype.addEventHandlers = function() {
    let self = this;
    this.widget.find('[data-element="collection"]').on('change', function() {
      self.changeCollection($(this).val());
      self.updateChart();
    });
    this.widget.find('[data-element="formula"]').on('change', function() {
      self.formula = $(this).val();
      self.updateChart();
    });
    this.widget.find('[data-element="aggregation"]').on('change', function() {
      self.aggregation = $(this).val();
      self.updateChart();
    });
    this.widget.find('[data-element="dimension"]').on('change', function() {
      self.dimension = $(this).val();
      self.updateChart();
    });
    
    setInterval(function(){
        self.updateChart();
    }, 10000);
    
  }
  let chartWidget = new ChartWidget('[data-element="chartWidget"]');