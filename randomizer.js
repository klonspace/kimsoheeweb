let dataSet = [];

fetch('dataSet.json')
.then(response => response.json())
.then(data => {
  dataSet = data;
  initRandomize()
})
.catch(error => console.error(error))
function emptyEverything() {
  document.querySelectorAll(".strike").forEach(function(elem) {
    elem.classList.remove("strike");
  });
  document.querySelectorAll(".value").forEach(function(elem) {
    elem.innerHTML = "";
  });
  document.querySelector("#quote").innerHTML = "";
  document.querySelector(".uppercase").innerHTML = "";
  document.querySelector(".lowercase").innerHTML = "";
}
function initRandomize() {
  emptyEverything();
  randomize(dataSet);
}

function explainEverything() {
  emptyEverything();
  explain(dataSet);
}

function randomize(selection) {
  for(var i = 0; i < selection.length; i++) {
    console.log("randomizing : "+selection[i].id)
    if(selection[i].type == "vRange") {
      let value;
      if(selection[i].relTo) {
        var relToValue = getReltoValue(dataSet, selection[i].relTo);
        selection[i].value = Math.floor(relToValue*Math.random()*(selection[i].max-selection[i].min)+selection[i].min);
      }
      else {
        selection[i].value = Math.floor(Math.random()*(selection[i].max-selection[i].min)+selection[i].min);
      }
      document.getElementById(selection[i].id).innerHTML = selection[i].value;
      if(selection[i].append)
      document.getElementById(selection[i].id).innerHTML += selection[i].append
    }

    else if(selection[i].type == "conditional") {
      if(Math.random() < selection[i].optionClosed.probability) {
        document.getElementById(selection[i].id).querySelector(".optionOpen").classList.add("strike")
        strike(selection[i].optionOpen.result);
      }
      else {
        document.getElementById(selection[i].id).querySelector(".optionClosed").classList.add("strike")
        randomize(selection[i].optionOpen.result);
      }
    }
    else if(selection[i].type == "quote") {
      //console.log(Math.floor(Math.random()*selection[i].possibilites.length))
      document.getElementById(selection[i].id).innerHTML = selection[i].possibilites[Math.floor(Math.random()*selection[i].possibilites.length)]
    }
    else if(selection[i].type == "width") {
      selection[i].value = Math.floor(Math.random()*selection[i].possibilites.length);
      document.getElementById(selection[i].id).innerHTML = selection[i].possibilites[selection[i].value].name;
      console.log(getReltoValue("stemThickness"))
      var uppercases = generateWidths(selection[i].possibilites[selection[i].value].uppercase, getReltoValue(dataSet, "stemThickness"));
      document.querySelector(".uppercase").appendChild(uppercases)
      var lowercases = generateWidths(selection[i].possibilites[selection[i].value].lowercase, getReltoValue(dataSet, "stemThickness"));
      document.querySelector(".lowercase").appendChild(lowercases)
    }
  }
}

function explain(selection) {
  for(var i = 0; i < selection.length; i++) {
    console.log("explaining : "+selection[i].id)
    if(selection[i].type == "vRange") {
      if(selection[i].relTo) {
        document.getElementById(selection[i].id).innerHTML = (Math.floor(selection[i].min*100))+"-"+(Math.floor(selection[i].max*100))+"% of "+getLittleName(dataSet, selection[i].relTo);
      }
      else {
        document.getElementById(selection[i].id).innerHTML = selection[i].min+"-"+selection[i].max;
      }
      if(selection[i].append)
      document.getElementById(selection[i].id).innerHTML += selection[i].append;
    }
    else if(selection[i].type == "conditional") {
      explain(selection[i].optionOpen.result);
    }
    else if(selection[i].type == "width") {
      selection[i].value = Math.floor(Math.random()*selection[i].possibilites.length);
      document.getElementById(selection[i].id).innerHTML = selection[i].possibilites[selection[i].value].name;
      console.log(getReltoValue("stemThickness"))
      var uppercases = explainWidths(selection[i].possibilites[selection[i].value].uppercase, getReltoValue(dataSet, "stemThickness"));
      document.querySelector(".uppercase").appendChild(uppercases);
      var lowercases = explainWidths(selection[i].possibilites[selection[i].value].lowercase, getReltoValue(dataSet, "stemThickness"));
      document.querySelector(".lowercase").appendChild(lowercases);
    }
  }
}

function generateWidths(db, st) {
  var fullContainer = document.createElement("div");
  for(var i = 0; i < db.length; i++) {
    var container = document.createElement("div");
    var label = document.createElement("span");
    label.classList.add("widthLetter");
    label.innerHTML = db[i].letter;
    container.appendChild(label)
    container.innerHTML += " ";
    var actualWidth = document.createElement("span");
    actualWidth.classList.add("actualWidth");
    if(db[i].relTo == "stemThickness"){
      db[i].value = st*(Math.random()*(db[i].max-db[i].min)+db[i].min);
    }
    else {
      db[i].value = getRelToLetterValue(db, db[i].relTo)*(Math.random()*(db[i].max-db[i].min)+db[i].min);
    }
    actualWidth.innerHTML = Math.floor(db[i].value+1);
    container.appendChild(actualWidth);
    fullContainer.appendChild(container);
  }
  return fullContainer;
}
function explainWidths(db, st) {
  var fullContainer = document.createElement("div");
  for(var i = 0; i < db.length; i++) {
    var container = document.createElement("div");
    var label = document.createElement("span");
    label.classList.add("widthLetter");
    label.innerHTML = db[i].letter;
    container.appendChild(label)
    container.innerHTML += " ";

    var actualWidth = document.createElement("span");
    actualWidth.classList.add("actualWidth");
    if(db[i].relTo == "stemThickness"){
      actualWidth.innerHTML = (Math.floor(db[i].min*100))+"-"+(Math.floor(db[i].max*100))+"% of s.t.";
    }
    else {
      if(db[i].min == 1 && db[i].max == 1) {
        actualWidth.innerHTML = "= "+db[i].relTo;
      }
      else {
        actualWidth.innerHTML = (Math.floor(db[i].min*100))+"-"+(Math.floor(db[i].max*100))+"% of "+db[i].relTo;
      }
    }
    container.appendChild(actualWidth);
    fullContainer.appendChild(container);
  }
  return fullContainer;
}

function getRelToLetterValue(selection, ref) {
  for(var i = 0; i < selection.length; i++) {
    if(selection[i].letter == ref) {
      return selection[i].value;
    }
  }
}

function strike(selection) {
  console.log(selection.length)
  for(var i = 0; i < selection.length; i++) {
    console.log("striking : "+selection[i].id)
    document.getElementById(selection[i].id).parentNode.classList.add("strike");
    if(selection[i].type == "conditional") {
      strike(selection[i].optionOpen.result);
    }
  }
}
function getReltoValue(selection, ref) {
  for(var i = 0; i < selection.length; i++) {
    if(selection[i].type == "conditional") {
      if(getReltoValue(selection[i].optionOpen.result, ref)) {
        return getReltoValue(selection[i].optionOpen.result, ref);
      }
    }
    if(selection[i].id == ref) {
      return selection[i].value;
    }
  }
  return false;
}

function getLittleName(selection, ref) {
  for(var i = 0; i < selection.length; i++) {
    if(selection[i].type == "conditional") {
      if(getLittleName(selection[i].optionOpen.result, ref)) {
        return getLittleName(selection[i].optionOpen.result, ref);
      }
    }
    if(selection[i].id == ref) {
      return selection[i].littleName;
    }
  }
  return false;
}

document.getElementById("randomizer").addEventListener("click", function() {
  initRandomize();
});
document.getElementById("seeMinMax").addEventListener("click", function() {
  explainEverything();
});

document.getElementById("footerPlaceholder").style.height = document.getElementById("footer").getBoundingClientRect().height+"px";

document.getElementById("footerContainer").style.height = document.getElementById("footer").getBoundingClientRect().height+"px";

function checkFooterPlacement() {
  if(document.getElementById("footerContainer").getBoundingClientRect().top + window.pageYOffset + 20 >
  window.pageYOffset+window.innerHeight-document.getElementById("footerContainer").getBoundingClientRect().height) {
    document.getElementById("footer").classList.add("floating");
  }
  else {
    document.getElementById("footer").classList.remove("floating");
  }
  requestAnimationFrame(checkFooterPlacement)
}
checkFooterPlacement();
