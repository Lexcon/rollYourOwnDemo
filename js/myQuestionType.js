/*
	Question type based on: single response
	This question types randomly picks an answer from the available answers and the respondent should guess 
*/
(function($) {
	$.fn.extend({
		myQuestionType: function(item) {
			
			item.randomlyChosenAnswer = Math.floor((Math.random() * item.panswers.length) + 1);

			function redraw() {
			
				if (item.currentpanswerno == item.currentlyDrawnActiveAnswer) {
					return; // nothing changed during window resize: no need to redraw
				}

				// this question should POST Q1_1: 3
				// in case of 'extra input' it should also post Q1_1Text: textual user input

				var cnt, controlsHTML = 'Controls should be hidden from the actual respondent but are included for comprehensive POST-ing of the data:<br>',
					htmlDisplay = '',
					panswer;
									
				htmlDisplay = item.text + '<br><div class="fixedText">Hello let\'s play a game, try to guess the answer by clicking on any of the squares! (the correct answer is ' + item.randomlyChosenAnswer + ')</div>';
				
				for (cnt=0; panswer=item.panswers[cnt]; cnt++) {
					controlsHTML += '<input type="radio" name="' + item.varlabel + '" id="' + item.varlabel + '_' + panswer.panswerno + ' " value="' + panswer.panswerno + '"' + (panswer.panswerno == item.currentpanswerno?' checked':'') + '>';
					htmlDisplay += '<div class="myQuestionTypeBox myQuestionTypeBox' + item.varlabel + (item.currentpanswerno==panswer.panswerno?' myQuestionTypeSelectedBox':'') + '" id="box' + item.varlabel + '_' + panswer.panswerno + '">' + panswer.panswertxt + '</div>'
				}
				$('#' + item.varlabel + '-wrapper').html(htmlDisplay + controlsHTML).ready(function(){
					$('.myQuestionTypeBox' + item.varlabel).click(function() {
						var value = $(this).attr('id').split('_')[1];
						item.currentpanswerno = value;
						$dd.validate(); // validates all questions on this page, so also ones not served by the current script
						redraw() // or $dd.redraw(), should it be necessary to also redraw any other item on this page
					})
				});
				
				item.currentlyDrawnActiveAnswer = item.currentpanswerno;

			}
			
			// in case of window-resizing this will make it redraw automatically along with any other items on this page
			$.dd.redrawers.push(redraw);
			$.dd.validators.push(function() {
				if (item.randomlyChosenAnswer == item.currentpanswerno) {
					// we're ok, hurray!
					return true;
				}
				$dd.pageMsg += 'Answer ' + item.currentpanswerno + ' is not correct';
				return false;
			}); // add it to the list of other validators that may live on the same page
			redraw();
		}
	})
})(jQuery);