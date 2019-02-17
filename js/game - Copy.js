$(document).ready(function () {
    "use strict";

    // set the character array and objects
    var characters = [
        {
            name: "Lui Kang",
            imageName: "lui_kang.png",
            Health: 150,
            Attack: 8,
            AttackMult: 1,
            CounterAttack: 20
        },
        {
            name: "Scorpion",
            imageName: "scorpion.png",
            Health: 180,
            Attack: 8,
            AttackMult: 1,
            CounterAttack: 20
        },
        {
            name: "Sub-Zero",
            imageName: "sub-zero.png",
            Health: 100,
            Attack: 8,
            AttackMult: 1,
            CounterAttack: 20
        },
        {
            name: "Raiden",
            imageName: "raiden.png",
            Health: 120,
            Attack: 8,
            AttackMult: 1,
            CounterAttack: 20
        }
    ];

    // initialize variables in the global scope
    var player = "";
    var playerAttack = 0;
    var playerAttackInc = 0;
    var playerWins = 0;
    var opponent = "";
    var opponentCounterAttack = 0;
    var isPlayerChosen = false;
    var isOpponentChosen = false;
    var charArray = ["0", "1", "2", "3"];
    var playerHealth = 0;
    var opponentHealth = 0;
    var selectOppText = "";
    var gameOver = false;

    // hide the attack button and lightning divs
    function hideDivs() {
        $("#attack_div").hide();
        $("#attackButton").hide();
        for (var i = 0; i < 4; i++) {
            $("#char" + i).hide();
            $("#char" + i + "_h6").hide();
        }
    }
    hideDivs();

    // show the attack button and lightning divs
    function showDivs() {
        $("#attack_div").show();
        $("#attackButton").show();
        $("#queue_text").show(500);
        for (var i = 0; i < charArray.length; i++) {
            $("#q" + i + "_img").show(250);
        }
        $("#selectPlayer").show();
        $("#top_div").slideUp();
    }

    // run all tasks required if a player won the game
    function wonMatch() {
        // console.log("startGame is: " + startGame);
        playerWins++;
        console.log(playerWins);
        if (playerWins == 3) {
            // end the game since you've defeated all 3 opponents
            document.getElementById("wonGame").play();
            hideDivs();
            gameOver = true;
            // console.log("Game Over is: " + gameOver);
            return true;
        } else {
            document.getElementById("wonMatch").play();
            opponent = "";
            isOpponentChosen = false;
            hideDivs();
            $("#opp_text").hide();
            $("#opp_img").hide();
            $("#opp_h6").text("");
            setTimeout(function () {
                // remove characters from the queue
                $("#queue_text").hide(500);
                for (var i = 0; i < charArray.length; i++) {
                    $("#q" + i + "_img").hide(250);
                }
                $("#selectPlayer").show();
                $("#top_div").slideDown();
                showChar();
            }, 2500);
            return true;
        }
    }

    // run all tasks required if the player lost a match
    function lostMatch() {
        document.getElementById("lostMatch").play();
    }

    // set the function for what happens after you and your opponent have been selected
    function startGame() {
        $("#opp_text").show();
        $("#opp_img").show();
        $("#attackButton").on("click", function () {
            console.log(opponentHealth);
            // console.log("Player Attack1: " + playerAttack);
            if (!gameOver) {
                opponentHealth -= playerAttack;
                $("#opp_h6").text("Health: " + opponentHealth);
                if (opponentHealth <= 0) {
                    // console.log("Player Attack2: " + playerAttack);
                    opponentHealth = 0;
                    wonMatch();
                    return true;
                } else {
                    playerHealth -= opponentCounterAttack;
                }
                $("#you_h6").text("Health: " + playerHealth);
                if (playerHealth <= 0) {
                    lostMatch();
                    return true;
                }
                playerAttack += playerAttackInc;
                document.getElementById("attack").play();
                $("#lightning-right").fadeIn(100);
                $("#lightning-right").attr("src", "images/lightning_r.png").fadeOut(200);
                setTimeout(function () {
                    $("#lightning-left").fadeIn(100);
                    $("#lightning-left").attr("src", "images/lightning_l.png").fadeOut(200);
                }, 200);
            }
        });
    }

    // pick the player's character and your opponent
    function prepGame() {
        $("#attack_div").show();
        if (!isPlayerChosen || !isOpponentChosen) {
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
            if (!isPlayerChosen) {
                $("#selectPlayer").text("Select your Character:");
            } else {
                if (playerWins == 0) {
                    selectOppText = "first";
                } else if (playerWins == 1) {
                    selectOppText = "next";
                } else if (playerWins == 2) {
                    selectOppText = "final";
                }
                $("#selectPlayer").text("Select your " + selectOppText + " Opponent:");
            }
        }

        $(".char").on("click", function () {
            if (!isPlayerChosen || !isOpponentChosen) {
                if (!isPlayerChosen) {
                    // the player's character hasn't been selected
                    player = $(this).attr("value");
                    // hide the character you just selected
                    $("#char" + player).hide(500);
                    $("#char" + player + "_h6").text("");
                    $("#char" + player + "_h6").hide();
                    isPlayerChosen = true;
                    $("#you_text").text("You:");
                    $("#you_img").attr("src", "images/" + characters[player].imageName);
                    $("#you_img").addClass("border");
                    playerHealth = characters[player].Health;
                    playerAttack = characters[player].Attack;
                    playerAttackInc = characters[player].Attack * characters[player].AttackMult;
                    $("#you_h6").addClass("w-100 d-flex bg-light justify-content-center align-items-center");
                    $("#you_h6").text("Health: " + playerHealth);
                    // remove the selected player from the charArray
                    var indexToRemove = charArray.indexOf(player);
                    charArray.splice(indexToRemove, 1);
                } else if (!isOpponentChosen) {
                    // the player has been selected, but the opponent hasn't been
                    opponent = $(this).attr("value");
                    // hide the opponent you just selected
                    $("#char" + opponent).hide(500);
                    $("#char" + opponent + "_h6").text("");
                    $("#char" + opponent + "_h6").hide();
                    isOpponentChosen = true;
                    $("#opp_text").text("Opponent:");
                    $("#opp_img").attr("src", "images/" + characters[opponent].imageName);
                    $("#opp_img").addClass("border");
                    opponentHealth = characters[opponent].Health;
                    opponentCounterAttack = characters[opponent].CounterAttack;
                    $("#opp_h6").addClass("w-100 d-flex bg-light justify-content-center align-items-center");
                    $("#opp_h6").text("Health: " + opponentHealth);
                    // remove the selected opponent from the charArray
                    var indexToRemove = charArray.indexOf(opponent);
                    charArray.splice(indexToRemove, 1);
                    // the player and the opponent have both been selected
                    $("#selectPlayer").hide(500);
                    $("#top_div").slideUp(500);
                    showDivs();
                    // move the 2 remaining opponents to the queue
                    $("#queue_text").text("The Queue:");
                    for (var i = 0; i < charArray.length; i++) {
                        var tempRemove = charArray[i];
                        $("#q" + i + "_img").attr("src", "images/" + characters[tempRemove].imageName);
                    }
                    $("#beginning").animate({
                        volume: 0.0
                    }, 2500);
                    startGame();
                    return true;
                }
            }
        });
    }

    // make a function to add pics of the charcters or remaining characters to be chosen from
    function showChar() {
        for (var i = 0; i < charArray.length; i++) {
            $("#char" + charArray[i]).show();
            $("#char" + charArray[i]).attr("src", "images/" + characters[charArray[i]].imageName);
            $("#char" + charArray[i]).addClass("border");
            $("#char" + charArray[i] + "_h6").show();
            $("#char" + charArray[i] + "_h6").addClass("w-100 d-flex bg-light justify-content-center align-items-center");
            $("#char" + charArray[i] + "_h6").text("Health: " + characters[charArray[i]].Health);
        }
        prepGame();
        return true;
    }

    // decide what to do when the start button is clicked
    $("#startButton").on("click", function () {
        document.getElementById("beginning").play();
        $("#startButton").fadeOut(500);
        showChar();
    });
});