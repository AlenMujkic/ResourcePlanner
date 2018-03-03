/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
//Create variables for database
// This works on all devices/browsers, and uses IndexedDBShim as a final fallback 
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
const DBName = "Teams"		//Name of database
const DBVersion = 1;		
const TeamsNumber = 10;
var STORENames = [];		//Each team have a objectStore in DB
var TEAMNames = [];
for(var counter = 0; counter < TeamsNumber; counter++){
	 STORENames[counter] = "TeamStore" + (counter + 1);		//objectStore name = TeamStore1, TeamStore2, ...
	 TEAMNames[counter] = "Team" + (counter + 1);			//Team name = Team1, Team2,...
}
var request = indexedDB.open(DBName, DBVersion),			//Open(or create) DB
	db;

request.onupgradeneeded = function(event) {		// Create new database if not exists, if exist this function will skipped
	db = event.target.result;
	for(var counter = 0; counter < TeamsNumber; counter++){		//Create objectStore for each Team
		db.createObjectStore(STORENames[counter], {keyPath: "id"});
	}
	CreateTeam();	//Call function for create database content for each Team
	console.log("Create db");
	AddTeamOptions(TEAMNames); 	//Call function AddOptions to add options for the 'SelectTeam'
};

request.onerror = function(event) {		//If there is some error with DB we will get alert
	alert("Error with: " + event.target.errorCode);
};

request.onsuccess = function(event) {		//Open database if it exists
	db = event.target.result;
	console.log("Open db");
	AddTeamOptions(TEAMNames);		//Call function for create Options (SelectTeam & SelectYear)
}
//Create Variables
var STOREid,
	membercounter,
	yearcounter,
	monthcounter,
	projectscounter;
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
//This function is used when we want to round number to n decimals
var _round = Math.round;
Math.round = function(number, decimals /* optional, default 0 */){
	if (arguments.length == 1)
		return _round(number);
	var multiplier = Math.pow(10, decimals);
	return _round(number * multiplier) / multiplier;
}
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
//This function will run only once when we create database
//This will add Teams with workers and project to the database and set all Values to zero
function CreateTeam(){
	request.onsuccess = function() {
		// Start a new transaction for each team
		for(var counter = 0; counter < TeamsNumber; counter++){
			var tx = db.transaction(STORENames[counter], "readwrite");
			var store = tx.objectStore(STORENames[counter]);
			db.onerror = function(event) {
				// Generic error handler for all errors targeted at this database's requests!
				alert("Database error: " + event.target.errorCode);
			};
			var Mnumber = 10;	//Number of members in each teams
			var Ynumber = 18; 	//Number of years
			var Year = 2000;	//Start Year
			var Pnumber = 8;	//Number of projects		
			Team = {		//Team object will have id, TeamName and Members
				id : 1,
				TeamName: TEAMNames[counter],		//TeamName will be Team1, Team2, etc
				Members: []}
			for(var j = 0; j < Mnumber; j++){
				Team.Members[j]= {		//Members object will have Name and Years
				Name: TEAMNames[counter]+"M"+(j+1),	//Members Name will be Team1M1,Team1M2 (M1=Member1)
				Years: []}
				for(var k = 0; k < Ynumber; k++){
					Team.Members[j].Years[k] ={		//Years object will have Value and Months
						Value: Year + k,		
						Months: [{			//Months object will have Value, Total, Mondays
							Value: "Jan",	//Value is the name of the months
							Total: 0,		//Total is procent for the members work in that month
							Mondays: []},{		
							Value: "Feb",
							Total: 0,
							Mondays: []},{
							Value: "Mar",
							Total: 0,
							Mondays: []},{
							Value: "Apr",
							Total: 0,
							Mondays: []},{
							Value: "Mai",
							Total: 0,
							Mondays: []},{
							Value: "Jun",
							Total: 0,
							Mondays: []},{
							Value: "Jul",
							Total: 0,
							Mondays: []},{
							Value: "Aug",
							Total: 0,
							Mondays: []},{
							Value: "Sep",
							Total: 0,
							Mondays: []},{
							Value: "Okt",
							Total: 0,
							Mondays: []}, {
							Value: "Nov",
							Total: 0,
							Mondays: []},{
							Value: "Dez",
							Total: 0,
							Mondays: []}]}
					for(var m = 0; m < 12; m++){
						var M=[];
						M = getMondays((m + 1),(Year + k));	//Call function getMondays to get every monday in specific month and year
						for(var l = 0; l < M.length; l++){
							Team.Members[j].Years[k].Months[m].Mondays[l]={	//Mondays object will have Value and Projects
								Value: M[l],	//Value will have array of all mondays of the month
								Projects: []}	//Project is array of all projects for that month
							for(var p = 0; p < Pnumber; p++){
								if(p == 0){
									Project = "Available";	//First Name of projects will be Available
								}
								else if (p == Pnumber-1){
									Project = "Total";		//Last Name of projects will be Total
								}
								else{
									Project = "Project" + p;	//All other projects Name will be 'Project1', 'Project2', etc
								}  
								Team.Members[j].Years[k].Months[m].Mondays[l].Projects[p] ={		//Projects object will have Name and Value
								Name: Project,		//Name is the name of project
								Value: 0.0}			//Value is the worker time on the project in days, Total - Value will be in percent
							}
						}
					}
				}
			}
			// Add data
			var saveData = store.put(Team);
			saveData.onerror = function(event){
				alert("Error: " + event.target.errorCode);
			}
		}
	}
}
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
//Add new option to the SelectTeam element
function AddTeamOptions(Value){
	var length = Value.length;
	for(var counter = 0; counter < length; counter++){
		var SelectTeam = document.getElementById('SelectTeam');
		var opt = document.createElement("option");	//Create new option
		opt.value =  (counter);	//Set value of option to counter 
		opt.text = Value[counter];		//Set text of option to Value[counter]
		SelectTeam.add(opt);	//add option to SelectTeam
	}
}
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
//Add options to the SelectYear element
function AddYearOptions(){
	var SelectTeam = document.getElementById("SelectTeam");
	var SelectYear = document.getElementById('SelectYear');
	if(SelectTeam == null || SelectYear == null){return 0;}	//Check if there is some errors while getElementById
	for(var i = SelectYear.options.length-1; i > 0; i--){
		SelectYear.removeChild(SelectYear.options[i]);		//Remove old Year options
	}
	var SelectedTeam = SelectTeam.options[SelectTeam.selectedIndex].text;
	if(SelectedTeam != "Select Team"){
		STOREid = SelectTeam.options[SelectTeam.selectedIndex].value;
		var tx = db.transaction(STORENames[STOREid], "readwrite");		//Start transaction
		var store = tx.objectStore(STORENames[STOREid]);
		db.onerror = function(event) {
			// Generic error handler for all errors targeted at this database's requests!
			alert("Database error: " + event.target.errorCode);
		};
		var req = store.get(1);
		req.onsuccess = function() {
			var j = req.result.Members[0].Years.length;		//Get number of the Years
			for(var i = 0; i < j; i++){
				var opt = document.createElement("option");	//Create new option
				var Value = req.result.Members[0].Years[i].Value
				opt.value = Value ;	//Set value of option to Value 
				opt.text = Value;		//Set text of option to Value
				SelectYear.add(opt);	//add option to SelectYear
			}
		}
		req.onerror = function(event){
			alert("Error: " + event.target.errorCode);
		}
	}
}
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
//Get every monday of the month in year, month = 1(Jan),2,...,12; year = 2000,2001, etc.
function getMondays(month,year) {
    month = month-1;	//function Date need month = 0,1,...,11
    var d = new Date(year, month, 1, 0, 0, 0, 0),
		mondays = [], m = [];
    d.setDate(1);
    // Get the first Monday in the month
    while (d.getDay() !== 1) {
		d.setDate(d.getDate() + 1);
    }
    // Get all the other Mondays in the month
    while (d.getMonth() === month) {
		m.push(new Date(d.getTime()));
		d.setDate(d.getDate() + 7);
    }
	var l = m.length;
    for(var i = 0; i < l; i++){
		mondays[i]=m[i].getDate()+"."+(month+1)+".";		//Get mondays in format 1.1., 8.1., etc
    }
    return mondays;
}
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
//Callback function for Filter Button to show or hide FilterTable
function FilterButtonFunction(){
	var FilterTable = document.getElementById("FilterTable");
	if(FilterTable.style.visibility == "hidden")
		showElement(FilterTable);
	else
		hideElement(FilterTable);
}
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
//This function make Element visible
function showElement(Element){
	Element.style.visibility="visible";
}
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
//This function make Element hidden
function hideElement(Element){
	Element.style.visibility="hidden";
}
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
//This function is callback function  when we click on Show button
function ShowButtonFunction(){
	var SelectTeam = document.getElementById("SelectTeam");
	var SelectYear = document.getElementById("SelectYear");
	if(SelectTeam == null || SelectYear == null){return 0;}	//Check if there is some errors while getElementById
	var SelectedTeam = SelectTeam.options[SelectTeam.selectedIndex].text;
	var SelectedYear = SelectYear.options[SelectYear.selectedIndex].text;
	if(SelectedTeam == null || SelectedYear == null){return 0;}	//Check if there is some errors while getting Team and Year
	if(SelectedTeam == "Select Team")
		alert("Please select a team!");	//Alert to the user to choose a Team
	else if(SelectedYear == "Select Year")
		alert("Please select a year!");	//Alert to the user to choose a Year
	else{
		var FilterTable = document.getElementById("FilterTable");
		if(TeamTable = document.getElementById("TeamTable")){
			TeamTable.parentNode.removeChild(TeamTable);	//Check if there is old TeamTable and remove it
			if(WDiv = document.getElementById("WorkerMainDiv")){
				hideElement(WDiv);	//Hide WorkersMainDiv
			}
		}
		CreateTeamTable(SelectedTeam, SelectedYear);
		hideElement(FilterTable);	//Hide filterTable
		var TName = document.getElementById("TeamName");
		if(TName != null){	//Check if there is some errors while getElementById
			TName.innerHTML = SelectedTeam;	//Write Selected Team Name 
		}
	}
}
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function CreateTeamTable(SelectedTeam,SelectedYear){
	var tx = db.transaction(STORENames[STOREid], "readwrite");
	var store = tx.objectStore(STORENames[STOREid]);		//Open store object of Selected Team
	db.onerror = function(event) {
		// Generic error handler for all errors targeted at this database's requests!
		alert("Database error: " + event.target.errorCode);
	};
	var Value = store.get(1);
	Value.onsuccess = function(){ 
		Members = Value.result.Members;		//Members is array of all members from selected team
		membercounter = Members.length;		//Number of members
		var TableCont = createArray(membercounter,13);	// 13 = 12(months) + 1(Name of members)
		yearcounter = 0;
		var Years = Members[0].Years;	//All years object from db
		while(Years[yearcounter].Value != SelectedYear){					
			yearcounter++;				
		}
		var Year = Years[yearcounter];		//Selected year object
		for(var m = 0; m < membercounter; m++){		//For each member 
			TableCont[m][0] = Members[m].Name;		//For each row, first column of TableCont will be Member name
			for(var t = 1; t < 13; t++){	//For each month
				var v = Members[m].Years[yearcounter].Months[t-1].Total;	
				if(v == 0){
					TableCont[m][t] = "-";
				}
				else{
					TableCont[m][t] = v + "%";
				}
			}
		};
		tableCreate("Team",membercounter,13,TableCont);		//Create table body
		var HeaderCont = ['Name'];
		var FooterCont = ["Total"];
		var num;
		for(var i = 1;i < 13; i++){		
			num = 0;
			HeaderCont[i] = Year.Months[i-1].Value;		//Header will have Name,Jan,...,Dez
			var total = 0;
			for(var m = 0; m < membercounter; m++){
				if(TableCont[m][i] != "-"){
					total += parseFloat(TableCont[m][i]);
					num++;
				}
			}
			if(total == 0){
				FooterCont[i] = "-";
		}
			else{
				FooterCont[i] = Math.round(total/num,2) + "%";		//Footer will have Total, and value of average of all members for every month
			}
		}
		tableHeader("TeamTable",13,HeaderCont);		//Create table header
		tableFooter("TeamTable",13,FooterCont);		//Create table footer
		var Ttbl = document.getElementById("TeamTable");
		if (Ttbl != null) {	//Check if there is some errors while getElementById
		for (var i = 1; i < Ttbl.rows.length-1; i++) {
				for (var j = 1; j < Ttbl.rows[i].cells.length; j++)
					Ttbl.rows[i].cells[j].onclick = function () { CreateWorkerTable(this); }; //Make onclick options (call function CreateWorkerTable) of cells of the TeamTable
			}
		}	
	}
	Value.onerror = function(event){
		alert("Error: " + event.target.errorCode);
	}
}
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
//This function create WorkerTable 
function CreateWorkerTable(cel){
	if(tbl = document.getElementById("WorkerTable")){
		tbl.parentNode.removeChild(tbl);	//Check if there is old WorkerTable and remove it
	}
	var WDiv = document.getElementById("WorkerMainDiv");
	if(WDiv != null){	//Check if there is some errors while getElementById
		showElement(WDiv);	//Call function showElement
		var Ttbl = document.getElementById("TeamTable");
		if(Ttbl != null){	//Check if there is some errors while getElementById
			var R = cel.parentNode.rowIndex,	//Row index for the cell of the TeamTable
				C = cel.cellIndex,	//Column index for the cell of the TeamTable
				SelectedName = Ttbl.rows[R].cells[0].innerHTML,	//Get Name of the selected worker
				Month = Ttbl.rows[0].cells[C].innerHTML;	//Get selected Month
			var WName = document.getElementById("WorkerName");
			if(WName != null){	//Check if there is some errors while getElementById
				var SelectYear = document.getElementById("SelectYear");
				if(SelectYear == null){return 0;}	//Check if there is some errors while getElementById
				var SelectedYear = SelectYear.options[SelectYear.selectedIndex].text;
				WName.innerHTML = Month +' ' +  SelectedYear + ' (' + SelectedName + ')'; // Mar 2018 (Worker)
			}
			var HeaderCont = ['Project(s)'];
			var FooterCont = ['Utilization:'];
			var tx = db.transaction(STORENames[STOREid], "readwrite");
			var store = tx.objectStore(STORENames[STOREid]);
			db.onerror = function(event) {
				// Generic error handler for all errors targeted at this database's
				// requests!
				alert("Database error: " + event.target.errorCode);
			};
			var Value = store.get(1);
			Value.onsuccess = function(){
				Members = Value.result.Members;
				membercounter = 0;
				while(Members[membercounter].Name != SelectedName){		//define membercounter to find a member
					membercounter++;
				}
				yearcounter = 0;
				monthcounter = 0;
				var Years = Members[membercounter].Years;
				while(Years[yearcounter].Value != SelectedYear){		//define yearcounter to find a year	
					yearcounter++;				
				}
				while(Years[yearcounter].Months[monthcounter].Value != Month){		//define monthcounter to find a month			
					monthcounter++;				
				}
				var mondayscounter = Members[membercounter].Years[yearcounter].Months[monthcounter].Mondays.length;		//get number of mondays in selected month
				projectscounter = Members[membercounter].Years[yearcounter].Months[monthcounter].Mondays[mondayscounter-1].Projects.length;
				for(var i = 0; i < mondayscounter; i++){
					HeaderCont[i+1] = Members[membercounter].Years[yearcounter].Months[monthcounter].Mondays[i].Value;		//Header will have date of mondays
					FooterCont[i+1] = Members[membercounter].Years[yearcounter].Months[monthcounter].Mondays[i].Projects[projectscounter-1].Value+ "%";	//Footer will have total in percent for every week
				}
				var TableCont = createArray(projectscounter-1,mondayscounter+1);
				for(var p = 0; p < projectscounter-1; p++){		//TableCont will have Name of projects and value for each project in each week
					TableCont[p][0]=Members[membercounter].Years[yearcounter].Months[monthcounter].Mondays[mondayscounter-1].Projects[p].Name;
					for(var m = 1; m < mondayscounter+1; m++){
						var v = Members[membercounter].Years[yearcounter].Months[monthcounter].Mondays[m-1].Projects[p].Value;
						TableCont[p][m] = v ;
					}
				}
				//Create table with header, body and footer
				tableCreate("Worker",projectscounter-1,mondayscounter+1,TableCont);
				tableHeader("WorkerTable",mondayscounter+1,HeaderCont);				
				tableFooter("WorkerTable",mondayscounter+1,FooterCont);	
				var Wtbl = document.getElementById("WorkerTable");
				if (Wtbl != null) {	//Check if there is some errors while getElementById
					for (var i = 1; i < Wtbl.rows.length-1; i++) {
						for (var j = 0; j < Wtbl.rows[i].cells.length; j++)
							Wtbl.rows[i].cells[j].contentEditable = "true";	//Make table cells to be editable
					}
					Wtbl.rows[1].cells[0].contentEditable = "false";	//First cell must be "Available"
				}
			}
			Value.onerror = function(){
				alert("Error: " + event.target.errorCode);
			}	
		}			
	}
}
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function createArray(length) {
    var arr = new Array(length || 0),
        i = length;
    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
	}
    return arr;
}
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
//This function create table to the div (ID) r x c, and add content Table_content to the table
function tableCreate(ID,r,c,Table_content){
    var div_position = document.getElementById(ID),
        tbl  = document.createElement('table');	//Create table element
	if(tbl != null){	//Check if there is some errors while createElement
		tbl.id = ID+'Table';	//Make table ID = ID(div)+'Table'
		tbl.classList.add("Table");	//Add class to the table
		for(var i = 0; i < r; i++){
			var tr = tbl.insertRow();	//Create rows 0 to r-1
			for(var j = 0; j < c; j++){
				var td = tr.insertCell();	//Create cells 0 to c-1 for each row
				td.appendChild(document.createTextNode(Table_content[i][j]));	//Insert content to each cell
			}
		}
		div_position.appendChild(tbl);	//Put table inside div (ID)
	}
}
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
//This function create Header of the table (ID), with "n" columns, and with content "Header_content"
function tableHeader(ID,n,Header_content){
	var tbl = document.getElementById(ID);
	if(tbl != null){	//Check if there is some errors while getElementById
		tbl.classList.add("Table");	//Add class to the table
		var Header = tbl.createTHead();	//Create Header to the table
		var hrow = Header.insertRow(0);	//Create row for the header
		for(var i = 0; i < n; i++){	
			var hcell = hrow.insertCell(i); //Insert n cells to the header
			hcell.innerHTML = Header_content[i];	//add content to the header cells
		}
	}
}
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
// This function create Footer of the table (ID), with "n" columns, and with content "Footer_content"
function tableFooter(ID,n,Footer_content){
	var tbl = document.getElementById(ID);
	if(tbl != null){	//Check if there is some errors while getElementById
		tbl.classList.add("Table");	//Add class to the table
		var Footer = tbl.createTFoot();	//Create Footer to the table
		var frow = Footer.insertRow(0);	//Create row for the footer
		for(var i = 0; i < n; i++){
			var fcell = frow.insertCell(i);	//Insert n cells in footer row
			fcell.innerHTML = Footer_content[i];	//add content to the footer cells
		}
	}
}
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
//Call for button Save
function SaveButtonFunction(){
	var Tbl = document.getElementById("WorkerTable");
	var total =[]
	if(Tbl != null){
		var r = Tbl.rows.length-1;		//Number of rows
		var c = Tbl.rows[1].cells.length;		//Number of cells in each row
		var temp = createArray(r,c);
		for (var i = 1; i <	r; i++) {
			for (var j = 1; j < c; j++){
				temp[j][i] = 0;		
				var x = Tbl.rows[i].cells[j].innerHTML;		//Get value from table cell
				if(isNumber(x)){		//check if Value in table is number
					temp[j][i] += parseFloat(x);
				}
				else{
					alert("You must write a number to the table!!!");
					return 0;
				}
			}		
		}
		for(var j = 1; j < c; j++){
			total[j] = 0;
			for(var i = 2; i < r; i++){
				total[j] += temp[j][i] ;
			}
			if(temp[j][1] == 0){
				total[j] = 0;
			}
			else{
				total[j] = total[j]/temp[j][1]*100;		//Total = sum of all projects values / available value * 100 (%)
			}
			temp[j][r] = total[j];		//write total in last column of temp
		}
		total[0] = 0;
		for(var counter = 1; counter < total.length; counter++){		//Sum of all total value will be in first cell of total
			total[0] += total[counter];
		}
		total[0] = total[0]/(total.length-1);		//Get total value of the selected month 
		var tx = db.transaction(STORENames[STOREid], "readwrite");
		var store = tx.objectStore(STORENames[STOREid]);
		db.onerror = function(event) {
			// Generic error handler for all errors targeted at this database's requests!
			alert("Database error: " + event.target.errorCode);
		};
		var Value = store.get(1);
		Value.onsuccess = function(){
			Members = Value.result.Members;
			for(var j = 0; j < r; j++){
				for(var i = 0; i < c-1; i++){		//Write data to Selected member in selected year and selected month - Projects Name and Value
					Members[membercounter].Years[yearcounter].Months[monthcounter].Mondays[i].Projects[j].Value = temp[i+1][j+1];	
					Members[membercounter].Years[yearcounter].Months[monthcounter].Mondays[i].Projects[j].Name = Tbl.rows[j+1].cells[0].innerHTML
				}
			}
			Members[membercounter].Years[yearcounter].Months[monthcounter].Total = total[0];		//Write data of the month total
			var saveData = store.put(Value.result);		//save data to database
			saveData.onerror = function(event){
				alert("Error " + event.target.errorCode);
			}
			saveData.onsuccess = function(){
				CloseFunction();		//CloseFunction to close worker table
				ShowButtonFunction();		//ShowButtonFunction to refresh main table of team
			}
		}
		Value.onerror = function(event){
			alert("Error " + event.target.errorCode);
		}
	}
	else{
		alert("Error with WorkerTable");
	}
}
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
//This function is callback function when we click x(close) on the WorkerTable
function CloseFunction(){
	var WDiv = document.getElementById("WorkerMainDiv");
	if(WDiv != null){	//Check if there is some errors while getElementById
		hideElement(WDiv);	//Call function hideElement
	}
}
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
//Check if n is number and if it's, return true
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

