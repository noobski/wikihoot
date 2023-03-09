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
