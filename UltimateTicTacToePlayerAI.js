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
 
 //Player 1 AI: Level 1
 //TODO: Add Player 2 AI code here, and swap the pawn values (1 and 2)
 function player1AILevel1(){
	 
 }
 
 //Player 2 AI: Level 1
 function player2AILevel1(outerX, outerY, wonCells){
	 addLog("Won cells: " + wonCells);
	 
	/*--- Check to see if the inner game has been won ---*/
	var wonCheck = false;
	while(wonCheck == false){
		addLog("Checking cell " + outerX + "," + outerY);
		//If the selected game has already been won, choose a new one
		if (wonCells[outerX][outerY] != 0){
			addLog("The cell was won by " + wonCells[outerX][outerY]);
			//Select a random game to play in and check again
			outerX = Math.floor(Math.random() * 3);
			outerY = Math.floor(Math.random() * 3);
			addLog("New cell to check is " + outerX + "," + outerY);
		}
		//The selected game hasn't been won, continue to move selection
		else{
			addLog("The following cell is valid " + outerX + "," + outerY);
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
			addLog("Calculating " + checkVal);
			
			//If the space is taken, set the point value to 0
			if(selected[outerX][outerY][i][j] == 1  || selected[outerX][outerY][i][j] == 2){
				valTable[i][j] = 0;
				addLog("Coords (" + i + "," + j + ") are already filled.");
			}
			//Otherwise, calculate the value
			else{
				switch(checkVal){
					case "0.0": //left-top
						addLog("checkVal = " + checkVal + " | Calculating left-top.");
						spaceScore = 0; //Reset score
						
						/*--- Check for single space moves ---*/
						for (var x = 0; x < 3; x++){ //Check columns (x)
							for (var y = 0; y < 3; y++){ //Check rows (y)
							addLog("Checking coords(" + x + "." + y + ")");
								//Skip spaces that aren't in line with the one being evaluated, and skip the space being evaluated
								//Skip: left-top, middle-bottom, right-center
								if((x == 0 && y == 2) || (x == 2 && y == 1) || (x == 1 && y == 0)){
									//Skip
									addLog("This space offers no additional value. Skip.");
								}
								//Add points for blocking an opponent, or lining up a move for self
								else{
									if(selected[outerX][outerY][x][y] == 1){ //Block
										spaceScore++;
										addLog("Blocking an opponent's move: +1. Score = " + spaceScore);
									}
									if(selected[outerX][outerY][x][y] == 2){ //Set-up
										spaceScore++;
										addLog("Setting up a move for yourself: +1. Score = " + spaceScore);
									}
								}	
							}
						}
						/*--- Check for blocked moves (-1 point)---*/
						//Top row
						if ((selected[outerX][outerY][1][0] == 2 && selected[outerX][outerY][2][0] == 1) || (selected[outerX][outerY][1][0] == 1 && selected[outerX][outerY][2][0] == 2)){
							spaceScore--;
						}
						//Diaganol
						if ((selected[outerX][outerY][1][1] == 2 && selected[outerX][outerY][2][2] == 1) || (selected[outerX][outerY][1][1] == 1 && selected[outerX][outerY][2][2] == 2)){
							spaceScore--;
						}
						//Left column
						if ((selected[outerX][outerY][0][1] == 2 && selected[outerX][outerY][0][2] == 1) || (selected[outerX][outerY][0][1] == 1 && selected[outerX][outerY][0][2] == 2)){
							spaceScore--;
						}
						/*--- Check for winning moves (opponent) (Second highest priority = 75 points) ---*/
						//Top row
						if ((selected[outerX][outerY][1][0] == 1 && selected[outerX][outerY][2][0] == 1)){
							spaceScore = 75;
						}
						//Diaganol
						if ((selected[outerX][outerY][1][1] == 1 && selected[outerX][outerY][2][2] == 1)){
							spaceScore = 75;
						}
						//Left column
						if ((selected[outerX][outerY][0][1] == 1 && selected[outerX][outerY][0][2] == 1)){
							spaceScore = 75;
						}
						/*--- Check for winning moves (self) (Highest priority = 100 points) ---*/
						//Top row
						if ((selected[outerX][outerY][1][0] == 2 && selected[outerX][outerY][2][0] == 2)){
							//addLog("middle-top and right-top are blue");
							spaceScore = 100;
						}
						//Diaganol
						if ((selected[outerX][outerY][1][1] == 2 && selected[outerX][outerY][2][2] == 2)){
							spaceScore = 100;
						}
						//Left column
						if ((selected[outerX][outerY][0][0] == 2 && selected[outerX][outerY][0][2] == 2)){
							spaceScore = 100;
						}
						
						//Add the score to the table
						valTable[i][j] = spaceScore;
						addLog(checkVal + " score = " + valTable[i][j]);
						break;
					case "0.1": //left-center
						break;
					case "0.2": //left-bottom
						break;
					case "1.0": //middle-top
						break;
					case "1.1": //middle-center
						break;
					case "1.2": //middle-bottom
						break;
					case "2.0": //right-top
						break;
					case "2.1": //right-center
						break;
					case "2.2": //right-bottom
						break;
				}
			}
		}
	}
	
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
	addLog("Best value = " + bestOption);
	
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
	var bestOptionLocation = [0,0,0,0]; //Best option coordinates [outerX, outerY, innerX, innerY]
	var optionString = ""; //Concatenated possible options for displaying as coordinate pairs
	for(var test = 0; test < possibleOptions.length; test++){
		optionString = (optionString + " (" + possibleOptions[test] + ", " + possibleOptions[test + 1] + ")");
		test++;
	}
	addLog("Possible options:");
	addLog(optionString);
	selectedOption = (Math.floor(Math.random() * (possibleOptions.length / 2)) * 2); //Randomly select x position of best option
	bestOptionLocation[0] = outerX;
	bestOptionLocation[1] = outerY;
	bestOptionLocation[2] = possibleOptions[selectedOption];
	bestOptionLocation[3] = possibleOptions[selectedOption + 1];
	addLog("Best option location = " + bestOptionLocation[0] + "." + bestOptionLocation[1] + "." + bestOptionLocation[2] + "." + bestOptionLocation[3]);
	return bestOptionLocation; //Return the best option's location
 }