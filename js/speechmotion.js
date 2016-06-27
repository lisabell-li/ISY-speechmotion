window.addEventListener("DOMContentLoaded", function(){
    var state =1;
    //Babylon engine creation
    var canvas = document.getElementById('gameCanvas');
    var engine = new BABYLON.Engine(canvas, true);
    //Babylon Scene creation
    var scene = new BABYLON.Scene(engine);
    scene.fogEnabled= true;
    //   scene.debugLayer.show();
    scene.ambientColor= BABYLON.Color3.Red();

    //the boxcube
    var cube = BABYLON.Mesh.CreateBox("cube", 5, scene);

    //Free Camera
    var camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(250,200,50), scene);
    camera.setTarget(BABYLON.Vector3.Zero());

    //the ambient light
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0,1,0), scene);
    var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(-15, 1, -4), scene);


    // Create a particle system
    var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);

    //Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture("images/flare.png", scene);
    // Where the particles come from
    particleSystem.emitter = cube; // the starting object, the emitter
    particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0); // Starting all from
    particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0); // To...

    // Colors of all particles
    particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
    particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

    // Size of each particle (random between...
    particleSystem.minSize = 0.4;
    particleSystem.maxSize = 1.5;

    // Life time of each particle (random between...
    particleSystem.minLifeTime = 0.3;
    particleSystem.maxLifeTime = 1.5;

    // Emission rate
    particleSystem.emitRate = 1500;

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    // Set the gravity of all particles
    particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

    // Direction of each particle after it has been emitted
    particleSystem.direction1 = new BABYLON.Vector3(-7, 8, 3);
    particleSystem.direction2 = new BABYLON.Vector3(7, 8, -3);

    // Angular speed, in radians
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;

    // Speed
    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 3;
    particleSystem.updateSpeed = 0.005;

    // Start the particle system
    particleSystem.start();


    var addRotationAnimation = function( handType, rollRadian) {
        var degree = rollRadian * (180 / Math.PI);

        var rotationDegree;

        if(handType === "left")						// hand roll is from 0 to 180deg
            rotationDegree= -degree-180;		// back card should roll from -180 to 0
        else
            rotationDegree =180-degree;	// hand roll is from 0 to -180deg


        // Fountain's animation
        var keys = [];
        var animation = new BABYLON.Animation("animation", "rotation.x",  rotationDegree, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        // At the animation key 0, the value of scaling is "1"
        keys.push({
            frame: 0,
            value: 0
        });

        // At the animation key 50, the value of scaling is "0.2"
        keys.push({
            frame: 50,
            value: Math.PI
        });

        // At the animation key 100, the value of scaling is "1"
        keys.push({
            frame: 100,
            value: 0
        });

        // Launch animation
        animation.setKeys(keys);
        cube.animations.push(animation);
        scene.beginAnimation(cube, 0, 100, true);
    }






    // create some boxes
    ///var boxes = new Array();
    /*for (var x = -6; x <= 6; x += 4){

     var cube = BABYLON.Mesh.CreateBox("box" + x.toString(), 2, scene);
     cube.position.y = 1;
     cube.position.x = x;
     cube.position.z = 10;
     boxes.push(cube);


     }*/



    // --------------- annyang Functions --------------------------

    var addGround = function () {
        // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
        var ground = BABYLON.Mesh.CreateGround("ground1", 100, 100,3, scene);
        ground.material = new BABYLON.StandardMaterial("materialGround", scene);
        ground.material.backFaceCulling = false;
        ground.material.diffuseColor = new BABYLON.Color3(0.4, 0.3, 1);
        ground.position.y -= 10;
    };

    var removeGround = function () {
        // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
        scene.getMeshByName("ground1").dispose();
    };
    var rotate = function () {
       state= 2;
    };
    var rotateStop = function () {
        state= 1;
    };



    // Resize
    window.addEventListener("resize", function () {
        engine.resize();

    });

    // -------- ANNYANG ------------
    if (annyang) {
        // Let's define a command.
        var commands = {
            'ground': addGround,
            'remove' : removeGround,
            'rotate'  : rotate,
            'stop rotate'  : rotateStop,
        };
        annyang.debug(true);
        // Add our commands to annyang
        annyang.addCommands(commands);


        // Start listening.
        annyang.start(true, true);
    }

    // ------------------------------

    // -------- Leap Motion ------------
    Leap.loop(function(frame) {

        switch(state) {
            case 1:
                if (frame.pointables.length > 0) {
                    var positionLeap = frame.pointables[0].stabilizedTipPosition;
                    var normalized = frame.interactionBox.normalizePoint(positionLeap);

                    cube.position.x = positionLeap[2];
                    cube.position.y = positionLeap[1];
                    cube.position.z = positionLeap[0];
                    // console.log("x:  "+positionLeap[2] + "  y:  "+positionLeap[1]+"  z:  "+positionLeap[0]);
                }
                break;
            case 2:
                if(frame.hands.length > 0) {
                   // addRotationAnimation( frame.hands[0].type, frame.hands[0].roll());

                    var degree = frame.hands[0].roll() * (180 / Math.PI);
                    if(frame.hands[0].type === "left")						// hand roll is from 0 to 180deg
                       degree= -degree;
                    else
                        degree= degree;


                    cube.rotation.x = -frame.hands[0].roll();

                }
                break;
            default:
        }


    });

    //the render loop
    engine.runRenderLoop(function(){
        scene.render();
    });







}, false)