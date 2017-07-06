function rollDice() {
	const stats = [0, 0, 0, 0, 0, 0]; //Store final numbers here
	const rolls = []; //Store rolls here

	for (let j = 0; j < 6; j++) {
		let stat = [];
		for (let i = 0; i < 3; i++) {
			let roll = Math.floor(Math.random() * 6 ) + 1;
			stat.push(roll);
			stats[j] += roll;
		};
		rolls.push(stat);
	};

	console.log(rolls);
	console.log(stats);
}