$(document).ready(function () {
    "use strict";

    // set the character array and objects
    var characters = [
        {
            name: "Lui Kang",
            imageName: "lui_kang.png",
            Health: 170,
            Attack: 5,
            CounterAttack: 15
        },
        {
            name: "Scorpion",
            imageName: "scorpion.png",
            Health: 190,
            Attack: 3,
            CounterAttack: 18
        },
        {
            name: "Sub-Zero",
            imageName: "sub-zero.png",
            Health: 120,
            Attack: 10,
            CounterAttack: 11
        },
        {
            name: "Raiden",
            imageName: "raiden.png",
            Health: 130,
            Attack: 9,
            CounterAttack: 13
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
    var gameOver = false;

    // hide the things until the appropriate times to show them
    $("#top_row").hide();
    $("#match_row").hide();
    $("#you_row").hide();
    $("#opp_row").hide();
    $("#queue_text").hide();
    $("#message_row").hide();

    // clear the queue area
    function clearQueue() {
        $("#queue_text").hide(500);
        for (var i = 0; i < 4; i++) {
            $("#q" + i + "_img").attr("src", "");
        }
    }

    function wonMatch() {
        $("#attack_div").html("");
        playerWins++;
        // show the won game/round text
        $("#message_row").show();
        if (playerWins == 3) {
            $("#message_text").css("background-color", "#28a745");
            $("#message_text").text("You've won the Match!");
        } else {
            $("#message_text").css("background-color", "#17a2b8");
            $("#message_text").text("You've won this round!");
        }
        setTimeout(function () {
            document.getElementById("wonMatch").play();
            $("#opp_row").hide(500);
            clearQueue();
        }, 1000);
        if (playerWins == 3) {
            // end the game since you've defeated all 3 opponents
            gameOver = true;
            return true;
        } else {
            if (playerWins == 1) {
                $("#selectPlayer").text("Select your next Opponent:");
            } else if (playerWins == 2) {
                $("#selectPlayer").text("Select your final Opponent:");
            }
            isOpponentChosen = false;
        }
        setTimeout(function () {
            $("#message_row").hide();
            showChar();
            return true;
        }, 2500);
    }

    function lostMatch() {
        $("#attack_div").html("");
        document.getElementById("lostMatch").play();
        gameOver = true;
        clearQueue();
        $("#message_row").show();
        $("#message_text").css("background-color", "#fd7e14");
        $("#message_text").text("You've Lost the Game!");
        return true;
    }

    // set the function for what happens after you and your opponent have been selected
    function startGame() {
        $("#attack_div").html("<button id='attackButton' class='btn btn-light btn-lg'>Attack!</button>");
        $("#attackButton").on("click", function () {
            if (!gameOver) {
                opponentHealth -= playerAttack;
                $("#opp_h6").text("Health: " + opponentHealth);
                document.getElementById("attack").play();
                // play the attack sound and show the right attack lightning
                $("#lr_text").text("-" + playerAttack);
                $("#lr_text").show();
                $("#lightning_right").fadeIn(100);
                $("#lightning_right").attr("src", "images/lightning_r.png").fadeOut(500);
                $("#lr_text").fadeOut(500);
                if (opponentHealth <= 0) {
                    opponentHealth = 0;
                    wonMatch();
                    return true;
                } else {
                    playerHealth -= opponentCounterAttack;
                    // show the left countattack lightning since I didn't win with the latest attack
                    setTimeout(function () {
                        $("#ll_text").text("-" + opponentCounterAttack);
                        $("#ll_text").show();
                        $("#lightning_left").fadeIn(100);
                        $("#lightning_left").attr("src", "images/lightning_l.png").fadeOut(500);
                        $("#ll_text").fadeOut(500);
                    }, 200);
                }
                $("#you_h6").text("Health: " + playerHealth);
                if (playerHealth <= 0) {
                    lostMatch();
                    return true;
                }
                playerAttack += playerAttackInc;
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
            }
        }

        $(".char").on("click", function () {
            $("#match_row").show();
            if (!isPlayerChosen || !isOpponentChosen) {
                if (!isPlayerChosen) {
                    // the player's character hasn't been selected
                    player = $(this).attr("value");
                    // hide the character you just selected
                    $("#char" + player + "_text").text("");
                    $("#char" + player + "_text").hide();
                    $("#char" + player).attr("src", "");
                    $("#char" + player).hide();
                    $("#char" + player + "_h6").text("");
                    $("#char" + player + "_h6").hide();
                    // show the match_row with you and your opponent
                    isPlayerChosen = true;
                    $("#you_row").show();
                    $("#you_text").html("<span class='small text-dark' >You: </span>" + characters[player].name);
                    $("#you_img").attr("src", "images/" + characters[player].imageName);
                    playerHealth = characters[player].Health;
                    playerAttack = characters[player].Attack;
                    playerAttackInc = characters[player].Attack;
                    $("#you_h6").text("Health: " + characters[player].Health);
                    // remove the selected player from the charArray
                    var indexToRemove = charArray.indexOf(player);
                    charArray.splice(indexToRemove, 1);
                    $("#selectPlayer").text("Select your first Opponent:");
                } else if (!isOpponentChosen) {
                    // the player has been selected, but the opponent hasn't been
                    opponent = $(this).attr("value");
                    // hide the opponent you just selected
                    $("#char" + opponent + "_text").text("");
                    $("#char" + opponent + "_text").hide();
                    $("#char" + opponent).attr("src", "");
                    $("#char" + opponent).hide();
                    $("#char" + opponent + "_h6").text("");
                    $("#char" + opponent + "_h6").hide();
                    isOpponentChosen = true;
                    $("#opp_row").show();
                    $("#opp_text").html("<span class='small text-dark' >Opponent: </span>" + characters[opponent].name);
                    $("#opp_img").attr("src", "images/" + characters[opponent].imageName);
                    opponentHealth = characters[opponent].Health;
                    opponentCounterAttack = characters[opponent].CounterAttack;
                    $("#opp_h6").text("Health: " + characters[opponent].Health);
                    // remove the selected opponent from the charArray
                    var indexToRemove = charArray.indexOf(opponent);
                    charArray.splice(indexToRemove, 1);
                    // the player and the opponent have both been selected
                    $("#top_row").slideUp(500);
                    // move the remaining opponent(s) to the queue
                    if (charArray.length > 0) {
                        $("#queue_text").show();
                        for (var i = 0; i < charArray.length; i++) {
                            $("#q" + i + "_img").attr("src", "images/" + characters[charArray[i]].imageName);
                        }
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
            $("#char" + charArray[i] + "_text").text(characters[charArray[i]].name);
            $("#char" + charArray[i]).attr("src", "images/" + characters[charArray[i]].imageName);
            $("#char" + charArray[i] + "_h6").text("Health: " + characters[charArray[i]].Health);
            $("#top_row").slideDown(500);
        }
        prepGame();
        return true;
    }

    // decide what to do when the start button is clicked
    $("#startButton").on("click", function () {
        document.getElementById("beginning").play();
        $("#startButton").fadeOut(500);
        showChar();
        return true;
    });
});