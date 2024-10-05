const fs = require('fs');

// Function to read and parse a sparse matrix from a file
function readSparseMatrix(filePath) {
    console.log(`\nReading matrix from file: ${filePath}`);

    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const lines = data.split('\n').filter(line => line.trim() !== '');

        // Parse matrix dimensions
        const rows = parseInt(lines[0].split('=')[1].trim());
        const cols = parseInt(lines[1].split('=')[1].trim());
        console.log(`Matrix dimensions: Rows = ${rows}, Cols = ${cols}`);

        // Initialize a Map to store non-zero elements
        const sparseMatrix = new Map();

        // Process non-zero entries
        for (let i = 2; i < lines.length; i++) {
            const [row, col, value] = lines[i].replace(/[()]/g, '').split(',').map(Number);

            if (value !== 0) {
                sparseMatrix.set(`${row},${col}`, value); // Store only non-zero entries
                console.log(`Added non-zero entry: (${row}, ${col}) => ${value}`);
            }
        }

        return { rows, cols, sparseMatrix };
    } catch (error) {
        console.error(`Error reading file: ${error.message}`);
        return null;
    }
}

// Function to add two sparse matrices
function addSparseMatrices(matrix1, matrix2) {
    // Check if matrix dimensions match
    if (matrix1.rows !== matrix2.rows || matrix1.cols !== matrix2.cols) {
        console.error("Matrix dimension mismatch! Cannot perform addition.");
        return null;
    }

    const resultMatrix = new Map();

    // Merge matrix1 into resultMatrix
    matrix1.sparseMatrix.forEach((value, key) => {
        resultMatrix.set(key, value);
    });

    // Add values from matrix2
    matrix2.sparseMatrix.forEach((value, key) => {
        const currentVal = resultMatrix.get(key) || 0;
        resultMatrix.set(key, currentVal + value);
    });

    console.log("\nMatrices added successfully.");
    return { rows: matrix1.rows, cols: matrix1.cols, sparseMatrix: resultMatrix };
}

// Function to print the sparse matrix in a human-readable format
function printSparseMatrix({ rows, cols, sparseMatrix }) {
    console.log(`\nSparse Matrix (${rows} x ${cols}):`);
    if (sparseMatrix.size === 0) {
        console.log("Matrix is empty or contains only zeroes.");
        return;
    }
    
    sparseMatrix.forEach((value, key) => {
        const [row, col] = key.split(',').map(Number);
        console.log(`(${row}, ${col}) => ${value}`);
    });
}

// Example usage
const matrixFilePath1 = 'matrix1.txt';
const matrixFilePath2 = 'matrix2.txt';

const matrix1 = readSparseMatrix(matrixFilePath1);
const matrix2 = readSparseMatrix(matrixFilePath2);

if (matrix1 && matrix2) {
    const result = addSparseMatrices(matrix1, matrix2);
    if (result) {
        printSparseMatrix(result);
    }
} else {
    console.log("Error in reading one or both matrices.");
}
