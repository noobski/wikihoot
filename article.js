/* eslint-disable no-useless-escape */
/* eslint-disable no-magic-numbers */
/* eslint-disable no-console */
/* global require */
// eslint-disable-next-line no-unused-vars
class Article {
	constructor(language='en'){
		this.language = language;
		// load articles list for this language
		const fs = require('fs');
		const filename = './'+this.language+'_article_titles.txt';
		this.titles = fs.readFileSync(filename, 'utf-8').split('\r');
		// create array of words to remove from articles
		const function_words = ['a', 'is', 'an', 'the', 'and', 'or', 'but', 'for', 'nor', 'so', 'yet', 'to', 'of', 'in', 'on', 'at', 'by', 'with', 'from', 'up', 'about', 'over', 'above', 'below', 'under', 'out', 'off', 'down', 'before', 'after', 'since', 'during', 'although', 'despite', 'instead', 'however', 'nevertheless', 'furthermore', 'moreover', 'otherwise', 'accordingly', 'consequently', 'hence', 'meanwhile', 'similarly', 'therefore', 'thus', 'as', 'if', 'unless', 'because', 'since', 'that', 'when', 'where', 'while', 'who', 'whom', 'whose', 'what', 'which', 'how', 'why', 'whether', 'whoever', 'whatever', 'whenever', 'wherever', 'however', 'whichever', 'whomever'];
		const auxiliary_verbs = ['be', 'have', 'do', 'will', 'shall', 'would', 'should', 'can', 'could', 'may', 'might', 'must'];
		const stop_words = ['also', 'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now'];
		const misc_words = ['amp', 'oclc', 'original', 'pp', 'ad', 'retrieved', 'doi', 'pmid', 'scid', '.pdf', '.png', 'many', 'isbn', 'archived', 'b', 'bc', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'hlist', 'em', 'th', 'nd', 'rd', 'st', 'nbs', 'nb'];
		this.useless_words = [...function_words, ...auxiliary_verbs, ...stop_words, ...misc_words];
		// fetch the article
		this.select_and_fetch_article();
	}
	select_and_fetch_article() {
		this.article_title = this.select_title();
		this.fetch_article(() => this.start_game);
	}
	start_game() {
		this.clean_up_article_text();
		this.create_word_list();
		this.clean_up_word_list();
		this.count_and_sort_words();
		// if not enough words (maybe a bad article) then start again
		if(this.words.length < 10)
		{
			this.select_and_fetch_article();
			return;
		}
		// start user interaction here
		this.show_top_terms(10);
		// show the article itself
		// show_article();
	}
	select_title(){
		return this.titles[Math.floor(Math.random() * this.titles.length)];
	}
	fetch_article(cb) {
		console.log('fetching article for '+this.article_title+'...');
		this.url = 'https://'+this.language+'.wikipedia.org/w/api.php?action=parse&page='+this.article_title+'&format=json';
		fetch(this.url)
			.then(response => response.json())
			.then(json => {
				let txt = json.parse.text['*'];
				const cheerio = require('cheerio');
				const $ = cheerio.load(txt);
				// extract the contents of <p> tags
				txt = $('p').map((i, el) => $(el).text()).get();
				txt = txt.join(' ');
				this.article_text = txt;
				cb();
			});
	}
	clean_word(word) {
		return word.replace(/[^a-zA-Z]/g, '').toLowerCase();
	}
	clean_up_article_text() {
		let txt = this.article_text;
		// remove all references from text
		txt = txt.replace(/<ref[^>]*>.*?<\/ref>/gm, '');
		// remove html tags from text
		txt = txt.replace(/<[^>]*>?/gm, '');
		// remove all punctuation from the article
		txt = txt.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
		// remove items surrounded by brackets (e.g. '[4]')
		const regex = /\[[^\]]*\]/g;
		txt = txt.replace(regex, '');
		this.article_text = txt;
	}
	create_word_list(){
		const words = [];
		/* words: [{word: 'apple', count: 3},
				{word: 'car', count: 1},
				...]
		*/
		// split text in to words and count them
		this.article_text.split(/\s+/).forEach(word => {
			const clean = this.clean_word(word); // remove punctuation and lowercase
			if (clean !== '') {
				const found_word = words.find(w => w.word == clean);
				if(!found_word)
					words.push({word: clean, count: 1});
				else
					found_word.count++;
			}
		});
		this.words = words;
	}
	clean_up_word_list(){
		const title_words = this.article_title.split(/\s+/);
		// remove all word variants of the article's title words from the article
		title_words.forEach(title_word =>{
			const clean_word = this.clean_word(title_word);
			this.words = this.words.filter(word_obj => !word_obj.word.includes(clean_word));
		});
		// remove all 'conjecture' words from the article's text
		this.words = this.words.filter(word_obj => !this.useless_words.includes(word_obj.word));
	}
	count_and_sort_words(){
		// count the total number of words
		this.total_words = this.words.reduce((total_words, word) => total_words + word.count, 0);
		// sort the words by count
		this.words.sort((a, b) => b.count - a.count);
	}
	show_top_terms(num){
		const top_terms = this.words.slice(0, num);
		console.table(top_terms);
		const top_terms_word_count = top_terms.reduce((a, b) => a + b.count, 0);
		console.log('Top '+num+' terms together have '+top_terms_word_count
			+ ' occurrences. out of a total of ' + this.total_words + ' total words = '
			+ Math.round(top_terms_word_count / this.total_words * 100) + '%');
	}
}
