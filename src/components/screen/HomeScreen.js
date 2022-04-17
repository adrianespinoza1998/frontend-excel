import xlsxFile from 'read-excel-file';
import { useState } from 'react';
import {useContext} from 'react'
import {AuthContext} from '../auth/authContext';
import { SubirExcel } from '../projects/SubirExcel';
import { SeleccionarExcel } from '../projects/SeleccionarExcel';
import { SubirModelo } from '../projects/SubirModelo';

export const HomeScreen = () => {

    const [items, setItems] = useState({
        data: [],
        load: false
    });

    const [modelo, setModelo] = useState({
        archivoModelo: [],
        loadModelo: false
    });

    const {archivoModelo, loadModelo} = modelo;

    const { data, load } = items;
    
    const {user} = useContext(AuthContext); 

    const [archivo, setArchivo] = useState({
        nombreArchivo: '',
        cargaArchivo: false
    });

    const { nombreArchivo, cargaArchivo } = archivo;

    const handleSubmit = async () => {
        //event.preventDefault();
        const data = new FormData(document.querySelector('form'));

        const excel = data.get("excel");

        if (excel.name !== '') {
            const finalData = await xlsxFile(excel);

            setItems({
                data: finalData,
                load: true
            });
        } else {
            alert('Por favor, ingrese el excel a la plataforma');
        }
    }

    const onChangeUpload = (event) => {
        event.preventDefault();

        if (event.target.value !== '') {

            const finalPath = event.target.value.replace(/\\/g, '/');

            const arrPath = finalPath.split('/');

            const archivoSubido = arrPath[arrPath.length - 1];

            setArchivo({
                nombreArchivo: archivoSubido,
                cargaArchivo: true
            });
        } else {
            setArchivo({
                nombreArchivo: 'Datos a subir',
                cargaArchivo: false
            });
        }
    }

    const guardarModelo = (file)=>{
        setModelo({
            ...modelo,
            archivoModelo: file
        });
    }

    const cargarDatos = async () => {

        setModelo({
            ...modelo,
            loadModelo: true
        })
    }

    return (
        <div>
            {
            (loadModelo) ?
            <SubirModelo guardarModelo={guardarModelo} data={data} user={user} archivoModelo={archivoModelo}/>
            :
                (load) ?
                <SubirExcel data={data} cargarDatos={cargarDatos} />
                :
                <SeleccionarExcel handleSubmit={handleSubmit} cargaArchivo={cargaArchivo} 
                    nombreArchivo={nombreArchivo} onChangeUpload={onChangeUpload} />
            }
        </div>
    )
}
