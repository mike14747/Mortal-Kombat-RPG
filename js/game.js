$(document).ready(function () {
    "use strict";

    var characters = [
        {
            name: "Lui Kang",
            image_name: "lui_kang.png",
            HealthPoints: 150,
            AttackPower: 8,
            CounterAttackPower: 20
        },
        {
            name: "Scorpion",
            image_name: "scorpion.png",
            HealthPoints: 180,
            AttackPower: 8,
            CounterAttackPower: 20
        },
        {
            name: "Sub-Zero",
            image_name: "sub-zero.png",
            HealthPoints: 100,
            AttackPower: 8,
            CounterAttackPower: 20
        },
        {
            name: "Raiden",
            image_name: "raiden.png",
            HealthPoints: 120,
            AttackPower: 8,
            CounterAttackPower: 20
        }
    ];

    // initialize variables in the global scope
    var player = "";
    var opponent = "";
    var isPlayerChosen = false;
    var isOpponentChosen = false;
    var charArray = [0, 1, 2, 3];

    function startGame(pl, op) {
        $("#attackButton").on("click", function () {
            $("#lightning-right").fadeIn(100);
            $("#lightning-right").attr("src", "images/lightning_r.png").fadeOut(200);
            $("#lightning-left").delay(200).fadeIn(100);
            $("#lightning-left").attr("src", "images/lightning_l.png").fadeOut(200);
        });
    }

    // pick the player's character and the first opponent
    function prepGame() {
        // make the 'Select a Character/Opponent' text change colors in the attract mode
        var colorCounter = 0;
        setInterval(function () {
            var selectTextColor = ["#ffef2f", "ffe72a", "ffdf24", "ffd719", "#ffcd14", "#ff950d"];
            $("#selectPlayer").css("color", selectTextColor[colorCounter]);
            colorCounter++;
            if (colorCounter == selectTextColor.length) {
                colorCounter = 0;
            }
        }, 150);
        $("#selectPlayer").text("Select your Character:");

        // add pics of the charcters
        for (var i = 0; i < characters.length; i++) {
            $("#char" + i).attr("src", "images/" + characters[i].image_name);
            $("#char" + i).addClass("border");
            $("#char" + i + "-h6").addClass("w-100 d-flex bg-light justify-content-center align-items-center");
            $("#char" + i + "-h6").text(characters[i].HealthPoints);
        }

        /* for (var i = 1; i <= 4; i++) {
            $("#char" + i).attr("src", "images/char" + i + ".png");
            $("#char" + i).addClass("border");
            $("#char" + i + "-h6").addClass("w-100 d-flex bg-light justify-content-center align-items-center");
            $("#char" + i + "-h6").text("Health: 150");
        } */

        $(".char").on("click", function () {
            if (!isPlayerChosen) {
                // the player's character hasn't been selected
                player = $(this).attr("value");
                // hide the character you just selected
                $("#char" + player).hide(500);
                $("#char" + player + "-h6").text("");
                $("#char" + player + "-h6").hide();
                isPlayerChosen = true;
                $("#you_text").text("You:");
                $("#you_img").attr("src", "images/" + characters[player].image_name);
                $("#you_img").addClass("border");
                $("#you-h6").addClass("w-100 d-flex bg-light justify-content-center align-items-center");
                $("#you-h6").text(characters[player].HealthPoints);
                // remove the selected player from the charArray
                var indexToRemove = charArray.indexOf(player);
                charArray.splice(indexToRemove, 1);
                $("#selectPlayer").text("Select your first Opponent:");
            } else if (!isOpponentChosen) {
                // the player has been selected, but the opponent hasn't been
                opponent = $(this).attr("value");
                // hide the opponent you just selected
                $("#char" + opponent).hide(500);
                $("#char" + opponent + "-h6").text("");
                $("#char" + opponent + "-h6").hide();
                isOpponentChosen = true;
                $("#opp_text").text("Opponent:");
                $("#opp_img").attr("src", "images/" + characters[opponent].image_name);
                $("#opp_img").addClass("border");
                $("#opp-h6").addClass("w-100 d-flex bg-light justify-content-center align-items-center");
                $("#opp-h6").text(characters[opponent].HealthPoints);
                // remove the selected opponent from the charArray
                var indexToRemove = charArray.indexOf(opponent);
                charArray.splice(indexToRemove, 1);
                // the player and the opponent have both been selected
                $("#selectPlayer").hide(500);
                $("#top_div").slideUp(500);
                var newButton = $('<button id="attackButton" class="btn btn-light btn-lg">Attack!</button>');
                $("#attack_div").append(newButton);
                // move the 2 remaining opponents to the queue
                $("#queue_text").text("The Queue:");
                for (var i = 0; i < charArray.length; i++) {
                    var tempRemove = charArray[i];
                    $("#q" + i + "_img").attr("src", "images/" + characters[tempRemove].image_name);
                }
                startGame(player, opponent);
                return false;
            }
        });
    }

    $("#startButton").on("click", function () {
        document.getElementById("beginning").play();
        $("#startButton").fadeOut(500);
        prepGame();
    });
});