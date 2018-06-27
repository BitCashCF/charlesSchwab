
//Console log to signal/ensure Javascript file is being loaded using an IIFE
(function() {
    console.log("Javascript file successfully loaded.");
}());

//Maybe we want to track the number of clicks on the breadcrumbs for analytics purposes
//Use an IIFE to create a closure so that we can access a counter value anywhere
//This is not entirely necessary, but might be useful later on to check user behavior
//This could be extended to track specific breadcrumbs or any number of other clicks
var clickCounter = (function() {
    let counterVal = 0;  

    return {
        increment() {
            ++counterVal;  
        },  

        get value() {
            return counterVal;
        }
    };
})();

//The below function sets the breadcrumb and its associated pseudo-element triangle color appropriately
//Clicking on an element means it is active, visually respresented by orange
function setBreadcrumbColor(elem) {

    // Create array of all 'a' elements
    var aList = document.getElementsByTagName('a');
  
    //Loop through all 'a' elements to remove active class on non-clicked breadcrumbs
    //This is necessary for coloring of breadcrumb (li and :after/before pseudo elements)
    //Note: I am not using jQuery given parameters of the challenge, but it would probably make selectors easier
    for (i = 0; i < aList.length; i++) {
        // Remove the class 'active' if it exists
        aList[i].closest('li').classList.remove('active');
        aList[i].closest('li').childNodes[1].classList.remove('active')
    }

    //Add 'active' and 'visitedAlready' classses to the element that was clicked to add color
    //Now that the breadcrumb was visited, a new color remains (shows progress)
    elem.classList.add('active', 'visitedAlready');
    elem.childNodes[1].classList.add('active', 'visitedAlready');

    //Checking analytics
    clickCounter.increment();
    console.log("Counter is now: ", clickCounter.value);
}

function modifyProgress(modifierValue) {
	//Animation is now running, which means want to shut down the buttons to prevent edge cases
	setButtonsDisabled(true);

	//From the select component, get the value; this lets us know which bar we'll modify
	var getSelectorValue = document.getElementById("barSelection");
	var chosenValue = getSelectorValue.options[getSelectorValue.selectedIndex].value;

	//Select the bar itself using the value grabbed above
	var barToBeModified = document.getElementById('barProgress' + chosenValue); 

	//Set the speed of the animation; lower numbers are faster
    var id = setInterval(frame, 10);

    //Set the goal value, which we'll use to determine when the progress bar stops inreased or decreasing
    //Have to parse, otherwise it tries to add/subtract an integer with a percentage
    var goalWidth = parseFloat(barToBeModified.style.width) + modifierValue;

    //Visually change the bar color if we would end up with a value beyond 100
    if(goalWidth > 100 || goalWidth < 0){
    	barToBeModified.style.backgroundColor = 'red'
    }
    else{
    	//Reset back to orange if the value becomes value again
    	barToBeModified.style.backgroundColor = 'orange'
    }

    function frame() {
    	//Alias the width for readability
    	var currentWidth = parseFloat(barToBeModified.style.width);

    	//We stop on one of three conditions:
    	//1. We cannot go above 100, so a positive modifier cannot exceed that upper limit
    	//2. We cannot go below 0, so a negative modifier cannot exceed that lower limit
    	//3. We need to handle when the goal width is reached
        if (currentWidth  >= 100  && modifierValue > 0 || currentWidth  <= 0 && modifierValue < 0 || currentWidth == goalWidth) {
        	//If at  0 or 100, stop - we don't need to change the bar progress anymore
            clearInterval(id);

            //Reenable the buttons once the animation has completed 
        	setButtonsDisabled(false);

			//Visually update the numerical value within the progress bar itself 
			document.getElementById("percentValue" + chosenValue).innerHTML = barToBeModified.style.width;
        } else {
        	//Change the width of the progress bar itself and set back to a percentage
            barToBeModified.style.width = currentWidth >= goalWidth ? currentWidth-1 + '%' : currentWidth+1 + '%';
        }
    }
}

function setButtonsDisabled(isDisabled){
	Array.from(document.getElementById("buttonContainer").getElementsByTagName('button'))
		.forEach(button => {
  			button.disabled = isDisabled;
	});
}



