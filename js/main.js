/* Author:

 */
$(document).ready(function() {
	init();
	$("#output-wrapper").hide();
	$("#dyslexiarizeme").click(function(event) {
		var level = $("#level").html();
		jumbledWords.clearCache();
		if(level === "<b>Mild</b>") {
			jumbledWords.severityFunction = mildMiddle;
		} else if(level === "<b>Medium</b>") {
			jumbledWords.severityFunction = mediumMiddle;
		} else {
			jumbledWords.severityFunction = severeMiddle;
		}
		var input = $("#dyslexicInput").val()
		var output = getNewText(input);
		$("#dyslexiarized").html(output);
		goToByScroll("output-wrapper");

	});

	$(function() {
		$("#slider").slider({
			value : 1,
			min : 1,
			max : 3,
			step : 1,
			slide : function(event, ui) {
				updateLevel(ui.value);
			}
		});
		updateLevel(1);
	});
})
function updateLevel(val) {
	var level = "";
	if(val == 1) {
		level = "Mild";
	} else if(val == 2) {
		level = "Medium";
	} else {
		level = "Severe";
	}
	$("#level").html("<b>" + level + "</b>");
}

var jumbledWords = {
	severityFunction : mildMiddle,
	cache : {},
	add : function(word, fn) {
		if(!this.cache[word]) {
			this.cache[word] = fn(word, this.severityFunction);
		}
		return this.cache[word];
	},
	clearCache : function() {
		this.cache = {};
	}
};

function goToByScroll(id) {
	$("#" + id).fadeIn("slow");
	$("body").animate({
		scrollTop : $("#" + id).offset().top
	}, 500, function() {
		$("#" + id).fadeIn('slow', function() {

		});
	})
}

function isVowel(s) {
	return (/^[aeiou]$/i).test(s);
}

function severeMiddle(middleWord) {
	var letters = middleWord.split("");
	return letters.sort(function() {
		return 0.5 - Math.random()
	}).join("");
}

function mediumMiddle(middleWord) {
	var newMiddle = [];
	var letterGroups = middleWord.match(/.{1,2}/g);
	for(var i = 0; i < letterGroups.length; i++) {
		newMiddle.push(severeMiddle(letterGroups[i]));
	}
	return newMiddle.join("");
}

function mildMiddle(middleWord) {
	var letters = middleWord.split("");
	var myVowels = middleWord.replace(/[^aeiou]{1}/gi, "").split("");
	var newMiddle = [];
	var myNewVowels = severeMiddle(myVowels.join("")).split("");

	for(var i = 0; i < letters.length; i++) {
		if(isVowel(letters[i])) {
			newMiddle.push(letters[i].toLowerCase() === letters[i] ? myVowels.pop().toLowerCase() : myVowels.pop().toUpperCase());
		} else {
			newMiddle.push(letters[i]);
		}
	}
	return newMiddle.join("");
}

function getNewWord(word, fnSeverity) {
	if(word.length <= 3)
		return word;
	var letters = word.split("");
	var firstLetter = letters.shift();
	var lastLetter = letters.pop();
	return firstLetter + fnSeverity(letters.join("")) + lastLetter;
}

function getNewSentence(original) {
	var originalWords = original.split(/[\s,\.\(\)\[\]\'\-\:\;\#\&\^\%\$\£\"\!\/\\\+\=]+/);
	var originalSeparators = original.replace(/[^\s,\.\(\)\[\]\'\-\:\;\#\&\^\%\$\£\"\!\/\\\+\=]{1,}/g, "~").split("~");
	originalSeparators.shift();
	var newWords = "";

	for(var i = 0; i < originalWords.length; i++) {
		newWords += jumbledWords.add(originalWords[i], getNewWord);
		newWords += original.length === newWords.length ? "" : originalSeparators.shift();
	}
	return newWords;
}

function getNewText(original) {
	var originalSentences = original.split(/\n/);
	var returnString = "";
	for(var i = 0; i < originalSentences.length; i++) {
		returnString += "<p>" + getNewSentence(originalSentences[i]) + "</p>";
	}
	return returnString;
}

var FALLINGLETTERS = 30;
function init() {
	var first = true;
	for(var i = 0; i < FALLINGLETTERS; i++) {
		document.body.appendChild(createAFallingLetter(first));
		first = false;
	}
}

function randomInteger(low, high) {
	return low + Math.floor(Math.random() * (high - low));
}

function randomFloat(low, high) {
	return low + Math.random() * (high - low);
}

function randomItem(items) {
	return items[randomInteger(0, items.length - 1)];
}

function durationValue(value) {
	return value + "s";
}

function createAFallingLetter(is_first) {
	var letters = "dyslexiarize.me".split("");
	var distances = ["really-far-away", "far-away", "normal", "close", "really-close"];

	/* Start by creating a wrapper div, and an empty span  */
	var fallingLetterElement = document.createElement('div');
	fallingLetterElement.className = 'falling-letter ' + randomItem(distances);

	var fallingLetter = document.createElement('span');
	fallingLetter.innerHTML = randomItem(letters);

	fallingLetterElement.appendChild(fallingLetter);

	/* Randomly choose a spin animation */
	var spinAnimationName = 'spin';

	/* Randomly choose a side to anchor to, keeps the middle more dense and fits liquid layout */
	var anchorSide = (Math.random() < 0.5) ? 'left' : 'right';

	/* Figure out a random duration for the fade and drop animations */
	var fadeAndDropDuration = durationValue(randomFloat(5, 11));

	/* Figure out another random duration for the spin animation */
	var spinDuration = durationValue(randomFloat(4, 8));

	// how long to wait before the flakes arrive
	var fallingLetterDelay = is_first ? 0 : durationValue(randomFloat(0, 10));

	fallingLetterElement.style.webkitAnimationName = 'fade, drop';
	fallingLetterElement.style.webkitAnimationDuration = fadeAndDropDuration + ', ' + fadeAndDropDuration;
	fallingLetterElement.style.webkitAnimationDelay = fallingLetterDelay;

	/* Position the snowflake at a random location along the screen, anchored to either the left or the right*/
	fallingLetterElement.style[anchorSide] = randomInteger(10, 60) + '%';

	fallingLetter.style.webkitAnimationName = spinAnimationName;
	fallingLetter.style.webkitAnimationDuration = spinDuration;

	/* Return this snowflake element so it can be added to the document */
	return fallingLetterElement;
}

