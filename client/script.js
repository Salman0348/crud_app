
//read the data from the DB upon loading of the page
document.addEventListener('DOMContentLoaded',()=>{
    fetch('http://localhost:5000/getAll').then(response => response.json()).then(data => tableHtmlLoaded(data['data'])); //the data is object and the data['data'] is an array of objects which are basically all of the rows/recods of the table 'persons' in the databse.
})

//name insert handling 
const nameAddBtn = document.querySelector('#add-name-btn');

nameAddBtn.onclick = ()=>{
    let nameInput = document.querySelector('#name');
    const name = nameInput.value;
    nameInput.value = "";
    fetch('http://localhost:5000/insert',{
        headers:{
            'content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({name : name})
    }).then(response => response.json())
    .then(data => insertRow(data['data']))
}

//inseting a new row into the front end table after insertion of new name in the DB
let insertRow = (data)=>{
    const tableBody = document.querySelector('table tbody');
    const isTableData = document.querySelector('.no_data');

    let tableHtml = "<tr>";
            tableHtml += `<td>${data.id}</td>`;
            tableHtml += `<td class="name">${data.name}</td>`;
            tableHtml += `<td>${new Date(data.dateAdded).toLocaleString()}</td>`;
            tableHtml += `<td><button class="delete_row_btn" data-id=${data.id}>Delete</button></td>`;
            tableHtml += `<td><button class="edit_row_btn" data-id=${data.id}>Edit</button></td>`;
        tableHtml += '</tr>'

    if(isTableData){
        tableBody.innerHTML = tableHtml;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }
}


//deleting row from the DB table(event handler)
document.querySelector('tbody').addEventListener('click',(event)=>{
    if(event.target.className == 'delete_row_btn'){
        const id = event.target.dataset.id;
        deleteRowById(id);
    }
    if(event.target.className == 'edit_row_btn'){
        document.querySelector("#update-section").hidden = false;
        //setting id of the targeted row inside update btn
        const updateBtn = document.querySelector('#update-btn');
        updateBtn.dataset.id = event.target.dataset.id;

        // extracting name from the targeted row
        const editBtnParent = event.target.parentElement;
        let nameElement = editBtnParent.previousElementSibling;
        
        while(nameElement.className != 'name'){
            nameElement = nameElement.previousElementSibling;
        }
        
        let oldName = nameElement.innerText;
        console.log(oldName); /* ************* */

        // now inserting the extracted name into #old-name-update span
        document.querySelector('#old-name-update').innerText = `(${oldName})`;
    }
})

 

let deleteRowById = (id)=>{
    fetch('http://localhost:5000/delete/'+id,{
        method:'DELETE'
    }).then(response => response.json())
    .then(data => {if(data.success){
        location.reload();
    }})
}

document.querySelector('#update-btn').addEventListener('click',(event)=>{
    const id = document.querySelector('#update-btn').dataset.id;
    handleNameUpdate(id);
})

let handleNameUpdate = (id)=>{
    const updateName = document.querySelector("#update-name").value;
    if(updateName !=""){
        fetch('http://localhost:5000/update',{
            headers:{
                'content-type':'application/json'
            },
            method:'PATCH',
            body:JSON.stringify({
                name:updateName,
                id: id
            })
        }).then(response => response.json())
        .then(data => {
            if(data.success){
                location.reload();
            }})
    }

}

//handling of searching by name
document.querySelector("#search-btn").addEventListener('click',()=>{
    const searchValueInput = document.querySelector('#search-input');
    const searchValue = searchValueInput.value;
    searchValueInput.value ="";

    if(searchValue !=""){
        fetch('http://localhost:5000/search/'+ searchValue).then(response => response.json()).then(data => tableHtmlLoaded(data['data']));
    }
})

//table body handling during loading of the page
let tableHtmlLoaded = (data) =>{
    const tableBody = document.querySelector('table tbody');
    if(data.length === 0){ //no data in the database 
        tableBody.innerHTML = `<tr><td class="no_data" colspan="5">No data</td></tr>`
        return;
    }
    let tableHtml = "";
    data.forEach(function({id,name,date_added}){
        tableHtml += '<tr>';
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td class="name">${name}</td>`;
        tableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`;
        tableHtml += `<td><button class="delete_row_btn" data-id=${id}>Delete</button></td>`;
        tableHtml += `<td><button class="edit_row_btn" data-id=${id}>Edit</button></td>`;
        tableHtml += '</tr>'
    })

    tableBody.innerHTML = tableHtml;

}