var queslist = document.getElementsByClassName('tab');
var progressBar = document.getElementsByClassName('progress');


function nextOpt(num, wid) {
    if (num == 10) {
        var radiosFitnessLevel = document.getElementsByName('fitness_level');
        for (var i = 0, length = radiosFitnessLevel.length; i < length; i++) {
            if (radiosFitnessLevel[i].checked) {
                if (radiosFitnessLevel[i].value === "beginner") {
                    document.getElementById("nivel").innerHTML = "Principiante";
                } else if (radiosFitnessLevel[i].value === "intermediate") {
                    document.getElementById("nivel").innerHTML = "Intermedio";
                } else if (radiosFitnessLevel[i].value === "advanced") {
                    document.getElementById("nivel").innerHTML = "Avanzado";
                }
                break;
            }
        }

        var radiosTargetWeightType = document.getElementsByName('target_weight__type');
        for (var i = 0, length = radiosTargetWeightType.length; i < length; i++) {
            if (radiosTargetWeightType[i].checked) {
                if (radiosTargetWeightType[i].value === "lbs") {
                    var weightLbs = document.getElementsByName('target_weight__kg')[0].value;
                    document.getElementById("pesodeseadoNumber").innerHTML = weightLbs;
                    document.getElementById("pesodeseadoUnit").innerHTML = " lbs";
                } else if (radiosTargetWeightType[i].value === "kg") {
                  var weightKg = document.getElementsByName('target_weight__kg')[0].value;
                    document.getElementById("pesodeseadoNumber").innerHTML = weightKg;
                    document.getElementById("pesodeseadoUnit").innerHTML = " kg";
                }
                break;
            }
        }

        var x = document.getElementsByClassName('email')[0];
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(x.value)) {
            queslist[num].style.display = "none";
            queslist[num + 1].style.display = "block";
            Send(x.value);
            localStorage.setItem("User-Email", x.value);
            OfCountdown();
        } else {
            var x = document.getElementsByClassName('Chemail')[0].classList.add("invalid");
        }
    } else if (num >= 0) {
        if (num <= 3) {
            queslist[num].style.display = "none";
            queslist[num + 1].style.display = "block";
            progressBar[0].style.width = wid + "%";
        } else if (num > 3 && num <= 7) {
            if (num == 7) {
                if (queslist[num].childNodes[1].childNodes[1].childNodes[3].childNodes[1].childNodes[1].value == "") {
                    queslist[num].childNodes[1].childNodes[1].childNodes[3].childNodes[1].childNodes[1].parentElement.classList.remove("invalid");
                    queslist[num].childNodes[1].childNodes[1].childNodes[3].childNodes[1].childNodes[1].parentElement.classList.add("invalid");
                } else {
                    queslist[num].style.display = "none";
                    queslist[num + 1].style.display = "block";
                    progressBar[1].style.width = wid + "%";
                    queslist[num].childNodes[1].childNodes[1].childNodes[3].childNodes[1].childNodes[1].parentElement.classList.remove("invalid");
                }
            } else if (queslist[num].childNodes[1].childNodes[1].childNodes[3].childNodes[3].childNodes[1].childNodes[1].value == "") {
                reClass(num);
                queslist[num].childNodes[1].childNodes[1].childNodes[3].childNodes[3].childNodes[1].childNodes[1].parentElement.classList.add("invalid");
            } else {
                queslist[num].style.display = "none";
                queslist[num + 1].style.display = "block";
                progressBar[1].style.width = wid + "%";
                queslist[num].childNodes[1].childNodes[1].childNodes[3].childNodes[3].childNodes[1].childNodes[1].parentElement.classList.remove("invalid");
            }
        } else if (num == 8) {
            queslist[num].style.display = "none";
            queslist[num + 1].style.display = "block";
            progressBar[2].style.width = wid + "%";
            document.getElementsByClassName('header')[0].style.display = "none";
            setTimeout(showEmail, 5000);
        }
    } else {
        if (progressBar[0].style.width == "0%") {
            window.location.href = "index.html";
        }
        if (progressBar[0].style.width == "") {
            window.location.href = "index.html";
        } else {
            for (var i = 0; i <= 8; i++) {
                if (queslist[i].style.display == "block") {
                    queslist[i].style.display = "none";
                    queslist[i - 1].style.display = "block";
                    if (i <= 4) {
                        var widValue = progressBar[0].style.width;
                        progressBar[0].style.width = (parseInt(widValue) - 25) + "%";
                    } else if (i > 3 && i < 8) {
                        var widValue = progressBar[1].style.width;
                        progressBar[1].style.width = (parseInt(widValue) - 25) + "%";
                    } else if (i == 8) {
                        var widValue = progressBar[1].style.width;
                        progressBar[1].style.width = (parseInt(widValue) - 25) + "%";
                    }
                    break;
                }
            }
        }
    }
}

function reClass(num) {
    console.log("removed");
    queslist[num].childNodes[1].childNodes[1].childNodes[3].childNodes[3].childNodes[1].childNodes[1].parentElement.classList.remove("invalid");
}

function showEmail() {
    console.log("enter");
    queslist[9].style.display = "none";
    queslist[10].style.display = "block";
}

function showConti(num) {
    console.log("selected2");
    document.getElementsByClassName("Countinue")[num].disabled = false;
}

function OfCountdown() {
    var min = 9
    var sec = 59;
    var timer = setInterval(function () {
        document.getElementsByClassName('timerMinHeader')[0].innerHTML = min;
        document.getElementsByClassName('timerSecHeader')[0].innerHTML = sec;
        sec--;
        if (sec < 0) {
            min--;
            sec = 59;
            if (min == 0) {
                document.getElementsByClassName('timerMinHeader')[0].innerHTML = 0;
                document.getElementsByClassName('timerSecHeader')[0].innerHTML = 00;
                clearInterval(timer);
            }
        }
    }, 1000);
}

function closeWin(letter) {
    if (letter === "a") {
        document.getElementById("paymenta").style.display = 'none';
    } else if (letter === "b") {
        document.getElementById("paymentb").style.display = 'none';
    } else if (letter === "c") {
        document.getElementById("paymentc").style.display = 'none';
    }
}

function Send(email) {
    Email.send({
        Host: "smtp.gmail.com",
        Username: "user",
        Password: "Pass",
        To: email,
        From: "from-mail",
        Subject: "This is the subject",
        Body: "And this is the body"
    }).then(
        // message => alert(message)
    );
}