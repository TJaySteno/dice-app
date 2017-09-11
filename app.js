//HTML elements
const h2 = document.querySelector('h2');

const rollInfo = Array.from(document.querySelectorAll('fieldset'));
const partyTreasure = rollInfo.pop();

//Find HTML elements for roll fields
const rollInputs = [{},{},{}];
for (let i = 0; i < rollInfo.length; i++) {
	rollInputs[i].actionElement = rollInfo[i].firstElementChild.nextElementSibling.nextElementSibling;
	rollInputs[i].numberOfDiceElement = rollInputs[i].actionElement.nextElementSibling.nextElementSibling.nextElementSibling;
	rollInputs[i].dieSidesElement = rollInputs[i].numberOfDiceElement.nextElementSibling.nextElementSibling.nextElementSibling;
}

//Find HTML element for treasure fields
const treasureInputs = {};
treasureInputs.PP = partyTreasure.firstElementChild.nextElementSibling;
treasureInputs.GP = treasureInputs.PP.nextElementSibling;
treasureInputs.EP = treasureInputs.GP.nextElementSibling;
treasureInputs.SP = treasureInputs.EP.nextElementSibling;
treasureInputs.CP = treasureInputs.SP.nextElementSibling;
treasureInputs.items = treasureInputs.CP.nextElementSibling.nextElementSibling.nextElementSibling;

//Array in which to store rolls
const rolls = [];

//Basic functions
const d = (d) => Math.floor(Math.random() * d ) + 1;
const log = (message) => console.log(message);

const print = (message) => {
	h2.innerHTML = message;
	rollInputs[0].actionElement.focus();
}

function clearRolls() {
	for (let i = 1; i < 3; i++) {
		rollInputs[i].actionElement.value = '';
		rollInputs[i].numberOfDiceElement.value = '';
		rollInputs[i].dieSidesElement.value = '';
	}
}

function clearTreasureInputs() {
	treasureInputs.PP.value = '';
	treasureInputs.GP.value = '';
	treasureInputs.EP.value = '';
	treasureInputs.SP.value = '';
	treasureInputs.CP.value = '';
	treasureInputs.items.value = '';
	
}

//Dice rolling functions
function retrieveInfo() {
	const rollInfo = [];
	for (let i = 0; i < rollInputs.length; i++) {
		if (rollInputs[i].actionElement.value === null) {
			throw Error('Please enter a description of your action');
		} else if (isNaN(rollInputs[i].numberOfDiceElement.value) || isNaN(rollInputs[i].dieSidesElement.value)) {
			throw Error('Please enter numbers for both number of dice and dice sides');
		} else if (rollInputs[i].actionElement.value && rollInputs[i].numberOfDiceElement.value && rollInputs[i].dieSidesElement.value) {
			rollInfo[i] = {
				action: rollInputs[i].actionElement.value,
				numberOfDice: rollInputs[i].numberOfDiceElement.value,
				dieSides: rollInputs[i].dieSidesElement.value
			}
		} else {
			break;
		}
	}
	clearRolls();
	return rollInfo;
}

function rollDice(rollInfo) {
	for (let i = 0; i < rollInfo.length; i++) {
		rollInfo[i].rolls = [];
		for (let j = 0; j < rollInfo[i].numberOfDice; j++) {
			rollInfo[i].rolls.push(d(rollInfo[i].dieSides));
		}
	}
}

function rollMessage(rollInfo) {
	let description = '(';
	let total = 0;
	let theRolls = ' total (';
	for (let j = 0; j < rollInfo.length; j++) {
		description += `${rollInfo[j].action} ${rollInfo[j].numberOfDice}d${rollInfo[j].dieSides}`;
		for (let i = 0; i < rollInfo[j].rolls.length; i++) {
			total += rollInfo[j].rolls[i];
			theRolls += ` ${rollInfo[j].rolls[i]}`;
		}
		if (j+1 < rollInfo.length) {
			description += ' + ';
			theRolls += ','
		}
	}
	description += '): ';
	theRolls += ' )';
	let message = description + total + theRolls;
	return message;
}

function addTime(message) {
	let date = new Date();
	return ` - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

function allRollsMessage(newRoll) {
	rolls.unshift(newRoll);
	if (rolls.length > 5) {
		rolls.pop();
	}
	message = '';
	for (let i = 0; i < rolls.length; i++) {
		message += `${rolls[i]}<br>`;
	}
	return message;
}

//Roll Button
function rollButton() {
	let rollInfo = retrieveInfo();
	rollDice(rollInfo);
	let message = rollMessage(rollInfo);
	message += addTime();
	message = allRollsMessage(message);
	return message;
}

//Test Buttons
function testRolls() {
	let sum = 0;
	let list = [];
	let filtered = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
	for (let i = 0; i < 9999; i++) { 
		let num = d(20);
		sum += num;
		list.push(num);
		filtered[num-1].push(num);
	};
	return `Test results for 9,999 rolls<p>${mean(sum, 9999).toFixed(4)} mean<br>${median(list)} median<br>${mode(filtered)}</p>`;
}

//Return average of a sum of numbers
const mean = (sum, num) => (sum/num);

//Return middle of a list
const median = (list) => {
	list.sort((a, b) => a - b);
	const median = Math.ceil(list.length/2);
	return list[median];
}

function mode(filtered) {
	let mode;
	let frequency = 0;
	for (let i = 0; i < filtered.length; i++) {
		if (filtered[i].length > frequency) {
			mode = [i+1]; 
			frequency = filtered[i].length;
		} else if (filtered[i].length === frequency) {
			mode.push(i+1)
		}
	}
	let message = '';
	for (let i = 0; i < mode.length; i++) {
		message += `${mode[i]} `;
	}
	message += `mode, with a frequency of ${frequency}`;
	return message;
}

//Treasure	
let treasure;
let previousTreasure;

if (localStorage.treasure) {
	//Parse existing treasure or start a new set
	treasure = JSON.parse(localStorage.treasure);
} else {
	treasure = {
		coins: 0,
		items: []
	};
}

if (localStorage.previousTreasure) {
	//Parse existing treasure or start a new set
	previousTreasure = JSON.parse(localStorage.previousTreasure);
}

function addToStash() {
	//Retrieve and store inputs, add to localStorage, print
	if (treasureInputs.PP.value) {
		treasure.coins += parseInt(treasureInputs.PP.value)*1000;
	}
	if (treasureInputs.GP.value) {
		treasure.coins += parseInt(treasureInputs.GP.value)*100;
	}
	if (treasureInputs.EP.value) {
		treasure.coins += parseInt(treasureInputs.GP.value)*50;
	}
	if (treasureInputs.SP.value) {
		treasure.coins += parseInt(treasureInputs.SP.value)*10;
	}
	if (treasureInputs.CP.value) {
		treasure.coins += parseInt(treasureInputs.CP.value);
	}
	if (treasureInputs.items.value) {
		const itemString = treasureInputs.items.value;
		itemArray = itemString.split(", ");
		treasure.items = treasure.items.concat(itemArray);
	}
	storeTreasure();
	clearTreasureInputs();
	return showTreasure();
}

const storeTreasure = () => {
	//Store treasure in local storage
	if (typeof(Storage) !== "undefined") {
		localStorage.setItem("treasure", JSON.stringify(treasure));
		localStorage.setItem("previousTreasure", JSON.stringify(previousTreasure));
	} else {
		throw Error('Sorry! No Web Storage support');
	}
}

function showTreasure() {
	//Display party treasure
	let message = `${treasure.coins/100} gold pieces<br>`;
	for (let i = 0; i < treasure.items.length; i++) {
		if (i > 0) {
			message += ', ';
		}
		message += `${treasure.items[i]}`;
	};
	return message;
}

function divvyItUp() {
	//Divide up the party's treasure and reset values
	if (confirm('Are you sure you want to divvy up the gold?')) {
		let adventurers = prompt('How many adventurers?');
		while (isNaN(adventurers) || adventurers <= 0) {
			adventurers = prompt('Please enter a valid number of adventurers')
		}
		if (confirm(`You want to divide between ${adventurers} adventurers?`)) {
			const copperEach = ((treasure.coins)/adventurers);
			previousTreasure = `${(copperEach/100).toFixed(2)} gold each if divided evenly between ${adventurers}<br>Total Treasure: ${showTreasure()}`
			treasure = {
				coins: 0,
				items: []
			}
			storeTreasure();
			return previousTreasure;
		} else {
			return 'Are you keeping all that treasure for yourself, mate?';
		}
	}
}

//Show stored values for last round of treasure
const showPrevious = () => `This is what you added last time:<br>${previousTreasure}`;