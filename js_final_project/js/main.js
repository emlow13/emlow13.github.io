
//function to call an internal data API from Metron Aviation
function getMetronAPIResults() {

  var dateString = $("#dateField").val();
  var airportString = $("#airportField").val();
  airportString = airportString.toUpperCase();

  var metronAPI = 'http://adoc-api/arrivalListDateAirport/' + dateString + '/' + airportString;

//check that values have been entered in query fields
  if (dateString.length == 0 || airportString.length == 0){
    $("#sample").html("Please enter text into the search field");
  } else {
    $.ajax({
            url: metronAPI,
            dataType: "json",
            success: function saveData(data) {
            //save results
            writeDocTable(data);
            // console.log(data);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown)
            {
                     alert("error loading " + metronAPI);
            }
        });
    
    };
};

 //write out the table
function writeDocTable(data) {
    

    var s = '<table id="myTable" class="display compact"><thead>'; 
    s += '<tr><th>Flight Reference</th><th>Origin</th><th>Destination</th><th>ETA</th><th>ETD</th></tr></thead>';
     
    //loop through each doc
    for (i=0; i < data.docs.length; i++) {
        s += '<tr>';
        s += '<td>' + data.docs[i].flightRef + '</td>';
        s += '<td>' + data.docs[i].origin + '</td>';
        s += '<td>' + data.docs[i].destination + '</td>';     
        s += '<td>' + data.docs[i].eta + '</td>';
        s += '<td>' + data.docs[i].etd + '</td>';      
        s += '</tr>';            
    }
     
    //finish table   
    s += '</table>';
     
    //write the table to the DOM using jQuery into a div with id "divTable"
    $( "#divTable" ).html( s );

    //create Data Table with some customization
    $('#myTable').DataTable({
        "stripeClasses": [],
        "order": [[ 1, "desc" ]],
        "pageLength": 15
    });
     
    //add callback for mouse click on table row
    $('#myTable tbody').on( 'click', 'tr', function () {
     
        //get the data table
        var table = $('#myTable').DataTable();
     
        //get data for row that was clicked
        var rowData = table.row(this).data();
         
        //do something with the data in the row
        if (rowData) {
         
            //example extracting data from various columns (remember columns start at zero)
            var colThreeData = rowData[3];
            var colFourData = rowData[4];

            //do something with the data

            etaMill = Date.parse(colThreeData);
            etdMill = Date.parse(colFourData);

            eteMill = etaMill - etdMill;
            ete = eteMill / (1000 *60);
            str = ete.toFixed(20);
            eteString = str.substring(0, str.length-10);

            // alert('data from column 3:' + colThreeData);
            // alert('data from column 4:' + colFourData);
            eteResultsString = 'Estimated Time En Route' + 'from ' + rowData[1] + ' to ' + rowData[2] + ' is: ' + eteString + ' minutes';
            alert(eteResultsString);
            $("#queryInstructions").hide(250);
            // $("#calcResults").html(eteResultsString);
            // $("$calcResults").show(250);
            // $("#calcResults").show(500);
        }
    });

};


//Execute the main sequence of events
$("#searchBtn").on('click', function(e) {
  e.preventDefault();
   returnedData = getMetronAPIResults();
   console.log('Searching for flight query results...')
   $("#sample").hide(5000);
    $("#queryInstructions").show(500);
}); 