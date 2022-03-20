export const validarSO = ()=>{

    const navInfo = window.navigator.appVersion.toLowerCase();

    let so = '';

    if(navInfo.indexOf('win') !== -1)
	{
		so = 'Windows';
	}
	else if(navInfo.indexOf('linux') !== -1)
	{
		so = 'Linux';
	}
	
    /*if(so==='Windows'){
        return 'http://localhost:5000';
    }else{
        return 'http://3.16.54.133:80'
    }*/

    return 'http://3.16.54.133:80';
}