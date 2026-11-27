const Base = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";

async function request(path, options = {}) {
    const res = await fetch(`${Base}${path}`,{
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        ...options,
    });

    if (res.status === 204) return null;

    const body = await res.json();
    if (!res.ok) {
        const err = new Error(body.message || "Request failed");
        err.status = res.status;
        err.error = body.errors;
        throw err;
    }
    return body;
}

export const karyawanApi = {
    list: ({ page = 1, cari = ""}={}) => request(`/karyawan?${new URLSearchParams({ page, cari })}`),
    create: (data) => request(`/karyawan`, { method: "POST", body: JSON.stringify(data) }),
    update: (id, data) => request(`/karyawan/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    remove: (id) => request(`/karyawan/${id}`, { method: "DELETE" }),
}

export const divisiApi = {
    list: () => request(`/divisi`), 
}