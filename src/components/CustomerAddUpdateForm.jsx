import React, { useState } from 'react';
import * as restdb from '../restdb';

const CustomerAddUpdateForm = ({ formData, handleInputChange, onSaveClick, onDeleteClick, onCancelClick, isEditing, selectedCustomerEmail }) => {
    const isValidName = (name) => {
        const regex = /^[A-Za-zÄÖÜäöüß\s]+$/;
        return regex.test(name);
    };

    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const checkEmailExists = async (email) => {
        const customers = await restdb.getAll();
        return customers.some(customer => customer.email === email);
    };

    const validateDataForSaveClick = async () => {
        if (!formData.name || !formData.email || !formData.password) {
            alert('Please fill out all fields.');
            return;
        }
        if (!isValidName(formData.name)) {
            alert('Please use only letters for the name.');
            return;
        }
        if (isEditing && formData.email === selectedCustomerEmail) {
            await onSaveClick();
            return;
        }
        if (!isEditing && await checkEmailExists(formData.email)) {
            alert('The Email is already in use, choose a new one.');
            return;
        }
        if (!isValidEmail(formData.email)) {
            alert('Please enter a valid Email.');
            return;
        }

        await onSaveClick();
    };

    const checkIfCustomerSelectedForDelete = async () => {
        if (!isEditing) {
            alert('Please select a customer you want to delete.');
            return;
        }

        await onDeleteClick();
    }

    return (
        <div>
            <h2 className="heading">{isEditing ? 'Update' : 'Add'}</h2>
            <form className="form">
                <div className="inputGroup">
                    <label className="label">Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        placeholder={formData.name === '' ? 'Name...' : ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="inputGroup">
                    <label className="label">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        placeholder={formData.email === '' ? 'Email...' : ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="inputGroup">
                    <label className="label">Password:</label>
                    <input
                        type="text"
                        name="password"
                        value={formData.password}
                        placeholder={formData.password === '' ? 'Password...' : ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="buttonContainer">
                    <button type="button" onClick={checkIfCustomerSelectedForDelete} className="button delete">Delete</button>
                    <button type="button" onClick={validateDataForSaveClick} className="button save">Save</button>
                    <button type="button" onClick={onCancelClick} className="button cancel">Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default CustomerAddUpdateForm;