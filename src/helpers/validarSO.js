export const validarSO = () => {

    const navInfo = navigator.userAgentData.platform;

    /*if (navInfo == 'Windows') {
        return 'http://localhost:5000';
    }
    else {
        return 'http://3.16.54.133:80';
    }*/
    if(navInfo === null){
        return 'http://3.16.54.133:80';
    }else{
        return 'http://localhost:5000';
    }
}