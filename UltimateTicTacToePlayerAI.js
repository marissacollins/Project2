/*	AI 1: Easy mode using depth-bound, min-max search with evaluation function
	Created by: Courtney Campbell, Brandon Charles, Marissa Collins, and Hannah Millea
	
	Evaluation function:
	4 Criteria to be used when evaluating a move
	
	-Gain one point for each opponent character in a row from potential space
	-Gain one point for placing your character on the board
	-Gain one point for each of your characters in a row from potential space
	-Lose one point for each of your characters in a row with an opponent's character and the potential space
	-A space has a value of 0 if it is already taken
 */

 //Player 1 AI: Level 1
 //TODO: Add Player 2 AI code here, and swap the pawn values (1 and 2)
 function player1AILevel1(){
	 
 }
 
 //Player 2 AI: Level 1
 function player2AILevel1(outsideX, outsideY, wonCells){
	 var outerX = outsideX;
	 var outerY = outsideY;
	 addLog("Won cells: " + wonCells);
	 
	/*--- Evaluate possible moves ---*/
	var wonCheck = false;
	while(wonCheck == false){
		addLog("Checking cell " + outerX + "," + outerY);
		if (wonCells[outerX][outerY] != 0){ //If the selected game has already been won, choose a new one
		addLog("The cell was won by " + wonCells[outerX][outerY]);
		outerX = Math.floor(Math.random() * 3);
		outerY = Math.floor(Math.random() * 3);
		addLog("New cell to check is " + outerX + "," + outerY);
		}
		else{
			addLog("The following cell is valid " + outerX + "," + outerY);
			wonCheck = true;
		}
	}
	
	//Create a value table for the game
	//This holds the point values of each space in the game
	var valTable = [[0,0,0],
					[0,0,0],
					[0,0,0]];
	 
	 var checkVal; //Determines which square you are calculating for
	 var spaceScore = 0; //Point value for the space being calculated
	
	//Check the value of possible moves in game x,y
	for(var i = 0; i < 3; i++){ //Check rows (x)
		for (var j = 0; j < 3; j++){ //Check columns (y)
			checkVal = i + "." + j; //Which square is being checked
			
			if(selected[outerX][outerY][i][j] == 1  || selected[outerX][outerY][i][j] == 2){ //If the space is taken, set the value to 0
				valTable[i][j] = 0;
				//addLog("Coords (" + i + "," + j + ") are already filled.");
			}
			else{ //Otherwise, calculate the value
				switch(checkVal){
					case "0.0": //Calculate top-left value
						addLog("checkVal = " + checkVal + " | Calculating top-left.");
						spaceScore = 0; //Reset score
						//addLog("Placing a character on the game board: +1. Score = " + spaceScore);
						for (var x = 0; x < 3; x++){
							for (var y = 0; y < 3; y++){
							//addLog("Checking coords(" + x + "," + y + ")");
								if((x == 0 && y == 0) || (x == 1 && y == 2) || (x == 2 && y == 1)){ //Skip: top-left, center-right, bottom-middle
									//Skip
									//addLog("This space offers no additional value. Skip.");
								}
								else{
									if(selected[outerX][outerY][x][y] == 1){ //If the space is taken by an opponent, gain 1 point for blocking
										spaceScore++;
										//addLog("Blocking an opponent's move: +1. Score = " + spaceScore);
									}
									if(selected[outerX][outerY][x][y] == 2){ //If the space is taken by your character, gain 1 point for being in a row
										spaceScore++;
										//addLog("Setting up a move for yourself: +1. Score = " + spaceScore);
									}
								}	
							}
						}
						//Check for blocked moves
						if ((selected[outerX][outerY][0][1] == 2 && selected[outerX][outerY][0][2] == 1) || (selected[outerX][outerY][0][1] == 1 && selected[outerX][outerY][0][2] == 2)){ //Lose 1 point if the top row is blocked
							spaceScore--;
						}
						if ((selected[outerX][outerY][1][1] == 2 && selected[outerX][outerY][2][2] == 1) || (selected[outerX][outerY][1][1] == 1 && selected[outerX][outerY][2][2] == 2)){ //Lose 1 point if the diaganol row is blocked
							spaceScore--;
						}
						if ((selected[outerX][outerY][1][0] == 2 && selected[outerX][outerY][2][0] == 1) || (selected[outerX][outerY][1][0] == 1 && selected[outerX][outerY][2][0] == 2)){ //Lose 1 point if the left column is blocked
							spaceScore--;
						}
						//Check for diaganol wins
						if ((selected[outerX][outerY][1][1] == 2 && selected[outerX][outerY][2][2] == 2)){ //Gain a point for 2 in a row diaganol
							spaceScore = 100;
						}
						//Check for vertical wins
						if ((selected[outerX][outerY][1][0] == 2 && selected[outerX][outerY][2][0] == 2)){ //Gain a point for 2 in a row diaganol
							spaceScore = 100;
						}
						//Check for horizontal wins
						if ((selected[outerX][outerY][0][1] == 2 && selected[outerX][outerY][0][2] == 2)){ //Gain a point for 2 in a row diaganol
							spaceScore = 100;
						}
						//Check for diaganol win blocks
						if ((selected[outerX][outerY][1][1] == 1 && selected[outerX][outerY][2][2] == 1)){ //Gain a point for 2 in a row diaganol
							spaceScore = 75;
						}
						//Check for vertical win blocks
						if ((selected[outerX][outerY][1][0] == 1 && selected[outerX][outerY][2][0] == 1)){ //Gain a point for 2 in a row diaganol
							spaceScore = 75;
						}
						//Check for horizontal win blocks
						if ((selected[outerX][outerY][0][1] == 1 && selected[outerX][outerY][0][2] == 1)){ //Gain a point for 2 in a row diaganol
							spaceScore = 75;
						}
						
						valTable[i][j] = spaceScore;
						addLog(checkVal + " score = " + valTable[i][j]);
						break;
					case "0.1": //Calculate top-middle value
						addLog("checkVal = " + checkVal + " | Calculating top-middle.");
						spaceScore = 0; //Reset score
						for (var x = 0; x < 3; x++){
							for (var y = 0; y < 3; y++){
								if((x == 0 && y == 1) || (x == 2 && y == 0) || (x == 2 && y == 2)){ //Skip: top-middle, bottom-left, bottom-right
									//Skip
								}
								else{
									if(selected[outerX][outerY][x][y] == 1){ //If the space is taken by an opponent, gain 1 point for blocking
										spaceScore++;
									}
									if(selected[outerX][outerY][x][y] == 2){ //If the space is taken by your character, gain 1 point for being in a row
										spaceScore++;
									}
								}	
							}
						}
						//Check for blocked moves
						if ((selected[outerX][outerY][0][0] == 2 && selected[outerX][outerY][0][2] == 1) || (selected[outerX][outerY][0][0] == 1 && selected[outerX][outerY][0][2] == 2)){ //Lose 1 point if the top row is blocked
							spaceScore--;
						} 
						if ((selected[outerX][outerY][1][1] == 2 && selected[outerX][outerY][2][1] == 1) || (selected[outerX][outerY][1][1] == 1 && selected[outerX][outerY][2][1] == 2)){ //Lose 1 point if the center column is blocked
							spaceScore--;
						}
						//Check for horizontal win blocks
						if ((selected[outerX][outerY][2][0] == 1 && selected[outerX][outerY][2][2] == 1)){ //Gain a point for 2 in a row diaganol
							spaceScore = 75;
						}
						//Check for vertical win blocks
						if ((selected[outerX][outerY][1][1] == 1 && selected[outerX][outerY][0][1] == 1)){ //Gain a point for 2 in a row diaganol
							spaceScore = 75;
						}
						//Check for horizontal wins
						if ((selected[outerX][outerY][2][0] == 2 && selected[outerX][outerY][2][2] == 2)){ //Gain a point for 2 in a row diaganol
							spaceScore = 100;
						}
						//Check for vertical wins
						if ((selected[outerX][outerY][1][1] == 2 && selected[outerX][outerY][0][1] == 2)){ //Gain a point for 2 in a row diaganol
							spaceScore = 100;
						}
						
						valTable[i][j] = spaceScore;
						addLog(checkVal + " score = " + valTable[i][j]);
						break;
					case "0.2": //Calculate top-right value
						addLog("checkVal = " + checkVal + " | Calculating top-right.");
						spaceScore = 0; //Reset score
						for (var x = 0; x < 3; x++){
							for (var y = 0; y < 3; y++){
								if((x == 0 && y == 2) || (x == 1 && y == 0) || (x == 2 && y == 1)){ //Skip: top-right, center-left, bottom-middle
									//Skip
								}
								else{
									if(selected[outerX][outerY][x][y] == 1){ //If the space is taken by an opponent, gain 1 point for blocking
										spaceScore++;
									}
									if(selected[outerX][outerY][x][y] == 2){ //If the space is taken by your character, gain 1 point for being in a row
										spaceScore++;
									}
								}	
							}
						}
						if ((selected[outerX][outerY][0][0] == 2 && selected[outerX][outerY][0][1] == 1) || (selected[outerX][outerY][0][0] == 1 && selected[outerX][outerY][0][1] == 2)){ //Lose 1 point if the top row is blocked
							spaceScore--;
						}
						if ((selected[outerX][outerY][1][1] == 2 && selected[outerX][outerY][2][0] == 1) || (selected[outerX][outerY][1][1] == 1 && selected[outerX][outerY][2][0] == 2)){ //Lose 1 point if the diaganol row is blocked
							spaceScore--;
						}
						if ((selected[outerX][outerY][1][2] == 2 && selected[outerX][outerY][2][2] == 1) || (selected[outerX][outerY][1][2] == 1 && selected[outerX][outerY][2][2] == 2)){ //Lose 1 point if the right column is blocked
							spaceScore--;
						}
						//Check for diaganol win
						if ((selected[outerX][outerY][1][1] == 2 && selected[outerX][outerY][0][0] == 2)){ //Gain a point for 2 in a row diaganol
							spaceScore = 100;
						}
						//Check for vertical wins
						if ((selected[outerX][outerY][1][2] == 2 && selected[outerX][outerY][2][2] == 2)){ //Gain a point for 2 in a row diaganol
							spaceScore = 100;
						}
						//Check for horizontal wins
						if ((selected[outerX][outerY][0][1] == 2 && selected[outerX][outerY][0][0] == 2)){ //Gain a point for 2 in a row diaganol
							spaceScore = 100;
						}
						//Check for diaganol win blocks
						if ((selected[outerX][outerY][1][1] == 1 && selected[outerX][outerY][2][0] == 1)){ //Gain a point for 2 in a row diaganol
							spaceScore = 75;
						}
						//Check for vertical win blocks
						if ((selected[outerX][outerY][1][2] == 1 && selected[outerX][outerY][2][2] == 1)){ //Gain a point for 2 in a row diaganol
							spaceScore = 75;
						}
						//Check for horizontal win blocks
						if ((selected[outerX][outerY][0][1] == 1 && selected[outerX][outerY][0][0] == 1)){ //Gain a point for 2 in a row diaganol
							spaceScore = 75;
						}
						
						valTable[i][j] = spaceScore;
						addLog(checkVal + " score = " + valTable[i][j]);
						break;
					case "1.0": //Calculate center-left value
						addLog("checkVal = " + checkVal + " | Calculating center-left.");
						spaceScore = 0; //Reset score
						for (var x = 0; x < 3; x++){
							for (var y = 0; y < 3; y++){
								if((x == 1 && y == 0) || (x == 0 && y == 2) || (x == 2 && y == 2)){ //Skip: center-left, top-right, bottom-right
									//Skip
								}
								else{
									if(selected[outerX][outerY][x][y] == 1){ //If the space is taken by an opponent, gain 1 point for blocking
										spaceScore++;
									}
									if(selected[outerX][outerY][x][y] == 2){ //If the space is taken by your character, gain 1 point for being in a row
										spaceScore++;
									}
								}	
							}
						}
						if ((selected[outerX][outerY][1][1] == 2 && selected[outerX][outerY][1][2] == 1) || (selected[outerX][outerY][1][1] == 1 && selected[outerX][outerY][1][2] == 2)){ //Lose 1 point if the center row is blocked
							spaceScore--;
						} 
						if ((selected[outerX][outerY][0][0] == 2 && selected[outerX][outerY][0][2] == 1) || (selected[outerX][outerY][0][0] == 1 && selected[outerX][outerY][0][2] == 2)){ //Lose 1 point if the left column is blocked
							spaceScore--;
						}
						//Check for horizontal win blocks
						if ((selected[outerX][outerY][1][1] == 1 && selected[outerX][outerY][1][2] == 1)){ //Gain a point for 2 in a row diaganol
							spaceScore = 75;
						}
						//Check for vertical win blocks
						if ((selected[outerX][outerY][0][0] == 1 && selected[outerX][outerY][2][0] == 1)){ //Gain a point for 2 in a row diaganol
							spaceScore = 75;
						}
						//Check for horizontal wins
						if ((selected[outerX][outerY][1][1] == 2 && selected[outerX][outerY][1][2] == 2)){ //Gain a point for 2 in a row diaganol
							spaceScore = 100;
						}
						//Check for vertical wins
						if ((selected[outerX][outerY][0][0] == 2 && selected[outerX][outerY][2][0] == 2)){ //Gain a point for 2 in a row diaganol
							spaceScore = 100;
						}
						
						valTable[i][j] = spaceScore;
						addLog(checkVal + " score = " + valTable[i][j]);
						break;
					case "1.1": //Calculate center-middle value
						addLog("checkVal = " + checkVal + " | Calculating center-middle.");
						spaceScore = 0; //Reset score
						for (var x = 0; x < 3; x++){
							for (var y = 0; y < 3; y++){
								if(x == 1 && y == 1){ //Skip: center-middle
									//Skip
								}
								else{
									if(selected[outerX][outerY][x][y] == 1){ //If the space is taken by an opponent, gain 1 point for blocking
										spaceScore++;
									}
									if(selected[outerX][outerY][x][y] == 2){ //If the space is taken by your character, gain 1 point for being in a row
										spaceScore++;
									}
								}	
							}
						}
						if ((selected[outerX][outerY][1][0] == 2 && selected[outerX][outerY][1][2] == 1) || (selected[outerX][outerY][1][0] == 1 && selected[outerX][outerY][1][2] == 2)){ //Lose 1 point if the center row is blocked
							spaceScore--;
						} 
						if ((selected[outerX][outerY][0][1] == 2 && selected[outerX][outerY][2][1] == 1) || (selected[outerX][outerY][0][1] == 1 && selected[outerX][outerY][2][1] == 2)){ //Lose 1 point if the middle column is blocked
							spaceScore--;
						}
						if ((selected[outerX][outerY][0][0] == 2 && selected[outerX][outerY][2][2] == 1) || (selected[outerX][outerY][0][0] == 1 && selected[outerX][outerY][2][2] == 2)){ //Lose 1 point if the down-right diaganol row is blocked
							spaceScore--;
						}
						if ((selected[outerX][outerY][0][2] == 2 && selected[outerX][outerY][2][0] == 1) || (selected[outerX][outerY][0][2] == 1 && selected[outerX][outerY][2][0] == 2)){ //Lose 1 point if the down-right diaganol row is blocked
							spaceScore--;
						}
						//Check for diaganol wins
						if ((selected[outerX][outerY][0][0] == 2 && selected[outerX][outerY][2][2] == 2)){ //Gain a point for 2 in a row diaganol
							spaceScore = 100;
						}
						if ((selected[outerX][outerY][2][0] == 2 && selected[outerX][outerY][0][2] == 2)){ //Gain a point for 2 in a row diaganol
							spaceScore = 100;
						}
						//Check for diaganol blocks
						if ((selected[outerX][outerY][0][0] == 1 && selected[outerX][outerY][2][2] == 1)){ //Gain a point for 2 in a row diaganol
							spaceScore = 75;
						}
						if ((selected[outerX][outerY][2][0] == 1 && selected[outerX][outerY][0][2] == 1)){ //Gain a point for 2 in a row diaganol
							spaceScore = 75;
						}
						//Check for horizontal win blocks
						if ((selected[outerX][outerY][1][0] == 1 && selected[outerX][outerY][1][2] == 1)){ //Gain a point for 2 in a row diaganol
							spaceScore = 75;
						}
						//Check for vertical win blocks
						if ((selected[outerX][outerY][0][1] == 1 && selected[outerX][outerY][2][1] == 1)){ //Gain a point for 2 in a row diaganol
							spaceScore = 75;
						}
						//Check for horizontal wins
						if ((selected[outerX][outerY][1][0] == 2 && selected[outerX][outerY][1][2] == 2)){ //Gain a point for 2 in a row diaganol
							spaceScore = 100;
						}
						//Check for vertical wins
						if ((selected[outerX][outerY][0][1] == 2 && selected[outerX][outerY][2][1] == 2)){ //Gain a point for 2 in a row diaganol
							spaceScore = 100;
						}
						
						valTable[i][j] = spaceScore;
						addLog(checkVal + " score = " + valTable[i][j]);
						break;
					case "1.2": //Calculate center-right value
						addLog("checkVal = " + checkVal + " | Calculating center-right.");
						spaceScore = 0; //Reset score
						for (var x = 0; x < 3; x++){
							for (var y = 0; y < 3; y++){
								if((x == 1 && y == 2) || (x == 0 && y == 0) || (x == 0 && y == 2)){ //Skip: center-right, top-left, bottom-left
									//Skip
								}
								else{
									if(selected[outerX][outerY][x][y] == 1){ //If the space is taken by an opponent, gain 1 point for blocking
										spaceScore++;
									}
									if(selected[outerX][outerY][x][y] == 2){ //If the space is taken by your character, gain 1 point for being in a row
										spaceScore++;
									}
								}	
							}
						}
						if ((selected[outerX][outerY][1][1] == 2 && selected[outerX][outerY][1][0] == 1) || (selected[outerX][outerY][1][1] == 1 && selected[outerX][outerY][1][0] == 2)){ //Lose 1 point if the center row is blocked
							spaceScore--;
						} 
						if ((selected[outerX][outerY][2][0] == 2 && selected[outerX][outerY][2][2] == 1) || (selected[outerX][outerY][2][0] == 1 && selected[outerX][outerY][2][2] == 2)){ //Lose 1 point if the right column is blocked
							spaceScore--;
						}
						//Check for horizontal win blocks
						if ((selected[outerX][outerY][1][1] == 1 && selected[outerX][outerY][1][0] == 1)){ //Gain a point for 2 in a row diaganol
							spaceScore = 75;
						}
						//Check for vertical win blocks
						if ((selected[outerX][outerY][0][2] == 1 && selected[outerX][outerY][2][2] == 1)){ //Gain a point for 2 in a row diaganol
							spaceScore = 75;
						}
						//Check for horizontal wins
						if ((selected[outerX][outerY][1][1] == 2 && selected[outerX][outerY][1][0] == 2)){ //Gain a point for 2 in a row diaganol
							spaceScore = 100;
						}
						//Check for vertical wins
						if ((selected[outerX][outerY][2][0] == 2 && selected[outerX][outerY][2][2] == 2)){ //Gain a point for 2 in a row diaganol
							spaceScore = 100;
						}
						
						valTable[i][j] = spaceScore;
						addLog(checkVal + " score = " + valTable[i][j]);
						break;
					case "2.0": //Calculate bottom-left value
						addLog("checkVal = " + checkVal + " | Calculating bottom-left.");
						spaceScore = 0; //Reset score
						for (var x = 0; x < 3; x++){
							for (var y = 0; y < 3; y++){
								if((x == 0 && y == 1) || (x == 1 && y == 2) || (x == 0 && y == 2)){ //Skip: top-middle, center-right, bottom-left
									//Skip
								}
								else{
									if(selected[outerX][outerY][x][y] == 1){ //If the space is taken by an opponent, gain 1 point for blocking
										spaceScore++;
									}
									if(selected[outerX][outerY][x][y] == 2){ //If the space is taken by your character, gain 1 point for being in a row
										spaceScore++;
									}
								}	
							}
						}
						if ((selected[outerX][outerY][2][1] == 2 && selected[outerX][outerY][2][2] == 1) || (selected[outerX][outerY][2][1] == 1 && selected[outerX][outerY][2][2] == 2)){ //Lose 1 point if the bottom row is blocked
							spaceScore--;
						} 
						if ((selected[outerX][outerY][1][1] == 2 && selected[outerX][outerY][0][2] == 1) || (selected[outerX][outerY][1][1] == 1 && selected[outerX][outerY][0][2] == 2)){ //Lose 1 point if the diaganol row is blocked
							spaceScore--;
						}
						if ((selected[outerX][outerY][0][0] == 2 && selected[outerX][outerY][1][0] == 1) || (selected[outerX][outerY][0][0] == 1 && selected[outerX][outerY][1][0] == 2)){ //Lose 1 point if the left column is blocked
							spaceScore--;
						}
						//Check for diaganol wins
						if ((selected[outerX][outerY][1][1] == 2 && selected[outerX][outerY][0][2] == 2)){ //Gain a point for 2 in a row diaganol
							spaceScore = 100;
						}
						//Check for vertical wins
						if ((selected[outerX][outerY][1][0] == 2 && selected[outerX][outerY][0][0] == 2)){ //Gain a point for 2 in a row diaganol
							spaceScore = 100;
						}
						//Check for horizontal wins
						if ((selected[outerX][outerY][2][1] == 2 && selected[outerX][outerY][2][2] == 2)){ //Gain a point for 2 in a row diaganol
							spaceScore = 100;
						}
						//Check for diaganol win blocks
						if ((selected[outerX][outerY][1][1] == 1 && selected[outerX][outerY][0][2] == 1)){ //Gain a point for 2 in a row diaganol
							spaceScore = 75;
						}
						//Check for vertical win blocks
						if ((selected[outerX][outerY][1][0] == 1 && selected[outerX][outerY][0][0] == 1)){ //Gain a point for 2 in a row diaganol
							spaceScore = 75;
						}
						//Check for horizontal win blocks
						if ((selected[outerX][outerY][2][1] == 1 && selected[outerX][outerY][2][2] == 1)){ //Gain a point for 2 in a row diaganol
							spaceScore = 75;
						}
						
						valTable[i][j] = spaceScore;
						addLog(checkVal + " score = " + valTable[i][j]);
						break;
					case "2.1": //Calculate bottom-middle value
						addLog("checkVal = " + checkVal + " | Calculating bottom-middle.");
						spaceScore = 0; //Reset score
						for (var x = 0; x < 3; x++){
							for (var y = 0; y < 3; y++){
								if((x == 2 && y == 1) || (x == 0 && y == 0) || (x == 0 && y == 2)){ //Skip: bottom-middle, top-left, top-right
									//Skip
								}
								else{
									if(selected[outerX][outerY][x][y] == 1){ //If the space is taken by an opponent, gain 1 point for blocking
										spaceScore++;
									}
									if(selected[outerX][outerY][x][y] == 2){ //If the space is taken by your character, gain 1 point for being in a row
										spaceScore++;
									}
								}	
							}
						}
						if ((selected[outerX][outerY][2][0] == 2 && selected[outerX][outerY][2][2] == 1) || (selected[outerX][outerY][2][0] == 1 && selected[outerX][outerY][2][2] == 2)){ //Lose 1 point if the bottom row is blocked
							spaceScore--;
						} 
						if ((selected[outerX][outerY][1][1] == 2 && selected[outerX][outerY][0][1] == 1) || (selected[outerX][outerY][1][1] == 1 && selected[outerX][outerY][0][1] == 2)){ //Lose 1 point if the center column is blocked
							spaceScore--;
						}
						valTable[i][j] = spaceScore;
						addLog(checkVal + " score = " + valTable[i][j]);
						break;
					case "2.2": //Calculate bottom-right value
						addLog("checkVal = " + checkVal + " | Calculating bottom-right.");
						spaceScore = 0; //Reset score
						for (var x = 0; x < 3; x++){
							for (var y = 0; y < 3; y++){
								if((x == 0 && y == 1) || (x == 1 && y == 0) || (x == 2 && y == 2)){ //Skip: top-middle, center-left, bottom-right
									//Skip
								}
								else{
									if(selected[outerX][outerY][x][y] == 1){ //If the space is taken by an opponent, gain 1 point for blocking
										spaceScore++;
									}
									if(selected[outerX][outerY][x][y] == 2){ //If the space is taken by your character, gain 1 point for being in a row
										spaceScore++;
									}
								}	
							}
						}
						if ((selected[outerX][outerY][2][0] == 2 && selected[outerX][outerY][2][1] == 1) || (selected[outerX][outerY][2][0] == 1 && selected[outerX][outerY][2][1] == 2)){ //Lose 1 point if the bottom row is blocked
							spaceScore--;
						} 
						if ((selected[outerX][outerY][1][1] == 2 && selected[outerX][outerY][0][0] == 1) || (selected[outerX][outerY][1][1] == 1 && selected[outerX][outerY][0][0] == 2)){ //Lose 1 point if the diaganol row is blocked
							spaceScore--;
						}
						if ((selected[outerX][outerY][0][2] == 2 && selected[outerX][outerY][1][2] == 1) || (selected[outerX][outerY][0][2] == 1 && selected[outerX][outerY][1][2] == 2)){ //Lose 1 point if the right column is blocked
							spaceScore--;
						}
						//Check for diaganol win
						if ((selected[outerX][outerY][1][1] == 2 && selected[outerX][outerY][0][0] == 2)){ //Gain a point for 2 in a row diaganol
							spaceScore = 100;
						}
						//Check for verical wins
						if ((selected[outerX][outerY][1][2] == 2 && selected[outerX][outerY][2][2] == 2)){ //Gain a point for 2 in a row diaganol
							spaceScore = 100;
						}
						//Check for horizontal wins
						if ((selected[outerX][outerY][0][1] == 2 && selected[outerX][outerY][0][0] == 2)){ //Gain a point for 2 in a row diaganol
							spaceScore = 100;
						}
						//Check for diaganol win blocks
						if ((selected[outerX][outerY][1][1] == 1 && selected[outerX][outerY][0][0] == 1)){ //Gain a point for 2 in a row diaganol
							spaceScore = 75;
						}
						//Check for verical win blocks
						if ((selected[outerX][outerY][1][2] == 1 && selected[outerX][outerY][2][2] == 1)){ //Gain a point for 2 in a row diaganol
							spaceScore = 75;
						}
						//Check for horizontal win blocks
						if ((selected[outerX][outerY][0][1] == 1 && selected[outerX][outerY][0][0] == 1)){ //Gain a point for 2 in a row diaganol
							spaceScore = 75;
						}
						
						valTable[i][j] = spaceScore;
						addLog(checkVal + " score = " + valTable[i][j]);
						break;
				}
			}
		}
	}
	addLog("Move values from left to right, top to bottom: " + valTable);
	
	/*--- Select move from best options ---*/
	//Find best value
	var bestOption = valTable[0][0];
	for (var alpha = 0; alpha < 3; alpha++){
		for (var beta = 0; beta < 3; beta++){
			if (bestOption < valTable[alpha][beta]){
				bestOption = valTable[alpha][beta];
			}
		}
	}
	addLog("Best value = " + bestOption);
	var possibleOptions = []; //array holding the possible places to move on the inner board
	var optionCounter = 0;
	var selectedOption = 0;
	var bestOptionLocation = [0,0,0,0];
	for (var ares = 0; ares < 3; ares++){
		for (var zeus = 0; zeus < 3; zeus++){
			if (bestOption == valTable[ares][zeus]){
				possibleOptions[optionCounter] = ares;
				optionCounter++;
				possibleOptions[optionCounter] = zeus;
				optionCounter++;
			}
		}
	}
	var optionString = "";
	for(var test = 0; test < possibleOptions.length; test++){
		optionString = (optionString + " (" + possibleOptions[test] + ", " + possibleOptions[test + 1] + ")");
		test++;
	}
	addLog("Possible options:");
	addLog(optionString);
	selectedOption = (Math.floor(Math.random() * (possibleOptions.length / 2)) * 2);
	bestOptionLocation[0] = outerX;
	bestOptionLocation[1] = outerY;
	addLog("selected option = " + selectedOption);
	bestOptionLocation[2] = possibleOptions[selectedOption];
	bestOptionLocation[3] = possibleOptions[selectedOption + 1];
	addLog("Best option location = " + bestOptionLocation);
	return bestOptionLocation;
 }