window.addEventListener("DOMContentLoaded", function () {
    //Switch case number of Leaploop, triggered by annyang commands and functions
    var state = 1;
    //Texture/image - current image src file
    var currentPickedMeshTextureSrc;
    //Frames
    var previousFrame = 0;
    // if mesh selected, no other click event allowed
    var clickable = true;
    //current selected mesh, to perform actions on
    var currentPickedMesh = 0;
    var useSlider =0;
    var currentBrightnessAdd =0;
    var contrastValue=10;
    var center1,center2, center3,center4;
    var box1,box2, box3,box4;

    function initialImagetoCanvas(imgSrc) {

        var img = new Image();
        img.src = imgSrc;
        img.onload = function () {
            draw(img);
        };
    }

    function draw(img) {
        var canni = document.getElementById('imgcanvas');
        console.log("height: " + img.naturalHeight);
        canni.width= img.naturalWidth;
        canni.height= img.naturalHeight;
       
        var ctx = canni.getContext('2d');
        ctx.drawImage(img, 0, 0);
    }




    //Babylon engine creation
    var canvas = document.getElementById('gameCanvas');
    var engine = new BABYLON.Engine(canvas, true);
    //Babylon Scene creation
    var scene = new BABYLON.Scene(engine);
    scene.fogEnabled = true;
    scene.ambientColor = BABYLON.Color3.Red();


    //Free Camera
    //var camera = new BABYLON.FreeCamera("camera", nevw BABYLON.Vector3(250,200,50), scene);
    // camera.setTarget(BABYLON.Vector3.Zero());
    // ArcRotateCamera >> Camera turning around a 3D point (here Vector zero) with mouse and cursor keys
    // Parameters : name, alpha, beta, radius, target, scene
    var camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2, 1700, new BABYLON.Vector3(-1600,0,50), scene);
    scene.activeCamera = camera;
    camera.attachControl(canvas, true);
    camera.applyGravity = true;

    //the ambient light
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(-15, 1, -4), scene);
    light.intensity = 10;


    //----GUI ELEMENTS----///

    //GUI elements to change brightness
    var buttonPlaneMaterial = new BABYLON.StandardMaterial("texturePlane" + index, scene);
    buttonPlaneMaterial.diffuseTexture = new BABYLON.Texture("images/minus.PNG" , scene);
    buttonPlaneMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    buttonPlaneMaterial.backFaceCulling = false;//Always show the front and the back of an element

    //Creation of a plane
    var buttonPlane = BABYLON.Mesh.CreatePlane("buttonMinus" , 60, scene);
    buttonPlane.material = buttonPlaneMaterial;
    buttonPlane.scaling.x= 1.2;
    buttonPlane.position.y = canvas.height/2.0;
    buttonPlane.position.x = -450;
    buttonPlane.position.z = 0;
    buttonPlane.isPickable = true;

    var buttonPlaneMaterial2 = new BABYLON.StandardMaterial("texturePlane" + index, scene);
    buttonPlaneMaterial2.diffuseTexture = new BABYLON.Texture("images/plus.PNG" , scene);
    buttonPlaneMaterial2.specularColor = new BABYLON.Color3(0, 0, 0);
    buttonPlaneMaterial2.backFaceCulling = false;//Always show the front and the back of an element

    //Creation of a plane
    var buttonPlane2 = BABYLON.Mesh.CreatePlane("buttonPlus" , 60, scene);
    buttonPlane2.material = buttonPlaneMaterial2;
    buttonPlane2.scaling.x= 1.2;
    buttonPlane2.position.y = canvas.height/2.0;
    buttonPlane2.position.x = -830;
    buttonPlane2.position.z = 0;
    buttonPlane2.isPickable = true;

    var sliderMaterial = new BABYLON.StandardMaterial("texturePlane" + index, scene);
    //sliderMaterial.diffuseTexture = new BABYLON.Texture("images/minus.PNG" , scene);
    sliderMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    sliderMaterial.backFaceCulling = false;//Always show the front and the back of an element

    //Creation of a plane
    var slider = BABYLON.Mesh.CreatePlane("slider" , 10, scene);
    slider.material = sliderMaterial;
    slider.scaling.x= 30;
    slider.position.y = canvas.height/2.0;
    slider.position.x = -640;
    slider.position.z = 0;
    slider.isPickable = true;

    var sliderMaterial2 = new BABYLON.StandardMaterial("texturePlane" + index, scene);
    //sliderMaterial2.diffuseTexture = new BABYLON.Texture("images/minus.PNG" , scene);
    sliderMaterial2.diffuseColor = new BABYLON.Color3(0.8, 0.20, 1);
    sliderMaterial2.backFaceCulling = false;//Always show the front and the back of an element

    //Creation of a plane
    var slider2 = BABYLON.Mesh.CreatePlane("button" , 20, scene);
    slider2.material = sliderMaterial2;
    slider2.scaling.y= 3;
    slider2.position.y = canvas.height/2.0;
    slider2.position.x = -640;
    slider2.position.z = 0;
    slider2.isPickable = true;



    // GUI Elements to change contrast
    var buttonMinusMaterial = new BABYLON.StandardMaterial("texturePlane" + index, scene);
    buttonMinusMaterial.diffuseTexture = new BABYLON.Texture("images/minus.PNG" , scene);
    buttonMinusMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    buttonMinusMaterial.backFaceCulling = false;//Always show the front and the back of an element

    //Creation of a plane
    var buttonMinus = BABYLON.Mesh.CreatePlane("buttonMinusContrast" , 60, scene);
    buttonMinus.material = buttonMinusMaterial;
    buttonMinus.scaling.x= 1.2;
    buttonMinus.position.y = canvas.height/2.80;
    buttonMinus.position.x = -450;
    buttonMinus.position.z = 0;
    buttonMinus.isPickable = true;

    var buttonPlusMaterial = new BABYLON.StandardMaterial("texturePlane" + index, scene);
    buttonPlusMaterial.diffuseTexture = new BABYLON.Texture("images/plus.PNG" , scene);
    buttonPlusMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    buttonPlusMaterial.backFaceCulling = false;//Always show the front and the back of an element

    //Creation of a plane
    var buttonPlus = BABYLON.Mesh.CreatePlane("buttonPlusContrast" , 60, scene);
    buttonPlus.material = buttonPlusMaterial;
    buttonPlus.scaling.x= 1.2;
    buttonPlus.position.y = canvas.height/2.80;
    buttonPlus.position.x = -830;
    buttonPlus.position.z = 0;
    buttonPlus.isPickable = true;

    var sliderMateriaContrast = new BABYLON.StandardMaterial("texturePlane" + index, scene);
    //sliderMateria2.diffuseTexture = new BABYLON.Texture("images/minus.PNG" , scene);
    sliderMateriaContrast.specularColor = new BABYLON.Color3(0, 0, 0);
    sliderMateriaContrast.backFaceCulling = false;//Always show the front and the back of an element

    //Creation of a plane
    var sliderContrast = BABYLON.Mesh.CreatePlane("sliderContrast" , 10, scene);
    sliderContrast.material = sliderMateriaContrast;
    sliderContrast.scaling.x= 30;
    sliderContrast.position.y = canvas.height/2.80;
    sliderContrast.position.x = -640;
    sliderContrast.position.z = 0;
    sliderContrast.isPickable = true;

    var sliderSelecterContrastMaterial = new BABYLON.StandardMaterial("texturePlane" + index, scene);
    //sliderMaterial2.diffuseTexture = new BABYLON.Texture("images/minus.PNG" , scene);
    sliderSelecterContrastMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.20, 1);
    sliderSelecterContrastMaterial.backFaceCulling = false;//Always show the front and the back of an element

    //Creation of a plane
    var sliderSelecterContrast = BABYLON.Mesh.CreatePlane("sliderSelectContrast" , 20, scene);
    sliderSelecterContrast.material = sliderSelecterContrastMaterial;
    sliderSelecterContrast.scaling.y= 3;
    sliderSelecterContrast.position.y = canvas.height/2.8;
    sliderSelecterContrast.position.x = -640;
    sliderSelecterContrast.position.z = 0;
    sliderSelecterContrast.isPickable = true;

    //GUI element for grayscale
    var buttonGrayscaleMaterial = new BABYLON.StandardMaterial("texturePlane" + index, scene);
    buttonGrayscaleMaterial.diffuseTexture = new BABYLON.Texture("images/graybtn.png" , scene);
    buttonGrayscaleMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    buttonGrayscaleMaterial.backFaceCulling = false;//Always show the front and the back of an element

    //Creation of a plane
    var buttonGrayscale = BABYLON.Mesh.CreatePlane("buttonGrayscale" , 60, scene);
    buttonGrayscale.material = buttonGrayscaleMaterial;
    buttonGrayscale.scaling.x= 3.0;
    buttonGrayscale.position.y = canvas.height/4.0;
    buttonGrayscale.position.x = -500;
    buttonGrayscale.position.z = 0;
    buttonGrayscale.isPickable = true;

    //GUI element for invers
    var buttonInverseMaterial = new BABYLON.StandardMaterial("texturePlane" + index, scene);
    buttonInverseMaterial.diffuseTexture = new BABYLON.Texture("images/invertierbtn.png" , scene);
    buttonInverseMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    buttonInverseMaterial.backFaceCulling = false;//Always show the front and the back of an element

    //Creation of a plane
    var buttonInverse = BABYLON.Mesh.CreatePlane("buttonInvers" , 60, scene);
    buttonInverse.material = buttonInverseMaterial;
    buttonInverse.scaling.x= 3.0;
    buttonInverse.position.y = canvas.height/5.9;
    buttonInverse.position.x = -500;
    buttonInverse.position.z = 0;
    buttonInverse.isPickable = true;

    //GUI element for blue filter
    var buttonBlueMaterial = new BABYLON.StandardMaterial("texturePlane" + index, scene);
    buttonBlueMaterial.diffuseTexture = new BABYLON.Texture("images/bluebtn.png" , scene);
    buttonBlueMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    buttonBlueMaterial.backFaceCulling = false;//Always show the front and the back of an element

    //Creation of a plane
    var buttonBlue = BABYLON.Mesh.CreatePlane("buttonBlue" , 60, scene);
    buttonBlue.material = buttonBlueMaterial;
    buttonBlue.scaling.x= 3.0;
    buttonBlue.position.y = canvas.height/10.5;
    buttonBlue.position.x = -500;
    buttonBlue.position.z = 0;
    buttonBlue.isPickable = true;

    //GUI element for reset function
    var restMaterial = new BABYLON.StandardMaterial("texturePlane" + index, scene);
    restMaterial.diffuseTexture = new BABYLON.Texture("images/reset.png" , scene);
    restMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    restMaterial.backFaceCulling = false;//Always show the front and the back of an element

    //Creation of a plane
    var restBtn = BABYLON.Mesh.CreatePlane("buttonReset" , 60, scene);
    restBtn.material = restMaterial;
    restBtn.scaling.x= 3.0;
    restBtn.position.y = canvas.height/50.5;
    restBtn.position.x = -500;
    restBtn.position.z = 0;
    restBtn.isPickable = true;


    //GUI element forbrightness title
    var txtbrmat = new BABYLON.StandardMaterial("texturePlane" + index, scene);
    txtbrmat.diffuseTexture = new BABYLON.Texture("images/bright.png" , scene);
    txtbrmat.specularColor = new BABYLON.Color3(0, 0, 0);
    txtbrmat.backFaceCulling = false;//Always show the front and the back of an element

    //Creation of a plane
    var txtbr = BABYLON.Mesh.CreatePlane("txtbr" , 60, scene);
    txtbr.material = txtbrmat;
    txtbr.scaling.x= 3.0;
    txtbr.position.y = canvas.height/1.75;
    txtbr.position.x = -500;
    txtbr.position.z = 0;
    txtbr.isPickable = true;

    //GUI element for contrast title
    var txtcrmat = new BABYLON.StandardMaterial("texturePlane" + index, scene);
    txtcrmat.diffuseTexture = new BABYLON.Texture("images/contrast.png" , scene);
    txtcrmat.specularColor = new BABYLON.Color3(0, 0, 0);
    txtcrmat.backFaceCulling = false;//Always show the front and the back of an element

    //Creation of a plane
    var txtcr = BABYLON.Mesh.CreatePlane("contrast" , 60, scene);
    txtcr.material = txtcrmat;
    txtcr.scaling.x= 3.0;
    txtcr.position.y = canvas.height/2.35;
    txtcr.position.x = -500;
    txtcr.position.z = 0;
    txtcr.isPickable = true;


    //----GUI ELEMENTS ENDE----///

    //---------------Image/Texture Gallery Creation --------//

    var index = 1;
    var gallery = new Array();
    for (var x = 500; x <= 850; x += 200) {
        for (var y = -400; y <= -100; y += 200) {
            //Creation of image as textured material
            var materialPlane = new BABYLON.StandardMaterial("texturePlane" + index, scene);
            materialPlane.diffuseTexture = new BABYLON.Texture("gallery/img" + index + ".jpg", scene);
            materialPlane.specularColor = new BABYLON.Color3(0, 0, 0);
            materialPlane.backFaceCulling = false;//Always show the front and the back of an element

            //Creation of a plane with texture-image
            var plane = BABYLON.Mesh.CreatePlane("image" + index, 120, scene);
            plane.material = materialPlane;
            plane.position.y = y;
            plane.position.x = -x;
            plane.position.z = 0;
            plane.isPickable = true;
            gallery.push(plane);
            index++;

        }
    }



    //---------Image Processing -----------


    var decreaseBrightness = function(){
        if (currentPickedMesh) {
            slider2.position.x += 10;

        currentBrightnessAdd-=20;

        console.log(currentBrightnessAdd);

        var canni = document.getElementById('imgcanvas');
        var ctx = canni.getContext('2d');
        var imageData = ctx.getImageData(0, 0, canni.width, canni.height);
        var data = imageData.data;

        for (var i = 0; i < data.length; i += 4) {
            data[i] += currentBrightnessAdd;     // red
            data[i + 1] += currentBrightnessAdd; // green
            data[i + 2] += currentBrightnessAdd; // blue
        }
        ctx.putImageData(imageData, 0, 0);
        var dataURL = canni.toDataURL("image/jpg");
        dataURL.replace(/^data:image\/(png|jpg);base64,/, "");


        //Creation of a repeated textured material
        var materialPlane = new BABYLON.StandardMaterial("texturePlane", scene);
        materialPlane.diffuseTexture = new BABYLON.Texture.CreateFromBase64String(dataURL, "inverted", scene);
        materialPlane.specularColor = new BABYLON.Color3(0, 0, 0);
        materialPlane.backFaceCulling = false;//Allways show the front and the back of an element
        //delete current texture to free memory space
        currentPickedMesh.material.diffuseTexture.dispose();
        //assign new material to current selected plane
        currentPickedMesh.material = materialPlane;
        }
    }

    //Algorith from here: http://www.dfstudios.co.uk/articles/programming/image-programming-algorithms/image-processing-algorithms-part-5-contrast-adjustment/
    var  increaseContrast = function(){
        if (currentPickedMesh) {
            sliderSelecterContrast.position.x -= 10;

            contrastValue*=2;


            var canni = document.getElementById('imgcanvas');
            var ctx = canni.getContext('2d');
            var imageData = ctx.getImageData(0, 0, canni.width, canni.height);
            var data = imageData.data;
            var factor = (255 + contrastValue) / (255.01 - contrastValue);
            for (var i = 0; i < data.length; i += 4) {
                data[i] = factor * (data[i] - 128) + 128;
                data[i+1] = factor * (data[i+1] - 128) + 128;
                data[i+2] = factor * (data[i+2] - 128) + 128;
                //implement clamping in a separate function if using in production
                if(data[i] > 255) data[i] = 255;
                if(data[i+1] > 255) data[i+1] = 255;
                if(data[i+2] > 255) data[i+2] = 255;
                if(data[i] < 0) data[i] = 0;
                if(data[i+1] < 0) data[i+1] = 0;
                if(data[i+2] < 0) data[i+2] = 0;
            }
            ctx.putImageData(imageData, 0, 0);
            var dataURL = canni.toDataURL("image/jpg");
            dataURL.replace(/^data:image\/(png|jpg);base64,/, "");


            //Creation of a repeated textured material
            var materialPlane = new BABYLON.StandardMaterial("texturePlane", scene);
            materialPlane.diffuseTexture = new BABYLON.Texture.CreateFromBase64String(dataURL, "contrast", scene);
            materialPlane.specularColor = new BABYLON.Color3(0, 0, 0);
            materialPlane.backFaceCulling = false;//Allways show the front and the back of an element
            //delete current texture to free memory space
            currentPickedMesh.material.diffuseTexture.dispose();
            //assign new material to current selected plane
            currentPickedMesh.material = materialPlane;
        }
    }
    var  decreaseContrast = function(){
        if (currentPickedMesh) {
            sliderSelecterContrast.position.x += 10;

            contrastValue-=10;


            var canni = document.getElementById('imgcanvas');
            var ctx = canni.getContext('2d');
            var imageData = ctx.getImageData(0, 0, canni.width, canni.height);
            var data = imageData.data;
            var factor = (255 + contrastValue) / (255.01 - contrastValue);
            for (var i = 0; i < data.length; i += 4) {
                data[i] = factor * (data[i] - 128) + 128;
                data[i+1] = factor * (data[i+1] - 128) + 128;
                data[i+2] = factor * (data[i+2] - 128) + 128;
            }
            ctx.putImageData(imageData, 0, 0);
            var dataURL = canni.toDataURL("image/jpg");
            dataURL.replace(/^data:image\/(png|jpg);base64,/, "");


            //Creation of a repeated textured material
            var materialPlane = new BABYLON.StandardMaterial("texturePlane", scene);
            materialPlane.diffuseTexture = new BABYLON.Texture.CreateFromBase64String(dataURL, "contrast", scene);
            materialPlane.specularColor = new BABYLON.Color3(0, 0, 0);
            materialPlane.backFaceCulling = false;//Allways show the front and the back of an element
            //delete current texture to free memory space
            currentPickedMesh.material.diffuseTexture.dispose();
            //assign new material to current selected plane
            currentPickedMesh.material = materialPlane;
        }
    }
        var increaseBrightness = function(){

            if (currentPickedMesh) {
                currentBrightnessAdd =currentBrightnessAdd+20;
                slider2.position.x -= 10;
                console.log(currentBrightnessAdd);
                var canni = document.getElementById('imgcanvas');
                var ctx = canni.getContext('2d');
                var imageData = ctx.getImageData(0, 0, canni.width, canni.height);
                var data = imageData.data;
                for (var i = 0; i < data.length; i += 4) {
                    data[i] += currentBrightnessAdd;     // red
                    data[i + 1] += currentBrightnessAdd; // green
                    data[i + 2] += currentBrightnessAdd; // blue
                }

                ctx.putImageData(imageData, 0, 0);
                var dataURL = canni.toDataURL("image/jpg");
                dataURL.replace(/^data:image\/(png|jpg);base64,/, "");


                //Creation of a repeated textured material
                var materialPlane = new BABYLON.StandardMaterial("texturePlane", scene);
               materialPlane.diffuseTexture = new BABYLON.Texture.CreateFromBase64String(dataURL, "inverted", scene);
                //materialPlane.diffuseTexture = new BABYLON.Texture('data:my_image_name', scene, true,
                 //   true, BABYLON.Texture.BILINEAR_SAMPLINGMODE,
                 //   null, null, bytes, true);
                materialPlane.specularColor = new BABYLON.Color3(0, 0, 0);
                materialPlane.backFaceCulling = false;//Allways show the front and the back of an element
                //delete current texture to free memory space
                currentPickedMesh.material.diffuseTexture.dispose();
                //assign new material to current selected plane
                currentPickedMesh.material = materialPlane;
            }

        }
        var invert = function() {
            if (currentPickedMesh) {
            var canni = document.getElementById('imgcanvas');
            var ctx = canni.getContext('2d');
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
            materialPlane.diffuseTexture = new BABYLON.Texture.CreateFromBase64String(dataURL, "inverted", scene);
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
            var canni = document.getElementById('imgcanvas');
            var ctx = canni.getContext('2d');
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
    var blau = function () {
        if (currentPickedMesh) {

            var canni = document.getElementById('imgcanvas');
            var ctx = canni.getContext('2d');
            var imageData = ctx.getImageData(0, 0, canni.width, canni.height);
            var data = imageData.data;
            //  go through each pixel, increasing blue, but decrease red and green:
            var w2 = canni.width;
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

    var downloadImage = function () {
        if (currentPickedMesh) {
            document.getElementById('download').click();
        }
    }


    document.getElementById('download').addEventListener('click', function () {
        var canvas3 = document.getElementById('imgcanvas');
        canvasContext = canvas3.getContext('2d');

        canvasContext.translate(canvas3.width, 0);
        canvasContext.scale(-1, 1);

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
    //--------------------------------//


    //------Add Particles to the current seletect Mesh ----//
    var addParticles = function () {
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
        else {

        }
    }
    //--------------------------------//

    var addRotationAnimation = function () {
        //if a mesh/object is selected...
        if (currentPickedMesh) {

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
        else {

        }
    }


    // --------------- annyang Functions --------------------------

    var addGround = function () {
        state=5;
        document.getElementById("info").style.display = 'block';
        currentPickedMesh.scaling.x = 1;
        currentPickedMesh.scaling.y = 1;
        //------creating 4 boxes and 4 small spheres (upper center of boxes)----//
         box2 = BABYLON.Mesh.CreateBox("box1", 80, scene);
        box2.material = new BABYLON.StandardMaterial("materialbox1", scene);
        box2.material.diffuseColor = new BABYLON.Color3(1, 0.4, 0);
        box2.position.y = -255;
        box2.position.x = -1900;
        box2.position.z = 400;
        box2.isPickable = true;


         center2 = BABYLON.Mesh.CreateSphere("center2",  10, 10, scene);
        center2.position.y = -215;
        center2.position.x = -1900;
        center2.position.z = 400;

         box3 = BABYLON.Mesh.CreateBox("box2", 80, scene);
        box3.material = new BABYLON.StandardMaterial("materialbox2", scene);
        box3.material.diffuseColor = new BABYLON.Color3(1, 0.4, 0);
        box3.position.y = -255;
        box3.position.x = -1100;
        box3.position.z = 400;
        box3.isPickable = true;


         center3 = BABYLON.Mesh.CreateSphere("center3",  10, 10, scene);
        center3.position.y = -215;
        center3.position.x = -1100;
        center3.position.z = 400;

         box1 = BABYLON.Mesh.CreateBox("box3", 80, scene);
        box1.material = new BABYLON.StandardMaterial("materialbox3", scene);
        box1.material.diffuseColor = new BABYLON.Color3(1, 0.4, 0);
        box1.position.y = -255;
        box1.position.x = -1900;
        box1.position.z = -400;
        box1.isPickable = true;

         center1 = BABYLON.Mesh.CreateSphere("center1",  10, 10, scene);
        center1.position.y = -215;
        center1.position.x = -1900;
        center1.position.z = -400;

         box4 = BABYLON.Mesh.CreateBox("box4", 80, scene);
        box4.material = new BABYLON.StandardMaterial("materialbox4", scene);
        box4.material.diffuseColor = new BABYLON.Color3(1, 0.4, 0);
        box4.position.y = -255;
        box4.position.x = -1100;
        box4.position.z = -400;
        box4.isPickable = true;

         center4 = BABYLON.Mesh.CreateSphere("center4",  10, 10, scene);
        center4.position.y = -215;
        center4.position.x = -1100;
        center4.position.z = -400;

        // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
        var ground = BABYLON.Mesh.CreateGround("ground", 1000, 1000, 1, scene);
        ground.position.y = -300;
        ground.position.x = -1500;
        ground.position.z = 0;
        ground.material = new BABYLON.StandardMaterial("materialGround", scene);
        ground.material.backFaceCulling = false;
        ground.material.diffuseColor = new BABYLON.Color3(0.5, 0.9, 1);


        //----------------------------------------------------//


    };
    var enableediting = function () {
        state = 1;
        clickable = true;

        cursor.style.display = "block";
         useSlider =1;

    };

    var removeGround = function () {
        // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
        scene.getMeshByName("ground").dispose();
        scene.getMeshByName("box1").dispose();
        scene.getMeshByName("box2").dispose();
        scene.getMeshByName("box3").dispose();
        scene.getMeshByName("box4").dispose();
        scene.getMeshByName("center1").dispose();
        scene.getMeshByName("center2").dispose();
        scene.getMeshByName("center3").dispose();
        scene.getMeshByName("center4").dispose();
        state=1;
        clickable = true;
        cursor.style.display = "block";
        useSlider =1;
        document.getElementById("info").style.display = 'none';
        currentPickedMesh.position.x =-1600;
        currentPickedMesh.scaling.x = 10;
        currentPickedMesh.scaling.y = 10;


    };
    var rotate = function () {
        state = 2;
    };
    var changeImages = function(){
        state=3;
    };
    var unselect = function () {
        console.log(currentPickedMesh);
        currentPickedMesh.outlineWidth = 0.0;
        currentPickedMesh.renderOutline = false;
        currentPickedMesh.dispose();
        state = 1;
        useSlider =0;
        clickable = true;
       // camera.radius += 400;
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
    var reset = function () {
     initialImagetoCanvas(currentPickedMeshTextureSrc);
        var materialPlane = new BABYLON.StandardMaterial("texturePlane" + index, scene);
        materialPlane.diffuseTexture = new BABYLON.Texture(currentPickedMeshTextureSrc, scene);
        materialPlane.specularColor = new BABYLON.Color3(0, 0, 0);
        materialPlane.backFaceCulling = false;//Always show the front and the back of an element
        currentPickedMesh.material = materialPlane;
    };


// -------- ANNYANG ------------
    if (annyang) {
        // ANNYANG commands
        var commands = {
            'Boden': addGround,
            'entfernen': removeGround,
            'drehen': rotate,
            'okay': unselect,
            'verschieben': move,
            'animieren': addRotationAnimation,
            'Wolke': addParticles,
            'Graustufen': grayscale,
            'Invertieren': invert,
            'Blaufilter': blau,
            'speichern': downloadImage,
            'editieren': enableediting,
            'heller': increaseBrightness,
            'dunkel': decreaseBrightness,
            'Kontrast erhöhen' : increaseContrast,
            'Kontrast reduzieren' : decreaseContrast,
            'Bilder wechseln' : changeImages,
            'zurücksetzen' : reset,
        };
        annyang.debug(true);
        // Add our commands to annyang
        annyang.addCommands(commands);
        //language = german
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

        switch(state) {
            //initial state: meshes are selectable with leap cursor /right index finger
            case 1:
                if (frame.hands[0] && frame.hands[0].type === "left") {	// hand roll is from 0 to 180deg
                    var degreeRoll = frame.hands[0].roll()
                    console.log("lefthand");
                    //scene.activeCamera.alpha = degreeRoll;
                }

                if (frame.pointables.length > 0 && frame.hands[0].type === "right") {
                    var positionLeap = frame.pointables[0].stabilizedTipPosition;
                    var normalized = frame.interactionBox.normalizePoint(positionLeap);
                    var hand = frame.hands[0];

                    //cursors position is updated with leaps normalized position
                    cursor.style.left = (canvas.width * normalized[0]) + 'px';
                    cursor.style.top = (canvas.height * (1 - normalized[1] )) + 'px';


                    if (frame.hands[0].type === "left") {	// hand roll is from 0 to 180deg
                        var degreeRoll = frame.hands[0].roll()
                        console.log("lefthand");
                        //scene.activeCamera.alpha = degreeRoll;
                    }
                    // Store frame for hand motion comparisment, see above
                    previousFrame = frame;

                    //get a past frame -> click event is triggered if finger is at one position for frame(x) frames
                    var tenFramesBack = controller.frame(30);
                    //get the movement vector of tenFramesBack and current frame
                    var movement = hand.translation(tenFramesBack);

                    //if movement is smaller than 1, than the user is pointing at the screen
                    if (movement[0] > 0 && movement[0] <= 1 && movement[1] <= 1 && movement[2] <= 1 && clickable) {

                        //html element cursors size and position relative to viewport
                        var rect = cursor.getBoundingClientRect();

                        //create click event with scene.pick and get the picked result
                        var pickResult = scene.pick(rect.left, rect.top);

                        //console.log(pickResult +""+pickResult.hit);
                        // Highlight selected Mesh if a mesh has been hit/selected by lea
                        if(useSlider==1) {

                            clickable = true;
                            cursor.style.display = "block";
                            if (pickResult.hit ) {

                                if ( pickResult.pickedMesh.name == "buttonPlus") {
                                    if(slider2.position.x> -780) {
                                        currentBrightnessAdd =currentBrightnessAdd+20;
                                        slider2.position.x -= 10;
                                        console.log(currentBrightnessAdd);
                                        var canni = document.getElementById('imgcanvas');
                                        var ctx = canni.getContext('2d');
                                        var imageData = ctx.getImageData(0, 0, canni.width, canni.height);
                                        var data = imageData.data;
                                        for (var i = 0; i < data.length; i += 4) {
                                            data[i] += currentBrightnessAdd;     // red
                                            data[i + 1] += currentBrightnessAdd; // green
                                            data[i + 2] += currentBrightnessAdd; // blue
                                        }

                                        ctx.putImageData(imageData, 0, 0);
                                        var dataURL = canni.toDataURL("image/jpg");
                                        dataURL.replace(/^data:image\/(png|jpg);base64,/, "");


                                        //Creation of a repeated textured material
                                        var materialPlane = new BABYLON.StandardMaterial("texturePlane", scene);
                                        materialPlane.diffuseTexture = new BABYLON.Texture.CreateFromBase64String(dataURL, "inverted", scene);
                                        //materialPlane.diffuseTexture = new BABYLON.Texture('data:my_image_name', scene, true,
                                        //   true, BABYLON.Texture.BILINEAR_SAMPLINGMODE,
                                        //   null, null, bytes, true);
                                        materialPlane.specularColor = new BABYLON.Color3(0, 0, 0);
                                        materialPlane.backFaceCulling = false;//Allways show the front and the back of an element
                                        //delete current texture to free memory space
                                        currentPickedMesh.material.diffuseTexture.dispose();
                                        //assign new material to current selected plane
                                        currentPickedMesh.material = materialPlane;
                                      //  pickResult.pickedMesh.dispose();
                                    }
                                   // console.log( slider2.position.x);


                                }
                                if ( pickResult.pickedMesh.name == "buttonMinus") {
                                    if(slider2.position.x< -490) {
                                        slider2.position.x += 10;
                                        currentBrightnessAdd-=20;

                                        console.log(currentBrightnessAdd);


                                        var img = new Image();
                                        img.src = currentPickedMeshTextureSrc;
                                        var canni = document.getElementById('imgcanvas');
                                        var ctx = canni.getContext('2d');
                                        ctx.drawImage(img, 0, 0);
                                        var imageData = ctx.getImageData(0, 0, canni.width, canni.height);
                                        var data = imageData.data;

                                        for (var i = 0; i < data.length; i += 4) {
                                            data[i] += currentBrightnessAdd;     // red
                                            data[i + 1] += currentBrightnessAdd; // green
                                            data[i + 2] += currentBrightnessAdd; // blue
                                        }
                                        ctx.putImageData(imageData, 0, 0);
                                        var dataURL = canni.toDataURL("image/jpg");
                                        dataURL.replace(/^data:image\/(png|jpg);base64,/, "");


                                        //Creation of a repeated textured material
                                        var materialPlane = new BABYLON.StandardMaterial("texturePlane", scene);
                                        materialPlane.diffuseTexture = new BABYLON.Texture.CreateFromBase64String(dataURL, "inverted", scene);
                                        materialPlane.specularColor = new BABYLON.Color3(0, 0, 0);
                                        materialPlane.backFaceCulling = false;//Allways show the front and the back of an element
                                        //delete current texture to free memory space
                                        currentPickedMesh.material.diffuseTexture.dispose();
                                        //assign new material to current selected plane
                                        currentPickedMesh.material = materialPlane;
                                    }


                                }
                                if ( pickResult.pickedMesh.name == "buttonMinusContrast") {
                                    if(sliderSelecterContrast.position.x< -490) {
                                        sliderSelecterContrast.position.x += 10;
                                        contrastValue-=20;

                                        console.log(currentBrightnessAdd);


                                        var img = new Image();
                                        img.src = currentPickedMeshTextureSrc;
                                        var canni = document.getElementById('imgcanvas');
                                        var ctx = canni.getContext('2d');
                                        ctx.drawImage(img, 0, 0);
                                        var imageData = ctx.getImageData(0, 0, canni.width, canni.height);
                                        var data = imageData.data;

                                        for (var i = 0; i < data.length; i += 4) {
                                            data[i] += currentBrightnessAdd;     // red
                                            data[i + 1] += currentBrightnessAdd; // green
                                            data[i + 2] += currentBrightnessAdd; // blue
                                        }
                                        ctx.putImageData(imageData, 0, 0);
                                        var dataURL = canni.toDataURL("image/jpg");
                                        dataURL.replace(/^data:image\/(png|jpg);base64,/, "");


                                        //Creation of a repeated textured material
                                        var materialPlane = new BABYLON.StandardMaterial("texturePlane", scene);
                                        materialPlane.diffuseTexture = new BABYLON.Texture.CreateFromBase64String(dataURL, "inverted", scene);
                                        materialPlane.specularColor = new BABYLON.Color3(0, 0, 0);
                                        materialPlane.backFaceCulling = false;//Allways show the front and the back of an element
                                        //delete current texture to free memory space
                                        currentPickedMesh.material.diffuseTexture.dispose();
                                        //assign new material to current selected plane
                                        currentPickedMesh.material = materialPlane;
                                    }


                                }
                                if ( pickResult.pickedMesh.name == "buttonPlusContrast") {
                                    if(sliderSelecterContrast.position.x< -490) {
                                        sliderSelecterContrast.position.x -= 10;
                                        currentBrightnessAdd+=20;

                                        console.log(currentBrightnessAdd);


                                        var img = new Image();
                                        img.src = currentPickedMeshTextureSrc;
                                        var canni = document.getElementById('imgcanvas');
                                        var ctx = canni.getContext('2d');
                                        ctx.drawImage(img, 0, 0);
                                        var imageData = ctx.getImageData(0, 0, canni.width, canni.height);
                                        var data = imageData.data;

                                        for (var i = 0; i < data.length; i += 4) {
                                            data[i] += currentBrightnessAdd;     // red
                                            data[i + 1] += currentBrightnessAdd; // green
                                            data[i + 2] += currentBrightnessAdd; // blue
                                        }
                                        ctx.putImageData(imageData, 0, 0);
                                        var dataURL = canni.toDataURL("image/jpg");
                                        dataURL.replace(/^data:image\/(png|jpg);base64,/, "");


                                        //Creation of a repeated textured material
                                        var materialPlane = new BABYLON.StandardMaterial("texturePlane", scene);
                                        materialPlane.diffuseTexture = new BABYLON.Texture.CreateFromBase64String(dataURL, "inverted", scene);
                                        materialPlane.specularColor = new BABYLON.Color3(0, 0, 0);
                                        materialPlane.backFaceCulling = false;//Allways show the front and the back of an element
                                        //delete current texture to free memory space
                                        currentPickedMesh.material.diffuseTexture.dispose();
                                        //assign new material to current selected plane
                                        currentPickedMesh.material = materialPlane;
                                    }


                                }
                                if ( pickResult.pickedMesh.name == "buttonGrayscale") {
                                    var canni = document.getElementById('imgcanvas');
                                    var ctx = canni.getContext('2d');
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
                                if ( pickResult.pickedMesh.name == "buttonInvers") {
                                    var canni = document.getElementById('imgcanvas');
                                    var ctx = canni.getContext('2d');
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
                                    materialPlane.diffuseTexture = new BABYLON.Texture.CreateFromBase64String(dataURL, "inverted", scene);
                                    materialPlane.specularColor = new BABYLON.Color3(0, 0, 0);
                                    materialPlane.backFaceCulling = false;//Allways show the front and the back of an element
                                    //delete current texture to free memory space
                                    currentPickedMesh.material.diffuseTexture.dispose();
                                    //assign new material to current selected plane
                                    currentPickedMesh.material = materialPlane;

                                }
                                if ( pickResult.pickedMesh.name == "buttonReset") {
                                    initialImagetoCanvas(currentPickedMeshTextureSrc);
                                    var materialPlane = new BABYLON.StandardMaterial("texturePlane" + index, scene);
                                    materialPlane.diffuseTexture = new BABYLON.Texture(currentPickedMeshTextureSrc, scene);
                                    materialPlane.specularColor = new BABYLON.Color3(0, 0, 0);
                                    materialPlane.backFaceCulling = false;//Always show the front and the back of an element
                                    currentPickedMesh.material = materialPlane;

                                }
                                if ( pickResult.pickedMesh.name == "buttonBlue") {
                                    var canni = document.getElementById('imgcanvas');
                                    var ctx = canni.getContext('2d');
                                    var imageData = ctx.getImageData(0, 0, canni.width, canni.height);
                                    var data = imageData.data;
                                    //  go through each pixel, increasing blue, but decrease red and green:
                                    var w2 = canni.width;
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
                            }


                        }
                        else if(useSlider==0){
                            if (pickResult.hit && pickResult.pickedMesh.material.diffuseTexture) {


                                //no more clickevent are being accepted
                                clickable = false;
                                pickResult.pickedMesh.outlineWidth = 0.3;
                                pickResult.pickedMesh.renderOutline = true;
                                //set the current selected mesh
                                currentPickedMesh = pickResult.pickedMesh;
                                console.log("curretnmesh" + currentPickedMesh.name);
                                currentPickedMeshTextureSrc = currentPickedMesh.material.diffuseTexture.url;
                                initialImagetoCanvas(currentPickedMeshTextureSrc);
                                console.log(currentPickedMesh.material.diffuseTexture.url);
                                //hide the cursor
                                cursor.style.display = "none";
                                //set loop state to 2 -> resize and rotate action
                                console.log(currentPickedMesh.position.x);
                               currentPickedMesh.position.x =-1600;
                                currentPickedMesh.position.y =-10;
                                currentPickedMesh.scaling.x = 10;
                                currentPickedMesh.scaling.y = 10;
                                //  camera.radius -= 400;

                                useSlider =1;
                                clickable = true;
                                cursor.style.display = "block";

                            }
                            else {
                                //if no mesh has been hit/selecte11d show cursor and enable leap click action
                                clickable = true;
                                useSlider =0;
                                cursor.style.display = "block";
                            }
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
                    if (frame.hands[0].type === "left")					// hand roll is from 0 to 180deg
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
                        currentPickedMesh.rotation.z = -frame.hands[0].yaw();
                    }
                    var hand = frame.hands[0];


                    //left hand image scaling
                    if (frame.hands[1]) {

                        var handNormPosition = frame.interactionBox.normalizePoint(frame.hands[1].palmPosition, true);

                        var velHand = frame.hands[1].palmVelocity;
                        if (velHand[1] < 0) {
                            currentPickedMesh.scaling.x = handNormPosition[1] * 10;
                            currentPickedMesh.scaling.y = handNormPosition[1] * 10;
                        } else {
                            currentPickedMesh.scaling.x = handNormPosition[1] * 10;
                            currentPickedMesh.scaling.y = handNormPosition[1] * 10;
                        }
                    }
                    /*
                     //Sphere image scaling: the radius of the virtual sphere inside your hand, with palm facing towards leap
                     var radius = hand.sphereRadius;
                     currentPickedMesh.scaling.x = radius/50;
                     currentPickedMesh.scaling.y = radius/50;
                     currentPickedMesh.scaling.z = radius/50;
                     //var newsize = radius/25;
                     //console.log("Sphere Radius: " + radius);
                     */
                }
                break;
            //detect gestures
            case 3:
                if (frame.valid && frame.gestures.length > 0) {
                    frame.gestures.forEach(function (gesture) {
                        switch (gesture.type) {
                            case "circle":
                                /* cube.scaling.x = gesture.radius/5;
                                 cube.scaling.y = gesture.radius/5;
                                 cube.scaling.z = gesture.radius/5;*/
                                var state = gesture.state;
                                if(state == "start") {

                                    for (var i = 0; gallery.length > i; i++) {
                                        //Creation of a plane
                                        gallery[i].material.diffuseTexture = new BABYLON.Texture("gallery/img" + index + ".jpg", scene);
                                        index++;
                                        if (index > 8) {
                                            index = 1;
                                        }
                                    }
                                }
                                console.log("Circle gesture");
                                break;
                            case "keyTap":
                                console.log("key tap gesture");
                                break;
                            case "screenTap":
                                var position = gesture.position;
                                console.log("screen tap gesture" + position);
                                break;
                            case "swipe":
                                console.log("Swipe gesture");
                                break;
                        }
                    });
                }
                break
            //move picked mesh around -> new position via leap
            case 4:

                if (frame.pointables.length > 0) {

                    var positionLeap = frame.pointables[0].stabilizedTipPosition;
                    var normalized = frame.interactionBox.normalizePoint(positionLeap, false);

                    //   pointerSphere.position.x = positionLeap[2];
                    // pointerSphere.position.y = positionLeap[1];
                    //pointerSphere.position.z = positionLeap[0];
                    // console.log("x:  "+positionLeap[2] + "  y:  "+positionLeap[1]+"  z:  "+positionLeap[0]);
                    /* //Analayse collision if ground is shown
                    if (currentPickedMesh.intersectsMesh(center1, false)) {
                        box1.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
                        document.getElementById("touchedBox").innerHTML = "Upper center of BOX 1";
                        document.getElementById("touchingNow").innerHTML = " Picture + BOX 1";
                        console.log("touched center1");
                    }
                    else if (currentPickedMesh.intersectsMesh(center2, false)) {
                        box2.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
                        document.getElementById("touchedBox").innerHTML = "Upper center of BOX 2";
                        document.getElementById("touchingNow").innerHTML = " Picture + BOX 2";
                        console.log("touched center2");
                    }
                    else if(currentPickedMesh.intersectsMesh(center3, false)) {
                        box3.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
                        document.getElementById("touchedBox").innerHTML = " Upper center of BOX 3";
                        document.getElementById("touchingNow").innerHTML = " Picture + BOX 3";
                        console.log("touched center3");
                    }
                    else if (currentPickedMesh.intersectsMesh(center4, false)) {
                        box4.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
                        document.getElementById("touchedBox").innerHTML = "Upper center of BOX 4";
                        document.getElementById("touchingNow").innerHTML = " Picture + BOX 4";
                        console.log("touched center4");
                    } else {
                        box1.material.diffuseColor = new BABYLON.Color3(1, 0.4, 0);
                        box2.material.diffuseColor = new BABYLON.Color3(1, 0.4, 0);
                        box3.material.diffuseColor = new BABYLON.Color3(1, 0.4, 0);
                        box4.material.diffuseColor = new BABYLON.Color3(1, 0.4, 0);
                        document.getElementById("touchingNow").innerHTML = "";
                    }

*/

                    /*Move Image around with leap

                    var hand = frame.hands[0];
                    leapX = (-1) * hand.screenPosition()[0]+500;
                    leapY = (-1) * hand.screenPosition()[1]+500;
                    leapZ = hand.screenPosition()[2]+200;

                    //needs adjustment! No matter how the camera has been rotated the movement should be intuitiv
                    currentPickedMesh.position.x =leapX;
                    currentPickedMesh.position.y =leapY;
                    currentPickedMesh.position.z =leapZ;
*/



                }
                break
            case 5:

                if (frame.pointables.length > 0) {

                    var positionLeap = frame.pointables[0].stabilizedTipPosition;
                    var normalized = frame.interactionBox.normalizePoint(positionLeap, false);

                    //   pointerSphere.position.x = positionLeap[2];
                    // pointerSphere.position.y = positionLeap[1];
                    //pointerSphere.position.z = positionLeap[0];
                    // console.log("x:  "+positionLeap[2] + "  y:  "+positionLeap[1]+"  z:  "+positionLeap[0]);
                   //Analayse collision if ground is shown
                     if (currentPickedMesh.intersectsMesh(center1, false)) {
                     box1.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
                     document.getElementById("touchedBox").innerHTML = "Upper center of BOX 1";
                     document.getElementById("touchingNow").innerHTML = " Picture + BOX 1";
                     console.log("touched center1");
                     }
                     else if (currentPickedMesh.intersectsMesh(center2, false)) {
                     box2.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
                     document.getElementById("touchedBox").innerHTML = "Upper center of BOX 2";
                     document.getElementById("touchingNow").innerHTML = " Picture + BOX 2";
                     console.log("touched center2");
                     }
                     else if(currentPickedMesh.intersectsMesh(center3, false)) {
                     box3.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
                     document.getElementById("touchedBox").innerHTML = " Upper center of BOX 3";
                     document.getElementById("touchingNow").innerHTML = " Picture + BOX 3";
                     console.log("touched center3");
                     }
                     else if (currentPickedMesh.intersectsMesh(center4, false)) {
                     box4.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
                     document.getElementById("touchedBox").innerHTML = "Upper center of BOX 4";
                     document.getElementById("touchingNow").innerHTML = " Picture + BOX 4";
                     console.log("touched center4");
                     } else {
                     box1.material.diffuseColor = new BABYLON.Color3(1, 0.4, 0);
                     box2.material.diffuseColor = new BABYLON.Color3(1, 0.4, 0);
                     box3.material.diffuseColor = new BABYLON.Color3(1, 0.4, 0);
                     box4.material.diffuseColor = new BABYLON.Color3(1, 0.4, 0);
                     document.getElementById("touchingNow").innerHTML = "";
                     }



                    //Move Image around with leap

                     var hand = frame.hands[0];
                     leapX = (-1) * hand.screenPosition()[0];
                     leapY = (-1) * hand.screenPosition()[1];
                     leapZ = hand.screenPosition()[2];

                     //needs adjustment! No matter how the camera has been rotated the movement should be intuitiv
                     currentPickedMesh.position.x =leapX*2;
                     currentPickedMesh.position.y =leapY*2;
                     currentPickedMesh.position.z =leapZ*3;




                }
                break

            default:

        }


    }).use('screenPosition', {scale: 1});

    //the render loop
    engine.runRenderLoop(function () {
        scene.render();
    });


}, false)