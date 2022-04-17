import React, { useContext, useEffect, useState } from 'react';
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

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { colors } from "../../helpers/colors";
import * as axios from 'axios';
import { validarSO } from '../../helpers/validarSO';
import { ModeloContext } from '../modelo/modeloContext';
import { useHistory } from 'react-router-dom';
import { UploadFile } from '../forms/UploadFile';

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

    const { dispatchLoad } = useContext(ModeloContext);

    const [descripcion, setDescripcion] = useState(false);

    const [lastDesripcion, setLastDescripcion] = useState('');

    const [idLugar, setIdLugar] = useState(0);

    const [listaDatAsoc, setListaDatAsoc] = useState([]);

    const [archivoModl, setArchivoModl] = useState({
        nombreArchivo: '',
        cargaArchivo: false
    });

    const { nombreArchivo, cargaArchivo } = archivoModl;

    const onChangeUpload = (event) => {
        event.preventDefault();

        dispatchLoad({ type: 'loading' });
        setLoad(true);

        const archivo = event.target.files[0];

        guardarModelo(archivo);

        if (archivo) {

            const ifcUrl = URL.createObjectURL(archivo);

            ifcLoader.load(ifcUrl, (ifcModel) => {
                ifcModels.push(ifcModel);
                scene.add(ifcModel);

                setDescripcion(true);

                dispatchLoad({ type: 'loaded' });
                setLoad(false);

                setArchivoModl({
                    nombreArchivo: archivo.name,
                    cargaArchivo: true
                });
            });
        } else {
            setArchivoModl({
                nombreArchivo: 'Datos a subir',
                cargaArchivo: false
            });
        }
    }

    const [menuData, setMenuData] = useState(data);
    const [load, setLoad] = useState(false);
    const history = useHistory();

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

            console.log(id);

            highlight(event, material, model);
        }
    }

    const handleDescripcion = (event) => {
        setLastDescripcion(event.target.value);
    }

    const asociarDatosModelo = () => {
        const lista = listaDatAsoc;

        let flag = false;

        for (let i = 0; i < listaDatAsoc.length; i++) {
            if (listaDatAsoc[i].id === idLugar) {
                flag = true;
                console.log(idLugar);
            }
        }

        if (!flag) {
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
        } else {
            alert("Esta estancia ya esta seleccionada");
        }
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
                        history.push('/home/admin');
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
        //console.log(menuData);
    }, [menuData]);

    return (
        <div>
            <canvas id='three-canvas' style={{ position: 'relative', height: '96.5vh', width: '100%' }}></canvas>

            <Grid container spacing={2} sx={{ justifyContent: 'center', alignItems: 'center', margin: 1 }}>
                {
                    (load) &&
                    <Grid item xs={6} md={12}>
                        <Typography component="h1" variant="h5">
                            Cargando......
                        </Typography>
                    </Grid>
                }
                {
                    (cargaArchivo) &&
                    <>
                        <Grid item xs={6} md={6}>
                            <FormControl sx={{ minWidth: 200 }} size="small">
                                <InputLabel id="selectDescription">Descripcion</InputLabel>
                                <Select
                                    labelId="selectDescription"
                                    id="selectDescription"
                                    onChange={handleDescripcion}
                                    label="Descripcion"
                                    sx={{ display: 'inline-block' }}
                                    value={lastDesripcion}
                                >
                                    <MenuItem value={0}>
                                        <em>--Seleccione--</em>
                                    </MenuItem>
                                    {
                                        (descripcion) &&
                                        menuData.map((row, index) => {
                                            if (row[2] !== 'Descripcion') {
                                                return <MenuItem key={index} value={row[2]}>
                                                    {row[2]}
                                                </MenuItem>
                                            }
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Button
                                sx={{
                                    mt: 5,
                                    mb: 5,
                                    backgroundColor: "#2196f3",
                                    color: "#fff",
                                    "&:hover": {
                                        color: "#2196f3"
                                    }
                                }}
                                onClick={asociarDatosModelo}
                            >
                                Seleccionar
                            </Button>
                        </Grid>
                    </>
                }
                <Grid item xs={6} md={(cargaArchivo) ? 6 : 12}>
                    <UploadFile nombreArchivo={nombreArchivo} cargaArchivo={cargaArchivo}
                        onChangeUpload={onChangeUpload} tipoData={'.ifc'} useDisabled={true} />
                </Grid>
                {
                    (cargaArchivo) &&
                    <Grid item xs={6} md={3}>
                        <Button
                            sx={{
                                mt: 5,
                                mb: 5,
                                backgroundColor: "#2196f3",
                                color: "#fff",
                                "&:hover": {
                                    color: "#2196f3"
                                }
                            }} onClick={subirProyecto}
                        >
                            Subir modelo
                        </Button>
                    </Grid>
                }
            </Grid>
            {/*<input type="file" id='upload' onChange={handleUpload} accept='.ifc' />*/}
            {
                /*(load) &&
                <div>
                    <p>Cargando.....</p>
                </div>*/
            }
            {/*<select id='selectDescription' onChange={handleDescripcion}>
        <option value={0}>--Seleccione--</option>
        {
            (descripcion) &&
            menuData.map((row, index) => {
                if (row[2] !== 'Descripcion') {
                    return <option key={index}>{row[2]}</option>
                }
            })
        }
    </select>*/}
            {/*<button onClick={asociarDatosModelo}>Seleccionar</button>
    <button onClick={subirProyecto}>Subir modelo</button>*/}
        </div>
    )
}
