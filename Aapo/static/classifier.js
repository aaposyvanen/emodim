"use strict";
async function analyzeWord(word){
console.log(word);

// Get the emotional ratings from the sever
await fetch('/evaluate/'+word)
.then(function(response){
	return response.text();
})
.then(function(text){
// format HTML according to the emotional ratings and append it to the result div.
appendToResult(text+"<br>");	
});	
}


async function analyzeText(text){
console.log(text);
// Get the emotional ratings from the sever
let response = await fetch('/evaluate_text/'+text);

if (response.ok){
	let json= await response.json();
	console.log(json);
	visualizeInHTML(json);
} else{
	appendToResult("HTTP-Error"+ response.status);	
}	
}

function analyzeClicked(){
	let textToAnalyze=inputarea.value;
//	let words=textToAnalyze.split(/[.,!?\s]/);
	analyzeText(textToAnalyze);
//	var i;
//	for (i=0;i<words.length;++i){
//		if(words[i].length>2){
//			analyzeWord(words[i]);
//		}
//	}
//	words.forEach(word => analyzeWord(word));
//	console.log(words);
//	appendToResult(textToAnalyze);
}


function appendToResult(text, span_class1, span_class2, tooltip){
	let newSpan=document.createElement('span');
	newSpan.classList.add(span_class1)
	newSpan.classList.add(span_class2)
	newSpan.title=tooltip
	newSpan.innerHTML=text;
	outputparagraph.append(newSpan);
	console.log(text);
}

function visualizeInHTML(json) {
	let t = JSON.stringify(json);
	json.forEach(function(item, index) {

		const valence = interpretValence(item);
		const arousal = Math.abs(interpretArousal(item)); // positive and negative arousal values have the same effect
		let valenceClass,
			arousalClass;

		switch (valence) {
			case (valence <= -0.67):
				valenceClass = -3
			case (valence <= -0.33):
				valenceClass = -2
			case (valence <= 0):
				valenceClass = -1
			case (valence <= 0.33):
				valenceClass = 0
			case (valence <= 0.67):
				valenceClass = 2
			case (valence <= 1):
				valenceClass = 3
			default:
				valenceClass = 0;
		}

		switch (arousal) {
			case (arousal <= 0.33):
				arousalClass = 0
			case (arousal <= 0.67):
				arousalClass = 2
			case (arousal <= 1):
				arousalClass = 3
			default:
				arousalClass = 0;
		}

		let span_class1 = "v" + valenceClass;
		let span_class2 = "a" + arousalClass;
		let tooltip = constructTooltip(item);
		appendToResult(item.original_text, span_class1, span_class2, tooltip);
		console.log(item, index);
	});
	debugparagraph.append(t);
}

// returns an integer that can have positive or negative values.
function interpretValence(item){
	if('direct_valence' in item){
		// when there is a direct rating, it is used as reported in the source.	
		return Math.round(item.direct_valence)
	}else if ('parsebank_nearest_valence' in item){
		// When there is no direct emotion rating, the result is multiplied by the strenght of association to make it milder because it is less certain.
		return Math.round(item.parsebank_nearest_distance*item.parsebank_nearest_valence);
	}
}


// returns an integer that can have positive or negative values.
function interpretArousal(item){
	if('direct_arousal' in item){
		// when there is a direct rating, it is used as reported in the source.	
		return Math.round(item.direct_arousal)
	}else if ('parsebank_nearest_arousal' in item){
		// When there is no direct emotion rating, the result is multiplied by the strenght of association to make it milder because it is less certain.
		return Math.round(item.parsebank_nearest_distance*item.parsebank_nearest_arousal);
	}
}

function constructTooltip(item){
	let tooltip="";
	if('baseform' in item){
		tooltip=tooltip+"baseform: "+ item.baseform +"\x0A";
	}
	if('direct_valence' in item){
		tooltip=tooltip+"direct valence: "+ item.direct_valence +"\x0A";
	}
	if('direct_arousal' in item){
		tooltip=tooltip+"direct arousal: "+ item.direct_arousal +"\x0A";
	}
	if('direct_dominance' in item){
		tooltip=tooltip+"direct dominance: "+ item.direct_dominance +"\x0A";
	}
	if('parsebank_nearest' in item){
		tooltip=tooltip+"parsebank nearest: "+ item.parsebank_nearest +"\x0A";
	}
	if('parsebank_nearest_distance' in item){
		tooltip=tooltip+"parsebank nearest distance: "+ item.parsebank_nearest_distance +"\x0A";
	}
	if('parsebank_nearest_valence' in item){
		tooltip=tooltip+"parsebank nearest valence: "+ item.parsebank_nearest_valence +"\x0A";
	}
	if('parsebank_nearest_arousal' in item){
		tooltip=tooltip+"parsebank nearest arousal: "+ item.parsebank_nearest_arousal +"\x0A";
	}
	if('parsebank_nearest_dominance' in item){
		tooltip=tooltip+"parsebank nearest dominance: "+ item.parsebank_nearest_dominance +"\x0A";
	}
	return tooltip;
}