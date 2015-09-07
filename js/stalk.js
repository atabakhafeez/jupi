var c;
var timeout = null;
var lastLength = 0;

var store = [];

function updateResults() {
	console.log("Updating results...");

	timeout = null;

	c.search($("#search").val(), [], 100, 0, function(error, data) {
		if(!error) {
			store = data.data;

			$("#frame").empty();

			store.map(function(e, idx) {
				$("#frame")
					.append($("<img></img>")
					.attr("src", e.picture)
					.attr("id", e.username)
				);
			});

			$("div#frame img").hover(
				function() { // Hover in
					makeHighlight(this.id);
				}
			);
		}
	});
}

function getUserData(uid) {
	for (var i = store.length - 1; i >= 0; i--) {
		if(store[i].username == uid)
			return store[i];
	};
}

function makeHighlight(uid) {
	// Kill the others
	$("div.highlight").remove();

	var anchor = $(("img#" + uid));

	var usr = getUserData(uid);

	var highlight = $("<div>")
				.addClass("highlight")
				.attr("data-uid", uid);

	switch(usr.college) {
		case "Nordmetall":
			highlight.addClass("c-n");
			break;

		case "C3":
			highlight.addClass("c-3");
			break;

		case "Mercator":
			highlight.addClass("c-m");
			break;

		case "Krupp":
			highlight.addClass("c-k");
			break;

		default:
			highlight.addClass("c-none");
	}


	var img = $("<img>")
				.attr("src", usr.picture)
				.attr("data-uid", uid);

	highlight
	.append(img)
	.append(getHighlightDetails(usr))
	.css(getHighlightPosition(anchor));

	highlight.hover(
		function() {},
		function() {
			this.remove();
		}	
	);

	anchor.before(highlight);
}

function getHighlightDetails(usr) {
	var dtls = $("<div>")
				.addClass("hl-ctn");
		dtls.append($("<h2>").html(usr.fullName));

	return dtls;
}

function getHighlightPosition(anchor){
	var offset = anchor.offset();

	return {
		'left': offset.left,
		'top': offset.top
	};
}

$(function(){
	$("#search").focus();

	c = new JUB.Client("https://api.jacobs-cs.club");

	$("#search").on('input', function(evt) {
		if(timeout != null) {
			clearTimeout(timeout);
			timeout = null;
		}

		if($("#search").val().length > 3) {
			if($("#search").val().length != lastLength) {
				updateResults();
				lastLength = $("#search").val().length;
			} else {
				timeout = setTimeout(updateResults, 200);
			}
		}
	});

	$("#search").change(updateResults);
});
