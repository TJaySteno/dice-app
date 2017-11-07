//HTML elements
	//Left div
		//Roll information
const left = document.querySelector('.left');
const leftFieldsets = left.querySelectorAll('fieldset');
const rollInputs = [{},{},{}];
const rollButtons = [];
for (let i = 0; i < 3; i++) {
	rollInputs[i].actionElement = leftFieldsets[i].firstElementChild.nextElementSibling.nextElementSibling;
	rollInputs[i].numberOfDiceElement = rollInputs[i].actionElement.nextElementSibling.nextElementSibling.nextElementSibling;
	rollInputs[i].dieSidesElement = rollInputs[i].numberOfDiceElement.nextElementSibling.nextElementSibling.nextElementSibling;
	rollButtons.push(rollInputs[i].dieSidesElement.nextElementSibling.nextElementSibling);
}

		//Test and h2
const display = left.lastElementChild;
const test = display.previousElementSibling;


	//Right Div
		//Party Treasure
const right = document.querySelector('.right');
const partyTreasure = right.firstElementChild;
const treasureInputs = {};
	treasureInputs.PP = partyTreasure.firstElementChild.nextElementSibling;
	treasureInputs.GP = treasureInputs.PP.nextElementSibling;
	treasureInputs.EP = treasureInputs.GP.nextElementSibling;
	treasureInputs.SP = treasureInputs.EP.nextElementSibling;
	treasureInputs.CP = treasureInputs.SP.nextElementSibling;
	treasureInputs.items = treasureInputs.CP.nextElementSibling.nextElementSibling.nextElementSibling;
const spoils = partyTreasure.lastElementChild;
const divvy = spoils.previousElementSibling;
const stash = divvy.previousElementSibling;


//Event listeners
	//Left div
		//Roll Information
for (let i = 0; i < rollButtons.length; i++) { 
	rollButtons[i].addEventListener( 'click', () => print(rollButton()) );
};
test.addEventListener('click', () => { print(testRolls()) });

	//Right div
		//Party Treasure and Test
stash.addEventListener('click', () => { print(addToStash()); });
divvy.addEventListener('click', () => { print(divvyItUp()); });
spoils.addEventListener('click', () => { print(showPrevious()); });


//HTML functions
	//Left div
		//Clear Roll Information
function clearRollInputs () {
	rollInputs[0].actionElement.value = '';
	rollInputs[0].numberOfDiceElement.value = '1';
	rollInputs[0].dieSidesElement.value = '20';
	for (let i = 1; i < 3; i++) {
		rollInputs[i].actionElement.value = '';
		rollInputs[i].numberOfDiceElement.value = '';
		rollInputs[i].dieSidesElement.value = '';
	}
	rollInputs[0].actionElement.focus();
}

		//Print function
function print (message) { display.innerHTML = message; }

	//Right div
		//Clear Party Treasure
function clearTreasureInputs () {
	treasureInputs.PP.value = '';
	treasureInputs.GP.value = '';
	treasureInputs.EP.value = '';
	treasureInputs.SP.value = '';
	treasureInputs.CP.value = '';
	treasureInputs.items.value = '';
}


//Set initial state
clearRollInputs();