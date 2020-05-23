// Constants
var jumpPower = 8;
var gravity = 0.3;
var jumpCooldown = 100;
var pipeGap = 3.5;
var pipeFrequency = 100;
var speed = 6;
var physDelay = 10;
var frameSize = 240;
var alivePlayers = 0;

// Variables
var pipes = new Array();
var pipeInterval = 0;
var physCount = 0;

class game {
	constructor(genome, x, y) {
		// Neat
		this.genome = genome;
		
		// Physics
		this.yVel = 0;
		this.y = frameSize / 2;
		this.canJump = true;
		this.fitness = 0;

		// Fitness
		this.pipeScore = 10;
		this.travelScore = 0.05;
		
		// Graphics
		this.windowX = frameSize * x + ((window.innerWidth-(frameSize * Math.ceil(window.innerWidth/frameSize-1)))/2);
		this.windowY = frameSize * y;
		var this_ = this;
		this.graphics = new p5(function(p) {
			this_.sketch(p);
		});
		
		// Physics
		this.physInterval = setInterval(function()
		{
			this_.runPhys();
		}, physDelay);

		// Jump
		
		document.addEventListener('keydown', function(){
			this_.jump();
		});
	}
	
	sketch(p) {
		var this_ = this;
		p.setup = function() {
			var can = p.createCanvas(frameSize,frameSize);
			can.style('top', this_.windowY + "px");
			can.style('left', this_.windowX + "px");
		}
		p.draw = function() {
			p.stroke('#222222');
			p.strokeWeight(1);
		
			// Pipes
			p.background(0, 204, 255);
			p.fill(0, 255, 0);
			for (var i = 0; i < pipes.length; i++)
			{
				p.rect(pipes[i].x, 0, frameSize/10, pipes[i].y);
				p.rect(pipes[i].x, pipes[i].y + (frameSize/pipeGap), frameSize/10, frameSize-(pipes[i].y + (frameSize/pipeGap)));
			}
			
			// Ground
			p.fill(204, 153, 0);
			p.rect(0, frameSize - (frameSize/14), frameSize, frameSize/14);
			
			// Player
			p.fill(255, 204, 0);
			p.stroke('#222222');
			p.rect((frameSize/18), Math.round(this_.y), frameSize/14, frameSize/14);
			
			// Outline
			p.fill(255,255,255,0);
			p.strokeWeight(2);
			p.rect(0,0,frameSize,frameSize);
			
			/* Text
			p.fill(0,0,0,255);
			p.strokeWeight(1);
			p.textSize(20);
			p.text(Math.floor(this_.fitness*10)/10, 10, 30)
			
			// Neat
			if (this_.input)
			{
				p.textSize(10);
				p.text(Math.floor(this_.input[0]*100)/100, 80, 30)
				p.text(Math.floor(this_.input[1]*100)/100, 110, 30)
				p.text(Math.floor(this_.input[2]*100)/100, 140, 30)
				p.textSize(20);
				p.text(Math.floor(this_.lastOutput*10)/10, 170, 30)
				
			}
			*/
		}
	}

	die()
	{
		/*
		this.y = frameSize/2;
		this.yVel = 0;
		this.fitness = 0;
		this.pipes=new Array();
		*/
		clearInterval(this.physInterval);
		clearInterval(this.pipeInterval);
		alivePlayers--;
		this.graphics.remove();
	}

	jump()
	{
		if (this.canJump)
		{
			this.canJump = false;
			this.yVel = -jumpPower;
			
			var this_ = this;
			setTimeout(function(){
				this_.canJump = true;
			}, jumpCooldown);
		}
	}
	
	jumpKey(e) {
		if (e.keyCode == 32)
		{
			this.jump();
		}
	}

	runPhys() {
		this.input = []; 
		/* Old Input
		if (pipes[0])
		{
			this.input = new Array(Math.abs(this.y/frameSize), Math.abs(pipes[0].y/frameSize), Math.abs(pipes[0].x/frameSize));
		}
		else
		{
			this.input = new Array(Math.abs(this.y/frameSize), 0.5, 0.5);
		}
		*/
		this.input.push(Math.abs(1-pipes[0].x/frameSize));
		if (Math.abs(this.y/(pipes[0].y+(frameSize/pipeGap))) > 1) {
			this.input.push(1);
		} else {
			this.input.push(Math.abs(this.y/(pipes[0].y+(frameSize/pipeGap))));
		}
		if (Math.abs(pipes[0].y/(this.y+(frameSize/14))) > 1) {
			this.input.push(1);
		} else {
			this.input.push(Math.abs(pipes[0].y/(this.y+(frameSize/14))));
		}
		
		
		var output = this.genome.activate(this.input);
		if (output[0] > 0.5)
		{
			this.jump();
		}
		this.lastOutput = output[0];
		
		
		this.y += this.yVel * (frameSize/720);
		this.yVel += gravity;
		
		// Death
		if (this.y < -(frameSize/14) || this.y > frameSize - (frameSize/14))
		{
			this.die();
		}
		
		// Pipes
		for (var i = 0; i < pipes.length; i++)
		{
			
			if (pipes[i].x <= -(frameSize/10))
			{
				fitness += this.pipeScore;
			}
			
			if (pipes[i]) {
				if ((frameSize/18) < pipes[i].x+(frameSize/10) && (frameSize/18)+(frameSize/14) > pipes[i].x)
				{
					if (this.y < pipes[i].y || this.y+(frameSize/14) > pipes[i].y+(frameSize/pipeGap))
					{
						this.die();
					}
				}
			}
			
		}
		
		this.fitness += this.travelScore;
		
		this.genome.score = this.fitness;
		// Update Info
		/*
		document.getElementById("A").innerHTML = Math.abs(this.y/frameSize);
		document.getElementById("D").innerHTML = Math.abs(this.fitness);
		if (this.pipes[0]) {
			document.getElementById("B").innerHTML = Math.abs(this.pipes[0].y/frameSize);
			document.getElementById("C").innerHTML = Math.abs(this.pipes[0].x/frameSize);
		}
		else
		{
			document.getElementById("B").innerHTML = "0";
			document.getElementById("C").innerHTML = "0";
		}
		*/
	}
}

const PLAYER_AMOUNT = 18;
const MUTATION_RATE = 0.3;
const ELITISM_PERCENT = 0.1;
const START_HIDDEN_SIZE = 0;


/*
	NEAT
*/
var Neat    = neataptic.Neat;
var Methods = neataptic.methods;
var Config  = neataptic.Config;
var Architect = neataptic.architect;

var neat;
var players = [];
var score = 0;
var highScore = 0;

// Neat Function
function initNeat() {
	neat = new Neat(
		4,
		1,
		null,
		{
			mutation: Methods.mutation.ALL,
			popsize: PLAYER_AMOUNT,
			mutationRate: MUTATION_RATE,
			elitism: Math.round(ELITISM_PERCENT * PLAYER_AMOUNT),
			network: new Architect.Random(
				3,
				START_HIDDEN_SIZE,
				1
			)
		}
	);
}

function startNeat()
{
	initNeat();
	startEvaluation();
	
	setInterval(function() {
		for (var i = 0; i < pipes.length; i++)
		{
			if (pipes[i].x <= -(frameSize/10))
			{
				pipes.splice(i, 1);
				score ++;
				document.getElementById("avg").innerHTML = "Score: " + score;
				i--;
				continue;
			}
			if (pipes[i]) {
				pipes[i].x -= Math.round(speed * (frameSize/720));
			}
		}
		if (alivePlayers <= 0)
		{
			endEvaluation();
		}
		if(physCount % pipeFrequency == 0)
		{
			pipes.push({
				x:frameSize,
				y:Math.round(Math.random()*(frameSize/2)+(frameSize/4) - (frameSize/pipeGap)/2)
			});
		}
		physCount++;
	}, physDelay);
}

function startEvaluation(){
	alivePlayers = PLAYER_AMOUNT;
	if (score > highScore)
	{
		highScore = score;
	}
	score = 0;
	
	
	var x = -1;
	var y = 0;
	for(var genome in neat.population){
		x++;
		if (x >= window.innerWidth/frameSize-1) {
			y++;
			x = 0;
		}
		genome = neat.population[genome];
		players.push(new game(genome, x, y));
	}
	if (document.getElementById("gen"))
	{
		document.getElementById("gen").style.marginTop = ((y+1) * frameSize) + "px";
		document.getElementById("avg").innerHTML = "Score: 0";
		document.getElementById("high").innerHTML = "High Score: " + highScore;
	}
}

function endEvaluation(){
	//document.getElementById("avg").innerHTML = "Average Score: " + Math.floor(neat.getAverage()*10)/10;

	for (var i = 0; i < players.length; i++) {
		players[i] = null;
	}
	players = [];
	clearInterval(pipeInterval);
	pipes = [];
	physCount = 0;
	
	neat.sort();
	var newPopulation = [];

	// Elitism
	for(var i = 0; i < neat.elitism; i++){
		newPopulation.push(neat.population[i]);
	}

	// Breed the next individuals
	for(var i = 0; i < neat.popsize - neat.elitism; i++){
		newPopulation.push(neat.getOffspring());
	}

	// Replace the old population with the new population
	neat.population = newPopulation;
	neat.mutate();

	neat.generation++;
	document.getElementById("gen").innerHTML = "Generation: " + neat.generation;
	startEvaluation();
}

startNeat();