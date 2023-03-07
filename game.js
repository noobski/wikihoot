/* eslint-disable no-useless-escape */
/* eslint-disable no-magic-numbers */
/* eslint-disable no-console */
// 9:15am
/* WIKIHOOT */
/* participants sign up with their phones, and see a wiki article title, and all have 20 seconds to guess as many popular terms
   as they can. after 20 seconds they get scored by the occurances of their terms */

const language = 'en'; // can be 'he'

const fs = require('fs');
const titles = fs.readFileSync('./article_titles.txt', 'utf-8').split('\r');
// const titles = ['Shekel'];

const function_words = ['a', 'is', 'an', 'the', 'and', 'or', 'but', 'for', 'nor', 'so', 'yet', 'to', 'of', 'in', 'on', 'at', 'by', 'with', 'from', 'up', 'about', 'over', 'above', 'below', 'under', 'out', 'off', 'down', 'before', 'after', 'since', 'during', 'although', 'despite', 'instead', 'however', 'nevertheless', 'furthermore', 'moreover', 'otherwise', 'accordingly', 'consequently', 'hence', 'meanwhile', 'similarly', 'therefore', 'thus', 'as', 'if', 'unless', 'because', 'since', 'that', 'when', 'where', 'while', 'who', 'whom', 'whose', 'what', 'which', 'how', 'why', 'whether', 'whoever', 'whatever', 'whenever', 'wherever', 'however', 'whichever', 'whomever'];
const auxiliary_verbs = ['be', 'have', 'do', 'will', 'shall', 'would', 'should', 'can', 'could', 'may', 'might', 'must'];
const stop_words = ['also', 'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now'];
const misc_words = ['amp', 'oclc', 'original', 'pp', 'ad', 'retrieved', 'doi', 'pmid', 'scid', '.pdf', '.png', 'many', 'isbn', 'archived', 'b', 'bc', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'hlist', 'em', 'th', 'nd', 'rd', 'st', 'nbs', 'nb'];

const game = {
/*
	// HTML elements
	term_e: document.getElementById('term'),
	guess_input_e: document.getElementById('guess'),
	submit_button_e: document.getElementById('submit'),
	timer_e: document.getElementById('timer'),
	score_e: document.getElementById('score'),
	play_again_button_e: document.getElementById('play-again'),
	view_article_e: document.getElementById('view-article'),
*/
	// config
	turns_per_player: 3,
	// variables
	words: []
};

select_and_fetch_article();
function select_and_fetch_article() {
	// get a random word from the dictionary
	select_title();
	// get the wikipedia article for that word
	fetch_article(start_game);
}
function start_game() {
	clean_up_article_text();
	create_word_list();
	clean_up_word_list();
	count_and_sort_words();
	// if not enough words (maybe a bad article) then start again
	if(game.words.length < 10) 
	{
		select_and_fetch_article();
		return;
	}
	// start user interaction here
	show_top_terms(0);
	// show the article itself
	// show_article();
}
function show_top_terms(num){
	const top_terms = game.words.slice(0, num);
	console.table(top_terms);
	const top_terms_word_count = top_terms.reduce((a, b) => a + b.count, 0);
	console.log('Top 10 terms together have '+top_terms_word_count
	+ ' occurrences. out of a total of ' + game.total_words + ' total words = '
	+ Math.round(top_terms_word_count / game.total_words * 100) + '%');
}
/* open a new window with the game.url showing in it
function show_article(){
	const url = 'https://'+language+'.wikipedia.org/wiki/' + game.article_title;
	window.open(url, '_blank');
}
*/
function select_title(){
	game.article_title = titles[Math.floor(Math.random() * titles.length)];
}
function fetch_article(cb) {
	// fetch the wikipedia article of the word provided
	console.log('fetching article for '+game.article_title+'...');
	game.url = 'https://'+language+'.wikipedia.org/w/api.php?action=parse&page='+game.article_title+'&format=json';
	fetch(game.url)
		.then(response => response.json())
		.then(json => {
			game.article_text = json.parse.text['*'];
			const cheerio = require('cheerio');
			const $ = cheerio.load(game.article_text);
			// extract the contents of <p> tags
			game.article_text = $('p').map((i, el) => $(el).text()).get();
			game.article_text = game.article_text.join(' ');
			cb();
		});
}
/*
function enable_disable_buttons(enable){
	[game.guess_input_e, game.submit_button_e, game.play_again_button_e,
		game.view_article_e].forEach(e => e.disabled = !enable);
}
*/
function clean_word(word) {
	return word.replace(/[^a-zA-Z]/g, '').toLowerCase();
}
function clean_up_article_text() {
	let txt = game.article_text;
	// remove all references from text
	txt = txt.replace(/<ref[^>]*>.*?<\/ref>/gm, '');
	// remove html tags from text
	txt = txt.replace(/<[^>]*>?/gm, '');
	// remove all punctuation from the article
	txt = txt.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
	// remove items surrounded by brackets (e.g. '[4]')
	const regex = /\[[^\]]*\]/g;
	txt = txt.replace(regex, '');
	game.article_text = txt;
}
function create_word_list(){
	const words = [];
	/* words: [{word: 'apple', count: 3},
			   {word: 'car', count: 1},
			   ...]
	*/
	// split text in to words and count them
	game.article_text.split(/\s+/).forEach(word => {
		const clean = clean_word(word); // lowercase and remove punctuation
		if (clean !== '') {
			const found_word = words.find(w => w.word == clean);
			if(!found_word)
				words.push({word: clean, count: 1});
			else
				found_word.count++;
		}
	});
	game.words = words;
}
function clean_up_word_list(){
	const title_words = game.article_title.split(/\s+/);
	// remove all versions of the articles title from the article
	title_words.forEach(title_word =>
		game.words = game.words.filter(word_struct => !word_struct.word.includes(clean_word(title_word))));
	// remove all 'conjecture' words from the article's text
	const useless_words = [...function_words, ...auxiliary_verbs, ...stop_words, ...misc_words];
	game.words = game.words.filter(word_struct => !useless_words.includes(word_struct.word));
}
function count_and_sort_words(){
	// count the total number of words
	game.total_words = game.words.reduce((total_words, word) => total_words + word.count, 0);
	// sort the words by count
	game.words.sort((a, b) => b.count - a.count);
}
