// ==UserScript==
// @name         Dynasty Tagifier
// @namespace	 gc-tagifier
// @homepageURL  https://github.com/gwennie-chan
// @downloadURL  https://github.com/gwennie-chan/dynasty-tagifier/raw/master/Dynasty%20Tagifier.user.js
// @updateURL    https://github.com/gwennie-chan/dynasty-tagifier/raw/master/Dynasty%20Tagifier.user.js
// @version      1.14
// @description  Dynasty-Scans.com Tag Modifications
// @author       Gwennie-Chan
// @include		 https://dynasty-scans.com/forum/*
// @include		 https://dynasty-scans.com/user/suggestions
// @include		 https://dynasty-scans.com/images/*
// @run-at		 document-end
// ==/UserScript==

//---Global Variables---
const dynastyURL = "https://dynasty-scans.com/tags.json";
const tagURLstub = "https://dynasty-scans.com/tags/";
const version = 1.14;
const currentURL = window.location.pathname;

//---Component Functions---

// Generate a lookup table from tags.json mapping lowercase tag names to {name, permalink}
function createTagMap() {
	return $.getJSON(dynastyURL).then(data => {
		const tagMap = {};
		Object.values(data).forEach(tagBin =>
			tagBin.forEach(nameLink =>
				tagMap[nameLink.name.toLowerCase()] = nameLink));
		return tagMap;
	});
}

function forumTagger() {
	//console.log("Starting Forum Tagger");
	//console.log("Checking Blocks For Tag Matches");
	createTagMap().then(tagMap => {
		$('code').each(function(){
			// Lookup the tag table and linkify if key exists
			var lowerHTML = this.innerHTML.toLowerCase();
			if (tagMap.hasOwnProperty(lowerHTML)) {
				var nameLink = tagMap[lowerHTML];
				$(this).html(`<a href=${tagURLstub}${nameLink.permalink} class="tagified" style="text-decoration:none;color:inherit;">${nameLink.name}</a>`);
			}
		});
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
		forumTagger();
	}
});
