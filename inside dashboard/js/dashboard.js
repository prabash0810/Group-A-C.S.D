$(document).ready(function () {


    // ===============================
    // Dashboard Navigation
    // ===============================


    $(".menu-btn").click(function () {


        let section = $(this).attr("id");


        $(".dashboard-card").fadeOut(300);


        if (section === "achievementBtn") {

            $("#achievementSection")
                .delay(300)
                .fadeIn(700);

        }


        else if (section === "notesBtn") {

            $("#notesSection")
                .delay(300)
                .slideDown(700);

        }


        else if (section === "targetBtn") {

            $("#targetSection")
                .delay(300)
                .fadeIn(700);

        }


        else if (section === "moneyBtn") {

            $("#moneySection")
                .delay(300)
                .fadeIn(700);

        }


    });






    // ===============================
    // Achievement System
    // ===============================


    $("#addAchievement").click(function () {


        let achievement = $("#achievementInput").val();



        if (achievement.trim() !== "") {


            $("#achievementList").append(`

                <li class="item">

                    🏆 ${achievement}

                    <button class="delete-btn">
                    Delete
                    </button>

                </li>

            `);


            $("#achievementInput").val("");

            saveData();


        }


        else {

            alert("Please enter an achievement");

        }


    });







    // ===============================
    // Notes System
    // ===============================


    $("#saveNote").click(function () {


        let note = $("#noteInput").val();



        if(note.trim() !== ""){


            $("#notesList").append(`

                <div class="item">

                    📝 ${note}

                    <button class="delete-btn">
                    Delete
                    </button>


                </div>

            `);


            $("#noteInput").val("");

            saveData();


        }


        else {

            alert("Write something first");

        }


    });








    // ===============================
    // Target System
    // ===============================


    $("#addTarget").click(function(){


        let target = $("#targetInput").val();



        if(target.trim() !== ""){


            $("#targetList").append(`


            <div class="item target-item">


                🎯 ${target}


                <input 
                type="checkbox"
                class="complete">


                <button class="delete-btn">
                Delete
                </button>


            </div>


            `);



            $("#targetInput").val("");

            updateProgress();

            saveData();


        }



    });







    // ===============================
    // Delete Items
    // ===============================


    $(document).on(
        "click",
        ".delete-btn",
        function(){


            $(this)
            .parent()
            .fadeOut(500,function(){

                $(this).remove();


                updateProgress();

                saveData();


            });


        }
    );







    // ===============================
    // Target Progress Bar
    // ===============================


    $(document).on(
        "change",
        ".complete",
        function(){

            updateProgress();

            saveData();

        }
    );





    function updateProgress(){


        let total =
        $(".target-item").length;



        let completed =
        $(".complete:checked").length;



        let percentage = 0;



        if(total > 0){

            percentage =
            (completed / total) * 100;

        }



        $(".progress")
        .css(
            "width",
            percentage + "%"
        );



    }







    // ===============================
    // Local Storage
    // ===============================


    function saveData(){


        localStorage.setItem(
            "dashboardData",
            $(".content").html()
        );


    }







    function loadData(){


        let savedData =
        localStorage.getItem(
            "dashboardData"
        );



        if(savedData){


            $(".content")
            .html(savedData);


        }


    }





    loadData();



});