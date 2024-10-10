import React, { useState, useEffect } from 'react';
import './CustomerList.css';
import CustomerAddUpdateForm from './CustomerAddUpdateForm';
import * as restdb from '../restdb';

const CustomerList = () => {
    const [selectedCustomerIndex, setSelectedCustomerIndex] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    useEffect(() => {
        const fetchCustomers = async () => {
            const customerData = await restdb.getAll();
            setCustomers(customerData);
        };
        fetchCustomers();
    }, []);

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const onDeleteClick = () => {
        if (selectedCustomerIndex !== null) {
            restdb.deleteById(customers[selectedCustomerIndex].id);
            setCustomers(customers.filter((_, index) => index !== selectedCustomerIndex));
            onCancelClick();
        }
    };

    const onSaveClick = async () => {
        if (selectedCustomerIndex !== null) {
            await restdb.put(customers[selectedCustomerIndex].id, { ...formData });
        } else {
            await restdb.post({ ...formData });
        }

        const allCustomers = await restdb.getAll();
        setCustomers(allCustomers);

        onCancelClick();
    };

    const onCancelClick = () => {
        setFormData({ name: '', email: '', password: '' });
        setSelectedCustomerIndex(null);
    };

    const handleListClick = (index) => {
        if (selectedCustomerIndex === index) {
            setSelectedCustomerIndex(null);
            setFormData({ name: '', email: '', password: '' });
        } else {
            setSelectedCustomerIndex(index);
            const selectedCustomer = customers[index];
            setFormData({
                name: selectedCustomer.name,
                email: selectedCustomer.email,
                password: selectedCustomer.password
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    return (
        <div className="container">
            <h1 className="heading">Customer Management</h1>

            <h2 className="heading">Customers List</h2>

            <input
                type="text"
                placeholder="Search by Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />
            <table className="table">
                <thead>
                    <tr>
                        <th className="th">Name</th>
                        <th className="th">Email</th>
                        <th className="th">Password</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCustomers.map((customer, index) => (
                        <tr
                            key={customer.id}
                            onClick={() => handleListClick(index)}
                            style={{ cursor: 'pointer', fontWeight: selectedCustomerIndex === index ? 'bold' : 'normal' }}
                        >
                            <td className="td">{customer.name}</td>
                            <td className="td">{customer.email}</td>
                            <td className="td">{customer.password}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <CustomerAddUpdateForm
                formData={formData}
                handleInputChange={handleInputChange}
                onSaveClick={onSaveClick}
                onDeleteClick={onDeleteClick}
                onCancelClick={onCancelClick}
                isEditing={selectedCustomerIndex !== null}
                selectedCustomerEmail={selectedCustomerIndex !== null ? customers[selectedCustomerIndex].email : ''}
            />
        </div>
    );
};

export default CustomerList;