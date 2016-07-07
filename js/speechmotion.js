window.addEventListener("DOMContentLoaded", function(){
    //Switch case number of Leaploop, triggered by annyang commands and functions
    var state =1;

    function initialImagetoCanvas(imgsrc) {
        var img = new Image();
        img.src = imgsrc;
        img.onload = function () {
            draw(this);
        };
    }

    function draw(img) {
        var canni = document.getElementById('imgcanvas');
        var ctx = canni.getContext('2d');
        ctx.drawImage(img, 0, 0);
        img.style.display = 'none';
        var imageData = ctx.getImageData(0,0,canni.width, canni.height);
        var data = imageData.data;
    }



    //Texture/image - current image src file
    var currentPickedMeshTextureSrc;

    //Frames
    var previousFrame =0;
    // if mesh selected, no other click event allowed
    var clickable = true;
    //current selected mesh, to perform actions on
    var currentPickedMesh =0;


    //Babylon engine creation
    var canvas = document.getElementById('gameCanvas');
    var engine = new BABYLON.Engine(canvas, true);
    //Babylon Scene creation
    var scene = new BABYLON.Scene(engine);
    scene.fogEnabled= true;
    // scene.debugLayer.show();
    scene.ambientColor= BABYLON.Color3.Red();


    //the boxcube
    //var cube = BABYLON.Mesh.CreateBox("cube", 5, scene);
    //var pointerSphere = BABYLON.Mesh.CreateSphere("sphere",  0.5, 0.5, scene);

    //Free Camera
    //var camera = new BABYLON.FreeCamera("camera", nevw BABYLON.Vector3(250,200,50), scene);
   // camera.setTarget(BABYLON.Vector3.Zero());
   // ArcRotateCamera >> Camera turning around a 3D point (here Vector zero) with mouse and cursor keys
   // Parameters : name, alpha, beta, radius, target, scene
    var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera",Math.PI / 2, Math.PI / 2, 50, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);

    //the ambient light
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0,1,0), scene);
    var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(-15, 1, -4), scene);


    //-----Initial boxes----------//

    // create some boxes
    /*
    var boxes = new Array();
    for (var x = -6; x <= 6; x += 4){

        var cube = BABYLON.Mesh.CreateBox("box" + x.toString(), 2, scene);
        cube.position.y = 1;
        cube.position.x = x;
        cube.position.z = 10;
        cube.isPickable = true;
        boxes.push(cube);


    }
    */
    //------------------------//



    //---------------Image/Texture Creation --------//


    //Creation of a repeated textured material
    var materialPlane = new BABYLON.StandardMaterial("texturePlane", scene);
    materialPlane.diffuseTexture = new BABYLON.Texture("images/rhino.jpg", scene);
    materialPlane.specularColor = new BABYLON.Color3(0, 0, 0);
    materialPlane.backFaceCulling = false;//Allways show the front and the back of an element

    //Creation of a plane
    var plane = BABYLON.Mesh.CreatePlane("plane", 10, scene);
 //  plane.rotation.z = 0.90;
 //   plane.position.x = 10;
 //   plane.position.y = 10;
 //   plane.position.z = 15;
    plane.material = materialPlane;



    //Creation of a repeated textured material
    var materialPlane2 = new BABYLON.StandardMaterial("texturePlane", scene);
    materialPlane2.diffuseTexture = new BABYLON.Texture("images/wildboar.jpg", scene);
    materialPlane2.specularColor = new BABYLON.Color3(0, 0, 0);
    materialPlane2.backFaceCulling = false;//Allways show the front and the back of an element

    //Creation of a plane
    var plane2 = BABYLON.Mesh.CreatePlane("plane2", 10, scene);
//     plane2.rotation.z = 0.90;
     plane2.position.x = 15;
//     plane2.position.y = 15;
//     plane2.position.z = 5;
    plane2.material = materialPlane2;


    //-------------------//




    //---------Image Processing -----------

        var invert = function() {
            if (currentPickedMesh) {
            var img = new Image();
            img.src = currentPickedMeshTextureSrc;
            var canni = document.getElementById('imgcanvas');
            var ctx = canni.getContext('2d');
            ctx.drawImage(img, 0, 0);
            img.style.display = 'none';
            var imageData = ctx.getImageData(0, 0, canni.width, canni.height);
            var data = imageData.data;
            for (var i = 0; i < data.length; i += 4) {
                data[i] = 255 - data[i];     // red
                data[i + 1] = 255 - data[i + 1]; // green
                data[i + 2] = 255 - data[i + 2]; // blue
            }
            ctx.putImageData(imageData, 0, 0);
            var dataURL = canni.toDataURL("image/jpg");
            dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
            // console.log(dataURL);

            //Creation of a repeated textured material
            var materialPlane = new BABYLON.StandardMaterial("texturePlane", scene);
            materialPlane.diffuseTexture = new BABYLON.Texture.CreateFromBase64String(dataURL, "iverted", scene);
            materialPlane.specularColor = new BABYLON.Color3(0, 0, 0);
            materialPlane.backFaceCulling = false;//Allways show the front and the back of an element
            //delete current texture to free memory space
             currentPickedMesh.material.diffuseTexture.dispose();
            //assign new material to current selected plane
             currentPickedMesh.material = materialPlane;
        }

        };
       //Grayscale and invert from:  https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
        var grayscale = function() {
            if (currentPickedMesh) {
            var img = new Image();
            img.src = currentPickedMeshTextureSrc;
            var canni = document.getElementById('imgcanvas');
            var ctx = canni.getContext('2d');
            ctx.drawImage(img, 0, 0);
            img.style.display = 'none';
            var imageData = ctx.getImageData(0, 0, canni.width, canni.height);
            var data = imageData.data;
            for (var i = 0; i < data.length; i += 4) {
                var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = avg; // red
                data[i + 1] = avg; // green
                data[i + 2] = avg; // blue
            }
            ctx.putImageData(imageData, 0, 0);
            var dataURL = canni.toDataURL("image/jpg");
            dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
            // console.log(dataURL);

            //Creation of a repeated textured material
            var materialPlane = new BABYLON.StandardMaterial("texturePlane", scene);
            materialPlane.diffuseTexture = new BABYLON.Texture.CreateFromBase64String(dataURL, "newimageGrayScale", scene);
            materialPlane.specularColor = new BABYLON.Color3(0, 0, 0);
            materialPlane.backFaceCulling = false;//Allways show the front and the back of an element
                //delete current texture to free memory space
                currentPickedMesh.material.diffuseTexture.dispose();
            //assign new material to current selected plane
                currentPickedMesh.material = materialPlane;

        }
        };
    var blau = function() {
        if (currentPickedMesh) {
        var img = new Image();
        img.src = currentPickedMeshTextureSrc;
        var canni = document.getElementById('imgcanvas');
        var ctx = canni.getContext('2d');
        ctx.drawImage(img, 0, 0);
        img.style.display = 'none';
        var imageData = ctx.getImageData(0, 0, canni.width, canni.height);
        var data = imageData.data;
        //  go through each pixel, increasing blue, but decrease red and green:
        var w2 = canni.width / 2;
        for (y = 0; y < canni.height; y++) {
            pixi = y * canni.width * 4;
            for (x = 0; x < w2; x++) {
                r = imageData.data[pixi++] / 3; //less red
                g = imageData.data[pixi++] / 3; //less green
                b = imageData.data[pixi++] * 5; //increase blue
                a = imageData.data[pixi++]; // no change to alpha alpha
                b = Math.min(255, b); //clamp to[0..255]
                imageData.data[pixi++] = r;
                imageData.data[pixi++] = g;
                imageData.data[pixi++] = b;
                imageData.data[pixi++] = a;
            }
        }
        ctx.putImageData(imageData, 0, 0);
        var dataURL = canni.toDataURL("image/jpg");
        dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        // console.log(dataURL);

        //Creation of a repeated textured material
        var materialPlane = new BABYLON.StandardMaterial("texturePlane", scene);
        materialPlane.diffuseTexture = new BABYLON.Texture.CreateFromBase64String(dataURL, "blueimage", scene);
        materialPlane.specularColor = new BABYLON.Color3(0, 0, 0);
        materialPlane.backFaceCulling = false;//Allways show the front and the back of an element
            //delete current texture to free memory space
            currentPickedMesh.material.diffuseTexture.dispose();
        //assign new material to current selected plane
         currentPickedMesh.material = materialPlane;
    }
    };

    var downloadImage = function(){
        if (currentPickedMesh) {
            document.getElementById('download').click();
        }
    }


    document.getElementById('download').addEventListener('click', function() {
        this.href = document.getElementById('imgcanvas').toDataURL();
        var picName = currentPickedMeshTextureSrc.split("/")[1];
        this.download = picName;
        console.log(document.getElementById('imgcanvas'))
    }, false);

    //-----------------------------//



    //-----inital position of leap cursor ---//
    //compute scenes transformations Matrix. Needed for BABYLON.Vector3.Project
    scene.updateTransformMatrix();
    //3D positions
    var _3Dposition = new BABYLON.Vector3(1,1,1);
    //Babylons Project Methog to convert 3D to 2D
    var _2Dposition = BABYLON.Vector3.Project(
        _3Dposition,
        BABYLON.Matrix.Identity(),   //world matrix
        scene.getTransformMatrix(), //transformation matrix
        scene.activeCamera.viewport.toGlobal(engine) //viewport
    );
    //set HTML position of "cursor"
    cursor.style.left = _2Dposition.x + 'px';
    cursor.style.top =  _2Dposition.y + 'px';
    //--------------------------------//


    //------Add Particles to the current seletect Mesh ----//
    var addParticles = function() {
        //check if a mesh is selected
        if (currentPickedMesh) {
            //BABYLON particle system
            var particleCloud = new BABYLON.ParticleSystem("particles", 2000, scene);

            //Texture
            particleCloud.particleTexture = new BABYLON.Texture("images/flare.png", scene);
            // Starting point of particles
            particleCloud.emitter = currentPickedMesh; // the current picked mesh = emitter
            particleCloud.minEmitBox = new BABYLON.Vector3(-1, 0, 0); // Startingpoint
            particleCloud.maxEmitBox = new BABYLON.Vector3(1, 0, 0); // ..to.

            // Colors
            particleCloud.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
            particleCloud.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
            particleCloud.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

            // Size of  particles random between 0  and/. 3
            particleCloud.minSize = 0.4;
            particleCloud.maxSize = 1.5;

            // Lifetime of  particles random between 0  and/. 3
            particleCloud.minLifeTime = 0.3;
            particleCloud.maxLifeTime = 1.5;

            // Emissionrate
            particleCloud.emitRate = 1500;

            // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
            particleCloud.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

            // gravity of particles
            particleCloud.gravity = new BABYLON.Vector3(0, -9.81, 0);

            // Direction of particles
            particleCloud.direction1 = new BABYLON.Vector3(-7, 8, 3);
            particleCloud.direction2 = new BABYLON.Vector3(7, 8, -3);

            // Angular speed of particals in radians
            particleCloud.minAngularSpeed = 0;
            particleCloud.maxAngularSpeed = Math.PI;

            // Speed of particles
            particleCloud.minEmitPower = 1;
            particleCloud.maxEmitPower = 3;
            particleCloud.updateSpeed = 0.005;

            // Start the particles
            particleCloud.start();
        }
        else{

        }
    }
    //--------------------------------//

    var addRotationAnimation = function() {
        //if a mesh/object is selected...
        if (currentPickedMesh){

        var settings = [];
        //create Babylon animation object
        var animation = new BABYLON.Animation("animation", "rotation.x", 1, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        // first animation frames scaling: 0
         settings.push({
            frame: 0,
            value: 0
        });

         // 50th animation frames scaling: Math.Pi
         settings.push({
            frame: 50,
            value: Math.PI
        });

         // hundreds animation frames scaling: 1
         settings.push({
            frame: 100,
            value: 1
        });

        // Launch roll animation
        animation.setKeys(settings);
         currentPickedMesh.animations.push(animation);
        scene.beginAnimation(currentPickedMesh, 0, 100, true);
    }
        else{

        }
    }


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
    var unselect = function () {
        console.log(currentPickedMesh);
        currentPickedMesh.outlineWidth = 0.0;
        currentPickedMesh.renderOutline = false;
        currentPickedMesh = 0;
        state= 1;
        clickable = true;
        cursor.style.display = "block";
    };
    var move = function () {
        if(currentPickedMesh)
            state= 4;
        else{
            state= 1;
            clickable = true;
            cursor.style.display = "block";
        }
    };
// -------- ANNYANG ------------
    if (annyang) {
        // Let's define a command.
        var commands = {
            'Boden': addGround,
            'entfernen' : removeGround,
            'drehen'  : rotate,
            'okay'  : unselect,
            'verschieben' : move,
            'animieren'   : addRotationAnimation,
            'Wolke'   : addParticles,
             'grayscale' : grayscale,
            'invers' :   invert,
            'blau': blau,
            'herunterladen' : downloadImage,
        };
        annyang.debug(true);
        // Add our commands to annyang
        annyang.addCommands(commands);
        annyang.setLanguage("de-DE")


        // Start annyang.
        annyang.start(true, true);
    }

    //---------------------------------//

    // Resize
    window.addEventListener("resize", function () {
        engine.resize();

    });


    // ------------------------------

    // -------- Leap Motion ------------//
    var controller = Leap.loop({enableGestures: true}, function(frame) {


        switch(state) {
            //initial state: meshes are selectable via cursor
            case 1:
                if (frame.pointables.length > 0) {
                    var positionLeap = frame.pointables[0].stabilizedTipPosition;
                    var normalized = frame.interactionBox.normalizePoint(positionLeap);
                    var hand = frame.hands[0];
                   // var x = ctx.canvas.width * normalized[0];
                   // var y = ctx.canvas.height * (1 - normalized[1]);
                 //   pointerSphere.position.x = positionLeap[2];
                   // pointerSphere.position.y = positionLeap[1];
                    //pointerSphere.position.z = positionLeap[0];
                    // console.log("x:  "+positionLeap[2] + "  y:  "+positionLeap[1]+"  z:  "+positionLeap[0]);
/*


                    leapX = (-1) * hand.screenPosition()[0] / 50 + 16;
                    leapY = (-1) * hand.screenPosition()[1] / 50;
                    leapZ = (-1) * hand.screenPosition()[2] / 50 + 16;
*/
                    //cursors position is updated with leaps normalized position
                    cursor.style.left = (canvas.width*normalized[0])  + 'px';
                    cursor.style.top = (canvas.height*(1- normalized[1] )) + 'px';

                    //!!is not being used at the moment!
                    // Hand motion compared now and previous frame
                    if (previousFrame) {
                        //movement since last frame
                        var translation = hand.translation(previousFrame);
                        var String = "Translation: " +translation.toString() + " ";
                        //rotationAxis since last frame
                        var rotationAxis = hand.rotationAxis(previousFrame, 2);
                        //rotation angle since last frame
                        var rotationAngle = hand.rotationAngle(previousFrame);
                        String += " Rotationaxis: " + rotationAxis.toString()  + " ";
                        String += " Rotationangle: " + rotationAngle.toFixed(2) + " ";
                        //resize/scale factor since last frame
                        var scaleFactor = hand.scaleFactor(previousFrame);
                        String += " Scale factor: " + scaleFactor.toFixed(2) + " ";
                        //console.log(String);
                    }

                // Store frame for hand motion comparisment, see above
                previousFrame = frame;

                 //get a past frame -> click event is triggered if finger is at one position for frame(x) frames
                 var tenFramesBack = controller.frame(50);
                 //get the movement vector of tenFramesBack and current frame
                 var movement = hand.translation(tenFramesBack);

                 //if movement is smaller than 1, than the user is pointing at the screen
                 if(movement[0] >0 &&movement[0] <=1 && movement[1] <=1 && movement[2] <=1 && clickable){

                 //no more clickevent are being accepted
                 clickable = false;

                 //html element cursors size and position relative to viewport
                 var rect = cursor.getBoundingClientRect();

                 //create click event with scene.pick and get the picked result
                 var pickResult = scene.pick(rect.left, rect.top);

                 //console.log(pickResult +""+pickResult.hit);
                 // Highlight selected Mesh if a mesh has been hit/selected by leap
                 if(pickResult.hit) {
                   pickResult.pickedMesh.outlineWidth = 0.3;
                   pickResult.pickedMesh.renderOutline = true;
                   //set the current selected mesh
                   currentPickedMesh = pickResult.pickedMesh;
                   currentPickedMeshTextureSrc= currentPickedMesh.material.diffuseTexture.url;
                   initialImagetoCanvas(currentPickedMeshTextureSrc);
                     console.log(currentPickedMesh.material.diffuseTexture);
                   //hide the cursor
                   cursor.style.display = "none";
                   //set loop state to 2 -> resize and rotate action
                   state = 2;
                   }
                   else{
                    //if no mesh has been hit/selected show cursor and enable leap click action
                    clickable = true;
                    cursor.style.display = "block";
                  }

                 }
                }
                break;
            //rotate current selected mesh and scale it
            case 2:
                if(frame.hands.length > 0) {
                   // addRotationAnimation( frame.hands[0].type, frame.hands[0].roll());
                  //  console.log(frame.hands[0].roll())
                    var degree = frame.hands[0].roll() * (180 / Math.PI);
                   // scene.activeCamera.alpha = degree;
                    if(frame.hands[0].type === "left")					// hand roll is from 0 to 180deg
                        console.log("lefthand");
                     //   scene.activeCamera.alpha = degree;
                    else {

                     /*
                        var hand = frame.hands[0];
                        var previousFram = controller.frame(1);
                        var totalRotation = hand.rotationAngle(previousFram);
                        var rotationAroundXAxis = hand.rotationAngle(previousFram, [0,0,1]);
                        var rotationAroundYAxis = hand.rotationAngle(previousFram, [0,0,1]);
                        var rotationAroundZAxis = hand.rotationAngle(previousFram, [0,0,1]);*/

                        //Rotate current selected mesh with the rotation of your hand. rotation around the x axis = roll, the y axis = pitch, the z axis= yaw
                        currentPickedMesh.rotation.x = -frame.hands[0].roll();
                        currentPickedMesh.rotation.y = -frame.hands[0].pitch();
                        currentPickedMesh.rotation.z =-frame.hands[0].yaw();
                    }

                    var hand = frame.hands[0];
                    //the radius of the virtual sphere inside your hand, with palm facing towards leap
                    var radius = hand.sphereRadius;
                    currentPickedMesh.scaling.x = radius/50;
                    currentPickedMesh.scaling.y = radius/50;
                    currentPickedMesh.scaling.z = radius/50;
                    //var newsize = radius/25;
                    //console.log("Sphere Radius: " + radius);
                }
                break;
            //detect gestures
            case 3:
                if(frame.valid && frame.gestures.length > 0){
                    frame.gestures.forEach(function(gesture){
                        switch (gesture.type){
                            case "circle":
                               /* cube.scaling.x = gesture.radius/5;
                                cube.scaling.y = gesture.radius/5;
                                cube.scaling.z = gesture.radius/5;*/

                                console.log("Circle Gesture");
                                break;
                            case "keyTap":
                                console.log("key tap Gesture");
                                break;
                            case "screenTap":
                                var position = gesture.position;
                                console.log("screen tap Gesture" + position);
                                break;
                            case "swipe":
                                console.log("Swipe Gesture");
                                break;
                        }
                    });
                }
                break
            //move picked mesh around -> new position via leap
            case 4:
                if (frame.pointables.length > 0) {
                    var positionLeap = frame.pointables[0].stabilizedTipPosition;
                    var normalized = frame.interactionBox.normalizePoint(positionLeap);

                    // var x = ctx.canvas.width * normalized[0];
                    // var y = ctx.canvas.height * (1 - normalized[1]);


                    //   pointerSphere.position.x = positionLeap[2];
                    // pointerSphere.position.y = positionLeap[1];
                    //pointerSphere.position.z = positionLeap[0];
                    // console.log("x:  "+positionLeap[2] + "  y:  "+positionLeap[1]+"  z:  "+positionLeap[0]);


                    var hand = frame.hands[0];

                    leapX = (-1) * hand.screenPosition()[0] / 50 + 16;
                    leapY = (-1) * hand.screenPosition()[1] / 50;
                    leapZ = (-1) * hand.screenPosition()[2] / 50 + 16;

                    //needs adjustment! No matter how the camera has been rotated the movement should be intuitiv
                    currentPickedMesh.position.x =leapX;
                    currentPickedMesh.position.y =leapY;
                    currentPickedMesh.position.z =-leapZ;


                }
                break
            default:

        }


    }).use('screenPosition', {scale: 1});

    //the render loop
    engine.runRenderLoop(function(){
        scene.render();
    });







}, false)