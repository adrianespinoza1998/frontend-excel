import React, { useEffect, useState } from 'react';
import {
    acceleratedRaycast,
    computeBoundsTree,
    disposeBoundsTree
} from 'three-mesh-bvh';
import {
    AmbientLight,
    AxesHelper,
    DirectionalLight,
    GridHelper,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    Raycaster,
    Vector2
} from "three";
import {
    OrbitControls
} from "three/examples/jsm/controls/OrbitControls";
import { IFCLoader } from "web-ifc-three/IFCLoader";
import { colors } from "../../helpers/colors";
import * as axios from 'axios';
import { validarSO } from '../../helpers/validarSO';

export const SubirModelo = ({ guardarModelo, data, user, archivoModelo }) => {
    //Creates the Three.js scene
    let scene;

    //Object to store the size of the viewport
    let size;

    //Creates the camera (point of view of the user)
    let aspect;
    let camera;

    //Creates the lights of the scene
    let lightColor;

    let ambientLight;

    let directionalLight;

    //Sets up the renderer, fetching the canvas of the HTML
    let threeCanvas;

    let renderer;

    //Creates grids and axes in the scene
    let grid;

    let axes;

    //Creates the orbit controls (to navigate the scene)
    let controls;

    //Animation loop
    let animate;

    //Adjust the viewport to the size of the browser

    let ifcLoader;

    const ifcModels = [];

    const [descripcion, setDescripcion] = useState(false);

    const [lastDesripcion, setLastDescripcion] = useState('');

    const [idLugar, setIdLugar] = useState(0);

    const [listaDatAsoc, setListaDatAsoc] = useState([]);

    const [menuData, setMenuData] = useState(data);

    const raycaster = new Raycaster();
    raycaster.firstHitOnly = true;
    const mouse = new Vector2();

    let preselectModel = { id: - 1 };

    let ifc;

    const highlight = (event, material, model) => {
        const found = cast(event)[0];
        if (found) {

            // Gets model ID
            model.id = found.object.modelID;

            // Gets Express ID
            const index = found.faceIndex;
            const geometry = found.object.geometry;
            const id = ifc.getExpressId(geometry, index);

            // Creates subset
            ifcLoader.ifcManager.createSubset({
                modelID: model.id,
                ids: [id],
                material: material,
                scene: scene,
                removePrevious: true
            });
        } else {
            // Removes previous highlight
            ifc.removeSubset(model.id, material);
        }
    }

    const cast = (event) => {

        // Computes the position of the mouse on the screen
        const bounds = threeCanvas.getBoundingClientRect();

        const x1 = event.clientX - bounds.left;
        const x2 = bounds.right - bounds.left;
        mouse.x = (x1 / x2) * 2 - 1;

        const y1 = event.clientY - bounds.top;
        const y2 = bounds.bottom - bounds.top;
        mouse.y = -(y1 / y2) * 2 + 1;

        // Places it on the camera pointing to the mouse
        raycaster.setFromCamera(mouse, camera);

        // Casts a ray
        return raycaster.intersectObjects(ifcModels);
    }

    const pick = (event, material, model) => {
        const found = cast(event)[0];
        if (found) {
            const index = found.faceIndex;
            const geometry = found.object.geometry;
            const ifc = ifcLoader.ifcManager;
            const id = ifc.getExpressId(geometry, index);

            setIdLugar(id);

            highlight(event, material, model);
        }
    }

    const handleUpload = (event) => {
        const archivo = event.target.files[0];

        guardarModelo(archivo);

        if (archivo) {
            const ifcUrl = URL.createObjectURL(archivo);

            ifcLoader.load(ifcUrl, (ifcModel) => {
                ifcModels.push(ifcModel);
                scene.add(ifcModel);

                setDescripcion(true);
            });
        }
    }

    const handleDescripcion = (event) => {
        setLastDescripcion(event.target.value);
    }

    const asociarDatosModelo = () => {
        const lista = listaDatAsoc;

        lista.push({
            id: idLugar,
            descripcion: lastDesripcion
        });

        setListaDatAsoc(lista);

        const menu = menuData.filter(d => d[2] !== lastDesripcion);

        console.log(menu);

        setMenuData(menu);

        document.querySelector('#selectDescription').value = 0;

        alert("Dato asociado");
    }

    const subirProyecto = async () => {

        if (listaDatAsoc.length > 0) {
            const fetchProyecto = await axios({
                url: `${validarSO()}/api/proyecto`,
                method: 'POST',
                data: {
                    nombreProyecto: 'proyecto prueba'
                },
                headers: {
                    'x-token': user.token
                }
            });

            if (fetchProyecto.data.idProyecto !== null) {

                const formData = new FormData();

                formData.append("archivo", archivoModelo);

                const fetchUpload = await axios({
                    url: `${validarSO()}/api/upload/${fetchProyecto.data.idProyecto}`,
                    method: 'PUT',
                    data: formData,
                    headers: {
                        'x-token': user.token
                    }
                });

                if (fetchUpload.data.idProyecto !== null) {

                    const finalData = [];

                    for (let i = 0; i < listaDatAsoc.length; i++) {

                        for (let j = 0; j < data.length; j++) {

                            if (listaDatAsoc[i].descripcion === data[j][2]) {
                                finalData.push(data[j]);
                                finalData[finalData.length - 1].push(listaDatAsoc[i].id);
                            }
                        }
                    }

                    const fetchItems = await axios({
                        url: `${validarSO()}/api/items`,
                        method: 'POST',
                        data: {
                            items: finalData,
                            idProyecto: fetchProyecto.data.idProyecto
                        },
                        headers: {
                            'x-token': user.token
                        }
                    });

                    if (fetchItems.data.msg === "Items insertados") {
                        alert("Proyecto guardado");
                    }

                }
            }
        } else {
            alert("No hay datos seleccionados");
            console.log(JSON.stringify(listaDatAsoc));
        }
    }

    useEffect(() => {

        scene = new Scene();

        size = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        aspect = size.width / size.height;

        camera = new PerspectiveCamera(75, aspect);
        camera.position.z = 15;
        camera.position.y = 13;
        camera.position.x = 8;

        lightColor = 0xffffff;

        ambientLight = new AmbientLight(lightColor, 0.5);
        scene.add(ambientLight);

        directionalLight = new DirectionalLight(lightColor, 1);
        directionalLight.position.set(0, 10, 0);
        directionalLight.target.position.set(-5, 0, 0);
        scene.add(directionalLight);
        scene.add(directionalLight.target);

        threeCanvas = document.querySelector('#three-canvas');

        renderer = new WebGLRenderer({
            canvas: threeCanvas,
            alpha: true
        });

        renderer.setSize(size.width, size.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        grid = new GridHelper(50, 30);
        scene.add(grid);

        axes = new AxesHelper();
        axes.material.depthTest = false;
        axes.renderOrder = 1;
        scene.add(axes);

        controls = new OrbitControls(camera, threeCanvas);
        controls.enableDamping = true;
        controls.target.set(-2, 0, 0);

        animate = () => {
            controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();

        window.addEventListener("resize", () => {
            size.width = window.innerWidth;
            size.height = window.innerHeight;
            camera.aspect = size.width / size.height;
            camera.updateProjectionMatrix();
            renderer.setSize(size.width, size.height);
        });

        ifcLoader = new IFCLoader();
        ifcLoader.ifcManager.setWasmPath("../../../../");

        ifcLoader.ifcManager.setupThreeMeshBVH(
            computeBoundsTree,
            disposeBoundsTree,
            acceleratedRaycast);

        threeCanvas.ondblclick = (event) => pick(event, colors.selected, preselectModel);

        window.onmousemove = (event) => highlight(
            event,
            colors.over,
            preselectModel);

        ifc = ifcLoader.ifcManager
    }, []);

    useEffect(() => {
        console.log(menuData);
    }, [menuData]);

    return (
        <div>
            <canvas id='three-canvas' style={{ position: 'relative', height: '96.5vh', width: '100%' }}></canvas>
            <input type="file" id='upload' onChange={handleUpload} accept='.ifc' />
            <select id='selectDescription' onChange={handleDescripcion}>
                <option value={0}>--Seleccione--</option>
                {
                    (descripcion) &&
                    menuData.map((row, index) => {
                        if(row[2]!=='Descripcion'){
                            return <option key={index}>{row[2]}</option>
                        }
                    })
                }
            </select>
            <button onClick={asociarDatosModelo}>Seleccionar</button>
            <button onClick={subirProyecto}>Subir modelo</button>
        </div>
    )
}
