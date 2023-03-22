const textarea = document.getElementById('textarea');
const timer = document.getElementById('timer');
let countdown = 60; // in seconds

function updateTimer() {
	if (countdown >= 0) {
		timer.innerHTML = `Time remaining: ${countdown}s`;
		countdown--;
		setTimeout(updateTimer, 1000);
	} else {
		timer.innerHTML = 'Time\'s up!';
		textarea.setAttribute('disabled', true); // disable textarea when time is up
	}
}

updateTimer();

// get a string, and return it backwards
function reverseString(str) {
	return str.split('').reverse().join('');
}

// get a string, and return it with the first letter of each word capitalized
function capitalizeFirstLetter(str) {
	return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// fetch an article from wikipedia that starts with an 'a', and count how many words it has
fetch('https://en.wikipedia.org/w/api.php?action=query&list=random&rnnamespace=0&rnlimit=1&format=json')
	.then(response => response.json())
	.then(json => {
		const article_title = json.query.random[0].title;
		fetch(`https://en.wikipedia.org/w/api.php?action=parse&page=${article_title}&format=json`)
			.then(response => response.json())
			.then(json => {
				const article_text = json.parse.text['*'];
				const $ = cheerio.load(article_text);
				// extract the contents of <p> tags
				const txt = $('p').map((i, el) => $(el).text()).get().join(' ');
				const words = txt.split(' ').length;
				document.getElementById('article_title').innerHTML = article_title;
				document.getElementById('article_text').innerHTML = capitalizeFirstLetter(txt);
				document.getElementById('article_words').innerHTML = words;
			});
	});
