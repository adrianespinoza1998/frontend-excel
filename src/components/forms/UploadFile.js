import React from 'react';
import Button from '@mui/material/Button';

export const UploadFile = ({ onChangeUpload, cargaArchivo, nombreArchivo, tipoData, useDisabled = false }) => {

    return (
        <Button
            variant="contained"
            component="label"
            sx={{
                backgroundColor: (cargaArchivo) ? "green" : "primary"
            }}
        >
            {(cargaArchivo) ? nombreArchivo : "Seleccionar Archivo"}
            {(useDisabled) ?
                (cargaArchivo) ?
                    <input
                        name="excel"
                        id="excel"
                        type="file"
                        accept={tipoData}
                        hidden
                        onChange={onChangeUpload}
                        disabled={true}
                    />
                    :
                    <input
                        name="excel"
                        id="excel"
                        type="file"
                        accept={tipoData}
                        hidden
                        onChange={onChangeUpload}
                    />
                :
                <input
                    name="excel"
                    id="excel"
                    type="file"
                    accept={tipoData}
                    hidden
                    onChange={onChangeUpload}
                />
            }
        </Button>
    )
}
