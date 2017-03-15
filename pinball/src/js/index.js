
(function (ROOT) {

	function preload () {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        //game.stage.backgroundColor = '#eee';
        game.load.image('ball', 'img/ball.png');
        game.load.image('paddle', 'img/paddle.png');
        game.time.advancedTiming = true
	}

	function create () {
        this.timeCount = 0;
        this.reward = 0;
        this.score = 0;
        this.generation = 0;
        this.gameCount = 1;
        this.totalScore = 0;
        this.isFinishedGame = false;

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.checkCollision.down = false;
        ball = game.add.sprite(game.world.width*0.5, game.world.height-25, 'ball');
        ball.anchor.set(0.5);
        game.physics.enable(ball, Phaser.Physics.ARCADE);
        ball.body.velocity.set(150, -150);
        ball.body.collideWorldBounds = true;
        ball.body.bounce.set(1.1);
        ball.checkWorldBounds = true;
        ball.events.onOutOfBounds.add(function(){
            this.reward -= 30;
            ball.x =  Math.random()*(200-40)+40;
            ball.y = game.world.height/2;
            ball.body.velocity.set(180, -150);
            ball.body.collideWorldBounds = true;
            this.isFinishedGame = true;
        }, this);

        paddle = game.add.sprite(game.world.width*0.5, game.world.height + 7, 'paddle');
        paddle.anchor.set(0.5,1);
        game.physics.enable(paddle, Phaser.Physics.ARCADE);
        paddle.body.immovable = true;

        cursors = game.input.keyboard.createCursorKeys()

        this.brain = new Brain()


        var style = { font: "10px Arial", fill: "#fff", 
            align: "left", // the alignment of the text is independent of the bounds, try changing to 'center' or 'right'
            boundsAlignH: "left", 
            boundsAlignV: "top", 
            wordWrap: true, wordWrapWidth: 300 };
            this.text = game.add.text(0, 0, "aaaa", style);
            //text.setTextBounds(16, 16, 768, 568);
	}

	function getInput() {
		this.input = []
        this.input[0] = Math.ceil(ball.x)
        this.input[1] = Math.ceil(ball.y)
        this.input[2] = Math.ceil(paddle.x)
        this.input[3] = Math.ceil(paddle.y)
        //console.log(this.input);
		return this.input;
	}

	function update () {
        if (cursors.left.isDown){
            this.moveLeft();
        }
        if (cursors.right.isDown){
            this.moveRight();
        }
        var _isCollide = game.physics.arcade.collide(ball, paddle);
        if(_isCollide == true){
            this.reward += 10;
            this.score += 1;
            this.totalScore += 1;
        }

        //レーダーで捕捉した入力値を取得する
        var input = this.getInput()

        //報酬計算
        this.rewardBrain()

        //動かす
        var output = this.brain.forward(input)
        switch(output) {
            case 0: 
                this.moveRight()
                break
            case 1:
                this.moveLeft()
                break
            case 2:
                //this.moveLeft()
                break
        }

        this.timeCount++
        if(this.isFinishedGame == true){
            this.isFinishedGame = false;
            var bestBrain = this.saveBrain();
            this.loadBrain(bestBrain);
            this.generation++;
            this.timeCount = 0;
            //console.log(this.score);
            this.score = 0;

            this.gameCount+=1;
            if(this.gameCount >= 1000){
                console.log(this.totalScore/1000);
                this.gameCount = 0;
                this.totalScore = 0;
            }

        }
/*
        this.timeCount++
        if(this.timeCount == 60*60) {
            var bestBrain = this.saveBrain();
            this.loadBrain(bestBrain);
            this.generation++
            this.timeCount = 0
            //console.log(this.score);
            this.score = 0;

            this.gameCount+=1;
            if(this.gameCount >= 100){
                console.log(this.totalScore/100);
                this.gameCount = 0;
                this.totalScore = 0;
            }
        }
*/
	}

    function moveRight () {
        paddle.x += 15;
        if(paddle.x >= 150){
            paddle.x = 150 - 36/2;
        }
    }

    function moveLeft () {
        paddle.x -= 15;
        if(paddle.x <= 0){
            paddle.x = 0 + 36/2;
        }
    }

	function render () {
        this.text.setText('fps:' + game.time.fps + 'time' +  Math.ceil(60 - Math.ceil(this.timeCount/60)) + 'gen:' + this.generation)
        /*
        game.debug.text('fps:' + game.time.fps, 5, 20);
        game.debug.text('time:' + Math.ceil(60 - Math.ceil(this.timeCount/60)), 5, 40);
        game.debug.text('generation:' + this.generation, 5, 60);
        game.debug.text('score:' + this.score, 5, 80);
        game.debug.text('reward:' + this.tmpReward, 5, 100);
        */
	}

    function rewardBrain() {
        this.brain.backward(this.getReward())
    }

    function getReward() {
        var reward = this.reward
        this.tmpReward = reward;
        this.reward = 0
        return reward
    }

    function saveBrain() {
        var brain = this.brain.value_net.toJSON()
        if(this.generation % 60 == 0){
            console.log(JSON.stringify(brain));
        }
        return JSON.stringify(brain)
    }

    function loadBrain(brain) {
        if(typeof brain === 'string') brain = JSON.parse(brain)
        this.brain.value_net.fromJSON(brain)
    }

	var game = ROOT.game = new Phaser.Game(
		150,
		150, 
		Phaser.CANVAS, 
		ROOT.document.body, { 
			preload: preload, 
			create: create, 
			update: update, 
			render: render,
            getInput:getInput,
            moveRight:moveRight,
            moveLeft:moveLeft,
            rewardBrain:rewardBrain,
            getReward:getReward,
            saveBrain:saveBrain,
            loadBrain:loadBrain,
		}
	)

})(this)