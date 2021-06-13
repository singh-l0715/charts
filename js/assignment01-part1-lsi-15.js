//Using local storage api.

var myStorage=window.localStorage;
myStorage.setItem("PropertyType","PropertyType");
myStorage.setItem("InvestmentType","InvestmentType");
myStorage.setItem("Perks","Perks");

//Getting the ids.

var propType=document.getElementById("PropertyType");
var InvType=document.getElementById("InvestmentType");
var PerksType=document.getElementById("Perks");



var Xaxis=[];//This is the default values and the will change on the change of facet
var eachRec=[];// This array holds the object inculding name and calculated data.
var finalRec=[];//This array is passed to asycn function to be used in series to show data.

var facetCounter=0;

const url = 'http://localhost:5501/data/data.json';
    

// printConsoleChart(url);

let chartData = {
  chart: {
      type: 'cylinder',
      options3d: {
        enabled: true,
        alpha: 10,
        beta: 10,
        depth: 200,
        viewDistance: 25
      }
    },
  title: { text: 'Real Estate Planning'},
  plotOptions: {
      series: {
        depth: 80,
       
        
      }
  },
  xAxis: { categories: Xaxis },
   yAxis: { title: { text: 'Number of Units'}}

}

PerksType.addEventListener('click', async function(e){

  facetCounter=2;
  //console.log(facetCounter);
  //Emptying the previously filled arrays.
   eachRec=[];
   finalRec=[];
 
  chartData.series = await filterBy(url,e.target.id);

  printHighChart(chartData);

});
propType.addEventListener('click', async function(e){

  facetCounter=0;
  //console.log(facetCounter);
  //Emptying the previously filled arrays.

   eachRec=[];
   finalRec=[];
   

  chartData.series = await filterBy(url,e.target.id);


  printHighChart(chartData);


});

InvType.addEventListener('click', async function(e){

  facetCounter=1;
  
  //Emptying the previously filled arrays.
   eachRec=[];
   finalRec=[];
  // chartData.series = await getChartData(url);
  chartData.series = await filterBy(url, e.target.id);
  
  printHighChart(chartData);

});

document.addEventListener('DOMContentLoaded', async function()  {


    //Get the data using fetch and add it to the series
    chartData.series = await filterBy(url, myStorage.getItem("PropertyType"));

    //console.log(chartData);
    
    printHighChart(chartData);

});


function fetchData(url)    {
  
    fetch(url)
     return fetch(url).then(response=> response.json());
   
     

}


async function filterBy(url, val)
{

   await fetchData(url).then((info=>{

    var reducedArray;
    reducedArray=info.reduce((a, {Town,  InvestmentType, Perks, PropertyType })=>{
      

     switch(facetCounter)
     {
       case 0:
        a[Town] = a[Town] || {Town, stats:[]};
        a[Town].stats[PropertyType] = (a[Town].stats[PropertyType] || 0) + 1;
        return a;
        
        case 1:

          a[Town] = a[Town] || {Town, stats:[]};
          a[Town].stats[InvestmentType] = (a[Town].stats[InvestmentType] || 0) + 1;
          return a 
        
        case 2:
          a[Town] = a[Town] || {Town, stats:[]};
          a[Town].stats[Perks] = (a[Town].stats[Perks] || 0) + 1;
          return a 


     }
      // console.log(filterBy); 
      
    },{});
      getValues(reducedArray);

  }));
  return finalRec;
}

async function getValues(reducedArray)
{
  var result = Object.values(reducedArray);

for(var i=0; i<result.length;i++)
{
  pushEntries(result[i].Town,result[i].stats);
}


//Dynamically changing the Xaxis.
var x=result[0].stats;
Object.keys(x).forEach((key,index)=>{


  Xaxis[index]=key;
});

}
  
 //This actually prints the chart
 async function printHighChart(chartData)  {
     var myChart = Highcharts.chart('container', chartData);
 }

 //This function calculate the records for a particular facet selected.

 function pushEntries(nameValue,stats)
 {
    var y=[];
    
    // this array will store the calculated records of the facet without name field
    //or in simple words it will store just the data in a sequence irrespective of the field name.
    

    Object.keys(stats).forEach((key,index)=>{


        y[index]=stats[key];

        
    });
    //console.log(y);
    //Pushing the record in finalRec array
    //console.log(Object.keys(stats));

    finalRec.push({name:nameValue, data: y });
 }

 