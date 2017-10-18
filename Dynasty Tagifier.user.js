// ==UserScript==
// @name         Dynasty Tagifier
// @homepageURL  https://github.com/gwennie-chan
// @downloadURL  https://github.com/gwennie-chan/dynasty-tagifier/raw/master/Dynasty%20Tagifier.user.js
// @updateURL    https://github.com/gwennie-chan/dynasty-tagifier/raw/master/Dynasty%20Tagifier.user.js
// @version      1.10
// @description  Dynasty-Scans.com Tag Modifications
// @author       Gwennie-Chan
// @include      https://dynasty-scans.com/forum/*
// @include		 https://dynasty-scans.com/user/suggestions
// @include		 https://dynasty-scans.com/images/*
// @require      https://code.jquery.com/jquery-3.2.1.min.js#sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

//---Global Variables---
const dynastyURL = "https://dynasty-scans.com/tags.json";
const tagURLstub = "https://dynasty-scans.com/tags/";
const version = 1.10;
const currentURL = window.location.pathname;
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
			var lowerHTML = this.innerHTML.toLowerCase();
			var lowerArray = nameArray[i].toLowerCase();
			if(lowerHTML == lowerArray){
				//console.log("Match Found: ",this.innerHTML);
				var correctedHTML = lowerHTML.replace(/\b./g, function(m){ return m.toUpperCase(); });
				$(this).html('<a href=' + tagURLstub + urlArray[i] + ' class="tagified" style="text-decoration:none;color:inherit;">' + correctedHTML + '</a>');
			}
		}
	});
}

function injectCSS() {
	$("<style>").prop("type", "text/css").html('\.tagified:hover{text-decoration:underline !important;color:#990000 !important;}\#controller{text-align:center;font-size:0.75em;font-weight:normal;}\#controller input{margin: 10px 20px;display:inline-block;}').prependTo("head");
}

function tagSelectionSwitcher() {
	//console.log("Starting TCC");
	$('#main h2').html('<h2>Suggestions Status</h2><div id="controller"><input type="checkbox" id="acceptedCont" checked><span class="text-success">Accepted</span></input><input type="checkbox" id="pendingCont" checked><span class="text-info">Pending</span></input><input type="checkbox" id="rejectedCont" checked><span class="text-error">Rejected</span></input></div>');
}

//---Main---
//console.log("Running Dynasty Tagifier v" + version);
$.when($.ready).done(function (){
	injectCSS();
	if (currentURL == "/user/suggestions"){
		tagSelectionSwitcher();
		$('#acceptedCont').click(function() {
			if ($(this).is(':checked')) {
				$('.suggestion-accepted').fadeIn();
			}
			else {
				$('.suggestion-accepted').fadeOut();
			}});
		$('#pendingCont').click(function() {
			if ($(this).is(':checked')) {
				$('.suggestion-pending').fadeIn();
			}
			else {
				$('.suggestion-pending').fadeOut();
			}});
		$('#rejectedCont').click(function() {
			if ($(this).is(':checked')) {
				$('.suggestion-rejected').fadeIn();
			}
			else {
				$('.suggestion-rejected').fadeOut();
			}});
	}
	else if ($('currentURL:has("forum")') ||  $('currentURL:has("images")')){
		$.when(JSONizer()).done(function(){
			forumTagger();
		});
	}
});