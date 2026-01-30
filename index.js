import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

async function getAllEmployees() {
    const [rows] = await pool.query('SELECT * FROM employees');
    console.log('All Employees:', rows);
    return rows;
}

async function getEmployeeById(id) {
    const [rows] = await pool.query(
        'SELECT * FROM employees WHERE employee_id = ?',
        [id]
    );
    console.log('Employee', id, ':', rows[0] || 'Not found');
    return rows[0] || null;
}

async function addEmployee(data) {
    const [result] = await pool.query(
        'INSERT INTO employees SET ?',
        [data]
    );
    console.log('Added employee ID:', result.insertId);
    return getAllEmployees();
}

async function removeEmployee(id) {
    const [result] = await pool.query(
        'DELETE FROM employees WHERE employee_id = ?',
        [id]
    );
    console.log('Deleted rows:', result.affectedRows);
    return getAllEmployees();
}

async function updateEmployee(id, updates) {
    const [result] = await pool.query(
        'UPDATE employees SET ? WHERE employee_id = ?',
        [updates, id]
    );
    console.log('Updated rows:', result.affectedRows);
    return getEmployeeById(id);
}

async function main() {
    console.log('Exercise 4 Start');
    
    await getAllEmployees();
    await getEmployeeById(2);
    
    await addEmployee({
        first_name: 'Sarah',
        last_name: 'Wilson',
        email: 'sarah.wilson@example.com',
        phone_number: '555-9999',
        department: 'Finance',
        salary: 88000.00
    });
    
    await removeEmployee(3);
    
    await updateEmployee(1, {
        first_name: 'Jonathan',
        last_name: 'Doe',
        email: 'jonathan.doe@example.com',
        phone_number: '555-1111',
        department: 'Engineering',
        salary: 95000.00
    });
    
    console.log('Exercise 4 Done');
    await pool.end();
}

main();