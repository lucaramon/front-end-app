const API_URL = 'http://localhost:4000/customers';

export async function getAll() {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch customers');
    }
    return response.json();
}

export async function post(item) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
    });
    if (!response.ok) {
        throw new Error('Failed to add customer');
    }
    return response.json();
}

export async function put(id, item) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
    });
    if (!response.ok) {
        throw new Error(`Failed to update customer with id ${id}`);
    }
    return response.json();
}

export async function deleteById(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error(`Failed to delete customer with id ${id}`);
    }
}