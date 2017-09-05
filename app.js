//HTML elements
const h2 = document.querySelector('h2');
const fieldsets = document.querySelectorAll('fieldset');

const inputs = [{},{},{}];
for (let i = 0; i < fieldsets.length; i++) {
	inputs[i].actionElement = fieldsets[i].firstElementChild.nextElementSibling.nextElementSibling;
	inputs[i].numberOfDiceElement = inputs[i].actionElement.nextElementSibling.nextElementSibling.nextElementSibling;
	inputs[i].dieSidesElement = inputs[i].numberOfDiceElement.nextElementSibling.nextElementSibling.nextElementSibling;
}

//Store previous rolls
const rolls = [];

//Basic functions
const d = (d) => Math.floor(Math.random() * d ) + 1;
const print = (message) => h2.innerHTML = message;
const log = (message) => console.log(message);

function clearInputs() {
	for (let i = 1; i < 3; i++) {
		inputs[i].actionElement.value = '';
		inputs[i].numberOfDiceElement.value = '';
		inputs[i].dieSidesElement.value = '';
	}
	inputs[0].actionElement.focus();
}

//App functions
function retrieveInfo() {
	const rollInfo = [];
	for (let i = 0; i < inputs.length; i++) {
		if (inputs[i].actionElement.value === null) {
			throw Error('Please enter a description of your action');
		} else if (isNaN(inputs[i].numberOfDiceElement.value) || isNaN(inputs[i].dieSidesElement.value)) {
			throw Error('Please enter numbers for both number of dice and dice sides');
		} else if (inputs[i].actionElement.value && inputs[i].numberOfDiceElement.value && inputs[i].dieSidesElement.value) {
			rollInfo[i] = {
				action: inputs[i].actionElement.value,
				numberOfDice: inputs[i].numberOfDiceElement.value,
				dieSides: inputs[i].dieSidesElement.value
			}
		} else {
			break;
		}
	}
	clearInputs();
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
	print(message);
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
	return `Test results for 9,999 rolls<p>${mean(sum)}<br>${median(list)}<br>${mode(filtered)}</p>`;
}

function mean(sum) { return `${(sum/9999).toFixed(4)} mean`; };

function median(list) {
	list.sort(function(a, b) { return a - b; });
	return `${list[5000]} median`;
}

function mode(filtered) {
	let mode;
	let frequency = 0;
	for (let i = 0; i < 20; i++) {
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