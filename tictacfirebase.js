var ticTacRef;
var IDs;
angular.module("TicTac", ["firebase"])
 .controller("TicTacCtrl", function($scope, $firebase){
 	
 	
	ticTacRef = new Firebase("https://rshtictactoe.firebaseio.com/");
 	$scope.fbRoot = $firebase(ticTacRef);

 	// Wait until everything really is loaded
 	$scope.fbRoot.$on("loaded", function() {
		IDs = $scope.fbRoot.$getIndex();
		if(IDs.length == 0)
		{
			// What???  No Board????  Let's build one.
	 		$scope.fbRoot.$add( { boxes:[['','',''],['','',''],['','','']],
 	 			xTurn:true, x:"images/plane1.jpg" , o:"images/plane2.jpg", tie:"images/catsarmwrestling.jpg",
 	 			gameover:true,
 	 			tallyx:0, tallyo:0, 
 	 		});

			$scope.fbRoot.$on("change", function() {
				IDs = $scope.fbRoot.$getIndex();
				$scope.obj = $scope.fbRoot.$child(IDs[0]);
			});
		}
		else
		{
			$scope.obj = $scope.fbRoot.$child(IDs[0]);
		}

	});

	$scope.resetBoard = function(){
		
		$scope.obj.boxes = [['','',''], ['','',''], ['','','']];
		$scope.obj.xTurn = false;
		$scope.obj.gameover = true;
		$scope.winner = "";
		$scope.obj.$save();

	}

	$scope.clickMoney = function(r,c) {
	
		if($scope.obj.gameover){
			if($scope.obj.boxes[r][c] == "") {
				if($scope.obj.xTurn = !$scope.obj.xTurn) {
					$scope.obj.boxes[r][c] = $scope.obj.x;
				}
				else {
					$scope.obj.boxes[r][c] = $scope.obj.o;
					$scope.obj.$save();
				}
			}
		}
	}	

	$scope.winningPlayer = function() {

		for(row=0; row < 3; row++) {
			
			var rowx = 0; var rowo=0;
			var colx = 0; var colo=0;
			var dia1x = 0/3; var dia1o=0/3;
			var dia2x = 0/3; var dia2o=0/3;
			var turn = 0; 

			addme = function() {
				for(var i = 0; i < 1; i++) {
    				$scope.tallyx = $scope.obj.tallyx++;
    			}
    		}

			addmeagain = function () {
				for(var i = 0; i < 1; i++) {
    				$scope.tallyo = $scope.obj.tallyo++;	
				}
			}

			for(box=0; box < 3; box++) {

				if($scope.obj.boxes[row][box] == $scope.obj.x) {rowx++, turn++}; $scope.obj.$save();
				if($scope.obj.boxes[box][row] == $scope.obj.x) {colx++, turn++}; $scope.obj.$save();
				if($scope.obj.boxes[box][box] == $scope.obj.x) {dia1x++, turn++}; $scope.obj.$save();
				if($scope.obj.boxes[box][2-box] == $scope.obj.x) {dia2x++, turn++}; $scope.obj.$save();

				if($scope.obj.boxes[row][box] == $scope.obj.o) {rowo++, turn++}; $scope.obj.$save();
				if($scope.obj.boxes[box][row] == $scope.obj.o) {colo++, turn++}; $scope.obj.$save();
				if($scope.obj.boxes[box][box] == $scope.obj.o) {dia1o++, turn++}; $scope.obj.$save();
				if($scope.obj.boxes[box][2-box] == $scope.obj.o) {dia2o++, turn++}; $scope.obj.$save();

			};

				if(rowx == 3 || colx == 3 ) {$scope.winner = $scope.obj.x; addme(); $scope.obj.gameover = false; $scope.obj.$save();};
				if(dia1x == 3 || dia2x == 3) {$scope.winner = $scope.obj.x; addme(); $scope.obj.gameover = false; $scope.obj.$save();};
				if(rowo == 3 || colo == 3) {$scope.winner = $scope.obj.o; addmeagain(); $scope.obj.gameover = false; $scope.obj.$save();};
				if(dia1o == 3 || dia2o == 3) {$scope.winner = $scope.obj.o; addmeagain(); $scope.obj.gameover = false; $scope.obj.$save();};
				if(turn >= 12 && rowx < 3 && colx < 3 && dia1x < 3 && dia2x < 3 && rowo < 3 && colo < 3 && dia1o < 3 && dia2o < 3) {$scope.winner = $scope.obj.tie; $scope.obj.$save();};
						
			}
	}

});