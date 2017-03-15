
(function (ROOT) {

	function preload () {
        this.score = 0;
        this.winCnt = 0;
        this.loseCnt = 0;
        this.drawCnt = 0;
        this.sumScore = 0;
        this.aveCnt = 0;
        this.enemyCards = [];
        for(var i=0; i<5; i++) {
            this.enemyCards.push(Math.floor( Math.random() * 3 ) + 1);
        }

		game.time.advancedTiming = true
		game.stage.disableVisibilityChange = true

        this.generation = 0;
        this.frameCount = 0;

        this.isGameEndCnt = 0;

        game.load.text('brain_text','text/brain.txt')
	}

	function create () {
        game.world.setBounds(0, 0, this.mapWidth, this.mapHeight)
        this.agent = new Agent(game, this);
        var _brainText = this.cache.getText('brain_text');
        this.agent.loadBrain(_brainText);
	}

	function getInput() {
		this.input = []
		this.input[0] = this.enemyCards[0];
		this.input[1] = this.enemyCards[1];
		this.input[2] = this.enemyCards[2];
		this.input[3] = this.enemyCards[3];
		this.input[4] = this.enemyCards[4];
        this.input[5] = this.agent.playerCards.length
		return this.input;
	}

	function update () {

        var _brainText = this.cache.getText('brain_text');
        this.agent.loadBrain(_brainText);

        this.agent.update();

        if(this.isGameEndCnt >= 1){
            this.isGameEndCnt+=1;
            if(this.isGameEndCnt >= 3){

                this.generation += 1;
                this.aveCnt++;
                if(this.aveCnt < 1000){
                    this.sumScore += this.score;
                }else{
                    console.log("genelation:" + this.generation + "/ave:" + this.sumScore / 1000);
                    this.aveCnt = 0;
                    this.sumScore = 0;
                }

                //reset
                this.isGameEndCnt = 0;
                this.score = 0;
                this.winCnt = 0;
                this.drawCnt = 0;
                this.loseCnt = 0;
                this.agent.playerCards = [];
                this.enemyCards = [];
                for(var i=0; i<5; i++) {
                    this.enemyCards.push(Math.floor( Math.random() * 3 ) + 1);
                }
            }
        }
	}

    function getResult(playerCard, enemyCard) {
        //1gu 2choki 3pa-
        if(playerCard == enemyCard){
            this.drawCnt+=1;
            this.score+=0;
            return 0;
        }else

        if(playerCard == 1 && enemyCard == 2){
            this.winCnt+=1;
            this.score+=1;
            return 1;
        }else if(playerCard == 2 && enemyCard == 3){
            this.winCnt+=1;
            this.score+=1;
            return 1;
        }else if(playerCard == 3 && enemyCard == 1){
            this.winCnt+=1;
            this.score+=1;
            return 1;
        }else

        if(enemyCard == 1 && playerCard == 2){
            this.loseCnt+=1;
            this.score-=1;
            return -1;
        }else if(enemyCard == 2 && playerCard == 3){
            this.loseCnt+=1;
            this.score-=1;
            return -1;
        }else if(enemyCard == 3 && playerCard == 1){
            this.loseCnt+=1;
            this.score-=1;
            return -1;
        }
    }

	function render () {
        game.debug.text('fps:' + game.time.fps, 10, 20)
        game.debug.text('layer:2 + memory:1', 100, 20)
        game.debug.text('generation:' + this.generation, 10, 40)
        game.debug.text('win:' + this.winCnt + "/draw:" + this.drawCnt + "/lose:" + this.loseCnt, 10, 60)
        game.debug.text('score:' + this.score, 10, 80)
        game.debug.text('reward:' + this.agent.tmpReward, 10, 100)


        var enemyText = "";
        for(var i=0; i<this.enemyCards.length; i++) {
            enemyText += this.enemyCards[i] + "-";
        }
        game.debug.text('enemyText:' + enemyText, 10, 120)

        var playerText = "";
        for(var i=0; i<this.agent.playerCards.length; i++) {
            playerText += this.agent.playerCards[i] + "-";
        }
        game.debug.text('playerText:' + playerText, 10, 140)
	}

	var game = ROOT.game = new Phaser.Game(
		320,
		320, 
		Phaser.CANVAS, 
		ROOT.document.body, { 
			preload: preload, 
			create: create, 
			update: update, 
			render: render,
            getInput:getInput,
            getResult:getResult,
		}
	)

})(this)