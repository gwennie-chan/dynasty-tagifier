// ==UserScript==
// @name         Dynasty Tagifier
// @homepageURL  https://github.com/gwennie-chan
// @supportURL   https://github.com/gwennie-chan/dynasty-tagifier
// @downloadURL  https://github.com/gwennie-chan/dynasty-tagifier/raw/master/Dynasty%20Tagifier.user.js
// @version      0.1
// @description  Dynasty-Scans.com Tag Modifications
// @author       Gwennie-Chan
// @include      https://dynasty-scans.com/forum/topics/*
// @require      https://code.jquery.com/jquery-3.2.1.min.js#sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @run-at		 document-end
// ==/UserScript==

//---Global Variables---
const dynastyURL = "https://dynasty-scans.com/tags.json";
const tagURLstub = "https://dynasty-scans.com/tags/";
const version = 0.1;
var mainJSON = null;
var nameArray = [];
var urlArray = [];

//---Component Functions---
function JSONizer(){
	//console.log("JSON Master Function Started");
	$.when(updateJSON()).done(sortJSON());
}

function updateJSON(){
	$.when(pullJSON()).done(function () {
		$.when(mainJSON = GM_getValue("json")).done(function () {
			//console.log("JSON Local Variable Set: ",mainJSON);
		});
	});
}

function pullJSON(){
	var results = $.get({
		'url':dynastyURL,
		'global':"false",
		'dataType':"json",
		'success':function (data){
			//console.log("JSON Get and Parse Successful: ",data);
			$.when(GM_setValue("json",data)).done(/*console.log("JSON Stored Successfully: ",GM_getValue("json"))*/);
		}
	});
}

function sortJSON(){
	//console.log("JSON Array Sorting Started");
	var tempNameArray = [];
	var tempURLArray = [];
	const tagID = ["#","A","B","C","D","E","F","G","H","I","K","L","M","N","O","P","R","S","T","V","W","Y","Z"];
	const tagLength = tagID.length;
	var tagLengthArray = [];
	for (i=0;i<tagLength;i++){
		//console.log("Sorting - Computing Preliminary Array Length");
		tagLengthArray.push(mainJSON[tagID[i]].length);
	}
	for (i=0;i<tagLength;i++){
		//console.log("Sorting - Creating Tag Array");
		for(x=0;x<tagLengthArray[i];x++){
			tempNameArray.push(mainJSON[tagID[i]][x].name);
			tempURLArray.push(mainJSON[tagID[i]][x].permalink);
		}
	}
	//if (tempNameArray.length == tempURLArray.length){console.log("Array Validated");	}
	//else {console.log("Array Invalid - Error");}
	//console.log("Sorting Completed - Pushing Values To Main");
	nameArray = tempNameArray;
	urlArray = tempURLArray;
}

function forumTagger() {
	//console.log("Starting Forum Tagger");
	//console.log("Checking Blocks For Tag Matches");
	$('code').each(function(){
		for(i = 0;i<nameArray.length;i++){
			if(this.innerHTML == nameArray[i]){
				//console.log("Match Found: ",this.innerHTML);
				$(this).html('<a href=' + tagURLstub + urlArray[i] + ' class="tagified" style="text-decoration:none;color:inherit;">' + this.innerHTML + '</a>');
			}
		}
	});
}

function injectCSS() {
	$("<style>").prop("type", "text/css").html("\.tagified:hover{text-decoration:underline !important;color:#990000 !important;}").prependTo("head");
}

//---Main---
//console.log("Running Dynasty Tagifier v" + version);
injectCSS();
$.when(JSONizer()).done(function(){
	forumTagger();
});
