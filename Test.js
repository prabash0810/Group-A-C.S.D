const uniForm = document.getElementById("uniForm");
const uniTable = document.getElementById("uniTable");

let classes = JSON.parse(localStorage.getItem("classes")) || [];
uniForm.addEventListener("submit", function(e){

    e.preventDefault();

    const newClass = {
        module: document.getElementById("moduleName").value,
        lecturer: document.getElementById("lecturer").value,
        day: document.getElementById("uniDay").value,
        start: document.getElementById("uniStart").value,
        end: document.getElementById("uniEnd").value,
        room: document.getElementById("room").value
    };

    classes.push(newClass);

    localStorage.setItem("classes", JSON.stringify(classes));

    displayClasses();

    uniForm.reset();

});
function displayClasses(){

    uniTable.innerHTML = "";

    classes.forEach(function(item){

        uniTable.innerHTML += `
            <tr>
                <td>${item.module}</td>
                <td>${item.lecturer}</td>
                <td>${item.day}</td>
                <td>${item.start} - ${item.end}</td>
                <td>${item.room}</td>
            </tr>
        `;

    });

}