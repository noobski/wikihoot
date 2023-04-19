/* eslint-disable no-magic-numbers */
// eslint-disable-next-line no-unused-vars
class UI {
	constructor() {
		// get containers
		this.buttons_c = {start: document.getElementById('start_button'),
			quit: document.getElementById('quit_button'),
			restart: document.getElementById('restart_button')};
		this.game_c = document.getElementById('game_container');
		this.guesses_c = document.getElementById('guesses_container');
		this.players_c = document.getElementById('players_container');
		this.article_c = document.getElementById('article_container');
		this.results_c = document.getElementById('results_container');
		this.timer_c = document.getElementById('timer_container');
		this.header_c = document.getElementById('header');
		// start in mode 'lobby'
		this.change_state('lobby');
	}
	// state: lobby, game, results
	change_state(new_state, data) {
		const buttons_c = this.buttons_c;
		const game_c = this.game_c;
		const players_c = this.players_c;
		const results_c = this.results_c;
		const article_c = this.article_c;
		const guesses_c = this.guesses_c;
		if(new_state === 'lobby'){
			// show only 'start' button
			buttons_c.start.style.display = 'block';
			buttons_c.quit.style.display = 'none';
			buttons_c.restart.style.display = 'none';
			// show only 'players' area
			game_c.style.display = 'none';
			players_c.classList.add('players_container_normal');
			results_c.style.display = 'none';
			// article header
			this.header_c.className = 'normal_header';
			article_c.innerHTML = 'Repedia';
		}
		else if(new_state === 'game'){
			// stop spinner on start button
			this.start_spinner_on_start_button(false);
			// empty the textarea
			guesses_c.value = '';
			guesses_c.placeholder='Type here...';
			// show only 'quit' button & 'guesses' area
			buttons_c.start.style.display = 'none';
			buttons_c.quit.style.display = 'block';
			buttons_c.restart.style.display = 'none';
			// show only 'game' area
			game_c.style.display = 'block';
			players_c.classList.add('players_container_normal');
			// article header
			this.header_c.className = 'inverted_header';
			article_c.innerHTML = data;
		}
		else if(new_state === 'results'){
			// show only 'restart' button
			buttons_c.start.style.display = 'none';
			buttons_c.quit.style.display = 'none';
			buttons_c.restart.style.display = 'block';
			// show only 'results' area
			game_c.style.display = 'none';
			players_c.classList.add('players_container_score');
			results_c.style.display = 'block';
			// create matrix of results
			this.show_results(data);
		}
		else{
			throw new Error('Invalid state!');
		}
		this.state = new_state;
	}
	cap(word){
		const cap = word.charAt(0).toUpperCase() + word.slice(1);
		return cap;
	}
	show_results(data){
		const matrix = data;
		// empty results area
		this.results_c.innerHTML = '';
		// put the matrix in to a table, and append that table to g
		const table = document.createElement('table');
		for (let i = 0; i < matrix.length; i++) {
			const row = document.createElement('tr');
			const keys = Object.keys(matrix[i]);
			for (let j = 0; j < keys.length; j++) {
				const cell = document.createElement('td');
				if(j==0)
					cell.innerHTML = (i<5 ? '#'+(i+1)+': ' : '') + '<b>'
						+this.cap(matrix[i][keys[j]]) + '</b>';
				else
					cell.innerHTML = matrix[i][keys[j]];
				row.appendChild(cell);
			}
			table.appendChild(row);
		}
		this.results_c.appendChild(table);
	}
	get_guesses(){
		return this.guesses_c.value.split(/[\s]+/);
	}
	update_timer(time){
		this.timer_c.innerHTML = time;
	}
	// called from client every time server provides new list of players
	update_players(players){
		this.players_c.innerHTML = '';
		for (let i = 0; i < players.length; i++) {
			const player = document.createElement('div');
			player.innerHTML = players[i].username;
			player.innerHTML += (players[i].score != null ? ' - ' + players[i].score : '');
			this.players_c.appendChild(player);
		}
	}
	start_spinner_on_start_button(start=true){
		this.spinner_on_start_button = start;
		this.loop_spinner();
	}
	loop_spinner(){
		const b = this.buttons_c.start;
		if(!this.spinner_on_start_button)
		{
			b.innerHTML = 'Start';
			b.style.backgroundColor = '#5D8CAE'; // todo: change to spinner class color
			return;
		}
		b.style.backgroundColor = 'grey';
		const title = b.innerHTML;
		// length of title is 5 when it is 'Start', and another 2 for each '.' on either side
		if(title.length<15)
			b.innerHTML = '.' + title + '.';
		else
			b.innerHTML = 'Start';
		setTimeout(() => this.loop_spinner(), 300);
	}
}
