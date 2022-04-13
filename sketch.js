var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };
var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'torus knot' shape.
    var torus_knot = BABYLON.MeshBuilder.CreateTorusKnot("tk", {tube: 0.01, radialSegments: 1024, p:120, q:180}, scene);


    // create capsule shape
    var capsule = new BABYLON.MeshBuilder.CreateCapsule("capsule", {radius:0.5, capSubdivisions: 1, height:2, tessellation:4, topCapSubdivisions:12}, scene);
      

    //create cylinder shape 
    var cylinder = BABYLON.MeshBuilder.CreateCylinder("cylinder", {arc: 0.6, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);



    // Move the torus know upward 1/2 its height
    torus_knot.position.y = 1;


    //move capsule to the right
    capsule.position.x = 4; 


    //move cylinder
    capsule.position.y = -3; 

    
    //create animation object to move torus knot up higher
    var move_tk = {obj: torus_knot, prop: 'position', 
    val: new BABYLON.Vector3(0, 4, 0), dims: ['x', 'y', 'z']};
    
    //to move capsule higher 
    var move_capsule = {obj: capsule, prop: 'position', 
    val: new BABYLON.Vector3(0, 4, 0), dims: ['x', 'y', 'z']};


    //to move cylinder higher
    var move_cylinder = {obj: cylinder, prop: 'position', 
    val: new BABYLON.Vector3(0, -3, 0), dims: ['x', 'y', 'z']};


    //create animation object to dim light
    var dim_light = {obj: light, prop: 'intensity', val: 0, dims: false};

    //create array of animations
    var animations = [];

    //add torus knot and light animations to array 
    animations.push(move_tk); 
    animations.push(dim_light);   


    //add capsule and light animations to array
    animations.push(move_capsule); 
    animations.push(dim_light);   


    //add cylinder and light animations to array 
    animations.push(move_cylinder); 
    animations.push(dim_light);   


    //execute animations on canvas click
    document.getElementById('renderCanvas').addEventListener('click', 
    function() {
        animate(animations, scene, 4);
    });


    // Our built-in 'ground' shape.
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);

    return scene;
};
        window.initFunction = async function() {
            
            
            var asyncEngineCreation = async function() {
                try {
                return createDefaultEngine();
                } catch(e) {
                console.log("the available createEngine function failed. Creating the default engine instead");
                return createDefaultEngine();
                }
            }

            window.engine = await asyncEngineCreation();
if (!engine) throw 'engine should not be null.';
startRenderLoop(engine, canvas);
window.scene = createScene();};
initFunction().then(() => {sceneToRender = scene                    
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});