//Create variables
const previousRolls = [];


//General Purpose Functions
//Dice function
function d (sides) { return Math.floor(Math.random() * sides ) + 1; };

//Add time stamp
function addTime (message) {
	let date = new Date();
	return ` - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}


//Roll Information business logic
//Execute roll functions
function rollButton () {
	try {
		let rollInfo = retrieveRollInfo(); //Assign user input to rollInfo
		rollInfo = rollDice(rollInfo);
		rollInfo = rollMessage(rollInfo);
		rollInfo += addTime();
		rollInfo = allRollsMessage(rollInfo);
		return rollInfo;
	} catch (err) {
		return handler(err);
	} finally {
		clearRollInputs();
	}
}

//Gather input from user
function retrieveRollInfo () {
	const rollInfo = [];
	for (let i = 0; i < rollInputs.length; i++) {
		if (rollInputs[i].dieSidesElement.value && rollInputs[i].numberOfDiceElement.value) {
			if (isNaN(rollInputs[i].dieSidesElement.value) || rollInputs[i].dieSidesElement.value < 1) {
				const err = new Error("'Number of sides' needs to be a valid number");
				throw err;
			} else if (isNaN(rollInputs[i].numberOfDiceElement.value) || rollInputs[i].numberOfDiceElement.value < 1) {
				const err = new Error("'Number of dice' needs to be a valid number");
				throw err;
			} else if (rollInputs[i].dieSidesElement.value && rollInputs[i].numberOfDiceElement.value) {
				rollInfo[i] = {
					action: rollInputs[i].actionElement.value,
					numberOfDice: rollInputs[i].numberOfDiceElement.value,
					dieSides: rollInputs[i].dieSidesElement.value,
					rolls: [],
					message: ''
				}
			}
		}
	}
	return rollInfo;
}

//Generate rolls based on user input
function rollDice (rollInfo) {
	for (let i = 0; i < rollInfo.length; i++) {
		for (let j = 0; j < rollInfo[i].numberOfDice; j++) {
			rollInfo[i].rolls.push(d(rollInfo[i].dieSides));
		}
	}
	return rollInfo;
}

//Convert rolls into readable message
function rollMessage (rollInfo) {
	let description = '(';
	let total = 0;
	let theRolls = ' total (';
	for (let j = 0; j < rollInfo.length; j++) {
		if (rollInfo[j].action) {
			description += `${rollInfo[j].action} `;
		}
		description += `${rollInfo[j].numberOfDice}d${rollInfo[j].dieSides}`;
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

//Create an array and use it to store roll messages
function allRollsMessage (newRoll) {
	previousRolls.unshift(newRoll);
	if (previousRolls.length > 5) {
		previousRolls.pop();
	}
	message = '<ol>';
	for (let i = 0; i < previousRolls.length; i++) {
		message += `<li>${previousRolls[i]}</li>`;
	}
	message += '</ol>';
	return message;
}


//Party Treasure
//Create variables
let treasure;
let previousTreasure;

//Retrieve data from localStorage
if (localStorage.treasure) {
	treasure = JSON.parse(localStorage.treasure);
} else {
	treasure = {
		coins: 0,
		items: []
	};
}

if (localStorage.previousTreasure) {
	previousTreasure = JSON.parse(localStorage.previousTreasure);
}

//Retrieve and store inputs, add to localStorage, print
function addToStash () {
	try {
		const inputs = [];
		if (treasureInputs.PP.value) { inputs.push(retrieve('PP', 1000)); };
		if (treasureInputs.GP.value) { inputs.push(retrieve('GP', 100)); };
		if (treasureInputs.EP.value) { inputs.push(retrieve('EP', 50)); };
		if (treasureInputs.SP.value) { inputs.push(retrieve('SP', 10)); };
		if (treasureInputs.CP.value) { inputs.push(retrieve('CP', 1)); };
		if (treasureInputs.items.value) {
			const itemString = treasureInputs.items.value;
			itemArray = itemString.split(", ");
			treasure.items = treasure.items.concat(itemArray);
		}
		if (inputs.length) { treasure.coins += inputs.reduce((acc, cur) => acc + cur); };
		storeTreasure();
		clearTreasureInputs();
		rollInputs[0].actionElement.focus();
		return showTreasure();
	} catch (err) { return handler(err); }
}

//Retrieve values from each 
function retrieve (coin, val) {
	let coins = parseInt(treasureInputs[coin].value);
	if (isNaN(coins)) {
		treasureInputs[coin].value = '';
		treasureInputs[coin].focus();
		const err = new Error('Coins must be entered in as valid numbers. Please fill with proper values and try again.');
		throw err;
	} else { return coins*val; }
}

//Store treasure in local storage
function storeTreasure () {
	try {
		if (typeof(Storage) !== "undefined") {
			localStorage.setItem("treasure", JSON.stringify(treasure));
			localStorage.setItem("previousTreasure", JSON.stringify(previousTreasure));
		} else {
			const err = new Error('Sorry! No Web Storage support');
			err.status = 500;
			throw err;
		}
	} catch (err) { return handler(err); }
}

//Display party treasure
function showTreasure () {
	let message = `<b>${treasure.coins/100} gold pieces</b><br>`;
	for (let i = 0; i < treasure.items.length; i++) {
		if (i > 0) {
			message += ', ';
		}
		message += `${treasure.items[i]}`;
	};
	return message;
}

//Divide party treasure
function divvyItUp () {
	if (confirm('Are you sure you want to divvy up the gold?')) {
		let adventurers = prompt('How many adventurers?');
		while (isNaN(adventurers) || adventurers <= 0) {
			adventurers = prompt('Please enter a valid number of adventurers');
		}
		if (confirm(`You want to divide between ${adventurers} adventurers?`)) {
			const copperEach = ((treasure.coins)/adventurers);
			previousTreasure = `<b>${(copperEach/100).toFixed(2)} gold each</b> if divided evenly between ${adventurers}<li>Total Treasure: ${showTreasure()}</li>`
			treasure = {
				coins: 0,
				items: []
			}
			storeTreasure();
			rollInputs[0].actionElement.focus();
			return previousTreasure;
		} else {
			return 'Are you keeping all that treasure for yourself, mate?';
		}
	}
}

//Show stored values for last round of treasure
const showPrevious = () => `<b>This is what you added last time:</b><li>${previousTreasure}</li>`;


//Test Button
//Execute test functions
function testRolls () {
	let sum = 0;
	let list = [];
	let filtered = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
	for (let i = 0; i < 9999; i++) { 
		let num = d(20);
		sum += num;
		list.push(num);
		filtered[num-1].push(num);
	};
	return `<b>Test results for 9,999 rolls</b><br><ul><li>${mean(sum, 9999).toFixed(4)} mean</li><li>${median(list)} median</li><li>${mode(filtered)}</li>`;
}

function mean (sum, length) { return (sum/length); };

function median (list) {
	list.sort((a, b) => a - b);
	const median = Math.ceil(list.length/2);
	return list[median];
}

function mode (filtered) {
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

//Error handler
function handler (err) {
	console.log(err);
	let message = `${err.message}<br>`;
	if (err.status) { message += `Status: ${err.status}` };
	return message;
}