/*	AI 1: Easy mode using depth-bound, min-max search with evaluation function
	
	Evaluation function:
	4 Criteria to be used when evaluating a move
	
	-Gain one point for each opponent character in a row from potential space
	-Gain one point for placing your character on the board
	-Gain one point for each of your characters in a row from potential space
	-Lose one point for each of your characters in a row with an opponent's character and the potential space
	-A space has a value of 0 if it is already taken
 */
 
 //Set onclick functions for unselected cells in current inner board

 function calculateAIPlayer1Move(){
	 
 }
 
 function calculateAIPlayer2Move(outerX, outerY){
	//Create a value table for the game
	var valTable = [[0,0,0],
					[0,0,0],
					[0,0,0]];
	 
	 var checkVal;
	 
	//Check the value of possible moves in game x,y
	for(var i = 0; i < 3; i++){ //Check rows (x)
		for (var j = 0; j < 3; j++){ //Check columns (y)
			checkVal = i + "." + j;
			if(selected[outerX,outerY,i,j] == 1  || selected[outerX,outerY,i,j] == 2){ //If the space is taken, set the value to 0
				valTable[i,j] = 0;
			}
			else{ //Otherwise, calculate the value
				switch(checkVal){
					case "0.0": //Calculate top-left value
						for (var x = 0; x < 3; x++){
							for (var y = 0; y < 3; y++){
								
							}
						}
						break;
					case "0.1": //Calculate top-middle value
						
						break;
					case "0.2": //Calculate top-right value
						
						break;
					case "1.0": //Calculate center-left value
						
						break;
					case "1.1": //Calculate center-middle value
						
						break;
					case "1.2": //Calculate center-right value
						
						break;
					case "2.0": //Calculate bottom-left value
						
						break;
					case "2.1": //Calculate bottom-middle value
						
						break;
					case "2.2": //Calculate bottom-right value
						
						break;
				}
			}
		}
	}
 }