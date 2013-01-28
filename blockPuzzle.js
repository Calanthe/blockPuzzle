var blockPuzzle = function(){ 
	var _gameBlocks = {
		block1: { 
					matrix: [
						[1,1,1],
						[0,1,0]
					],
					color: '#F29513'
				},
		block2: {
					matrix: [
						[0,1],
						[1,1]
					],
					color: '#F0AFB0'
				},
		block3: {
					matrix: [
						[1,0],
						[1,1]
					],
					color: '#107BD5'
				},
		block4: {
					matrix: [
						[1,1]
					],
					color: '#C48BE5'
				},
		block5: {
					matrix: [
						[1,1,1,1],
						[0,1,0,0]
					],
					color: '#36E8AC'
				},
		block6: {
					matrix: [
						[0,0,1],
						[1,1,1]	
					],
					color: '#F8C119'
				},
		block7: {
					matrix: [
						[1,0],
						[1,0],
						[1,1]
					],
					color: '#8350C1'
				},
		block8: {
					matrix: [
						[1]					
					],
					color: '#222222'
				},
		block9: {
					matrix: [
						[1,1],
						[0,1]					
					],
					color: '#F65151'
				},
		block10:{
					matrix: [
						[1,1,1,1]				
					],
					color: '#E5E3DE'
				},
		block11:{
					matrix: [
						[1,1,0],
						[1,0,0],
						[1,1,1]
					],
					color: '#2DA28F'
				},
		block12:{
					matrix: [
						[1],
						[1],
						[1]
					],
					color: '#043D5D'
				},
		block13:{
					matrix: [
						[1,1,1,1]
					],
					color: '#E547B8'
				},
		block14:{
					matrix: [
						[1,1],
						[0,1],
						[0,1]
					],
					color: '#F7F709'
				},
		block15:{
					matrix: [
						[0,1,0],
						[0,1,0],
						[1,1,1]
					],
					color: '#B7D5F7'
				},
		block16:{
					matrix: [
						[0,1,0],
						[1,1,1]
					],
					color: '#B3E5B3'
				},
		block17:{
					matrix: [
						[1],
						[1]
					],
					color: '#38B8C4'
				},
		block18:{
					matrix: [
						[1,1,1]
					],
					color: '#AA2525'
				},
		block19:{
					matrix: [
						[1,1,0,0],
						[0,1,1,1]
					],
					color: '#0DA52B'
				},
		block20:{
					matrix: [
						[0,0,1,0,0],
						[1,1,1,1,1]
					],
					color: '#E5148E'
				}
		},
		_$gameBody = $('body'),
		Level = function(level){
				var _map,
					_markedPointsMap = [];
				
				function dragOverEvent(event){
					var markedPoints,$gameArea,
						$target = $(event.originalEvent.target),
						$transferedData = getTransferedObj(event),
						dragged = {};
					
					event.stopPropagation();
					$transferedData.hide();
					
					$gameArea = getGameArea($transferedData);
					
					//pointer-events: none; to all blocks on board
					removePointerEvents($gameArea);
						
					if (_markedPointsMap[$transferedData.data('block')]){
						//remove moved block from map array
						_map = updateMap(_markedPointsMap[$transferedData.data('block')],_map,0); 
						delete _markedPointsMap[$transferedData.data('block')];
					}
				
					dragged = checkIfCanDrop($target,$transferedData,_map,$gameArea);
					if (!$.isEmptyObject(dragged)){					
						markedPoints = dragged.markedPoints;
						clearGameArea($gameArea);
						if (markedPoints.length>0){
							drawAvailableArea(markedPoints,$gameArea);
						}
					}
					
					event.preventDefault();
				}
					
				function dropEvent(event){
					var $target = $(event.originalEvent.target),
						$transferedData = getTransferedObj(event),
						markedPoints,
						dropped = {};
				
					event.stopPropagation();
					
					$gameArea = getGameArea($transferedData);
					
					dropped = checkIfCanDrop($target,$transferedData,_map,$gameArea);
					if (!$.isEmptyObject(dropped)){
						markedPoints = dropped.markedPoints;
				
						if (markedPoints.length>0){
							dropped.target.append($transferedData);
							_map = updateMap(markedPoints,_map,1);
							_markedPointsMap[$transferedData.data('block')] = markedPoints;
							if (levelFinished(_map)){
								$gameArea.parent().addClass('finished');
							}
							else{
								$gameArea.parent().removeClass('finished');
							}
						}
					}
					$transferedData.show();
					
					clearGameArea($gameArea);
					//remove pointer-events: none; from all blocks on board so I can move them
					addPointerEvents($gameArea);
					event.preventDefault();
				}
					
				function dragEvent(event){
					event.originalEvent.dataTransfer.setData('transferedObj',event.data.$draggedObj.attr('id'));
				}
				
				function attachEvents(level){	
					var i,$block,$drag,
						blocks = level.blocks,
						bLen = level.blocks.length,
						$scope = level.scope,
						$gameArea = $scope.find('div.game-area');	
					
					for (i=0;i<bLen;i++){
						$block = $scope.find('div.block.block'+blocks[i]);
						
						$drag = $block.find('div:first');
						$drag.attr('draggable','true');
						$drag.on('dragstart',{$draggedObj: $drag, marked: null},dragEvent);
					}
					
					$gameArea.on('dragover',dragOverEvent);
					$gameArea.on('drop',dropEvent);	
				}
				
				_map = level.map;
				attachEvents(level);
		};
		
	function checkIfCanDrop($target,$transferedData,map,$gameArea){
		var result = {};
					
		if ($target.parent().get(0) === $gameArea.get(0)){
			result = findAvailableBoxes($target,$transferedData,map,$gameArea);
		}

		return result;
	}	
	
	function removePointerEvents($gameArea){
		$gameArea.find('div.draggable').addClass('no-pointer');
	}	
		
	function addPointerEvents($gameArea){
		$gameArea.find('div.draggable').removeClass('no-pointer');
	}
		
	function levelFinished(map){
		var i,j,
			result = true,
			maxX = map.length,
			maxY = map[0].length;
			
		loop:	
		for (i=0; i<maxX; i++){
			for (j=0; j<maxY; j++){
				if (!map[i][j]){
					result = false;
					break loop;
				}
			}
		}
		
		return result;
	}	
		
	function drawAvailableArea(result, $gameArea){
		var i, $target,
			rLen = result.length;
			
		for (i=0; i<rLen; i++){
			$target = $gameArea.find('>div').eq(result[i].index);
			if (result[i].fill){
				$target.css('background-color',result[i].color);
			}
			else{
				$target.css('background-color','#FFFCF5');
			}
		}
	}	
		
	function getCoordsOrIndex(value,map){
		var i,j,
			r = 0,
			result = {
				x: 0,
				y: 0
			},
			maxX = map.length,
			maxY = map[0].length;
			
		loop:	
		for (i=0; i<maxX; i++){
			for (j=0; j<maxY; j++){
				if (typeof value !== 'object' && r === value){
					result.x = j;
					result.y = i;
					break loop;
				}
				else if (typeof value === 'object' && (i === value.y && j === value.x)){
					result = r;
					break loop;
				}
				r++;
			}
		}
		
		return result;
	}
		
	function getMarkedPoints(startX,startY,maxX,maxY,map,block){
		var i, j, x, pcoords,
			markedPoints = [],
			y = 0;
			
		loop:
			for (j = startY; j <= maxY; j++){
				x = 0; 
				for (i = startX; i <= maxX; i++){
					if ((map[j] !== undefined && map[j][i] !== undefined)
					&& (!block.matrix[y][x] || (block.matrix[y][x] && !map[j][i]))){
						pcoords = {
							x: i,
							y: j
						};
						markedPoints.push({
							coords: pcoords,
							index: getCoordsOrIndex(pcoords, map),
							fill: block.matrix[y][x]?1:0,
							color: block.color
						});
					}
					else {
						markedPoints = [];
						break loop;
					}				
					x++;
				}
				y++;
			}
			
		return markedPoints;
	}	
		
	function findAvailableBoxes($target,$transferedData,map,$gameArea){
		var bTarget = false,
			markedPoints = [],
			block = _gameBlocks[$transferedData.data('block')],
			maxI = block.matrix[0].length-1,
			maxJ = block.matrix.length-1,
			coords = getCoordsOrIndex($target.index(),map),
			startX = coords.x,
			startY = coords.y,
			maxX = startX + maxI,
			maxY = startY + maxJ;
				
		//first check right bottom direction
		markedPoints = getMarkedPoints(startX,startY,maxX,maxY,map,block);
		
		//then next right position
		if (!markedPoints.length){
			startX = coords.x-1;
			maxX = maxX-1;
			bTarget = true;
			
			markedPoints = getMarkedPoints(startX,startY,maxX,maxY,map,block);
		}
		
		//then next bottom and right position
		if (!markedPoints.length){
			startY = coords.y-1;
			maxY = maxY-1;
			bTarget = true;
			
			markedPoints = getMarkedPoints(startX,startY,maxX,maxY,map,block);
		}
		
		//then next bottom only position
		if (!markedPoints.length){
			startX = coords.x;
			maxX = startX + maxI;
			bTarget = true;
			
			markedPoints = getMarkedPoints(startX,startY,maxX,maxY,map,block);
		}
		
		//if no result then check left top direction
		if (!markedPoints.length){
			startX = coords.x - maxI;
			startY = coords.y - maxJ;
			maxX = coords.x;
			maxY = coords.y;
			bTarget = true;
			
			markedPoints = getMarkedPoints(startX,startY,maxX,maxY,map,block);
		}

		return {
			markedPoints: markedPoints,
			target: bTarget?updateTarget(startX,startY,map,$gameArea):$target
		}
	}
	
	function updateTarget(startX,startY,map,$gameArea){
		var newIndex = getCoordsOrIndex({x: startX, y: startY}, map);
		
		return $gameArea.find('>div.y').eq(newIndex);
	}
		
	function clearGameArea($gameArea){
		$gameArea.find('div').css('background-color','#FFFCF5');
	}
		
	function getGameArea($transferedData){
		var level = $transferedData.data('level'),
			$scope = $transferedData.parents('div.game.'+level);	
		
		return $scope.find('div.game-area');
	}	
		
	function getTransferedObj(event){
		var transferedData = event.originalEvent.dataTransfer.getData('transferedObj'),
			$transferedData = $('#'+transferedData);
			
		return $transferedData;
	}
		
	function updateMap(markedPoints,map,value){
		var i,
			pLen = markedPoints.length;
		
		for (i=0;i<pLen;i++){
			if (markedPoints[i].fill){
				map[markedPoints[i].coords.y][markedPoints[i].coords.x] = value;
			}
		}

		return map;
	}
			
	function dropBodyEvent(event){
		var	$transferedData = getTransferedObj(event),
			level = $transferedData.data('level'),
			$scope = $transferedData.parents('div.game.'+level),
			$gameArea = $scope.find('div.game-area'),
			$block;

		$block = $scope.find('div.block.'+$transferedData.data('block'));
		
		if ($block){
			$block.append($transferedData);
		}
		
		$transferedData.show();
		addPointerEvents($scope.find('div.game-area'));
		$gameArea.parent().removeClass('finished');
		
	}		
			
	function dragOverBodyEvent(event){
		var	$transferedData = getTransferedObj(event),
			level = $transferedData.data('level'),
			$gameArea = $transferedData.parents('div.game.'+level).find('div.game-area');
			
		clearGameArea($gameArea);
		addPointerEvents($gameArea);

		event.preventDefault();
	}		

	return {
        init : function(levels){	
			var i,
				len = levels.length;	
				
			for (i=0;i<len;i++){		
				Level(levels[i]);
			}
			
			_$gameBody.on('dragover',dragOverBodyEvent);
			_$gameBody.on('drop',dropBodyEvent);
        }
    };
}();