//Create a program that takes inputs (action, die sides, number of dice), converts those into rolls, and returns the values above previous rolls

//HTML
const h2 = document.querySelector('h2');
const actionEl = document.getElementById('action');
const numberOfDiceEl = document.getElementById('number');
const dieSidesEl = document.getElementById('sides');


const rolls = [];
//Create array for rolls
	//Add new message to array (unshift?)
	//if array.length > 5
		//remove from end
	//Print to h2
		//h2.innerHTML = `${message}<br>`

//Functions
const d = (d) => Math.floor(Math.random() * d ) + 1;
const time = () => {
	let date = new Date();
	return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}
function print() {
	if (rolls.length > 5) {
		rolls.pop();
	}
	h2.innerHTML = '';
	for (let i = 0; i < rolls.length; i++) {
		h2.innerHTML += `${rolls[i]}<br>`;
	}
}

//Roll
document.querySelector('form').onsubmit = function(e) {
	e.preventDefault();
	let action = actionEl.value;
	let numberOfDice = numberOfDiceEl.value;
	let dieSides = dieSidesEl.value;
	let sum = 0;
	let message = `${action} (${numberOfDice}d${dieSides}): `
	let message2 = ' ';
	for (let i = 0; i < numberOfDice; i++) {
		let roll = d(dieSides);
		message2 += `${roll} `;
		sum += roll;
	}
	message += `${sum} total (${message2}) - ${time()}`;
	rolls.unshift(message);
	print();
	console.log(message);
}

	//Create dice function
		/* 
		let final = 0
		let message = '<action> (<diceNumber>d<dieSides>): '
		for (diceNumber iterations) {
			let roll = rollDice(dieSides)
			message += '<roll> '
			sum += roll
		}
		message += <sum> <getTime>
		*/
	//Inputs
		//Enter action
			//Add form
			//Enter value into return
		//Enter any sided die
			//Add form
			//Use value in die function
		//Enter any number of dice
			//Add form
			//Use value in for loop
	//Take values from above and return rolls
		//e.g. Damage roll (4d6): 1 3 5 3 = <sum> <time>



// const buttons = document.querySelectorAll('button');

// let roll;

/* for (let i = 0; i < buttons.length; i++) {
	buttons[i].addEventListener('click', (e) => {
		let num = e.target.textContent;
		let date = new Date();
		let roll = `${d(num)} - 	${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
		console.log(roll);
		h2.textContent = roll;
	});
}; */