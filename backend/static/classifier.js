
"use strict";
function analyzeClicked() {
	const textToAnalyze = inputarea.value;
	analyzeText(textToAnalyze);
}

async function analyzeText(text) {
	// Get the emotional ratings from the sever
	const response = await fetch('/evaluate_text/' + text);

	if (response.ok) {
		const json = await response.json();
		visualizeInHTML(json);
	} else {
		appendToResult("HTTP-Error" + response.status);
	}
}

async function analyzeWord(word) {
	// Get the emotional ratings from the sever
	await fetch('/evaluate/' + word)
		.then(function(response) {
			return response.text();
		})
		.then(function(text) {
			// format HTML according to the emotional ratings and append it to the result div.
			appendToResult(text + "<br>");
		});
}

function visualizeInHTML(json) {
	const t = JSON.stringify(json);

	json.forEach(function(item, index) {

		const valence = interpretValence(item);
		const arousal = Math.abs(interpretArousal(item)); // positive and negative arousal values have the same effect
		let valenceClass,
			arousalClass;

		if (valence <= -0.75) {
			valenceClass = -3;
		} else if (valence <= -0.5) {
			valenceClass = -2;
		} else if (valence <= -0.25) {
			valenceClass = -1;
		} else if (valence <= 0.25) {
			valenceClass = 0;
		} else if (valence <= 0.5) {
			valenceClass = 1;
		} else if (valence <= 0.75) {
			valenceClass = 2;
		} else if (valence <= 1) {
			valenceClass = 3;
		} else {
			valenceClass = 0;
		}

		if (arousal <= 0.25) {
			arousalClass = 0;
		} else if (arousal <= 0.5) {
			arousalClass = 1;
		} else if (arousal <= 0.75) {
			arousalClass = 2;
		} else if (arousal <= 1) {
			arousalClass = 3;
		} else {
			arousalClass = 0;
		}

		const span_class1 = "v" + valenceClass;
		const span_class2 = "a" + arousalClass;
		const tooltip = constructTooltip(item);
		appendToResult(item.original_text, span_class1, span_class2, tooltip);
	});
	debugparagraph.append(t);
}

// returns an integer that can have positive or negative values.
function interpretValence(item) {
	if ('direct_valence' in item) {
		// when there is a direct rating, it is used as reported in the source.
		return Math.round(item.direct_valence)
	} else if ('parsebank_nearest_valence' in item) {
		// When there is no direct emotion rating, the result is multiplied by the strength of association to make it milder because it is less certain.
		return Math.round(item.parsebank_nearest_distance * item.parsebank_nearest_valence);
	}
}

// returns an integer that can have positive or negative values.
function interpretArousal(item) {
	if ('direct_arousal' in item) {
		// when there is a direct rating, it is used as reported in the source.
		return Math.round(item.direct_arousal)
	} else if ('parsebank_nearest_arousal' in item) {
		// When there is no direct emotion rating, the result is multiplied by the strenght of association to make it milder because it is less certain.
		return Math.round(item.parsebank_nearest_distance * item.parsebank_nearest_arousal);
	}
}

function constructTooltip(item) {
	let tooltip = "";
	if ('baseform' in item) {
		tooltip = tooltip + "baseform: " + item.baseform + "\x0A";
	}
	if ('direct_valence' in item) {
		tooltip = tooltip + "direct valence: " + item.direct_valence + "\x0A";
	}
	if ('direct_arousal' in item) {
		tooltip = tooltip + "direct arousal: " + item.direct_arousal + "\x0A";
	}
	if ('direct_dominance' in item) {
		tooltip = tooltip + "direct dominance: " + item.direct_dominance + "\x0A";
	}
	if ('parsebank_nearest' in item) {
		tooltip = tooltip + "parsebank nearest: " + item.parsebank_nearest + "\x0A";
	}
	if ('parsebank_nearest_distance' in item) {
		tooltip = tooltip + "parsebank nearest distance: " + item.parsebank_nearest_distance + "\x0A";
	}
	if ('parsebank_nearest_valence' in item) {
		tooltip = tooltip + "parsebank nearest valence: " + item.parsebank_nearest_valence + "\x0A";
	}
	if ('parsebank_nearest_arousal' in item) {
		tooltip = tooltip + "parsebank nearest arousal: " + item.parsebank_nearest_arousal + "\x0A";
	}
	if ('parsebank_nearest_dominance' in item) {
		tooltip = tooltip + "parsebank nearest dominance: " + item.parsebank_nearest_dominance + "\x0A";
	}
	return tooltip;
}

function appendToResult(text, span_class1, span_class2, tooltip) {
	const newSpan = document.createElement('span');
	newSpan.classList.add(span_class1)
	newSpan.classList.add(span_class2)
	newSpan.title = tooltip
	newSpan.innerHTML = text;

	const outputParagraph = document.getElementById('outputparagraph');
	outputParagraph.append(newSpan);
}

function clearOutput() {
	document.getElementById('outputparagraph').innerHTML = "";
	document.getElementById('debugparagraph').innerHTML = "";
}
