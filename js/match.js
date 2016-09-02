
//create all required variable
var score;
var cardsmatched;

var ui = $("#gameUI");
var uiIntro = $("#game_intro");
var uiState = $("#game_states");
var uiComplete = $("#game_complete");
var uiCards =  $("#cards");
var uiReset = $(".game_reset");
var uiScore = $(".game_score");
var uiPlay = $("#play_game");
var uiTimer = $("#timer");

//create deck array 
var matchingGame = {};
matchingGame.deck = ['po','po','shifu','shifu','tigress','tigress','mantis','mantis','viper','viper','ping','ping','oogway',
'oogway','monkey','monkey','li_shan','li_shan',];

//on document load the lazy way
$(function(){
	init();
});
//initialize game
function init(){
					uiComplete.hide();
					uiCards.hide();
					playGame = false;
					uiPlay.click(function(e){
						e.preventDefault();
						uiIntro.hide();
						startGame();
					});
					uiReset.click(function(e){
						e.preventDefault();
						uiComplete.hide();
						reStartGame();
					});
				}
//start game and create cards from deck array
function startGame(){
				uiTimer.show();
				uiScore.html("0 seconds");
				uiState.show();
				uiCards.show();
				score = 0;
				cardsmatched = 0;
				if(playGame == false){
					playGame = true;
					matchingGame.deck.sort(shuffle);
					for(var i=0; i<17;i++){
						$(".card:first-child").clone().appendTo("#cards");
					}					
					//initialize each card's position
					uiCards.children().each(function(index){
						//align the cards to be 3*6 ourselves.
						$(this).css({
							"left":($(this).width() + 20)* (index % 6),
							"top":($(this).height() + 20)* Math.floor(index / 6)
						});
						//get a pattern from the shuffled deck
							var pattern = matchingGame.deck.pop();
						//visually applay the pattern on tne DOM element.
						$(this).find(".back").addClass(pattern);
						//embed the pattern data into the DOM element.
						$(this).attr("data-pattern",pattern);
						//listen the click event on each card DIV element.
						$(this).click(selectCard);
					});
					timer();
				};
			}
			
//timer for game
function timer() {
				if(playGame){
					scoreTimeout = setTimeout(function(){
							uiScore.html(++score + " seconds");
							timer();
					},1000);
				};	
			};

//shuffle cardsmatched
function shuffle(){
	return 0.5 - Math.random();
}
//onclick finction add flip class and the check to see if cards are the same
function selectCard(){
	//we do nothing if there are already two cards flipped.
	if($(".cars-flipped").size() > 1 ){
		return;
	}
	$(this).addClass("card-flipped");
	//check the pattern of both flipped card 0.7s later
	if($(".card-flipped").size() == 2){
		setTimeout(checkPattern, 700);
	}
}

//if pattern is same remove cards otherwise flip back
function checkPattern(){
	if(isMatchPattern()){
			$(".card-flipped").removeClass("card-flipped").addClass("card-removed");
			if(document.webkitTransitionEnd){
				$(".card-removed").bind("webkitTransitionEnd", removeTookCards);
			}else{
				removeTookCards();
			}
	}else{
		$(".card-flipped").removeClass("card-flipped");
	}
}
//put 2 flipped cards in an array then check the images to see if it's the same
function isMatchPattern(){
	var cards = $(".card-flipped");
	var pattern = $(cards[0]).data("pattern");
	var anotherPattern = $(cards[1]).data("pattern");
	return (pattern == anotherPattern);
}
 
 //check to see if all cardsmatched variable is less than 8 if so remove card only otherwise remove card and end game
function removeTookCards(){
	if(cardsmatched < 8){
		cardsmatched++;
		$(".card-removed").remove();
	}else{
		$(".card-removed").remove();
		uiCards.hide();
		uiComplete.show();
		clearTimeout(scoreTimeout);
	}	
}
//recreate the original card, stop the timer and re popuate the array with the class names
function reStartGame(){
	playGame = false;
	uiCards.html("<div class='card'><div class='face front'></div><div class='face back'></div></div>");
	clearTimeout(scoreTimeout);
	matchingGame.deck = ['po','po','shifu','shifu','tigress','tigress','mantis','mantis','viper','viper','ping','ping','oogway','oogway','monkey','monkey','li_shan','li_shan',];
	startGame();
}