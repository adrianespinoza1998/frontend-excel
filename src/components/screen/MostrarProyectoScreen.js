import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import * as axios from 'axios';
import { validarSO } from '../../helpers/validarSO';

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
    Raycaster
} from "three";
import {
    OrbitControls
} from "three/examples/jsm/controls/OrbitControls";
import { IFCLoader } from "web-ifc-three/IFCLoader";
import { colors } from "../../helpers/colors";
import { AuthContext } from '../auth/authContext';
import { ModeloContext } from '../modelo/modeloContext';

import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const theme = createTheme();

export const MostrarProyectoScreen = () => {

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

    const raycaster = new Raycaster();
    raycaster.firstHitOnly = true;

    let ifc;

    const [load, setLoad] = useState(false);
    const { dispatchLoad } = useContext(ModeloContext);

    const highlight = (material, idPieza) => {

        return new Promise((resolve, reject) => {
            try {
                ifcLoader.ifcManager.createSubset({
                    modelID: 0,
                    ids: [idPieza],
                    material: material,
                    scene: scene,
                    removePrevious: false
                });
                resolve(true);
            } catch (error) {
                console.log(error);
                reject(false);
            }
        })
    }

    const { id } = useParams();

    const [proyecto, setProyecto] = useState({});

    const { user } = useContext(AuthContext);

    useEffect(async () => {

        dispatchLoad({ type: 'loading' });

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

        ifc = ifcLoader.ifcManager

        const fetch = await axios({
            url: `${validarSO()}/api/proyecto/${id}`,
            method: 'GET',
            headers: {
                'x-token': user.token
            }
        });

        setProyecto(fetch.data);

        const fetchData = await axios({
            url: `${validarSO()}/api/upload/${id}`,
            method: 'GET',
            headers: {
                'x-token': user.token
            }
        });

        const binaryData = [];
        binaryData.push(fetchData.data);

        const ifcUrl = URL.createObjectURL(new Blob(binaryData, { type: 'application/zip' }));

        ifcLoader.load(ifcUrl, async (ifcModel) => {
            ifcModels.push(ifcModel);
            scene.add(ifcModel);

            const fetchItems = await axios({
                url: `${validarSO()}/api/items/${id}`,
                method: 'GET',
                headers: {
                    'x-token': user.token
                }
            })

            const listaItems = fetchItems.data;

            for (let i = 0; i < listaItems.length; i++) {
                if (listaItems[i].cantidad > 0) {
                    await highlight(colors.selected, listaItems[i].idPieza);
                } else {
                    await highlight(colors.over, listaItems[i].idPieza);
                }
            }

            setLoad(true);

            dispatchLoad({ type: 'loaded' });
        });

    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Proyecto: {proyecto.nombreProyecto}
                    </Typography>
                    {
                        (!load) &&
                        <Typography component="h1" variant="h5">
                            Cargando......
                        </Typography>
                    }
                    <canvas id='three-canvas' style={{ position: 'relative', height: '80vh', width: '65%' }}></canvas>
                </Box>
            </Container>
        </ThemeProvider>

    )
}
