/*	AI 1: Easy mode using depth-bound, min-max search with evaluation function
	Created by: Courtney Campbell, Brandon Charles, Marissa Collins, and Hannah Millea
	
	Dumb AI Evaluation function:
	4 Criteria to be used when evaluating a move
	
	-Gain one point for each opponent character in a row from potential space
	-Gain one point for each of your characters in a row from potential space
	-Lose one point for each of your characters in a row with an opponent's character and the potential space
	-Winning a game takes highest priority, while stopping an opponent from winning is second highest.
	-A space has a value of 0 if it is already taken
	
	AI Levels:
	Level 1: Dumb AI - Uses a Single-Ply look-a-head to determine the best move for that specific inner game. Decisions amongst ties are random.
	Level 2: AI - Uses a Two-Ply look-a-head to determine the best move for that specific inner game, and the worst move for the opponent in the next turn. Decisions amongst ties are random.
	Level 3: Smart AI - Uses a Multi-Ply look-a-head to determine the best possible set of moves. Decisions amongst ties are branched out for the best case. Moves cannot exceed a decision time of 2.5 minutes.
 */
 
//Player AI: Level 1
 function playerAILevel1(outX, outY, wonGames, playerTurn){
	//Make the inputs variables for easy modifications
	var outsideX = outX;
	var outsideY = outY;
	var wonGameCells = wonGames;
	
	var opponentTurn;
	if(playerTurn == 1){
		opponentTurn = 2;
	} else{
		opponentTurn = 1;
	}
	
	//addLog("Won cells: " + wonGameCells);
	 
	/*--- Check to see if the inner game has been won ---*/
	var wonCheck = false;
	while(wonCheck == false){
		//addLog("Checking cell " + outsideX + "," + outsideY);
		//If the selected game has already been won, choose a new one
		if (wonGameCells[outsideX][outsideY] != 0){
			//addLog("The cell was won by " + wonGameCells[outsideX][outsideY]);
			//Select a random game to play in and check again
			outsideX = Math.floor(Math.random() * 3);
			outsideY = Math.floor(Math.random() * 3);
			//addLog("New cell to check is " + outsideX + "," + outsideY);
		}
		//The selected game hasn't been won, continue to move selection
		else{
			//addLog("The following cell is valid " + outsideX + "," + outsideY);
			wonCheck = true;
		}
	}
	
	/*--- Evaluate possible moves ---*/
	
	//Create a value table for the game
	//This holds the point values of each space in the game
	//valTable: x by y
	/*
		    x0  x1  x2
		y0 0.0 1.0 2.0
		y1 0.1 1.1 2.1
		y2 0.2 1.2 2.2
	*/
	var valTable = [[0,0,0],
					[0,0,0],
					[0,0,0]];
	 
	 var checkVal; //Determines which square you are calculating for
	 var spaceScore = 0; //Point value for the space being calculated
	
	//Check the value of possible moves in game x,y
	for(var i = 0; i < 3; i++){ //Check columns (x)
		for (var j = 0; j < 3; j++){ //Check rows (y)
			checkVal = i + "." + j; //Which square is being checked
			//addLog("Calculating " + checkVal);
			
			//If the space is taken, set the point value to 0
			if(selected[outsideX][outsideY][i][j] == opponentTurn  || selected[outsideX][outsideY][i][j] == playerTurn){
				valTable[i][j] = 0;
				//addLog("Coords (" + i + "," + j + ") are already filled.");
			}
			//Otherwise, calculate the value
			else{
				switch(checkVal){
					case "0.0": //left-top
						//addLog("checkVal = " + checkVal + " | Calculating left-top.");
						spaceScore = 1; //Reset score
						
						/*--- Check for single space moves ---*/
						for (var x = 0; x < 3; x++){ //Check columns (x)
							for (var y = 0; y < 3; y++){ //Check rows (y)
							//addLog("Checking coords(" + x + "." + y + ")");
								//Skip spaces that aren't in line with the one being evaluated, and skip the space being evaluated
								//Skip: left-top, middle-bottom, right-center
								if((x == 0 && y == 0) || (x == 1 && y == 2) || (x == 2 && y == 1)){
									//Skip
									//addLog("This space offers no additional value. Skip.");
								}
								//Add points for blocking an opponent, or lining up a move for self
								else{
									if(selected[outsideX][outsideY][x][y] == opponentTurn){ //Block
										spaceScore++;
										//addLog("Blocking an opponent's move: +1. Score = " + spaceScore);
									}
									if(selected[outsideX][outsideY][x][y] == playerTurn){ //Set-up
										spaceScore++;
										//addLog("Setting up a move for yourself: +1. Score = " + spaceScore);
									}
								}	
							}
						}
						/*--- Check for blocked moves (-1 point)---*/
						//Top row
						if ((selected[outsideX][outsideY][1][0] == playerTurn && selected[outsideX][outsideY][2][0] == opponentTurn) || (selected[outsideX][outsideY][1][0] == opponentTurn && selected[outsideX][outsideY][2][0] == playerTurn)){
							spaceScore--;
						}
						//diagonal
						if ((selected[outsideX][outsideY][1][1] == playerTurn && selected[outsideX][outsideY][2][2] == opponentTurn) || (selected[outsideX][outsideY][1][1] == opponentTurn && selected[outsideX][outsideY][2][2] == playerTurn)){
							spaceScore--;
						}
						//Left column
						if ((selected[outsideX][outsideY][0][1] == playerTurn && selected[outsideX][outsideY][0][2] == opponentTurn) || (selected[outsideX][outsideY][0][1] == opponentTurn && selected[outsideX][outsideY][0][2] == playerTurn)){
							spaceScore--;
						}
						/*--- Check for winning moves (opponent) (Second highest priority = 75 points) ---*/
						//Top row
						if ((selected[outsideX][outsideY][1][0] == opponentTurn && selected[outsideX][outsideY][2][0] == opponentTurn)){
							spaceScore = 75;
						}
						//diagonal
						if ((selected[outsideX][outsideY][1][1] == opponentTurn && selected[outsideX][outsideY][2][2] == opponentTurn)){
							spaceScore = 75;
						}
						//Left column
						if ((selected[outsideX][outsideY][0][1] == opponentTurn && selected[outsideX][outsideY][0][2] == opponentTurn)){
							spaceScore = 75;
						}
						/*--- Check for winning moves (self) (Highest priority = 100 points) ---*/
						//Top row
						if ((selected[outsideX][outsideY][1][0] == playerTurn && selected[outsideX][outsideY][2][0] == playerTurn)){
							spaceScore = 100;
						}
						//diagonal
						if ((selected[outsideX][outsideY][1][1] == playerTurn && selected[outsideX][outsideY][2][2] == playerTurn)){
							spaceScore = 100;
						}
						//Left column
						if ((selected[outsideX][outsideY][0][1] == playerTurn && selected[outsideX][outsideY][0][2] == playerTurn)){
							spaceScore = 100;
						}
						
						//Add the score to the table
						valTable[i][j] = spaceScore;
						//addLog(checkVal + " score = " + valTable[i][j]);
						break;
					case "0.1": //left-center
					//addLog("checkVal = " + checkVal + " | Calculating left-center.");
						spaceScore = 1; //Reset score
						
						/*--- Check for single space moves ---*/
						for (var x = 0; x < 3; x++){ //Check columns (x)
							for (var y = 0; y < 3; y++){ //Check rows (y)
							//addLog("Checking coords(" + x + "." + y + ")");
								//Skip spaces that aren't in line with the one being evaluated, and skip the space being evaluated
								//Skip: left-center, right-top, right-bottom
								if((x == 0 && y == 1) || (x == 2 && y == 0) || (x == 2 && y == 2)){
									//Skip
									//addLog("This space offers no additional value. Skip.");
								}
								//Add points for blocking an opponent, or lining up a move for self
								else{
									if(selected[outsideX][outsideY][x][y] == opponentTurn){ //Block
										spaceScore++;
										//addLog("Blocking an opponent's move: +1. Score = " + spaceScore);
									}
									if(selected[outsideX][outsideY][x][y] == playerTurn){ //Set-up
										spaceScore++;
										//addLog("Setting up a move for yourself: +1. Score = " + spaceScore);
									}
								}	
							}
						}
						/*--- Check for blocked moves (-1 point)---*/
						//Center row
						if ((selected[outsideX][outsideY][1][1] == playerTurn && selected[outsideX][outsideY][2][1] == opponentTurn) || (selected[outsideX][outsideY][1][1] == opponentTurn && selected[outsideX][outsideY][2][1] == playerTurn)){
							spaceScore--;
						}
						//Left column
						if ((selected[outsideX][outsideY][0][0] == playerTurn && selected[outsideX][outsideY][0][2] == opponentTurn) || (selected[outsideX][outsideY][0][0] == opponentTurn && selected[outsideX][outsideY][0][2] == playerTurn)){
							spaceScore--;
						}
						/*--- Check for winning moves (opponent) (Second highest priority = 75 points) ---*/
						//Center row
						if ((selected[outsideX][outsideY][1][1] == opponentTurn && selected[outsideX][outsideY][2][1] == opponentTurn)){
							spaceScore = 75;
						}
						//Left column
						if ((selected[outsideX][outsideY][0][0] == opponentTurn && selected[outsideX][outsideY][0][2] == opponentTurn)){
							spaceScore = 75;
						}
						/*--- Check for winning moves (self) (Highest priority = 100 points) ---*/
						//Center row
						if ((selected[outsideX][outsideY][1][1] == playerTurn && selected[outsideX][outsideY][2][1] == playerTurn)){
							spaceScore = 100;
						}
						//Left column
						if ((selected[outsideX][outsideY][0][0] == playerTurn && selected[outsideX][outsideY][0][2] == playerTurn)){
							spaceScore = 100;
						}
						
						//Add the score to the table
						valTable[i][j] = spaceScore;
						//addLog(checkVal + " score = " + valTable[i][j]);
						break;
					case "0.2": //left-bottom
					//addLog("checkVal = " + checkVal + " | Calculating left-bottom.");
						spaceScore = 1; //Reset score
						
						/*--- Check for single space moves ---*/
						for (var x = 0; x < 3; x++){ //Check columns (x)
							for (var y = 0; y < 3; y++){ //Check rows (y)
							//addLog("Checking coords(" + x + "." + y + ")");
								//Skip spaces that aren't in line with the one being evaluated, and skip the space being evaluated
								//Skip: left-bottom, middle-top, right-center
								if((x == 0 && y == 2) || (x == 1 && y == 0) || (x == 2 && y == 1)){
									//Skip
									//addLog("This space offers no additional value. Skip.");
								}
								//Add points for blocking an opponent, or lining up a move for self
								else{
									if(selected[outsideX][outsideY][x][y] == opponentTurn){ //Block
										spaceScore++;
										//addLog("Blocking an opponent's move: +1. Score = " + spaceScore);
									}
									if(selected[outsideX][outsideY][x][y] == playerTurn){ //Set-up
										spaceScore++;
										//addLog("Setting up a move for yourself: +1. Score = " + spaceScore);
									}
								}	
							}
						}
						/*--- Check for blocked moves (-1 point)---*/
						//Bottom row
						if ((selected[outsideX][outsideY][1][2] == playerTurn && selected[outsideX][outsideY][2][2] == opponentTurn) || (selected[outsideX][outsideY][1][2] == opponentTurn && selected[outsideX][outsideY][2][2] == playerTurn)){
							spaceScore--;
						}
						//diagonal
						if ((selected[outsideX][outsideY][1][1] == playerTurn && selected[outsideX][outsideY][2][0] == opponentTurn) || (selected[outsideX][outsideY][1][1] == opponentTurn && selected[outsideX][outsideY][2][0] == playerTurn)){
							spaceScore--;
						}
						//Left column
						if ((selected[outsideX][outsideY][0][0] == playerTurn && selected[outsideX][outsideY][0][1] == opponentTurn) || (selected[outsideX][outsideY][0][0] == opponentTurn && selected[outsideX][outsideY][0][1] == playerTurn)){
							spaceScore--;
						}
						/*--- Check for winning moves (opponent) (Second highest priority = 75 points) ---*/
						//Bottom row
						if ((selected[outsideX][outsideY][1][2] == opponentTurn && selected[outsideX][outsideY][2][2] == opponentTurn)){
							spaceScore = 75;
						}
						//diagonal
						if ((selected[outsideX][outsideY][1][1] == opponentTurn && selected[outsideX][outsideY][2][0] == opponentTurn)){
							spaceScore = 75;
						}
						//Left column
						if ((selected[outsideX][outsideY][0][0] == opponentTurn && selected[outsideX][outsideY][0][1] == opponentTurn)){
							spaceScore = 75;
						}
						/*--- Check for winning moves (self) (Highest priority = 100 points) ---*/
						//Bottom row
						if ((selected[outsideX][outsideY][1][2] == playerTurn && selected[outsideX][outsideY][2][2] == playerTurn)){
							spaceScore = 100;
						}
						//diagonal
						if ((selected[outsideX][outsideY][1][1] == playerTurn && selected[outsideX][outsideY][2][0] == playerTurn)){
							spaceScore = 100;
						}
						//Left column
						if ((selected[outsideX][outsideY][0][0] == playerTurn && selected[outsideX][outsideY][0][1] == playerTurn)){
							spaceScore = 100;
						}
						
						//Add the score to the table
						valTable[i][j] = spaceScore;
						//addLog(checkVal + " score = " + valTable[i][j]);
						break;
					case "1.0": //middle-top
					//addLog("checkVal = " + checkVal + " | Calculating middle-top.");
						spaceScore = 1; //Reset score
						
						/*--- Check for single space moves ---*/
						for (var x = 0; x < 3; x++){ //Check columns (x)
							for (var y = 0; y < 3; y++){ //Check rows (y)
							//addLog("Checking coords(" + x + "." + y + ")");
								//Skip spaces that aren't in line with the one being evaluated, and skip the space being evaluated
								//Skip: left-bottom, middle-top, right-bottom
								if((x == 0 && y == 2) || (x == 1 && y == 0) || (x == 2 && y == 2)){
									//Skip
									//addLog("This space offers no additional value. Skip.");
								}
								//Add points for blocking an opponent, or lining up a move for self
								else{
									if(selected[outsideX][outsideY][x][y] == opponentTurn){ //Block
										spaceScore++;
										//addLog("Blocking an opponent's move: +1. Score = " + spaceScore);
									}
									if(selected[outsideX][outsideY][x][y] == playerTurn){ //Set-up
										spaceScore++;
										//addLog("Setting up a move for yourself: +1. Score = " + spaceScore);
									}
								}	
							}
						}
						/*--- Check for blocked moves (-1 point)---*/
						//Top row
						if ((selected[outsideX][outsideY][0][0] == playerTurn && selected[outsideX][outsideY][2][0] == opponentTurn) || (selected[outsideX][outsideY][0][0] == opponentTurn && selected[outsideX][outsideY][2][0] == playerTurn)){
							spaceScore--;
						}
						//Middle column
						if ((selected[outsideX][outsideY][1][1] == playerTurn && selected[outsideX][outsideY][1][2] == opponentTurn) || (selected[outsideX][outsideY][1][1] == opponentTurn && selected[outsideX][outsideY][1][2] == playerTurn)){
							spaceScore--;
						}
						/*--- Check for winning moves (opponent) (Second highest priority = 75 points) ---*/
						//Top row
						if ((selected[outsideX][outsideY][0][0] == opponentTurn && selected[outsideX][outsideY][2][0] == opponentTurn)){
							spaceScore = 75;
						}
						//Middle column
						if ((selected[outsideX][outsideY][1][1] == opponentTurn && selected[outsideX][outsideY][1][2] == opponentTurn)){
							spaceScore = 75;
						}
						/*--- Check for winning moves (self) (Highest priority = 100 points) ---*/
						//Top row
						if ((selected[outsideX][outsideY][0][0] == playerTurn && selected[outsideX][outsideY][2][0] == playerTurn)){
							spaceScore = 100;
						}
						//Middle column
						if ((selected[outsideX][outsideY][1][1] == playerTurn && selected[outsideX][outsideY][1][2] == playerTurn)){
							spaceScore = 100;
						}
						
						//Add the score to the table
						valTable[i][j] = spaceScore;
						//addLog(checkVal + " score = " + valTable[i][j]);
						break;
					case "1.1": //middle-center
					//addLog("checkVal = " + checkVal + " | Calculating middle-center.");
						spaceScore = 1; //Reset score
						
						/*--- Check for single space moves ---*/
						for (var x = 0; x < 3; x++){ //Check columns (x)
							for (var y = 0; y < 3; y++){ //Check rows (y)
							//addLog("Checking coords(" + x + "." + y + ")");
								//Skip spaces that aren't in line with the one being evaluated, and skip the space being evaluated
								//Skip: middle-center
								if((x == 1 && y == 1)){
									//Skip
									//addLog("This space offers no additional value. Skip.");
								}
								//Add points for blocking an opponent, or lining up a move for self
								else{
									if(selected[outsideX][outsideY][x][y] == opponentTurn){ //Block
										spaceScore++;
										//addLog("Blocking an opponent's move: +1. Score = " + spaceScore);
									}
									if(selected[outsideX][outsideY][x][y] == playerTurn){ //Set-up
										spaceScore++;
										//addLog("Setting up a move for yourself: +1. Score = " + spaceScore);
									}
								}	
							}
						}
						/*--- Check for blocked moves (-1 point)---*/
						//Center row
						if ((selected[outsideX][outsideY][0][1] == playerTurn && selected[outsideX][outsideY][2][1] == opponentTurn) || (selected[outsideX][outsideY][0][1] == opponentTurn && selected[outsideX][outsideY][2][1] == playerTurn)){
							spaceScore--;
						}
						//Diagonals
						if ((selected[outsideX][outsideY][0][0] == playerTurn && selected[outsideX][outsideY][2][2] == opponentTurn) || (selected[outsideX][outsideY][0][0] == opponentTurn && selected[outsideX][outsideY][2][2] == playerTurn)){
							spaceScore--;
						}
						if ((selected[outsideX][outsideY][0][2] == playerTurn && selected[outsideX][outsideY][2][0] == opponentTurn) || (selected[outsideX][outsideY][0][2] == opponentTurn && selected[outsideX][outsideY][2][0] == playerTurn)){
							spaceScore--;
						}
						//Middle column
						if ((selected[outsideX][outsideY][1][0] == playerTurn && selected[outsideX][outsideY][1][2] == opponentTurn) || (selected[outsideX][outsideY][1][0] == opponentTurn && selected[outsideX][outsideY][1][2] == playerTurn)){
							spaceScore--;
						}
						/*--- Check for winning moves (opponent) (Second highest priority = 75 points) ---*/
						//Top row
						if ((selected[outsideX][outsideY][0][1] == opponentTurn && selected[outsideX][outsideY][2][1] == opponentTurn)){
							spaceScore = 75;
						}
						//Diagonals
						if ((selected[outsideX][outsideY][0][0] == opponentTurn && selected[outsideX][outsideY][2][2] == opponentTurn)){
							spaceScore = 75;
						}
						if ((selected[outsideX][outsideY][0][2] == opponentTurn && selected[outsideX][outsideY][2][0] == opponentTurn)){
							spaceScore = 75;
						}
						//Middlecolumn
						if ((selected[outsideX][outsideY][0][1] == opponentTurn && selected[outsideX][outsideY][0][2] == opponentTurn)){
							spaceScore = 75;
						}
						/*--- Check for winning moves (self) (Highest priority = 100 points) ---*/
						//Top row
						if ((selected[outsideX][outsideY][0][1] == playerTurn && selected[outsideX][outsideY][2][1] == playerTurn)){
							spaceScore = 100;
						}
						//Diagonals
						if ((selected[outsideX][outsideY][0][0] == playerTurn && selected[outsideX][outsideY][2][2] == playerTurn)){
							spaceScore = 100;
						}
						if ((selected[outsideX][outsideY][0][2] == playerTurn && selected[outsideX][outsideY][2][0] == playerTurn)){
							spaceScore = 100;
						}
						//Middle column
						if ((selected[outsideX][outsideY][0][1] == playerTurn && selected[outsideX][outsideY][0][2] == playerTurn)){
							spaceScore = 100;
						}
						
						//Add the score to the table
						valTable[i][j] = spaceScore;
						//addLog(checkVal + " score = " + valTable[i][j]);
						break;
					case "1.2": //middle-bottom
					//addLog("checkVal = " + checkVal + " | Calculating middle-bottom.");
						spaceScore = 1; //Reset score
						
						/*--- Check for single space moves ---*/
						for (var x = 0; x < 3; x++){ //Check columns (x)
							for (var y = 0; y < 3; y++){ //Check rows (y)
							//addLog("Checking coords(" + x + "." + y + ")");
								//Skip spaces that aren't in line with the one being evaluated, and skip the space being evaluated
								//Skip: left-top, middle-bottom, right-top
								if((x == 0 && y == 0) || (x == 1 && y == 2) || (x == 2 && y == 0)){
									//Skip
									//addLog("This space offers no additional value. Skip.");
								}
								//Add points for blocking an opponent, or lining up a move for self
								else{
									if(selected[outsideX][outsideY][x][y] == opponentTurn){ //Block
										spaceScore++;
										//addLog("Blocking an opponent's move: +1. Score = " + spaceScore);
									}
									if(selected[outsideX][outsideY][x][y] == playerTurn){ //Set-up
										spaceScore++;
										//addLog("Setting up a move for yourself: +1. Score = " + spaceScore);
									}
								}	
							}
						}
						/*--- Check for blocked moves (-1 point)---*/
						//Bottom row
						if ((selected[outsideX][outsideY][0][2] == playerTurn && selected[outsideX][outsideY][2][2] == opponentTurn) || (selected[outsideX][outsideY][0][2] == opponentTurn && selected[outsideX][outsideY][2][2] == playerTurn)){
							spaceScore--;
						}
						//Middle column
						if ((selected[outsideX][outsideY][1][0] == playerTurn && selected[outsideX][outsideY][1][1] == opponentTurn) || (selected[outsideX][outsideY][1][0] == opponentTurn && selected[outsideX][outsideY][1][1] == playerTurn)){
							spaceScore--;
						}
						/*--- Check for winning moves (opponent) (Second highest priority = 75 points) ---*/
						//Top row
						if ((selected[outsideX][outsideY][0][2] == opponentTurn && selected[outsideX][outsideY][2][2] == opponentTurn)){
							spaceScore = 75;
						}
						//Middle column
						if ((selected[outsideX][outsideY][1][0] == opponentTurn && selected[outsideX][outsideY][1][1] == opponentTurn)){
							spaceScore = 75;
						}
						/*--- Check for winning moves (self) (Highest priority = 100 points) ---*/
						//Top row
						if ((selected[outsideX][outsideY][0][2] == playerTurn && selected[outsideX][outsideY][2][2] == playerTurn)){
							spaceScore = 100;
						}
						//Middle column
						if ((selected[outsideX][outsideY][1][0] == playerTurn && selected[outsideX][outsideY][1][1] == playerTurn)){
							spaceScore = 100;
						}
						
						//Add the score to the table
						valTable[i][j] = spaceScore;
						//addLog(checkVal + " score = " + valTable[i][j]);
						break;
					case "2.0": //right-top
					//addLog("checkVal = " + checkVal + " | Calculating right-top.");
						spaceScore = 1; //Reset score
						
						/*--- Check for single space moves ---*/
						for (var x = 0; x < 3; x++){ //Check columns (x)
							for (var y = 0; y < 3; y++){ //Check rows (y)
							//addLog("Checking coords(" + x + "." + y + ")");
								//Skip spaces that aren't in line with the one being evaluated, and skip the space being evaluated
								//Skip: left-center, middle-bottom, right-top
								if((x == 0 && y == 1) || (x == 1 && y == 2) || (x == 2 && y == 0)){
									//Skip
									//addLog("This space offers no additional value. Skip.");
								}
								//Add points for blocking an opponent, or lining up a move for self
								else{
									if(selected[outsideX][outsideY][x][y] == opponentTurn){ //Block
										spaceScore++;
										//addLog("Blocking an opponent's move: +1. Score = " + spaceScore);
									}
									if(selected[outsideX][outsideY][x][y] == playerTurn){ //Set-up
										spaceScore++;
										//addLog("Setting up a move for yourself: +1. Score = " + spaceScore);
									}
								}	
							}
						}
						/*--- Check for blocked moves (-1 point)---*/
						//Top row
						if ((selected[outsideX][outsideY][0][0] == playerTurn && selected[outsideX][outsideY][1][0] == opponentTurn) || (selected[outsideX][outsideY][0][0] == opponentTurn && selected[outsideX][outsideY][1][0] == playerTurn)){
							spaceScore--;
						}
						//diagonal
						if ((selected[outsideX][outsideY][1][1] == playerTurn && selected[outsideX][outsideY][0][2] == opponentTurn) || (selected[outsideX][outsideY][1][1] == opponentTurn && selected[outsideX][outsideY][0][2] == playerTurn)){
							spaceScore--;
						}
						//Right column
						if ((selected[outsideX][outsideY][2][1] == playerTurn && selected[outsideX][outsideY][2][2] == opponentTurn) || (selected[outsideX][outsideY][2][1] == opponentTurn && selected[outsideX][outsideY][2][2] == playerTurn)){
							spaceScore--;
						}
						/*--- Check for winning moves (opponent) (Second highest priority = 75 points) ---*/
						//Top row
						if ((selected[outsideX][outsideY][0][0] == opponentTurn && selected[outsideX][outsideY][1][0] == opponentTurn)){
							spaceScore = 75;
						}
						//diagonal
						if ((selected[outsideX][outsideY][1][1] == opponentTurn && selected[outsideX][outsideY][0][2] == opponentTurn)){
							spaceScore = 75;
						}
						//Right column
						if ((selected[outsideX][outsideY][2][1] == opponentTurn && selected[outsideX][outsideY][2][2] == opponentTurn)){
							spaceScore = 75;
						}
						/*--- Check for winning moves (self) (Highest priority = 100 points) ---*/
						//Top row
						if ((selected[outsideX][outsideY][0][0] == playerTurn && selected[outsideX][outsideY][1][0] == playerTurn)){
							spaceScore = 100;
						}
						//diagonal
						if ((selected[outsideX][outsideY][1][1] == playerTurn && selected[outsideX][outsideY][0][2] == playerTurn)){
							spaceScore = 100;
						}
						//Right column
						if ((selected[outsideX][outsideY][2][1] == playerTurn && selected[outsideX][outsideY][2][2] == playerTurn)){
							spaceScore = 100;
						}
						
						//Add the score to the table
						valTable[i][j] = spaceScore;
						//addLog(checkVal + " score = " + valTable[i][j]);
						break;
					case "2.1": //right-center
					//addLog("checkVal = " + checkVal + " | Calculating right-center.");
						spaceScore = 1; //Reset score
						
						/*--- Check for single space moves ---*/
						for (var x = 0; x < 3; x++){ //Check columns (x)
							for (var y = 0; y < 3; y++){ //Check rows (y)
							//addLog("Checking coords(" + x + "." + y + ")");
								//Skip spaces that aren't in line with the one being evaluated, and skip the space being evaluated
								//Skip: left-top left-bottom, right-center
								if((x == 0 && y == 0) || (x == 0 && y == 2) || (x == 2 && y == 1)){
									//Skip
									//addLog("This space offers no additional value. Skip.");
								}
								//Add points for blocking an opponent, or lining up a move for self
								else{
									if(selected[outsideX][outsideY][x][y] == opponentTurn){ //Block
										spaceScore++;
										//addLog("Blocking an opponent's move: +1. Score = " + spaceScore);
									}
									if(selected[outsideX][outsideY][x][y] == playerTurn){ //Set-up
										spaceScore++;
										//addLog("Setting up a move for yourself: +1. Score = " + spaceScore);
									}
								}	
							}
						}
						/*--- Check for blocked moves (-1 point)---*/
						//Center row
						if ((selected[outsideX][outsideY][0][1] == playerTurn && selected[outsideX][outsideY][1][1] == opponentTurn) || (selected[outsideX][outsideY][0][1] == opponentTurn && selected[outsideX][outsideY][1][1] == playerTurn)){
							spaceScore--;
						}
						//Right column
						if ((selected[outsideX][outsideY][2][0] == playerTurn && selected[outsideX][outsideY][2][2] == opponentTurn) || (selected[outsideX][outsideY][2][0] == opponentTurn && selected[outsideX][outsideY][2][2] == playerTurn)){
							spaceScore--;
						}
						/*--- Check for winning moves (opponent) (Second highest priority = 75 points) ---*/
						//Center row
						if ((selected[outsideX][outsideY][0][1] == opponentTurn && selected[outsideX][outsideY][1][1] == opponentTurn)){
							spaceScore = 75;
						}
						//Right column
						if ((selected[outsideX][outsideY][2][0] == opponentTurn && selected[outsideX][outsideY][2][2] == opponentTurn)){
							spaceScore = 75;
						}
						/*--- Check for winning moves (self) (Highest priority = 100 points) ---*/
						//Center row
						if ((selected[outsideX][outsideY][0][1] == playerTurn && selected[outsideX][outsideY][1][1] == playerTurn)){
							spaceScore = 100;
						}
						//Right column
						if ((selected[outsideX][outsideY][2][0] == playerTurn && selected[outsideX][outsideY][2][2] == playerTurn)){
							spaceScore = 100;
						}
						
						//Add the score to the table
						valTable[i][j] = spaceScore;
						//addLog(checkVal + " score = " + valTable[i][j]);
						break;
					case "2.2": //right-bottom
					//addLog("checkVal = " + checkVal + " | Calculating right-bottom.");
						spaceScore = 1; //Reset score
						
						/*--- Check for single space moves ---*/
						for (var x = 0; x < 3; x++){ //Check columns (x)
							for (var y = 0; y < 3; y++){ //Check rows (y)
							//addLog("Checking coords(" + x + "." + y + ")");
								//Skip spaces that aren't in line with the one being evaluated, and skip the space being evaluated
								//Skip: left-center, middle-top, right-bottom
								if((x == 0 && y == 1) || (x == 1 && y == 0) || (x == 2 && y == 2)){
									//Skip
									//addLog("This space offers no additional value. Skip.");
								}
								//Add points for blocking an opponent, or lining up a move for self
								else{
									if(selected[outsideX][outsideY][x][y] == opponentTurn){ //Block
										spaceScore++;
										//addLog("Blocking an opponent's move: +1. Score = " + spaceScore);
									}
									if(selected[outsideX][outsideY][x][y] == playerTurn){ //Set-up
										spaceScore++;
										//addLog("Setting up a move for yourself: +1. Score = " + spaceScore);
									}
								}	
							}
						}
						/*--- Check for blocked moves (-1 point)---*/
						//Bottom row
						if ((selected[outsideX][outsideY][0][2] == playerTurn && selected[outsideX][outsideY][1][2] == opponentTurn) || (selected[outsideX][outsideY][0][2] == opponentTurn && selected[outsideX][outsideY][1][2] == playerTurn)){
							spaceScore--;
						}
						//diagonal
						if ((selected[outsideX][outsideY][1][1] == playerTurn && selected[outsideX][outsideY][0][0] == opponentTurn) || (selected[outsideX][outsideY][1][1] == opponentTurn && selected[outsideX][outsideY][0][0] == playerTurn)){
							spaceScore--;
						}
						//Right column
						if ((selected[outsideX][outsideY][2][0] == playerTurn && selected[outsideX][outsideY][2][1] == opponentTurn) || (selected[outsideX][outsideY][2][0] == opponentTurn && selected[outsideX][outsideY][2][1] == playerTurn)){
							spaceScore--;
						}
						/*--- Check for winning moves (opponent) (Second highest priority = 75 points) ---*/
						//Bottom row
						if ((selected[outsideX][outsideY][0][2] == opponentTurn && selected[outsideX][outsideY][1][2] == opponentTurn)){
							spaceScore = 75;
						}
						//diagonal
						if ((selected[outsideX][outsideY][1][1] == opponentTurn && selected[outsideX][outsideY][0][0] == opponentTurn)){
							spaceScore = 75;
						}
						//Right column
						if ((selected[outsideX][outsideY][2][0] == opponentTurn && selected[outsideX][outsideY][2][1] == opponentTurn)){
							spaceScore = 75;
						}
						/*--- Check for winning moves (self) (Highest priority = 100 points) ---*/
						//Bottom row
						if ((selected[outsideX][outsideY][0][2] == playerTurn && selected[outsideX][outsideY][1][2] == playerTurn)){
							spaceScore = 100;
						}
						//diagonal
						if ((selected[outsideX][outsideY][1][1] == playerTurn && selected[outsideX][outsideY][0][0] == playerTurn)){
							spaceScore = 100;
						}
						//Right column
						if ((selected[outsideX][outsideY][2][0] == playerTurn && selected[outsideX][outsideY][2][1] == playerTurn)){
							spaceScore = 100;
						}
						
						//Add the score to the table
						valTable[i][j] = spaceScore;
						//addLog(checkVal + " score = " + valTable[i][j]);
						break;
				}
			}
		}
	}
	
	//addLog("Value table: " + valTable);
	
	/*--- Select move from best options ---*/
	//Find best score
	var bestOption = valTable[0][0]; //Current best option
	for (var alpha = 0; alpha < 3; alpha++){
		for (var beta = 0; beta < 3; beta++){
			if (bestOption < valTable[alpha][beta]){
				bestOption = valTable[alpha][beta];
			}
		}
	}
	//addLog("Best value = " + bestOption);
	
	//Find the possible locations of the best score
	var possibleOptions = []; //array holding the possible places to move on the inner board
	var optionCounter = 0; //counter used to increment array position
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
	
	//Randomly select one of the possible locations
	var selectedOption = 0; //Randomly selected x position of best option
	var bestOptionLocation = [0,0,0,0]; //Best option coordinates [outsideX, outsideY, innerX, innerY]
	var optionString = ""; //Concatenated possible options for displaying as coordinate pairs
	for(var test = 0; test < possibleOptions.length; test++){
		optionString = (optionString + " (" + possibleOptions[test] + ", " + possibleOptions[test + 1] + ")");
		test++;
	}
	//addLog("Possible options:");
	//addLog(optionString);
	selectedOption = Math.floor(Math.random() * (possibleOptions.length / 2)); //Randomly select x position of best option
	//addLog("Number of options = " + possibleOptions.length / 2);
	//addLog("Selected option = " + selectedOption);
	bestOptionLocation[0] = outsideX;
	bestOptionLocation[1] = outsideY;
	bestOptionLocation[2] = possibleOptions[selectedOption * 2];
	bestOptionLocation[3] = possibleOptions[(selectedOption * 2) + 1];
	if (playerTurn == 1){
		addLog("Red's best move is space (" + bestOptionLocation[2] + "," + bestOptionLocation[3] + ") in game (" + bestOptionLocation[0] + "," + bestOptionLocation[1] + ")");
	} else{
		addLog("Blue's best move is space (" + bestOptionLocation[2] + "," + bestOptionLocation[3] + ") in game (" + bestOptionLocation[0] + "," + bestOptionLocation[1] + ")");
	}
	return bestOptionLocation; //Return the best option's location
 }
 
 
 
 
 // Calculate multiply AI
 //Parameters:	outX = X position of next move to be made in large game board
 //				outY = Y position of next move to be made in large game board
 //				wonGames = array that holds the win states of the games (0 = not won, 1 = red, 2 = blue)
 //				gameBoard = array that holds the move states of the games (0 = open, 1 = red, 2 = blue)
 //				playerTurn = which player is the AI currently (1 = red, 2 = blue)
 function calcAI(outX, outY, wonGames, gameBoard, playerTurn){
	//Make the parameters variables for easy modifications
	var outsideX = outX;
	var outsideY = outY;
	var wonGameCells = wonGames;
	var gameState = gameBoard;
	
	var opponentTurn;
	if(playerTurn == 1){
		opponentTurn = 2;
	} else{
		opponentTurn = 1;
	}
	
	//addLog("Won cells: " + wonGameCells);
	 
	/*--- Check to see if the inner game has been won ---*/
	var wonCheck = false;
	while(wonCheck == false){
		//addLog("Checking cell " + outsideX + "," + outsideY);
		//If the selected game has already been won, choose a new one
		if (wonGameCells[outsideX][outsideY] != 0){
			//addLog("The cell was won by " + wonGameCells[outsideX][outsideY]);
			//Select a random game to play in and check again
			outsideX = Math.floor(Math.random() * 3);
			outsideY = Math.floor(Math.random() * 3);
			//addLog("New cell to check is " + outsideX + "," + outsideY);
		}
		//The selected game hasn't been won, continue to move selection
		else{
			//addLog("The following cell is valid " + outsideX + "," + outsideY);
			wonCheck = true;
		}
	}
	
	/*--- Evaluate possible moves ---*/
	
	//Create a value table for the game
	//This holds the point values of each space in the game
	//valTable: x by y
	/*
		    x0  x1  x2
		y0 0.0 1.0 2.0
		y1 0.1 1.1 2.1
		y2 0.2 1.2 2.2
	*/
	var valTable = [[0,0,0],
					[0,0,0],
					[0,0,0]];
	 
	 var checkVal; //Determines which square you are calculating for
	 var spaceScore = 0; //Point value for the space being calculated
	
	//Check the value of possible moves in game x,y
	for(var i = 0; i < 3; i++){ //Check columns (x)
		for (var j = 0; j < 3; j++){ //Check rows (y)
			checkVal = i + "." + j; //Which square is being checked
			//addLog("Calculating " + checkVal);
			
			//If the space is taken, set the point value to 0
			if(gameState[outsideX][outsideY][i][j] == opponentTurn  || gameState[outsideX][outsideY][i][j] == playerTurn){
				valTable[i][j] = 0;
				//addLog("Coords (" + i + "," + j + ") are already filled.");
			}
			//Otherwise, calculate the value
			else{
				switch(checkVal){
					case "0.0": //left-top
						//addLog("checkVal = " + checkVal + " | Calculating left-top.");
						spaceScore = 1; //Reset score
						
						/*--- Check for single space moves ---*/
						for (var x = 0; x < 3; x++){ //Check columns (x)
							for (var y = 0; y < 3; y++){ //Check rows (y)
							//addLog("Checking coords(" + x + "." + y + ")");
								//Skip spaces that aren't in line with the one being evaluated, and skip the space being evaluated
								//Skip: left-top, middle-bottom, right-center
								if((x == 0 && y == 0) || (x == 1 && y == 2) || (x == 2 && y == 1)){
									//Skip
									//addLog("This space offers no additional value. Skip.");
								}
								//Add points for blocking an opponent, or lining up a move for self
								else{
									if(gameState[outsideX][outsideY][x][y] == opponentTurn){ //Block
										spaceScore++;
										//addLog("Blocking an opponent's move: +1. Score = " + spaceScore);
									}
									if(gameState[outsideX][outsideY][x][y] == playerTurn){ //Set-up
										spaceScore++;
										//addLog("Setting up a move for yourself: +1. Score = " + spaceScore);
									}
								}	
							}
						}
						/*--- Check for blocked moves (-1 point)---*/
						//Top row
						if ((gameState[outsideX][outsideY][1][0] == playerTurn && gameState[outsideX][outsideY][2][0] == opponentTurn) || (gameState[outsideX][outsideY][1][0] == opponentTurn && gameState[outsideX][outsideY][2][0] == playerTurn)){
							spaceScore--;
						}
						//diagonal
						if ((gameState[outsideX][outsideY][1][1] == playerTurn && gameState[outsideX][outsideY][2][2] == opponentTurn) || (gameState[outsideX][outsideY][1][1] == opponentTurn && gameState[outsideX][outsideY][2][2] == playerTurn)){
							spaceScore--;
						}
						//Left column
						if ((gameState[outsideX][outsideY][0][1] == playerTurn && gameState[outsideX][outsideY][0][2] == opponentTurn) || (gameState[outsideX][outsideY][0][1] == opponentTurn && gameState[outsideX][outsideY][0][2] == playerTurn)){
							spaceScore--;
						}
						/*--- Check for winning moves (opponent) (Second highest priority = 75 points) ---*/
						//Top row
						if ((gameState[outsideX][outsideY][1][0] == opponentTurn && gameState[outsideX][outsideY][2][0] == opponentTurn)){
							spaceScore = 75;
						}
						//diagonal
						if ((gameState[outsideX][outsideY][1][1] == opponentTurn && gameState[outsideX][outsideY][2][2] == opponentTurn)){
							spaceScore = 75;
						}
						//Left column
						if ((gameState[outsideX][outsideY][0][1] == opponentTurn && gameState[outsideX][outsideY][0][2] == opponentTurn)){
							spaceScore = 75;
						}
						/*--- Check for winning moves (self) (Highest priority = 100 points) ---*/
						//Top row
						if ((gameState[outsideX][outsideY][1][0] == playerTurn && gameState[outsideX][outsideY][2][0] == playerTurn)){
							spaceScore = 100;
						}
						//diagonal
						if ((gameState[outsideX][outsideY][1][1] == playerTurn && gameState[outsideX][outsideY][2][2] == playerTurn)){
							spaceScore = 100;
						}
						//Left column
						if ((gameState[outsideX][outsideY][0][1] == playerTurn && gameState[outsideX][outsideY][0][2] == playerTurn)){
							spaceScore = 100;
						}
						
						//Add the score to the table
						valTable[i][j] = spaceScore;
						//addLog(checkVal + " score = " + valTable[i][j]);
						break;
					case "0.1": //left-center
					//addLog("checkVal = " + checkVal + " | Calculating left-center.");
						spaceScore = 1; //Reset score
						
						/*--- Check for single space moves ---*/
						for (var x = 0; x < 3; x++){ //Check columns (x)
							for (var y = 0; y < 3; y++){ //Check rows (y)
							//addLog("Checking coords(" + x + "." + y + ")");
								//Skip spaces that aren't in line with the one being evaluated, and skip the space being evaluated
								//Skip: left-center, right-top, right-bottom
								if((x == 0 && y == 1) || (x == 2 && y == 0) || (x == 2 && y == 2)){
									//Skip
									//addLog("This space offers no additional value. Skip.");
								}
								//Add points for blocking an opponent, or lining up a move for self
								else{
									if(gameState[outsideX][outsideY][x][y] == opponentTurn){ //Block
										spaceScore++;
										//addLog("Blocking an opponent's move: +1. Score = " + spaceScore);
									}
									if(gameState[outsideX][outsideY][x][y] == playerTurn){ //Set-up
										spaceScore++;
										//addLog("Setting up a move for yourself: +1. Score = " + spaceScore);
									}
								}	
							}
						}
						/*--- Check for blocked moves (-1 point)---*/
						//Center row
						if ((gameState[outsideX][outsideY][1][1] == playerTurn && gameState[outsideX][outsideY][2][1] == opponentTurn) || (gameState[outsideX][outsideY][1][1] == opponentTurn && gameState[outsideX][outsideY][2][1] == playerTurn)){
							spaceScore--;
						}
						//Left column
						if ((gameState[outsideX][outsideY][0][0] == playerTurn && gameState[outsideX][outsideY][0][2] == opponentTurn) || (gameState[outsideX][outsideY][0][0] == opponentTurn && gameState[outsideX][outsideY][0][2] == playerTurn)){
							spaceScore--;
						}
						/*--- Check for winning moves (opponent) (Second highest priority = 75 points) ---*/
						//Center row
						if ((gameState[outsideX][outsideY][1][1] == opponentTurn && gameState[outsideX][outsideY][2][1] == opponentTurn)){
							spaceScore = 75;
						}
						//Left column
						if ((gameState[outsideX][outsideY][0][0] == opponentTurn && gameState[outsideX][outsideY][0][2] == opponentTurn)){
							spaceScore = 75;
						}
						/*--- Check for winning moves (self) (Highest priority = 100 points) ---*/
						//Center row
						if ((gameState[outsideX][outsideY][1][1] == playerTurn && gameState[outsideX][outsideY][2][1] == playerTurn)){
							spaceScore = 100;
						}
						//Left column
						if ((gameState[outsideX][outsideY][0][0] == playerTurn && gameState[outsideX][outsideY][0][2] == playerTurn)){
							spaceScore = 100;
						}
						
						//Add the score to the table
						valTable[i][j] = spaceScore;
						//addLog(checkVal + " score = " + valTable[i][j]);
						break;
					case "0.2": //left-bottom
					//addLog("checkVal = " + checkVal + " | Calculating left-bottom.");
						spaceScore = 1; //Reset score
						
						/*--- Check for single space moves ---*/
						for (var x = 0; x < 3; x++){ //Check columns (x)
							for (var y = 0; y < 3; y++){ //Check rows (y)
							//addLog("Checking coords(" + x + "." + y + ")");
								//Skip spaces that aren't in line with the one being evaluated, and skip the space being evaluated
								//Skip: left-bottom, middle-top, right-center
								if((x == 0 && y == 2) || (x == 1 && y == 0) || (x == 2 && y == 1)){
									//Skip
									//addLog("This space offers no additional value. Skip.");
								}
								//Add points for blocking an opponent, or lining up a move for self
								else{
									if(gameState[outsideX][outsideY][x][y] == opponentTurn){ //Block
										spaceScore++;
										//addLog("Blocking an opponent's move: +1. Score = " + spaceScore);
									}
									if(gameState[outsideX][outsideY][x][y] == playerTurn){ //Set-up
										spaceScore++;
										//addLog("Setting up a move for yourself: +1. Score = " + spaceScore);
									}
								}	
							}
						}
						/*--- Check for blocked moves (-1 point)---*/
						//Bottom row
						if ((gameState[outsideX][outsideY][1][2] == playerTurn && gameState[outsideX][outsideY][2][2] == opponentTurn) || (gameState[outsideX][outsideY][1][2] == opponentTurn && gameState[outsideX][outsideY][2][2] == playerTurn)){
							spaceScore--;
						}
						//diagonal
						if ((gameState[outsideX][outsideY][1][1] == playerTurn && gameState[outsideX][outsideY][2][0] == opponentTurn) || (gameState[outsideX][outsideY][1][1] == opponentTurn && gameState[outsideX][outsideY][2][0] == playerTurn)){
							spaceScore--;
						}
						//Left column
						if ((gameState[outsideX][outsideY][0][0] == playerTurn && gameState[outsideX][outsideY][0][1] == opponentTurn) || (gameState[outsideX][outsideY][0][0] == opponentTurn && gameState[outsideX][outsideY][0][1] == playerTurn)){
							spaceScore--;
						}
						/*--- Check for winning moves (opponent) (Second highest priority = 75 points) ---*/
						//Bottom row
						if ((gameState[outsideX][outsideY][1][2] == opponentTurn && gameState[outsideX][outsideY][2][2] == opponentTurn)){
							spaceScore = 75;
						}
						//diagonal
						if ((gameState[outsideX][outsideY][1][1] == opponentTurn && gameState[outsideX][outsideY][2][0] == opponentTurn)){
							spaceScore = 75;
						}
						//Left column
						if ((gameState[outsideX][outsideY][0][0] == opponentTurn && gameState[outsideX][outsideY][0][1] == opponentTurn)){
							spaceScore = 75;
						}
						/*--- Check for winning moves (self) (Highest priority = 100 points) ---*/
						//Bottom row
						if ((gameState[outsideX][outsideY][1][2] == playerTurn && gameState[outsideX][outsideY][2][2] == playerTurn)){
							spaceScore = 100;
						}
						//diagonal
						if ((gameState[outsideX][outsideY][1][1] == playerTurn && gameState[outsideX][outsideY][2][0] == playerTurn)){
							spaceScore = 100;
						}
						//Left column
						if ((gameState[outsideX][outsideY][0][0] == playerTurn && gameState[outsideX][outsideY][0][1] == playerTurn)){
							spaceScore = 100;
						}
						
						//Add the score to the table
						valTable[i][j] = spaceScore;
						//addLog(checkVal + " score = " + valTable[i][j]);
						break;
					case "1.0": //middle-top
					//addLog("checkVal = " + checkVal + " | Calculating middle-top.");
						spaceScore = 1; //Reset score
						
						/*--- Check for single space moves ---*/
						for (var x = 0; x < 3; x++){ //Check columns (x)
							for (var y = 0; y < 3; y++){ //Check rows (y)
							//addLog("Checking coords(" + x + "." + y + ")");
								//Skip spaces that aren't in line with the one being evaluated, and skip the space being evaluated
								//Skip: left-bottom, middle-top, right-bottom
								if((x == 0 && y == 2) || (x == 1 && y == 0) || (x == 2 && y == 2)){
									//Skip
									//addLog("This space offers no additional value. Skip.");
								}
								//Add points for blocking an opponent, or lining up a move for self
								else{
									if(gameState[outsideX][outsideY][x][y] == opponentTurn){ //Block
										spaceScore++;
										//addLog("Blocking an opponent's move: +1. Score = " + spaceScore);
									}
									if(gameState[outsideX][outsideY][x][y] == playerTurn){ //Set-up
										spaceScore++;
										//addLog("Setting up a move for yourself: +1. Score = " + spaceScore);
									}
								}	
							}
						}
						/*--- Check for blocked moves (-1 point)---*/
						//Top row
						if ((gameState[outsideX][outsideY][0][0] == playerTurn && gameState[outsideX][outsideY][2][0] == opponentTurn) || (gameState[outsideX][outsideY][0][0] == opponentTurn && gameState[outsideX][outsideY][2][0] == playerTurn)){
							spaceScore--;
						}
						//Middle column
						if ((gameState[outsideX][outsideY][1][1] == playerTurn && gameState[outsideX][outsideY][1][2] == opponentTurn) || (gameState[outsideX][outsideY][1][1] == opponentTurn && gameState[outsideX][outsideY][1][2] == playerTurn)){
							spaceScore--;
						}
						/*--- Check for winning moves (opponent) (Second highest priority = 75 points) ---*/
						//Top row
						if ((gameState[outsideX][outsideY][0][0] == opponentTurn && gameState[outsideX][outsideY][2][0] == opponentTurn)){
							spaceScore = 75;
						}
						//Middle column
						if ((gameState[outsideX][outsideY][1][1] == opponentTurn && gameState[outsideX][outsideY][1][2] == opponentTurn)){
							spaceScore = 75;
						}
						/*--- Check for winning moves (self) (Highest priority = 100 points) ---*/
						//Top row
						if ((gameState[outsideX][outsideY][0][0] == playerTurn && gameState[outsideX][outsideY][2][0] == playerTurn)){
							spaceScore = 100;
						}
						//Middle column
						if ((gameState[outsideX][outsideY][1][1] == playerTurn && gameState[outsideX][outsideY][1][2] == playerTurn)){
							spaceScore = 100;
						}
						
						//Add the score to the table
						valTable[i][j] = spaceScore;
						//addLog(checkVal + " score = " + valTable[i][j]);
						break;
					case "1.1": //middle-center
					//addLog("checkVal = " + checkVal + " | Calculating middle-center.");
						spaceScore = 1; //Reset score
						
						/*--- Check for single space moves ---*/
						for (var x = 0; x < 3; x++){ //Check columns (x)
							for (var y = 0; y < 3; y++){ //Check rows (y)
							//addLog("Checking coords(" + x + "." + y + ")");
								//Skip spaces that aren't in line with the one being evaluated, and skip the space being evaluated
								//Skip: middle-center
								if((x == 1 && y == 1)){
									//Skip
									//addLog("This space offers no additional value. Skip.");
								}
								//Add points for blocking an opponent, or lining up a move for self
								else{
									if(gameState[outsideX][outsideY][x][y] == opponentTurn){ //Block
										spaceScore++;
										//addLog("Blocking an opponent's move: +1. Score = " + spaceScore);
									}
									if(gameState[outsideX][outsideY][x][y] == playerTurn){ //Set-up
										spaceScore++;
										//addLog("Setting up a move for yourself: +1. Score = " + spaceScore);
									}
								}	
							}
						}
						/*--- Check for blocked moves (-1 point)---*/
						//Center row
						if ((gameState[outsideX][outsideY][0][1] == playerTurn && gameState[outsideX][outsideY][2][1] == opponentTurn) || (gameState[outsideX][outsideY][0][1] == opponentTurn && gameState[outsideX][outsideY][2][1] == playerTurn)){
							spaceScore--;
						}
						//Diagonals
						if ((gameState[outsideX][outsideY][0][0] == playerTurn && gameState[outsideX][outsideY][2][2] == opponentTurn) || (gameState[outsideX][outsideY][0][0] == opponentTurn && gameState[outsideX][outsideY][2][2] == playerTurn)){
							spaceScore--;
						}
						if ((gameState[outsideX][outsideY][0][2] == playerTurn && gameState[outsideX][outsideY][2][0] == opponentTurn) || (gameState[outsideX][outsideY][0][2] == opponentTurn && gameState[outsideX][outsideY][2][0] == playerTurn)){
							spaceScore--;
						}
						//Middle column
						if ((gameState[outsideX][outsideY][1][0] == playerTurn && gameState[outsideX][outsideY][1][2] == opponentTurn) || (gameState[outsideX][outsideY][1][0] == opponentTurn && gameState[outsideX][outsideY][1][2] == playerTurn)){
							spaceScore--;
						}
						/*--- Check for winning moves (opponent) (Second highest priority = 75 points) ---*/
						//Top row
						if ((gameState[outsideX][outsideY][0][1] == opponentTurn && gameState[outsideX][outsideY][2][1] == opponentTurn)){
							spaceScore = 75;
						}
						//Diagonals
						if ((gameState[outsideX][outsideY][0][0] == opponentTurn && gameState[outsideX][outsideY][2][2] == opponentTurn)){
							spaceScore = 75;
						}
						if ((gameState[outsideX][outsideY][0][2] == opponentTurn && gameState[outsideX][outsideY][2][0] == opponentTurn)){
							spaceScore = 75;
						}
						//Middlecolumn
						if ((gameState[outsideX][outsideY][0][1] == opponentTurn && gameState[outsideX][outsideY][0][2] == opponentTurn)){
							spaceScore = 75;
						}
						/*--- Check for winning moves (self) (Highest priority = 100 points) ---*/
						//Top row
						if ((gameState[outsideX][outsideY][0][1] == playerTurn && gameState[outsideX][outsideY][2][1] == playerTurn)){
							spaceScore = 100;
						}
						//Diagonals
						if ((gameState[outsideX][outsideY][0][0] == playerTurn && gameState[outsideX][outsideY][2][2] == playerTurn)){
							spaceScore = 100;
						}
						if ((gameState[outsideX][outsideY][0][2] == playerTurn && gameState[outsideX][outsideY][2][0] == playerTurn)){
							spaceScore = 100;
						}
						//Middle column
						if ((gameState[outsideX][outsideY][0][1] == playerTurn && gameState[outsideX][outsideY][0][2] == playerTurn)){
							spaceScore = 100;
						}
						
						//Add the score to the table
						valTable[i][j] = spaceScore;
						//addLog(checkVal + " score = " + valTable[i][j]);
						break;
					case "1.2": //middle-bottom
					//addLog("checkVal = " + checkVal + " | Calculating middle-bottom.");
						spaceScore = 1; //Reset score
						
						/*--- Check for single space moves ---*/
						for (var x = 0; x < 3; x++){ //Check columns (x)
							for (var y = 0; y < 3; y++){ //Check rows (y)
							//addLog("Checking coords(" + x + "." + y + ")");
								//Skip spaces that aren't in line with the one being evaluated, and skip the space being evaluated
								//Skip: left-top, middle-bottom, right-top
								if((x == 0 && y == 0) || (x == 1 && y == 2) || (x == 2 && y == 0)){
									//Skip
									//addLog("This space offers no additional value. Skip.");
								}
								//Add points for blocking an opponent, or lining up a move for self
								else{
									if(gameState[outsideX][outsideY][x][y] == opponentTurn){ //Block
										spaceScore++;
										//addLog("Blocking an opponent's move: +1. Score = " + spaceScore);
									}
									if(gameState[outsideX][outsideY][x][y] == playerTurn){ //Set-up
										spaceScore++;
										//addLog("Setting up a move for yourself: +1. Score = " + spaceScore);
									}
								}	
							}
						}
						/*--- Check for blocked moves (-1 point)---*/
						//Bottom row
						if ((gameState[outsideX][outsideY][0][2] == playerTurn && gameState[outsideX][outsideY][2][2] == opponentTurn) || (gameState[outsideX][outsideY][0][2] == opponentTurn && gameState[outsideX][outsideY][2][2] == playerTurn)){
							spaceScore--;
						}
						//Middle column
						if ((gameState[outsideX][outsideY][1][0] == playerTurn && gameState[outsideX][outsideY][1][1] == opponentTurn) || (gameState[outsideX][outsideY][1][0] == opponentTurn && gameState[outsideX][outsideY][1][1] == playerTurn)){
							spaceScore--;
						}
						/*--- Check for winning moves (opponent) (Second highest priority = 75 points) ---*/
						//Top row
						if ((gameState[outsideX][outsideY][0][2] == opponentTurn && gameState[outsideX][outsideY][2][2] == opponentTurn)){
							spaceScore = 75;
						}
						//Middle column
						if ((gameState[outsideX][outsideY][1][0] == opponentTurn && gameState[outsideX][outsideY][1][1] == opponentTurn)){
							spaceScore = 75;
						}
						/*--- Check for winning moves (self) (Highest priority = 100 points) ---*/
						//Top row
						if ((gameState[outsideX][outsideY][0][2] == playerTurn && gameState[outsideX][outsideY][2][2] == playerTurn)){
							spaceScore = 100;
						}
						//Middle column
						if ((gameState[outsideX][outsideY][1][0] == playerTurn && gameState[outsideX][outsideY][1][1] == playerTurn)){
							spaceScore = 100;
						}
						
						//Add the score to the table
						valTable[i][j] = spaceScore;
						//addLog(checkVal + " score = " + valTable[i][j]);
						break;
					case "2.0": //right-top
					//addLog("checkVal = " + checkVal + " | Calculating right-top.");
						spaceScore = 1; //Reset score
						
						/*--- Check for single space moves ---*/
						for (var x = 0; x < 3; x++){ //Check columns (x)
							for (var y = 0; y < 3; y++){ //Check rows (y)
							//addLog("Checking coords(" + x + "." + y + ")");
								//Skip spaces that aren't in line with the one being evaluated, and skip the space being evaluated
								//Skip: left-center, middle-bottom, right-top
								if((x == 0 && y == 1) || (x == 1 && y == 2) || (x == 2 && y == 0)){
									//Skip
									//addLog("This space offers no additional value. Skip.");
								}
								//Add points for blocking an opponent, or lining up a move for self
								else{
									if(gameState[outsideX][outsideY][x][y] == opponentTurn){ //Block
										spaceScore++;
										//addLog("Blocking an opponent's move: +1. Score = " + spaceScore);
									}
									if(gameState[outsideX][outsideY][x][y] == playerTurn){ //Set-up
										spaceScore++;
										//addLog("Setting up a move for yourself: +1. Score = " + spaceScore);
									}
								}	
							}
						}
						/*--- Check for blocked moves (-1 point)---*/
						//Top row
						if ((gameState[outsideX][outsideY][0][0] == playerTurn && gameState[outsideX][outsideY][1][0] == opponentTurn) || (gameState[outsideX][outsideY][0][0] == opponentTurn && gameState[outsideX][outsideY][1][0] == playerTurn)){
							spaceScore--;
						}
						//diagonal
						if ((gameState[outsideX][outsideY][1][1] == playerTurn && gameState[outsideX][outsideY][0][2] == opponentTurn) || (gameState[outsideX][outsideY][1][1] == opponentTurn && gameState[outsideX][outsideY][0][2] == playerTurn)){
							spaceScore--;
						}
						//Right column
						if ((gameState[outsideX][outsideY][2][1] == playerTurn && gameState[outsideX][outsideY][2][2] == opponentTurn) || (gameState[outsideX][outsideY][2][1] == opponentTurn && gameState[outsideX][outsideY][2][2] == playerTurn)){
							spaceScore--;
						}
						/*--- Check for winning moves (opponent) (Second highest priority = 75 points) ---*/
						//Top row
						if ((gameState[outsideX][outsideY][0][0] == opponentTurn && gameState[outsideX][outsideY][1][0] == opponentTurn)){
							spaceScore = 75;
						}
						//diagonal
						if ((gameState[outsideX][outsideY][1][1] == opponentTurn && gameState[outsideX][outsideY][0][2] == opponentTurn)){
							spaceScore = 75;
						}
						//Right column
						if ((gameState[outsideX][outsideY][2][1] == opponentTurn && gameState[outsideX][outsideY][2][2] == opponentTurn)){
							spaceScore = 75;
						}
						/*--- Check for winning moves (self) (Highest priority = 100 points) ---*/
						//Top row
						if ((gameState[outsideX][outsideY][0][0] == playerTurn && gameState[outsideX][outsideY][1][0] == playerTurn)){
							spaceScore = 100;
						}
						//diagonal
						if ((gameState[outsideX][outsideY][1][1] == playerTurn && gameState[outsideX][outsideY][0][2] == playerTurn)){
							spaceScore = 100;
						}
						//Right column
						if ((gameState[outsideX][outsideY][2][1] == playerTurn && gameState[outsideX][outsideY][2][2] == playerTurn)){
							spaceScore = 100;
						}
						
						//Add the score to the table
						valTable[i][j] = spaceScore;
						//addLog(checkVal + " score = " + valTable[i][j]);
						break;
					case "2.1": //right-center
					//addLog("checkVal = " + checkVal + " | Calculating right-center.");
						spaceScore = 1; //Reset score
						
						/*--- Check for single space moves ---*/
						for (var x = 0; x < 3; x++){ //Check columns (x)
							for (var y = 0; y < 3; y++){ //Check rows (y)
							//addLog("Checking coords(" + x + "." + y + ")");
								//Skip spaces that aren't in line with the one being evaluated, and skip the space being evaluated
								//Skip: left-top left-bottom, right-center
								if((x == 0 && y == 0) || (x == 0 && y == 2) || (x == 2 && y == 1)){
									//Skip
									//addLog("This space offers no additional value. Skip.");
								}
								//Add points for blocking an opponent, or lining up a move for self
								else{
									if(gameState[outsideX][outsideY][x][y] == opponentTurn){ //Block
										spaceScore++;
										//addLog("Blocking an opponent's move: +1. Score = " + spaceScore);
									}
									if(gameState[outsideX][outsideY][x][y] == playerTurn){ //Set-up
										spaceScore++;
										//addLog("Setting up a move for yourself: +1. Score = " + spaceScore);
									}
								}	
							}
						}
						/*--- Check for blocked moves (-1 point)---*/
						//Center row
						if ((gameState[outsideX][outsideY][0][1] == playerTurn && gameState[outsideX][outsideY][1][1] == opponentTurn) || (gameState[outsideX][outsideY][0][1] == opponentTurn && gameState[outsideX][outsideY][1][1] == playerTurn)){
							spaceScore--;
						}
						//Right column
						if ((gameState[outsideX][outsideY][2][0] == playerTurn && gameState[outsideX][outsideY][2][2] == opponentTurn) || (gameState[outsideX][outsideY][2][0] == opponentTurn && gameState[outsideX][outsideY][2][2] == playerTurn)){
							spaceScore--;
						}
						/*--- Check for winning moves (opponent) (Second highest priority = 75 points) ---*/
						//Center row
						if ((gameState[outsideX][outsideY][0][1] == opponentTurn && gameState[outsideX][outsideY][1][1] == opponentTurn)){
							spaceScore = 75;
						}
						//Right column
						if ((gameState[outsideX][outsideY][2][0] == opponentTurn && gameState[outsideX][outsideY][2][2] == opponentTurn)){
							spaceScore = 75;
						}
						/*--- Check for winning moves (self) (Highest priority = 100 points) ---*/
						//Center row
						if ((gameState[outsideX][outsideY][0][1] == playerTurn && gameState[outsideX][outsideY][1][1] == playerTurn)){
							spaceScore = 100;
						}
						//Right column
						if ((gameState[outsideX][outsideY][2][0] == playerTurn && gameState[outsideX][outsideY][2][2] == playerTurn)){
							spaceScore = 100;
						}
						
						//Add the score to the table
						valTable[i][j] = spaceScore;
						//addLog(checkVal + " score = " + valTable[i][j]);
						break;
					case "2.2": //right-bottom
					//addLog("checkVal = " + checkVal + " | Calculating right-bottom.");
						spaceScore = 1; //Reset score
						
						/*--- Check for single space moves ---*/
						for (var x = 0; x < 3; x++){ //Check columns (x)
							for (var y = 0; y < 3; y++){ //Check rows (y)
							//addLog("Checking coords(" + x + "." + y + ")");
								//Skip spaces that aren't in line with the one being evaluated, and skip the space being evaluated
								//Skip: left-center, middle-top, right-bottom
								if((x == 0 && y == 1) || (x == 1 && y == 0) || (x == 2 && y == 2)){
									//Skip
									//addLog("This space offers no additional value. Skip.");
								}
								//Add points for blocking an opponent, or lining up a move for self
								else{
									if(gameState[outsideX][outsideY][x][y] == opponentTurn){ //Block
										spaceScore++;
										//addLog("Blocking an opponent's move: +1. Score = " + spaceScore);
									}
									if(gameState[outsideX][outsideY][x][y] == playerTurn){ //Set-up
										spaceScore++;
										//addLog("Setting up a move for yourself: +1. Score = " + spaceScore);
									}
								}	
							}
						}
						/*--- Check for blocked moves (-1 point)---*/
						//Bottom row
						if ((gameState[outsideX][outsideY][0][2] == playerTurn && gameState[outsideX][outsideY][1][2] == opponentTurn) || (gameState[outsideX][outsideY][0][2] == opponentTurn && gameState[outsideX][outsideY][1][2] == playerTurn)){
							spaceScore--;
						}
						//diagonal
						if ((gameState[outsideX][outsideY][1][1] == playerTurn && gameState[outsideX][outsideY][0][0] == opponentTurn) || (gameState[outsideX][outsideY][1][1] == opponentTurn && gameState[outsideX][outsideY][0][0] == playerTurn)){
							spaceScore--;
						}
						//Right column
						if ((gameState[outsideX][outsideY][2][0] == playerTurn && gameState[outsideX][outsideY][2][1] == opponentTurn) || (gameState[outsideX][outsideY][2][0] == opponentTurn && gameState[outsideX][outsideY][2][1] == playerTurn)){
							spaceScore--;
						}
						/*--- Check for winning moves (opponent) (Second highest priority = 75 points) ---*/
						//Bottom row
						if ((gameState[outsideX][outsideY][0][2] == opponentTurn && gameState[outsideX][outsideY][1][2] == opponentTurn)){
							spaceScore = 75;
						}
						//diagonal
						if ((gameState[outsideX][outsideY][1][1] == opponentTurn && gameState[outsideX][outsideY][0][0] == opponentTurn)){
							spaceScore = 75;
						}
						//Right column
						if ((gameState[outsideX][outsideY][2][0] == opponentTurn && gameState[outsideX][outsideY][2][1] == opponentTurn)){
							spaceScore = 75;
						}
						/*--- Check for winning moves (self) (Highest priority = 100 points) ---*/
						//Bottom row
						if ((gameState[outsideX][outsideY][0][2] == playerTurn && gameState[outsideX][outsideY][1][2] == playerTurn)){
							spaceScore = 100;
						}
						//diagonal
						if ((gameState[outsideX][outsideY][1][1] == playerTurn && gameState[outsideX][outsideY][0][0] == playerTurn)){
							spaceScore = 100;
						}
						//Right column
						if ((gameState[outsideX][outsideY][2][0] == playerTurn && gameState[outsideX][outsideY][2][1] == playerTurn)){
							spaceScore = 100;
						}
						
						//Add the score to the table
						valTable[i][j] = spaceScore;
						//addLog(checkVal + " score = " + valTable[i][j]);
						break;
				}
			}
		}
	}
	
	//addLog("Value table: " + valTable);
	
	return valTable; //Return the values of all possible moves
 }
 
 //Player AI: Level 2
 //Parameters:	outX = X position of next move to be made in large game board
 //				outY = Y position of next move to be made in large game board
 //				wonGames = array that holds the win states of the games (0 = not won, 1 = red, 2 = blue)
 //				playerTurn = which player is the AI currently (1 = red, 2 = blue)
 function playerAILevel2(outX, outY, wonGames, playerTurn){

	// valtable2Ply = value table holding the sum of the possible moves
	// startState = array that holds the state of each space on the board (copy of selected)
	var valTable2Ply = [[0,0,0],
						[0,0,0],
						[0,0,0]];
	var startState = selected;
	var whichTurn = playerTurn;
	var flipTurns = false;
	
	//Call the calc function once to get initial values
	var tempTable = calcAI(outX, outY, wonGames, startState, whichTurn);
	//Check each value. If a move exists (space > 0) then calculate the values for that space
	for (var xPos = 0, xPos < 3; xPos++){
		for (var yPos = 0, yPos < 3, yPos++){
			if (valTable2Ply[xPos][yPos] > 0){
				var tempState = startState;
				var tempTable2;
				var bestOption = tempTable2[0][0]; //Current best option
				if(whichTurn == 1){
					tempState[outX][outY][xPos][yPos] = whichTurn;
					tempTable2 = calcAI(xPos, yPos, wonGames, tempState, whichTurn + 1);
					//Find best score
					for (var alpha = 0; alpha < 3; alpha++){
						for (var beta = 0; beta < 3; beta++){
							if (bestOption < tempTable2[alpha][beta]){
								bestOption = tempTable2[alpha][beta];
							}
						}
					}
					//addLog("Best value = " + bestOption);
				} else {
					tempState[outX][outY][xPos][yPos] = whichTurn;
					tempTable2 = calcAI(xPos, yPos, wonGames, tempState, whichTurn - 1);
					//Find best score
					for (var alpha = 0; alpha < 3; alpha++){
						for (var beta = 0; beta < 3; beta++){
							if (bestOption < tempTable2[alpha][beta]){
								bestOption = tempTable2[alpha][beta];
							}
						}
					}
					//addLog("Best value = " + bestOption);
				}
				if(flipTurns == false){
					valTable2Ply[xPos][yPos] += bestOption;
					flipTurns = true;
				} else{
					valTable2Ply[xPos][yPos] -= bestOption;
					flipTurns = false;
				}
			}
		}
	}
	
	/*--- Select move from best options ---*/
	//Find best score
	var bestOption = valTable2Ply[0][0]; //Current best option
	for (var alpha = 0; alpha < 3; alpha++){
		for (var beta = 0; beta < 3; beta++){
			if (bestOption < valTable2Ply[alpha][beta]){
				bestOption = valTable2Ply[alpha][beta];
			}
		}
	}
	//addLog("Best value = " + bestOption);
	
	//Find the possible locations of the best score
	var possibleOptions = []; //array holding the possible places to move on the inner board
	var optionCounter = 0; //counter used to increment array position
	for (var ares = 0; ares < 3; ares++){
		for (var zeus = 0; zeus < 3; zeus++){
			if (bestOption == valTable2Ply[ares][zeus]){
				possibleOptions[optionCounter] = ares;
				optionCounter++;
				possibleOptions[optionCounter] = zeus;
				optionCounter++;
			}
		}
	}
	
	//Randomly select one of the possible locations
	var selectedOption = 0; //Randomly selected x position of best option
	var bestOptionLocation = [0,0,0,0]; //Best option coordinates [outsideX, outsideY, innerX, innerY]
	var optionString = ""; //Concatenated possible options for displaying as coordinate pairs
	for(var test = 0; test < possibleOptions.length; test++){
		optionString = (optionString + " (" + possibleOptions[test] + ", " + possibleOptions[test + 1] + ")");
		test++;
	}
	//addLog("Possible options:");
	//addLog(optionString);
	selectedOption = Math.floor(Math.random() * (possibleOptions.length / 2)); //Randomly select x position of best option
	//addLog("Number of options = " + possibleOptions.length / 2);
	//addLog("Selected option = " + selectedOption);
	bestOptionLocation[0] = outsideX;
	bestOptionLocation[1] = outsideY;
	bestOptionLocation[2] = possibleOptions[selectedOption * 2];
	bestOptionLocation[3] = possibleOptions[(selectedOption * 2) + 1];
	if (playerTurn == 1){
		addLog("Red's best move is space (" + bestOptionLocation[2] + "," + bestOptionLocation[3] + ") in game (" + bestOptionLocation[0] + "," + bestOptionLocation[1] + ")");
	} else{
		addLog("Blue's best move is space (" + bestOptionLocation[2] + "," + bestOptionLocation[3] + ") in game (" + bestOptionLocation[0] + "," + bestOptionLocation[1] + ")");
	}
	return bestOptionLocation; //Return the best option's location
 }