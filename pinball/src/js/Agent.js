function Agent (game, root) {
	this.game = game;
	this.root = root;
	this.brain = new Brain()
	this.reward = 0
	this.tmpReward = 0;
    this.playerCards = [];
}

Agent.prototype.boot = function (x, y) {
}

Agent.prototype.update = function () {

	if(this.playerCards.length < 5){

		//レーダーで捕捉した入力値を取得する
		var input = this.root.getInput()

		//プレイヤーの入力を決める
		var output = this.brain.forward(input)
		if(output == 0){
			this.playerCards.push(1);
		}else if(output == 1){
			this.playerCards.push(2);
		}else if(output == 2){
			this.playerCards.push(3);
		}else{
			this.playerCards.push(0);
		}

		//結果から得点を計算し、報酬を得る
		if(this.playerCards.length == 1){
			this.reward += this.root.getResult(this.playerCards[0],this.root.enemyCards[0]);;
		}else if (this.playerCards.length == 2){
			this.reward += this.root.getResult(this.playerCards[1],this.root.enemyCards[1]);
		}else if (this.playerCards.length == 3){
			this.reward += this.root.getResult(this.playerCards[2],this.root.enemyCards[2]);
		}else if (this.playerCards.length == 4){
			this.reward += this.root.getResult(this.playerCards[3],this.root.enemyCards[3]);
		}else if (this.playerCards.length == 5){
			this.reward += this.root.getResult(this.playerCards[4],this.root.enemyCards[4]);
		}

		//報酬計算
		this.rewardBrain()

		//save & load
		if(this.playerCards.length == 5){
	        var bestBrain = this.saveBrain()
	        this.loadBrain(bestBrain)
	        this.root.isGameEndCnt = 1;
		}
	}
}

Agent.prototype.Sleep = function(T){ 
   var d1 = new Date().getTime(); 
   var d2 = new Date().getTime(); 
   while( d2 < d1+1000*T ){ 
       d2=new Date().getTime(); 
   } 
   return; 
} 

Agent.prototype.rewardBrain = function () {
	this.brain.backward(this.getReward())
}

Agent.prototype.getReward = function () {
	var reward = this.reward
	this.tmpReward = reward
	this.reward = 0
	return reward
}

Agent.prototype.reject = function () {

}

Agent.prototype.saveBrain = function () {
	var brain = this.brain.value_net.toJSON()

	var rate = this.root.generation % 10000;
	if(rate == 0){
		console.log(JSON.stringify(brain));
	}
    return JSON.stringify(brain)
}

Agent.prototype.loadBrain = function (brain) {
	if(typeof brain === 'string') brain = JSON.parse(brain)
	try{
		this.brain.value_net.fromJSON(brain)
	}
	catch(e){
		console.log(e);
	}
       
}

