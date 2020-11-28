// Global dataContainer so that all methods can access this file.
let empPayrollList;

// The DOMContentLoaded event fires when the initial HTML document has been completely loaded and parsed,
// without waiting for stylesheets, images, and subframes to finish loading.
// there are usually many different ways to do the same thing or find the same information.  window and document both can be used
window.addEventListener('DOMContentLoaded', (event) => {
    // Populate empPayrollList container to store data saved in local storage of the browser
    empPayrollList = getEmployeePayrollDataFromStorage();
    // Print actual count of employees on the emp-count element 
    document.querySelector(".emp-count").textContent = empPayrollList.length;
    // Calling createInnerHtml to load data in tabular form from json object using JS literals
    createInnerHtml();
    //removing item editEmp from local storage, so as to add new item to edit emp for updating items
    localStorage.removeItem('editEmp');
});

// Function declared in form of arrow function
// first check if an item named EmployeePayrollList exist in local storage or not
// if exist then returns the object in json format, otherwise returns an empty list
const getEmployeePayrollDataFromStorage = () => {
    return localStorage.getItem('EmployeePayrollList') ? JSON.parse(localStorage.getItem('EmployeePayrollList')) : [];
}


var createInnerHtml = () => {
    // Adding header of table in form of string (syntax of html code)
    const headerHtml = "<th></th><th>Name</th><th>Gender</th><th>Department</th><th>Salary</th><th>Start Date</th><th>Actions</th>"
    // using template literal to store html code and data using placeholders
    let innerHtml = `${headerHtml}`;
    for (const empPayrollData of empPayrollList) {
        // adding each element of empPayrollList to table row using js template literals
        innerHtml = `${innerHtml}
        <tr>
            <td><img class="profile" alt="" src="${empPayrollData._profilePic}"></td>
            <td>${empPayrollData._name}</td>
            <td>${empPayrollData._gender}</td>
            <td>${getDeptHtml(empPayrollData._department)}</td>
            <td>${empPayrollData._salary}</td>
            <td>${stringifyDate(empPayrollData._startDate)}</td>
            <td>
                <img id="${empPayrollData._id}" onclick= "remove(this)" alt="delete" src="../assets/icons/delete-black-18dp.svg">
                <img id="${empPayrollData._id}" onclick= "update(this)" alt="edit" src="../assets/icons/create-black-18dp.svg">
            </td>
        </tr>`;
    }
    // Html element having id table-display will show the data stored in innerHtml js literal
    document.querySelector('#table-display').innerHTML = innerHtml;
}

// Each employee can be part of multiple departments, so as to retrieve data dynamically in html file
// this function returns a js literal that contain code for html to show departments 
var getDeptHtml = (deptList) => {
    let deptHtml = '';
    for (const dept of deptList) {
        deptHtml = `${deptHtml}<div class="dept-label">${dept}</div>`
    }
    return deptHtml;
}

// Function to remove entry when clicked on delete icon
const remove = (node) => {
    // Find employee data having same id to delete from local storage
    let empPayrollData = empPayrollList.find(empData => empData._id = node.id);
    // If id doesn't exist in local storage, then return
    if (!empPayrollData) return;
    // First map empPayrollList to store only employee id's then find index of target id
    const index = empPayrollList.map(empData => empData._id).indexOf(empPayrollData.id);
    // Delete data at given index using splice function, splice(index, no_of_entries_to_be_deleted)
    empPayrollList.splice(index, 1);
    // Update local storage
    localStorage.setItem("EmployeePayrollList", JSON.stringify(empPayrollList));
    // Update employee count without refreshing the page
    document.querySelector(".emp-count").textContent = empPayrollList.length;
    // update page
    createInnerHtml();
}

// Function to update already existing data of an perticular employee
const update= (node)=>{
    // Find employee data having same id to update from local storage
    let empPayrollData= empPayrollList.find(empData=>empData._id == node.id);
    // If id doesn't exist in local storage, then return
    if(!empPayrollData) return;
    // To store data which is supposed to be updated, another local storage object editEmp is created
    localStorage.setItem('editEmp',JSON.stringify(empPayrollData));
    // Update current view and show employee_payroll page
    window.location.replace(site_properties.emp_payroll_page);
}