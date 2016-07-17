window.addEventListener("DOMContentLoaded", function () {
    //Switch case number of Leaploop, triggered by annyang commands and functions
    var state = 1;
    var leapX = 0;
    var leapY = 0;
    var leapZ = 0;

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
        var imageData = ctx.getImageData(0, 0, canni.width, canni.height);
        var data = imageData.data;
    }

    //Texture/image - current image src file
    var currentPickedMeshTextureSrc;

    //Frames
    var previousFrame = 0;
    // if mesh selected, no other click event allowed
    var clickable = true;
    //current selected mesh, to perform actions on
    var currentPickedMesh = 0;


    //Babylon engine creation
    var canvas = document.getElementById('gameCanvas');
    var engine = new BABYLON.Engine(canvas, true);
    //Babylon Scene creation
    var scene = new BABYLON.Scene(engine);
    scene.fogEnabled = true;
    // scene.debugLayer.show();
    scene.ambientColor = BABYLON.Color3.Red();

    var camera = new BABYLON.ArcRotateCamera("camera", Math.PI + Math.PI/2 , Math.PI / 2, 1700, BABYLON.Vector3.Zero(), scene);
    scene.activeCamera = camera;
    camera.attachControl(canvas, true);
    camera.applyGravity = true;


    //the ambient light
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 0, -1), scene);
    light.intensity = 1;

    //---------------Image/Texture Gallery Creation --------//

    var index = 1;
    var gallery = new Array();
    for (var x = 800; x <= 1050; x += 200) {
        for (var y = -250; y <= 350; y += 200) {
            //Creation of image as textured material
            var materialPlane = new BABYLON.StandardMaterial("texturePlane" + index, scene);
            materialPlane.diffuseTexture = new BABYLON.Texture("gallery/img" + index + ".jpg", scene);
            materialPlane.specularColor = new BABYLON.Color3(0, 0, 0);
            materialPlane.backFaceCulling = false;//Always show the front and the back of an element

            //Creation of a plane
            var plane = BABYLON.Mesh.CreatePlane("image" + index, 120, scene);
            plane.material = materialPlane;
            plane.position.y = y;
            plane.position.x = x;
            plane.position.z = 0;
            plane.isPickable = true;
            gallery.push(plane);
            index++;

        }
    }

    var box1 = BABYLON.Mesh.CreateBox("box1", 80, scene);
    box1.material = new BABYLON.StandardMaterial("materialbox1", scene);
    box1.material.diffuseColor = new BABYLON.Color3(1, 0.4, 0);
    box1.position.y = -255;
    box1.position.x = -400;
    box1.position.z = 400;
    box1.isPickable = true;


    var box2 = BABYLON.Mesh.CreateBox("box2", 80, scene);
    box2.material = new BABYLON.StandardMaterial("materialbox2", scene);
    box2.material.diffuseColor = new BABYLON.Color3(1, 0.4, 0);
    box2.position.y = -255;
    box2.position.x = 400;
    box2.position.z = 400;
    box2.isPickable = true;


    var box3 = BABYLON.Mesh.CreateBox("box3", 80, scene);
    box3.material = new BABYLON.StandardMaterial("materialbox3", scene);
    box3.material.diffuseColor = new BABYLON.Color3(1, 0.4, 0);
    box3.position.y = -255;
    box3.position.x = -400;
    box3.position.z = -400;
    box3.isPickable = true;

    var box4 = BABYLON.Mesh.CreateBox("box4", 80, scene);
    box4.material = new BABYLON.StandardMaterial("materialbox4", scene);
    box4.material.diffuseColor = new BABYLON.Color3(1, 0.4, 0);
    box4.position.y = -255;
    box4.position.x = 400;
    box4.position.z = -400;
    box4.isPickable = true;


    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    var ground = BABYLON.Mesh.CreateGround("ground", 1000, 1000, 1, scene);
    ground.position.y = -300;
    ground.position.x = 0;
    ground.position.z = 0;
    ground.material = new BABYLON.StandardMaterial("materialGround", scene);
    ground.material.backFaceCulling = false;
    ground.material.diffuseColor = new BABYLON.Color3(0.5, 0.9, 1);


    //---------Image Processing -----------

    var invert = function () {
        if (currentPickedMesh) {
            var width = currentPickedMesh.scaling.y * 100;
            var height = currentPickedMesh.scaling.x * 100;
            console.log(width + " height: " + height);
            var img = new Image();
            img.src = currentPickedMeshTextureSrc;
            var canni = document.getElementById('imgcanvas');
            var ctx = canni.getContext('2d');
            ctx.drawImage(img, 0, 0, height, width);
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
    var grayscale = function () {
        if (currentPickedMesh) {
            var img = new Image();
            img.src = currentPickedMeshTextureSrc;
            var canni = document.getElementById('imgcanvas');
            var ctx = canni.getContext('2d');
            ctx.drawImage(img,0, 0);
            img.style.display = 'none';
            var imageData = ctx.getImageData(0, 0, canni.width, canni.height);
            var data = imageData.data;
            for (var i = 2; i < data.length-3; i += 1) {
                var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = avg; // red
                data[i + 1] = avg; // green
                data[i + 2] = avg; // blue
            }
            ctx.putImageData(canni, 0, 0);
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
    var blau = function () {
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
                for (x = 0; x < canni.width; x++) {
                    r = imageData.data[pixi++]; //less red
                    g = imageData.data[pixi++]; //less green
                    b = imageData.data[pixi++] * 2; //increase blue
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

    //-----inital position of leap cursor ---//
    //compute scenes transformations Matrix. Needed for BABYLON.Vector3.Project
    scene.updateTransformMatrix();
    //3D positions
    var _3Dposition = new BABYLON.Vector3(1, 1, 1);
    //Babylons Project Methog to convert 3D to 2D
    var _2Dposition = BABYLON.Vector3.Project(
        _3Dposition,
        BABYLON.Matrix.Identity(),   //world matrix
        scene.getTransformMatrix(), //transformation matrix
        scene.activeCamera.viewport.toGlobal(engine) //viewport
    );

    //set HTML position of "cursor"
    cursor.style.left = _2Dposition.x + 'px';
    cursor.style.top = _2Dposition.y + 'px';


    // --------------- annyang Functions --------------------------

    var addGround = function () {
        // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
        var ground = BABYLON.Mesh.CreateGround("ground", camera.radius, camera.radius, 20, scene);
        ground.material = new BABYLON.StandardMaterial("materialGround", scene);
        ground.material.backFaceCulling = false;
        ground.material.diffuseColor = new BABYLON.Color3(0.4, 0.3, 1);
        ground.position.y -= 300;
    };

    var removeGround = function () {
        // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
        scene.getMeshByName("ground").dispose();
    };
    var rotate = function () {
        state = 2;
    };
    var unselect = function () {
        console.log(currentPickedMesh);
        currentPickedMesh.outlineWidth = 0.0;
        currentPickedMesh.renderOutline = false;
        currentPickedMesh = 0;
        state = 1;
        clickable = true;
        camera.radius += 400;
        cursor.style.display = "block";
    };
    var move = function () {
        if (currentPickedMesh)
            state = 4;
        else {
            state = 1;
            clickable = true;
            cursor.style.display = "block";
        }
    };

    var downloadImage = function () {
        if (currentPickedMesh) {
            document.getElementById('download').click();
        }
    }


    document.getElementById('download').addEventListener('click', function () {
        this.href = document.getElementById('imgcanvas').toDataURL();
        var picName = currentPickedMeshTextureSrc.split("/")[1];
        this.download = picName;
        console.log(document.getElementById('imgcanvas'))
    }, false);

// -------- ANNYANG ------------
    if (annyang) {
        // Let's define a command.
        var commands = {
            'Boden': addGround,
            'entfernen': removeGround,
            'drehen': rotate,
            'okay': unselect,
            'verschieben': move,
            'graustufen': grayscale,
            'invers': invert,
            'blau': blau,
            'speichern': downloadImage,
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
    var controller = Leap.loop({enableGestures: true}, function (frame) {


        switch (state) {
            //initial state: meshes are selectable via cursor
            case 1:
                if (frame.hands[0] && frame.hands[0].type === "left") {	// hand roll is from 0 to 180deg
                    var degreeRoll = frame.hands[0].roll()
                    console.log("lefthand");
                    scene.activeCamera.alpha = degreeRoll;
                }
                if (frame.pointables.length > 0 && frame.hands[0].type === "right") {
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
                    cursor.style.left = (canvas.width * normalized[0]) + 'px';
                    cursor.style.top = (canvas.height * (1 - normalized[1] )) + 'px';

                    //!!is not being used at the moment!
                    // Hand motion compared now and previous frame
                    if (previousFrame) {
                        //movement since last frame
                        var translation = hand.translation(previousFrame);
                        var String = "Translation: " + translation.toString() + " ";
                        //rotationAxis since last frame
                        var rotationAxis = hand.rotationAxis(previousFrame, 2);
                        //rotation angle since last frame
                        var rotationAngle = hand.rotationAngle(previousFrame);
                        String += " Rotationaxis: " + rotationAxis.toString() + " ";
                        String += " Rotationangle: " + rotationAngle.toFixed(2) + " ";
                        //resize/scale factor since last frame
                        var scaleFactor = hand.scaleFactor(previousFrame);
                        String += " Scale factor: " + scaleFactor.toFixed(2) + " ";
                        //console.log(String);
                    }


                    if (frame.hands[0].type === "left") {	// hand roll is from 0 to 180deg
                        var degreeRoll = frame.hands[0].roll()
                        console.log("lefthand");
                        scene.activeCamera.alpha = degreeRoll;
                    }
                    // Store frame for hand motion comparisment, see above
                    previousFrame = frame;

                    //get a past frame -> click event is triggered if finger is at one position for frame(x) frames
                    var tenFramesBack = controller.frame(20);
                    //get the movement vector of tenFramesBack and current frame
                    var movement = hand.translation(tenFramesBack);

                    //if movement is smaller than 1, than the user is pointing at the screen
                    if (movement[0] > 0 && movement[0] <= 1 && movement[1] <= 1 && movement[2] <= 1 && clickable) {

                        //no more clickevent are being accepted
                        clickable = false;

                        //html element cursors size and position relative to viewport
                        var rect = cursor.getBoundingClientRect();

                        //create click event with scene.pick and get the picked result
                        var pickResult = scene.pick(rect.left, rect.top);

                        //console.log(pickResult +""+pickResult.hit);
                        // Highlight selected Mesh if a mesh has been hit/selected by leap
                        if (pickResult.hit && pickResult.pickedMesh.material.diffuseTexture) {
                            pickResult.pickedMesh.outlineWidth = 0.3;
                            pickResult.pickedMesh.renderOutline = true;
                            //set the current selected mesh
                            currentPickedMesh = pickResult.pickedMesh;
                            console.log("curretnmesh" + currentPickedMesh);
                            currentPickedMeshTextureSrc = currentPickedMesh.material.diffuseTexture.url;
                            initialImagetoCanvas(currentPickedMeshTextureSrc);
                            console.log(currentPickedMesh.material.diffuseTexture.url);
                            //hide the cursor
                            cursor.style.display = "none";
                            //set loop state to 2 -> resize and rotate action
                            console.log(currentPickedMesh.position.x);
                            if (currentPickedMesh.position.x > 700) {
                                currentPickedMesh.position.x = 0;
                                currentPickedMesh.position.y = 0;
                            }
                            camera.radius -= 400;
                            state = 2;

                        }
                        else {
                            //if no mesh has been hit/selected show cursor and enable leap click action
                            clickable = true;
                            cursor.style.display = "block";
                        }

                    }
                }
                break;
            //rotate current selected mesh and scale it
            case 2:
                if (frame.hands.length > 0) {
                    // addRotationAnimation( frame.hands[0].type, frame.hands[0].roll());
                    //  console.log(frame.hands[0].roll())
                    var degree = frame.hands[0].roll() * (180 / Math.PI);
                    // scene.activeCamera.alpha = degree;

                    var hand = frame.hands[0];

                    //left hand image scaling
                    if (frame.hands[1]) {

                        var handNormPosition = frame.interactionBox.normalizePoint(frame.hands[1].palmPosition, true);

                        var velHand = frame.hands[1].palmVelocity;
                        if (velHand[1] < 0) {
                            currentPickedMesh.scaling.x = handNormPosition[1] * 4;
                            currentPickedMesh.scaling.y = handNormPosition[1] * 4;
                        } else {
                            currentPickedMesh.scaling.x = handNormPosition[1] * 4;
                            currentPickedMesh.scaling.y = handNormPosition[1] * 4;
                        }
                    }
                }



break
//move picked mesh around -> new position via leap
case
4
:

if (frame.pointables.length > 0) {

    var positionLeap = frame.pointables[0].stabilizedTipPosition;
    var normalized = frame.interactionBox.normalizePoint(positionLeap);

    // var x = ctx.canvas.width * normalized[0];
    // var y = ctx.canvas.height * (1 - normalized[1]);


    //   pointerSphere.position.x = positionLeap[2];
    // pointerSphere.position.y = positionLeap[1];
    //pointerSphere.position.z = positionLeap[0];
    // console.log("x:  "+positionLeap[2] + "  y:  "+positionLeap[1]+"  z:  "+positionLeap[0]);
    if (currentPickedMesh.intersectsMesh(ground, false)) {
        currentPickedMesh.material.emissiveColor = new BABYLON.Color3(1, 0.9, 0.4);
        console.log("touched ground");
    } else {
        currentPickedMesh.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
    }


    var hand = frame.hands[0];

    leapX = (-1) * hand.screenPosition()[0];
    leapY = (-1) * hand.screenPosition()[1];
    leapZ = (-1) * hand.screenPosition()[2];

    //needs adjustment! No matter how the camera has been rotated the movement should be intuitiv
    currentPickedMesh.position.x = leapX;
    currentPickedMesh.position.y = leapY;
    currentPickedMesh.position.z = -leapZ;


}
break
case
5
:

if (frame.pointables.length > 0) {

    var positionLeap = frame.pointables[0].stabilizedTipPosition;
    var normalized = frame.interactionBox.normalizePoint(positionLeap);

    // var x = ctx.canvas.width * normalized[0];
    // var y = ctx.canvas.height * (1 - normalized[1]);


    //   pointerSphere.position.x = positionLeap[2];
    // pointerSphere.position.y = positionLeap[1];
    //pointerSphere.position.z = positionLeap[0];
    // console.log("x:  "+positionLeap[2] + "  y:  "+positionLeap[1]+"  z:  "+positionLeap[0]);
    if (currentPickedMesh.intersectsMesh(ground, false)) {
        currentPickedMesh.material.emissiveColor = new BABYLON.Color3(1, 0.9, 0.4);
        console.log("touched ground");
    } else {
        currentPickedMesh.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
    }


    var hand = frame.hands[0];

    leapX = (-1) * hand.screenPosition()[0];
    leapY = (-1) * hand.screenPosition()[1];
    leapZ = (-1) * hand.screenPosition()[2];

    //needs adjustment! No matter how the camera has been rotated the movement should be intuitiv
    currentPickedMesh.position.x = leapX;
    currentPickedMesh.position.y = leapY;
    currentPickedMesh.position.z = -leapZ;


}
break
default:

}


}).
use('screenPosition', {scale: 1});

//the render loop
engine.runRenderLoop(function () {
    scene.render();
});


},
false
)