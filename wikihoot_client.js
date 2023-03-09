/* eslint-disable no-console */
let server_url;
const current_url = window.location.href;
if(current_url.includes('file:') || current_url.includes('localhost'))
	server_url = 'http://localhost:3111';
else
	server_url = 'http://poco.la:3111';
// eslint-disable-next-line no-undef
const socket = io(server_url);

// if username doesn't exist in browser's memory, ask for it and store in the browser
let username = localStorage.getItem('username');
if (!username) {
	while(!username)
		username = prompt('How do you want to be called: ');
	localStorage.setItem('username', username);
}
// Send the username to the server when the user joins
socket.emit('join', username);

// Listen for the events
socket.on('game_start', (data) => {
	start_button.style.display = 'none';
	guesses_container.style.display = 'block';
	document.getElementById('players_container').style.backgroundColor = 'green';
	update_players(data.players);
	// update the article title
	document.querySelector('#article_container').innerHTML = data.article_title;
});
// Update users waiting in lobby
socket.on('player_list', (players) => {
	update_players(players);
});
// listen for the start button event. when pressed, send message 'start' to the server
const start_button = document.querySelector('#start_button');
start_button.onclick = () => {
	socket.emit('start');
};
// restart button. when pressed, restart the game
const restart_button = document.querySelector('#restart_button');
restart_button.onclick = () => {
	socket.emit('restart');
	// empty the textarea
	guesses_container.value = 'Type here...';
	// make the players_container background back to orange
	document.getElementById('players_container').style.backgroundColor = 'orange';
};

// timer
const timer = document.querySelector('#timer');
socket.on('timer', (time) => {
	timer.innerHTML = time;
	if(time === 0)
	{
		// send guesses to server
		const guesses = document.getElementById('guesses_container').value.split(/[\s]+/);
		socket.emit('user_guesses', guesses);
	}
});

// final score
socket.on('score', (words) => {
	console.log(words);
	const g = guesses_container;
	g.value = '';
	// calc total score of all guessed words
	const score = words.reduce((total_score, w) => total_score + w.total_count, 0);
	g.value+= 'Total score: ' + score + '\n';
	g.value+= '------------------------\n';
	words.forEach(w => {
		// {guess: word, total_count: count, variants: variants_count}
		g.value +=w.guess + ': ' + w.total_count + '\n';
		if(w.total_count)
		{
			g.value += ' (';
			w.variants.forEach((v, i) => {
				g.value += v.word + ': ' + v.count + ((i<w.variants.length-1) ? ', ' : '');
			});
			g.value += ')\n';
		}
	});
	g.value += '\n';
});

// instructions button
/* const instructionsButton = document.querySelector('#instructions_button');
const instructions = document.querySelector('#instructions');
instructionsButton.addEventListener('click', () => {
	if (instructions.style.display === 'none') {
		instructions.style.display = 'block';
	} else {
		instructions.style.display = 'none';
	}
});
*/

const guesses_container = document.querySelector('#guesses_container');
const players_container = document.querySelector('#players_container');

// helper functions
function update_players(players){
	players_container.innerHTML = '';
	players_container.style.display = 'block';
	for (let i = 0; i < players.length; i++) {
		const player = document.createElement('div');
		player.innerHTML = players[i].username;
		player.innerHTML += (players[i].score != null ? ' (' + players[i].score + ')' : '');
		players_container.appendChild(player);
	}
}
