// Variables globales para almacenar matrices y resultados
let mat = [];
let raices = [];
let matOp1 = [];
let matOp2 = [];
let matResp1 = [];
let matResp2 = [];

// Referencias a elementos del DOM
let divEc = document.getElementById('ecuaciones');
let seeMat = document.getElementById('seeMat');
let solution = document.getElementById('solution');
let answers = document.getElementById('answers');

// Función para crear los campos de entrada de ecuaciones
function crearEc() {
    let n = getN();

    // Validación del número de ecuaciones
    if (!(/^\d+$/.test(n)) || n < 1) {
        alert('El grado del polinomio debe ser un número positivo');
        document.getElementById('n').value = '';
        return;
    }

    clearEc();

    let button = document.createElement('button');
    button.type = 'button'; // Cambiado a 'button' para evitar el envío del formulario
    button.textContent = 'Mostrar Matriz';
    button.onclick = saveIndex;
    let P = document.createElement('span');
    P.innerHTML = `P<sub>${n}</sub> (x) = `;
    divEc.appendChild(P);

    // Crear campos de entrada para las ecuaciones
    for (let i = 0; i <= n; i++) {
        let inputX = document.createElement('input');
        inputX.type = 'number';
        inputX.id = `x${i}`;

        // Exponente que disminuye desde n-1
        let exponent = n - i;

        // Si el exponente es 0, solo mostramos el campo de entrada sin la x
        if (exponent > 0) {
            if (exponent != 1) {
                let xWithExponent = document.createElement('span');
                xWithExponent.innerHTML = `x<sup>${exponent}</sup>`;
                divEc.appendChild(inputX);
                divEc.appendChild(xWithExponent);
            } else {
                let xWithExponent = document.createElement('span');
                xWithExponent.innerHTML = `x`;
                divEc.appendChild(inputX);
                divEc.appendChild(xWithExponent);
            }
        } else {
            divEc.appendChild(inputX);
        }

        if (i < n) {
            divEc.appendChild(document.createTextNode(' + '));
        }
    }

    divEc.appendChild(document.createElement('br'));
    divEc.appendChild(document.createElement('br'));

    divEc.appendChild(button);
}

function saveIndex() {
    let n = getN();
    mat = [];

    // Guardar valores de la matriz y resultados
    for (let i = 0; i <= n; i++) {
        let value = document.getElementById(`x${i}`).value;

        if (value === '' || isNaN(value)) {
            alert('Verifica que los campos estén correctamente completados');
            return;
        } else {
            if (i === 0 && value == 0) {
                alert(`Para que sea una función de grado ${n}, el coeficiente de x^${n} no puede ser 0`);
                return;
            } else {
                if (i == (n - 1) && value == 0) {
                    alert(`El coeficiente de x no puede ser 0 para continuar con el método`);
                    return;
                } else {
                    value = parseFloat(value);
                    mat[i] = value;
                }
            }
        }
    }

    // Limpiar el contenedor del polinomio y el botón de resolver si ya existen
    seeMat.innerHTML = '';
    solution.innerHTML = '';
    answers.innerHTML = '';

    let btnSolve = document.createElement('button');
    btnSolve.type = 'button';
    btnSolve.textContent = 'Resolver';
    btnSolve.onclick = solve;

    let mtx = document.createElement('h3');
    mtx.textContent = 'Polinomio: ';


    console.log('Se guardo el polinomio con los coeficientes: ', mat);
    polinomio = crearPolinomio(mat);

    seeMat.appendChild(mtx)
    seeMat.appendChild(polinomio)
    seeMat.appendChild(document.createElement('br'));
    seeMat.appendChild(btnSolve)
}



function crearPolinomio(mat) {
    let n = mat.length;
    let polinomio = document.createElement('span');
    polinomio.style.color = 'white';

    let mrow = document.createElement('span');

    let P = document.createElement('span');
    P.innerHTML = `P<sub>${n - 1}</sub>(x) = `;
    mrow.appendChild(P);

    for (let i = 0; i < n; i++) {
        let coef = mat[i];
        let exponent = n - i - 1;

        // Si el coeficiente es 0, no mostrar este término
        if (coef !== 0) {
            // Manejar el signo del coeficiente
            if (i > 0 && coef > 0) {
                mrow.appendChild(document.createTextNode(' + '));
            } else if (coef < 0) {
                if (i > 0) {
                    mrow.appendChild(document.createTextNode(' - '));
                } else {
                    mrow.appendChild(document.createTextNode('-'));
                }
                coef = Math.abs(coef); // Hacer positivo el coeficiente para mostrarlo
            }

            // Mostrar el coeficiente (omitir si es 1 o -1 y no es el término constante)
            if (coef !== 1 || exponent === 0) {
                let coefSpan = document.createElement('span');
                coefSpan.textContent = `${coef}`;
                mrow.appendChild(coefSpan);
            }

            // Agregar la variable x con el exponente si es mayor a 0
            if (exponent > 0) {
                let xSpan = document.createElement('span');
                xSpan.innerHTML = `x`;
                if (exponent > 1) {
                    xSpan.innerHTML += `<sup>${exponent}</sup>`;
                }
                mrow.appendChild(xSpan);
            }
        }
    }

    polinomio.appendChild(mrow);
    return polinomio;
}


// Función para limpiar los campos de entrada de ecuaciones
function clearEc() {
    divEc.innerHTML = '';
    mat = [];

    seeMat.innerHTML = '';
    solution.innerHTML = '';
    answers.innerHTML = '';
}

function solve() {
    let raices = [];
    let grado = mat.length;
    let n = mat.length;
    let p1, p2;
    let polinomioresult;

    for (let i = 0; i < grado; i++) {

        n = mat.length; // Recalcular después de modificar el polinomio
        let findSol = false;
        let matResult;
        let x;
        let aux = 0;

        while (!findSol) {

            // Validar que no sea la primera iteracion para calcular x
            if (aux != 0) {
                x = roundIfClose(x - p1 / p2);
            } else {
                x = roundIfClose(-mat[n - 1] / mat[n - 2]);
            }

            // Inicializar matrices de operaciones y respuestas
            let matOp1 = [0];
            let matResp1 = [mat[0]];

            // Calcular matOp1 y matResp1
            for (let j = 0; j < n - 1; j++) {
                let valuematOp1 = matResp1[j] * x;
                valuematOp1 = roundIfClose(valuematOp1);
                matOp1.push(valuematOp1);

                let valuematResp1 = matOp1[j + 1] + mat[j + 1];
                valuematResp1 = roundIfClose(valuematResp1);
                matResp1.push(valuematResp1);
            }

            p1 = roundIfClose(matResp1[n - 1]);
            console.log(p1);

            if (Math.abs(p1) < 1e-3) {
                matResult = [mat, matOp1, matResp1];

                solution.appendChild(document.createElement('br'));

                let numite = document.createElement('h2');
                numite.textContent = `Iteración ${aux + 1}`;
                solution.appendChild(numite);

                let valuex = document.createElement('h3');
                valuex.textContent = `x = ${x}`;
                solution.appendChild(valuex);

                console.log('Se encontro una raiz: ', x);
                raices.push(x);

                solution.appendChild(document.createElement('br'));

                mat = matResp1.slice(0, -1); // Reducir el polinomio
                console.log('MATRIZ REDUCIDA: ', mat);

                let mathResult = printMatrix(matResult);
                solution.appendChild(mathResult);

                let raiz = document.createElement('h3');
                raiz.textContent = `x = ${x} es una raíz`;
                solution.appendChild(raiz);


                // Recalcula el nuevo valor de x después de encontrar una raíz si el polinomio tiene más de un término
                if (mat.length > 1) {
                    x = (mat[mat.length - 1] * -1) / mat[mat.length - 2];

                    polinomioresult = crearPolinomio(mat);
                    solution.appendChild(document.createElement('br'));
                    solution.appendChild(document.createElement('br'));
                    solution.appendChild(polinomioresult);
                    solution.appendChild(document.createElement('br'));

                } else {
                    console.log('Las raices son: ', raices);
                    return;
                }

                findSol = true;
                break;
            }

            let matOp2 = [0];
            let matResp2 = [mat[0]];

            // Calcular matOp2 y matResp2
            for (let j = 0; j < n - 2; j++) {
                let valuematOp2 = matResp2[j] * x;
                valuematOp2 = roundIfClose(valuematOp2);
                matOp2.push(valuematOp2);

                let valuematResp2 = matOp2[j + 1] + matResp1[j + 1];
                valuematResp2 = roundIfClose(valuematResp2);
                matResp2.push(valuematResp2);
            }

            p2 = roundIfClose(matResp2[n - 2]);

            if (p2 !== 0) {
                matResult = [mat, matOp1, matResp1, matOp2, matResp2];

                solution.appendChild(document.createElement('br'));

                let numite = document.createElement('h2');
                numite.textContent = `Iteración ${aux + 1}`;
                solution.appendChild(numite);

                let valuex = document.createElement('h3');
                valuex.textContent = `x = ${x}`;
                solution.appendChild(valuex);

                let mathResult = printMatrix(matResult);
                solution.appendChild(mathResult);
            } else {
                let error = document.createElement('h3');
                error.textContent = `No se puede continuar con el metodo, se encontraron raices complejas`;
                error.style.color = 'red';
                solution.appendChild(error);

                return;
            }

            if (aux == 49) {
                let error = document.createElement('h3');
                error.textContent = `La raiz ${i + 1} no converge a algun valor después de 50 iteraciones`;
                error.style.color = 'red';
                solution.appendChild(error);

                return;
            }

            aux++;

        }
    }
}


// Función para obtener el número de ecuaciones
function getN() {
    let n = document.getElementById('n').value;
    n = parseInt(n);
    return n;
}


function roundIfClose(num) {
    // Redondear a un número fijo de decimales
    let precision = 3;
    let roundedNum = parseFloat(num.toFixed(precision));

    // Encuentra el entero más cercano
    let lower = Math.floor(num);
    let upper = Math.ceil(num);

    // Verifica si el número está en el rango de redondeo
    if (num - lower >= 1 - Math.pow(10, -precision) || upper - num <= Math.pow(10, -precision)) {
        return Math.round(num);
    } else {
        return roundedNum;
    }
}


function printMatrix(arrays) {
    // Encuentra el número máximo de columnas
    const maxCols = Math.max(...arrays.map(arr => arr.length));

    // Crea el elemento MathML
    let math = document.createElement('math');
    let mrow = document.createElement('mrow');
    let mtable = document.createElement('mtable');

    // Itera sobre los arreglos para construir las filas
    arrays.forEach((arr, index) => {
        // Ajusta la longitud de la fila según el índice
        let rowLength = index < 3 ? maxCols : maxCols - 1;

        // Evitar longitud negativa, rellenando solo si es necesario
        let paddingLength = Math.max(0, rowLength - arr.length);
        let row = arr.concat(new Array(paddingLength).fill(''));

        // Crear la fila normal
        let mtr = document.createElement('mtr');
        row.forEach(cell => {
            let mtd = document.createElement('mtd');
            let mn = document.createElement('mn');
            mn.textContent = cell;
            mtd.appendChild(mn);
            mtr.appendChild(mtd);
        });

        mtable.appendChild(mtr);

        // Agregar una fila de separación cada dos filas
        if ((index + 1) % 2 === 0 && index !== arrays.length - 1) {
            let separatorRow = document.createElement('mtr');
            for (let i = 0; i < rowLength; i++) {
                let separatorCell = document.createElement('mtd');
                separatorCell.textContent = '—————'; // Simula una línea en cada columna
                separatorRow.appendChild(separatorCell);
            }
            mtable.appendChild(separatorRow);
        }
    });

    mrow.appendChild(mtable);
    math.appendChild(mrow);

    return math;
}



