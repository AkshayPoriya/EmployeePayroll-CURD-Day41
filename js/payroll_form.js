// Variable to check if this page is opened for adding new employee or updating existing employee
let isUpdate=false;
// If it is called for updating existing data then employeePayrollObj will store that data object
let employeePayrollObj={};


window.addEventListener('DOMContentLoaded', (event) =>{
    // Check either page is loaded for adding new data or info updation purpose
    checkForUpdate();
    var name = document.querySelector('#name');
    var textError = document.querySelector('.text-error');
    name.addEventListener('input', function(){
        if(name.value.length == 0){
            textError.textContent = "";
            return;
        }
        try{
            (new EmployeePayrollData()).name = name.value;
            textError.textContent = "";
        }catch(e){
            textError.textContent = e;
        }
    });

    var salary = document.querySelector('#salary');
    var output = document.querySelector('.salary-output');
    output.textContent = salary.value;
    salary.addEventListener('input', function(){
        output.textContent = salary.value;
    });

    var day = document.querySelector('#day');
    var month = document.querySelector('#month');
    var year = document.querySelector('#year');
    var dateError = document.querySelector('.date-error');
    day.addEventListener('input', function(){
        if(day.value!="--Select Day--" && month.value!="" && year.value!=""){
            checkDate();
        }
    });
    month.addEventListener('input', function(){
        if(day.value!="" && month.value!="--Select Month--" && year.value!=""){
            checkDate();
        }
    });
    year.addEventListener('input', function(){
        if(day.value!="" && month.value!="" && year.value!="--Select Year--"){
            checkDate();
        }
    });
    function checkDate(){
        try{
            let date = getInputValueById('#day')+" "+getInputValueById('#month')+" "+getInputValueById('#year');
            date = new Date(Date.parse(date));
            (new EmployeePayrollData()).startDate = date;
            dateError.textContent = "";
        }catch(e){
            dateError.textContent = e;
        }
    }
});

const save=(event)=>{
    //prevents removing of data, if there is error in name or date
    event.preventDefault();
    //if there is error, then form will not be submitted
    event.stopPropagation();
    try
    {
        // Set employeePayrollObj by calling this function
        setEmployeePayrollObject(); 
        // This function will check either updated data is to be stored or new data is added and will do action accordingly
        createAndUpdateStorage();
        resetForm();
        //after resetting, moving back to home page.
        window.location.replace(site_properties.home_page);
    }
    catch(e)
    {
        return;
    }
    //refactoring the code to populate employee payroll oject defined globally and filling values in employee payroll object instead of
    //creating the object of employee payroll seperately in create employee payroll 
  
}

const setEmployeePayrollObject = () => {
    employeePayrollObj._name = getInputValueById('#name');
    employeePayrollObj._profilePic = getSelectedValues('[name=profile]').pop();
    employeePayrollObj._gender = getSelectedValues('[name=gender]').pop();
    employeePayrollObj._department = getSelectedValues('[name=department]');
    employeePayrollObj._salary = getInputValueById('#salary');
    employeePayrollObj._note = getInputValueById('#notes');
    let date = getInputValueById('#day')+" "+getInputValueById('#month')+" "+
               getInputValueById('#year') ;
    employeePayrollObj._startDate = date;
}

function createAndUpdateStorage() {
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
    // Check if local storage contains list
    if (employeePayrollList) {
        // Check if new data is added or already existing data is updated
        let empPayrollData = employeePayrollList.find(empData => empData._id == employeePayrollObj._id)
        // If new data is added 
        if (!empPayrollData) {
            employeePayrollList.push(createEmployeePayrollData());
        }
        // if data is updated
        else {
            // find index
            const index = employeePayrollList.map(empData => empData._id).indexOf(empPayrollData._id);
            // then delete data stored at that index and add new value
            employeePayrollList.splice(index, 1, createEmployeePayrollData(empPayrollData._id));
        }
    }
    // If local storage is empty then add new list 
    else {
        employeePayrollList = [createEmployeePayrollData()]
    }
    // store employeePayrollList in local storage in form of string
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList));
}

// This function is called to store updated data
const createEmployeePayrollData = (id) => {
    let employeePayrollData = new EmployeePayrollData();
    if (!id) employeePayrollData.id = createNewEmployeeId();
    else employeePayrollData.id = id;
    setEmployeePayrollData(employeePayrollData);
    return employeePayrollData;
}

const createNewEmployeeId = () => {
    let empID = localStorage.getItem("EmployeeID");
    empID = !empID ? 1 : (parseInt(empID)+1).toString();
    localStorage.setItem("EmployeeID",empID);
    return empID;
}

const setEmployeePayrollData = (employeePayrollData) => {
    try {
      employeePayrollData.name = employeePayrollObj._name;
    } catch (e) {
      setTextValue('.text-error', e);
      throw e;
    }
    employeePayrollData.profilePic = employeePayrollObj._profilePic;
    employeePayrollData.gender = employeePayrollObj._gender;
    employeePayrollData.department = employeePayrollObj._department;
    employeePayrollData.salary = employeePayrollObj._salary;
    employeePayrollData.note = employeePayrollObj._note;
    try {
        employeePayrollData.startDate = 
            new Date(Date.parse(employeePayrollObj._startDate));
    } catch (e) {
        setTextValue('.date-error', e);
        throw e;
    }
    alert(employeePayrollData.toString());
}


var createEmployeePayroll = () =>{
    let employeePayrollData = new EmployeePayrollData();
    try{
        employeePayrollData.name = getInputValueById('#name');
    }catch(e){
        setTextValue('.text-error',e);
        throw e;
    }
    employeePayrollData.profilePic = getSelectedValues('[name=profile]').pop();
    employeePayrollData.gender = getSelectedValues('[name=gender]').pop();
    employeePayrollData.department = getSelectedValues('[name=department]');
    employeePayrollData.salary = getInputValueById('#salary');
    employeePayrollData.note = getInputValueById('#notes');
    let date = getInputValueById('#day')+" "+getInputValueById('#month')+" "+getInputValueById('#year');
    employeePayrollData.startDate = new Date(Date.parse(date));
    alert(employeePayrollData.toString());
    return employeePayrollData;
}

var getSelectedValues = (propertyValue) =>{
    let allItems = document.querySelectorAll(propertyValue);
    let selectedItems = [];
    allItems.forEach(item=>{
        if(item.checked){
            selectedItems.push(item.value);
        }
    });
    return selectedItems;
}

/*
* 1: querySelector is the newer feature.
* 2: The querySelector method can be used when selecting by element name,
*    nesting, or class name.
* 3: querySelector lets you find elements with rules that can't be 
*    expressed with getElementById
*/
var getInputValueById = (id) =>{
    let value = document.querySelector(id).value;
    return value;
}

/*
* 1: getElementById is better supported than querySelector in older 
*    versions of the browsers.
* 2: The thing with getElementById is that it only allows to select an 
*    element by its id.
*/
var getInputElementValue = (id) =>{
    let value = document.getElementById(id).value;
    return value;
}

var resetForm = () => {
    setValue('#name','');
    unsetSelectedValues('[name=profile]');
    unsetSelectedValues('[name=gender]');
    unsetSelectedValues('[name=department]');
    setValue('#salary','400000');
    setValue('#notes','');
    setValue('#day','--Select Day--');
    setValue('#month','--Select Month--');
    setValue('#year','--Select Year--');
}

var unsetSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
        item.checked = false;
    });
}

var setTextValue = (id, value) => {
    let element = document.querySelector(id);
    element.textContent = value;
}

var setValue = (id, value) => {
    let element = document.querySelector(id);
    element.value = value;
    if (id == '#salary') {
        var salary = document.querySelector('#salary');
        var output = document.querySelector('.salary-output');
        output.textContent = salary.value;
    }
}

// This function will set employeePayrollObj if this page is called for updating purpose otherwise does nothing
const checkForUpdate = () => {
    const employeePayrollJson = localStorage.getItem('editEmp');
    isUpdate = employeePayrollJson ? true : false;
    if (!isUpdate) return;
    employeePayrollObj = JSON.parse(employeePayrollJson);
    setForm();
}

// When payroll_form will be opened for update data, it is supposed to show stored data
const setForm = () => {
    //calling set value function to set text fields and date
    setValue('#name', employeePayrollObj._name);
    //calling set selected values function to check the fields
    setSelectedValues('[name=profile]', employeePayrollObj._profilePic);
    setSelectedValues('[name=gender]', employeePayrollObj._gender);
    setSelectedValues('[name=department]', employeePayrollObj._department);
    setValue('#salary',employeePayrollObj._salary);
    //calling set text value function to set text content of output salary
    setTextValue('.salary-output', employeePayrollObj._salary);
    setValue('#notes',employeePayrollObj._note);
    let date = stringifyDate(employeePayrollObj._startDate).split(" ");
    setValue('#day', date[0]);
    setValue('#month',date[1]);
    setValue('#year',date[2]);
}

// This function is called to mark check boxes using pre-submitted data, that is under updation process
const setSelectedValues = (propertyValue, value) => {
    //getting all the items for property passed in query selector
    let allItems = document.querySelectorAll(propertyValue);
    //for each item of allItems, condition is checked if item is array or not
    allItems.forEach(item => {
        //if value that recieved as input is array, then value array is checked for item value received from allItems
        //if value matches, particular item is checked
        if(Array.isArray(value)) {
            if (value.includes(item.value)) {
                item.checked = true;
            }
        }
        //if value is not array
        else if (item.value === value)
            item.checked = true;
    });    
}