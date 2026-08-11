document.addEventListener("DOMContentLoaded", function () {
    displayAchievements();

    const achievementForm = document.getElementById("achievementForm");
    if (achievementForm) {
        achievementForm.addEventListener("submit", function (event) {
            event.preventDefault();
            addAchievement();
        });
    }
});


function getStoredItems(key) {
    try {
        const storedValue = localStorage.getItem(key);
        const parsedValue = storedValue ? JSON.parse(storedValue) : [];
        return Array.isArray(parsedValue) ? parsedValue : [];
    } catch (error) {
        console.warn("Unable to read storage for " + key, error);
        return [];
    }
}


function saveStoredItems(key, items) {
    localStorage.setItem(key, JSON.stringify(items));
}


function addAchievement() {
    const title = document.getElementById("achievementTitle").value.trim();
    const description = document.getElementById("achievementDescription").value.trim();


    if (title === "" || description === "") {
        alert("Please enter achievement details");
        return;
    }


    const achievements = getStoredItems("achievements");

    const newAchievement = {
        id: Date.now(),
        title: title,
        description: description,
        completed: false
    };


    achievements.push(newAchievement);

    saveStoredItems("achievements", achievements);


    alert("Achievement Added Successfully!");

    document.getElementById("achievementTitle").value = "";
    document.getElementById("achievementDescription").value = "";


    displayAchievements();
}


function displayAchievements() {

    const achievements = getStoredItems("achievements");
    const list = document.getElementById("achievementList");


    if (!list) return;


    list.innerHTML = "";


    if (achievements.length === 0) {
        list.innerHTML = "<p>No achievements added yet.</p>";
        return;
    }


    achievements.forEach(item => {

        const card = document.createElement("div");
        card.className = "achievement-card";

        const title = document.createElement("h4");
        title.textContent = item.title;

        const description = document.createElement("p");
        description.textContent = item.description;

        const status = document.createElement("p");
        status.textContent = `Status: ${item.completed ? "Completed ✅" : "Pending ⏳"}`;

        const actions = document.createElement("div");

        const completeButton = document.createElement("button");
        completeButton.type = "button";
        completeButton.textContent = "Complete";
        completeButton.addEventListener("click", () => completeAchievement(item.id));

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteAchievement(item.id));

        actions.appendChild(completeButton);
        actions.appendChild(deleteButton);

        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(status);
        card.appendChild(actions);

        list.appendChild(card);
    });
}


function completeAchievement(id) {

    const achievements = getStoredItems("achievements").map(item => {

        if (item.id === id) {
            item.completed = true;
        }

        return item;
    });


    saveStoredItems("achievements", achievements);

    displayAchievements();
}


function deleteAchievement(id) {

    const achievements = getStoredItems("achievements")
        .filter(item => item.id !== id);


    saveStoredItems("achievements", achievements);

    displayAchievements();
}