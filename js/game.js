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
    var gameOver = true;
    var colorInterval = "";

    // clear the queue area
    function clearQueue() {
        $("#q_row").hide(500);
        for (var i = 0; i < 4; i++) {
            $("#q" + i + "_img").attr("src", "");
        }
        return;
    }

    function restartGame() {
        // re-initialize variables in the global scope
        player = "";
        playerAttack = 0;
        playerAttackInc = 0;
        playerWins = 0;
        opponent = "";
        opponentCounterAttack = 0;
        isPlayerChosen = false;
        isOpponentChosen = false;
        charArray = ["0", "1", "2", "3"];
        playerHealth = 0;
        opponentHealth = 0;
        gameOver = true;
        colorInterval = "";
        // hide the things until the appropriate times to show them
        $("#select_char").hide();
        $("#match_row").hide();
        $("#you_div").hide();
        $("#opp_div").hide();
        $("#message_row").addClass("vis_hidden");
        $("#q_row").hide();
        // show the insructions with the start button
        $("#instructions").show();
        // show the character divs but keep their parent hidden
        for (var i = 0; i < charArray.length; i++) {
            $("#char" + charArray[i] + "_div").show();
        }
    }

    restartGame();

    function wonMatch() {
        $("#attack_div").addClass("vis_hidden");
        document.getElementById("wonMatch").play();
        clearQueue();
        clearInterval(colorInterval);
        playerWins++;
        // show the won game/round text
        $("#message_row").removeClass("vis_hidden");
        if (playerWins == 3) {
            $("#message_text").css("background-color", "#28a745");
            $("#message_text").text("You've won the Match!");
            // end the game since you've defeated all 3 opponents
            gameOver = true;
            setTimeout(function () {
                restartGame();
            }, 5000);
        } else {
            $("#message_text").css("background-color", "#17a2b8");
            $("#message_text").text("You've won this round!");
            isOpponentChosen = false;
        }
        setTimeout(function () {
            $("#opp_div").hide();
            if (playerWins < 3) {
                $("#message_text").css("background-color", "#f59a4d");
                if (playerWins == 1) {
                    $("#message_text").text("Select your next Opponent:");
                } else if (playerWins == 2) {
                    $("#message_text").text("Select your final Opponent:");
                }
                showChar();
            }
            return;
        }, 4000);
    }

    function lostMatch() {
        $("#attack_div").addClass("vis_hidden");
        document.getElementById("lostMatch").play();
        gameOver = true;
        clearQueue();
        clearInterval(colorInterval);
        $("#message_row").removeClass("vis_hidden");
        $("#message_text").css("background-color", "#fd7e14");
        $("#message_text").text("You've Lost the Game!");
        setTimeout(function () {
            $("#message_row").addClass("vis_hidden");
            restartGame();
            return;
        }, 5000);
    }

    $("#attackButton").on("click", function () {
        if (!gameOver && isPlayerChosen && isOpponentChosen) {
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
                return;
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
                return;
            }
            playerAttack += playerAttackInc;
        }
    });

    // pick the player's character and your opponent
    function prepGame() {
        if (!isPlayerChosen || !isOpponentChosen) {
            // make the 'Select a Character/Opponent' text change colors in the attract mode
            var colorCounter = 0;
            if (!isPlayerChosen) {
                $("#message_row").removeClass("vis_hidden");
                $("#message_text").css("background-color", "#f59a4d");
                $("#message_text").text("Select your Character:");
            }
        }
    }

    $(".char").on("click", function () {
        if (!isPlayerChosen || !isOpponentChosen) {
            if (!isPlayerChosen) {
                // the player's character hasn't been selected
                $("#match_row").show();
                player = $(this).attr("value");
                // hide the character you just selected
                $("#char" + player + "_text").text("");
                $("#char" + player + "_img").attr("src", "");
                $("#char" + player + "_h6").text("");
                $("#char" + player + "_div").hide();
                // show the match_row with you and your opponent
                isPlayerChosen = true;
                $("#you_div").show();
                $("#you_text").html("<span class='small text-dark' >You: </span>" + characters[player].name);
                $("#you_img").attr("src", "images/" + characters[player].imageName);
                playerHealth = characters[player].Health;
                playerAttack = characters[player].Attack;
                playerAttackInc = characters[player].Attack;
                $("#you_h6").text("Health: " + characters[player].Health);
                // remove the selected player from the charArray
                var indexToRemove = charArray.indexOf(player);
                charArray.splice(indexToRemove, 1);
                $("#attack_div").addClass("vis_hidden");
                $("#message_row").removeClass("vis_hidden");
                $("#message_text").css("background-color", "#f59a4d");
                $("#message_text").text("Select your first Opponent:");
            } else if (!isOpponentChosen) {
                // the player has been selected, but the opponent hasn't been
                opponent = $(this).attr("value");
                // hide the opponent you just selected
                $("#char" + opponent + "_text").text("");
                $("#char" + opponent + "_img").attr("src", "");
                $("#char" + opponent + "_h6").text("");
                $("#char" + opponent + "_div").hide();
                isOpponentChosen = true;
                $("#message_row").addClass("vis_hidden");
                $("#opp_div").show();
                $("#opp_text").html("<span class='small text-dark' >Opponent: </span>" + characters[opponent].name);
                $("#opp_img").attr("src", "images/" + characters[opponent].imageName);
                opponentHealth = characters[opponent].Health;
                opponentCounterAttack = characters[opponent].CounterAttack;
                $("#opp_h6").text("Health: " + characters[opponent].Health);
                // remove the selected opponent from the charArray
                var indexToRemove = charArray.indexOf(opponent);
                charArray.splice(indexToRemove, 1);
                // the player and the opponent have both been selected
                $("#select_char").slideUp(500);
                // move the remaining opponent(s) to the queue
                if (charArray.length > 0) {
                    $("#q_row").show();
                    for (var i = 0; i < charArray.length; i++) {
                        $("#q" + i + "_img").attr("src", "images/" + characters[charArray[i]].imageName);
                    }
                }
                $("#beginning").animate({
                    volume: 0.0
                }, 2500);
                $("#attack_div").removeClass("vis_hidden");
                gameOver = false;
            }
        }
    });

    // make a function to add pics of the charcters or remaining characters to be chosen from
    function showChar() {
        for (var i = 0; i < charArray.length; i++) {
            $("#char" + charArray[i] + "_text").text(characters[charArray[i]].name);
            $("#char" + charArray[i] + "_img").attr("src", "images/" + characters[charArray[i]].imageName);
            $("#char" + charArray[i] + "_h6").text("Health: " + characters[charArray[i]].Health);
            $("#select_char").slideDown(500);
        }
        prepGame();
        return;
    }

    // decide what to do when the start button is clicked
    $("#startButton").on("click", function () {
        $("#beginning").prop("volume", 1);
        document.getElementById("beginning").pause();
        document.getElementById("beginning").currentTime = 0;
        document.getElementById("beginning").play();
        $("#instructions").hide();
        showChar();
    });
});