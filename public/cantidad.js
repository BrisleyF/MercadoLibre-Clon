const formulario = document.getElementById('formulario');
const inputs = document.querySelectorAll('#formulario input');
const inputCantidad = document.getElementById('grupo__cantidad');


const expresiones = {
	cantidad: /^\d{1,4}$/ // 1 a 4 numeros.
};

const campos = { 
    cantidad: false,
};

const validarFormulario = (e) => {

    if(e.target.name) {
        validarCampo(expresiones.cantidad, e.target, 'cantidad');
    };
};


const validarCampo = (expresion, input, campo) => {
	if(expresion.test(input.value)){
		document.getElementById(`grupo__${campo}`).classList.remove('colorRed');
		document.getElementById(`grupo__${campo}`).classList.add('colorGreen');
        document.querySelector('.formulario__input-error').classList.remove('formulario__input-error-activo');
        campos[campo] = true;
		
	} else {
		document.getElementById(`grupo__${campo}`).classList.add('colorRed');
		document.getElementById(`grupo__${campo}`).classList.remove('colorGreen');
		document.querySelector('.formulario__input-error').classList.add('formulario__input-error-activo');
        campos[campo] = false;
	}
};

inputs.forEach((input) => {
    input.addEventListener('keyup', validarFormulario);
    input.addEventListener('blur', validarFormulario);
})


formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    
	if(campos.cantidad){
		

        let cantidad = inputCantidad.value;

        datosDelFormulario(cantidad);

        formulario.reset();

        document.getElementById('grupo__cantidad').classList.remove('colorGreen');
        
	} 
});

let datosDelFormulario = async (cantidad) => {
    await axios({
        method: 'post',
        url: 'http://localhost:3000/carrito/agregar',
        responseType: 'json', 
        data: {
            'cantidad': cantidad,
        }
    }).then(({data: {_id}}) => {
        document.getElementById("carrito-link").href= "/carrito/agregar/" + _id;        
    });
};
