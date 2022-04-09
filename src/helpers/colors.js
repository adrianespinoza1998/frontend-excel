import {MeshLambertMaterial} from "three";

export const colors = {
    over: new MeshLambertMaterial({
        transparent: true,
        opacity: 0.6,
        color: 0xff88ff,
        depthTest: false
    }),
    selected: new MeshLambertMaterial({
        transparent: true,
        opacity: 0.6,
        color: 0x33ab53,
        depthTest: false
    }),
    used: new MeshLambertMaterial({
        transparent: true,
        opacity: 0.6,
        color: 0xc4396e,
        depthTest: false
    })
}