/* eslint-disable no-console */
const url = window.location.href;
const dom = (url.includes('file:') || url.includes('localhost')) ? 'localhost' : 'poco.la';
const server_url = 'http://'+dom+':3111';
// eslint-disable-next-line no-undef
const socket = io(server_url);

class Game {
	constructor() {
		// start UI
		// eslint-disable-next-line no-undef
		this.ui = new UI();
		this.ui.change_state('lobby');
		// get username and send to the server
		this.username = this.get_username();
		socket.emit('join', this.username);
		// Listen for communication events
		socket.on('game_start', (data) => this.game_start(data));
		// Listen for update of users waiting in lobby
		socket.on('player_list', (players) => this.ui.update_players(players));
		// listen for the start button event. when pressed, send message 'start' to the server
		const start_button = document.querySelector('#start_button');
		start_button.onclick = () => {
			socket.emit('start');
			this.ui.start_spinner_on_start_button(true);
		};
		// restart button. when pressed, restart the game
		const restart_button = document.querySelector('#restart_button');
		restart_button.onclick = () => {
			socket.emit('restart');
			this.ui.change_state('lobby');
		};
		// Language selection
		const select = document.getElementById('lang-select');
		select.addEventListener('change', () => socket.emit('language', this.value));
		socket.on('language', (lang) => select.value = lang);
		// Timer
		socket.on('timer', (time) => {
			this.ui.update_timer(time);
			if(time === 0)
				socket.emit('user_guesses', this.ui.get_guesses());
		});
		// Quit button
		document.getElementById('quit_button').onclick = () => {
			socket.emit('quit');
			this.ui.change_state('lobby');
		};
		// final results
		socket.on('results', (matrix) => {
			this.ui.change_state('results', matrix);
		});
	}
	game_start(data){
		this.ui.change_state('game', data.article_title);
		this.ui.update_players(data.players);
	}
	get_username() {
		// if username doesn't exist in browser's memory, ask for it and store in the browser
		let username = localStorage.getItem('username');
		if (!username) {
			while(!username)
				username = prompt('How do you want to be called: ');
			localStorage.setItem('username', username);
		}
		return username;
	}
}

new Game();
