const BASE = "http://localhost:5000/api";

const getHeaders = () => {
    const headers: HeadersInit = {
        "Content-Type": "application/json"
    };

    const token = localStorage.getItem("token");

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
};

export async function apiGet(path: string) {
    const r = await fetch(BASE + path, {
        headers: getHeaders()
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Request failed');
    return data;
}

export async function apiPost(path: string, body: any) {

    const isFormData = body instanceof FormData;

    const token = localStorage.getItem("token");

    const headers: any = {};

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    if (!isFormData) {
        headers["Content-Type"] = "application/json";
    }

    console.log("TOKEN:", token);
    console.log("HEADERS:", headers);

    const r = await fetch(BASE + path, {
        method: "POST",
        headers,
        body: isFormData
            ? body
            : JSON.stringify(body)
    });

    const data = await r.json();

    if (!r.ok) {
        throw new Error(data.error || "Request failed");
    }

    return data;
}

export async function apiPut(path: string, body: any) {
    const r = await fetch(BASE + path, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(body)
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Request failed');
    return data;
}

export async function apiDelete(path: string) {
    const r = await fetch(BASE + path, {
        method: "DELETE",
        headers: getHeaders()
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Request failed');
    return data;
}

export const apiPutbest = async (url: string, body?: any) => {
    const res = await fetch(`${BASE}${url}`, {
        method: "PUT",
        headers: getHeaders(),
        body: body ? JSON.stringify(body) : undefined
    });

    return res.json();
};