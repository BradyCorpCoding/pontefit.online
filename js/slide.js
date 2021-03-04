var s = document.getElementsByClassName('app-preview-item');
var startValue = 4;
var d = document.getElementsByClassName('slick-a');
var i=0;
function next(value) {
  startValue += value
  if (startValue >= s.length-1) {
    startValue = 8;
    console.log("Full");
  }
  else {
    s[startValue-2].style.display = "none";

    s[startValue-1].style.zIndex = "1000";
    s[startValue-1].style.transform = "scale(.8)";
    s[startValue-1].style.margin = "0 -110px 0 0";




    s[startValue].style.zIndex = "2000";
    s[startValue].style.transform = "scale(1)";
    s[startValue].style.transition = "transform .2s linear";
    s[startValue].style.margin = "0 5px";

    s[startValue+1].style.zIndex = "1000";
    s[startValue+1].style.transform = "scale(.8)";
    s[startValue+1].style.margin = "0px -110px 0px -63px";
  }
  if (i < d.length-1) {
    d[i].classList.remove("slick-active");
    i++;
    d[i].classList.add("slick-active");
  }
}
function prev(value) {
  startValue += value
  if (startValue <= 4) {
    startValue = 4;
    console.log("Full prv");
  }
  else {
    // s[startValue].style.display = "none";
    s[startValue-2].style.display = "block"

    s[startValue].style.zIndex = "1000";
    s[startValue].style.transform = "scale(.8)";
    s[startValue].style.margin = "0 110px 0 -40px";

    s[startValue-1].style.zIndex = "2000";
    s[startValue-1].style.transform = "scale(1)";
    s[startValue-1].style.transition = "transform .2s linear";
    s[startValue-1].style.margin = "0 -30px";


    s[startValue-2].style.zIndex = "1000";
    s[startValue-2].style.transform = "scale(.8)";
    s[startValue-2].style.margin = "0px -70px 0px 0px";
  }
  if (i > 0) {
    d[i].classList.remove("slick-active");
    i--;
    d[i].classList.add("slick-active");
  }

}
/*Active
z-index: 2000;
    transform: scale(1);
    transition: transform .2s linear;
    margin: 0 -50px;
*/
/*Back
z-index: 1000;
    transform: scale(.8);
    margin: 0 -110px 0 0;
    document.getElementById("myDIV").style.transition = "all 2s";
*/
