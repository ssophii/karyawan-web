import { useEffect, useState } from "react";
import { karyawanApi } from "./api";
import { divisiApi } from "./api";

const initialState = {
    kode:"",
    nama:"",    
    jabatan:"",
    divisi_id:"",
};

export default function App() {
    const[items, setItems] = useState([]);
    const[divisi, setDivisi] = useState([]);
    const[form, setForm] = useState(initialState);
    const[editId, setEditId] = useState(null);
    const[errors, setErrors] = useState({});
    const[loading, setLoading] = useState(true);
    const[pesan, setPesan] = useState("");
    
    async function fetchData() {
        try{
            setLoading(true);
            const body = await karyawanApi.list();
            setItems(body.data);
        } catch (error) {
            setPesan(error.message);
        } finally{
            setLoading(false);
        }
    }
    // fetchData();
    

    useEffect(() => {
        fetchData();
        divisiApi.list().then((body) => setDivisi(body.data)).catch((error) => setPesan(error.message));
    }, []);

    const onChange = (error) => {
        setForm({ ...form, [error.target.name]: error.target.value });
    }

    async function onSubmit(e) {
        e.preventDefault();
        setErrors({});
        setPesan("");
        try {
            if (editId) { await karyawanApi.update(editId, form); }
            else { await karyawanApi.create(form); }
            setForm(initialState);
            setEditId(null);
            await fetchData();
        } catch (error) {
            if (error.status === 422) {
                setErrors(error.errors);
            } else {
                setPesan(error.message);
            }
        }
    }

    function onEdit(item) {
        setEditId(item.id);
        setForm({kode:item.kode, nama:item.nama, jabatan:item.jabatan, divisi_id:item.divisi?.id ?? ""});
    }

    async function onDelete(id) {
        if (!window.confirm("Apakah anda yakin?")) return;

        try {
            await karyawanApi.remove(id);
            await fetchData();
        } catch (error) {
            setPesan(error.message);
        }
    }

    return (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: 16 }}>
            <h1>Data Karyawan</h1>
            {pesan && <p style={{ color: "red" }}>{pesan}</p>}

            <form onSubmit={onSubmit} style={{ marginBottom: 16 }}>
                {["kode", "nama", "jabatan"].map((field) => (
                    <div key={field} style={{ marginBottom: 6 }}>
                        <input
                            name={field}
                            placeholder={field}
                            value={form[field]}
                            onChange={onChange}
                        />
                        {errors[field] && (
                            <small style={{ color: "red" }}> {errors[field][0]}</small>
                        )}
                    </div>
                ))}

                <div style={{ marginBottom: 6 }}>
                    <select name="divisi_id" value={form.divisi_id} onChange={onChange}>
                        <option value="">-- tanpa divisi --</option>
                        {divisi.map((d) => (
                            <option key={d.id} value={d.id}>{d.nama}</option>
                        ))}
                    </select>
                    {errors.divisi_id && (
                        <small style={{ color: "red" }}> {errors.divisi_id[0]}</small>
                    )}
                </div>

                <button type="submit">{editId ? "Simpan Perubahan" : "Tambah"}</button>
                {editId && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditId(null);
                            setForm(initialState);
                            setErrors({});
                        }}
                    >
                        Batal
                    </button>
                )}
            </form>

            {loading ? (
                <p>Memuat...</p>
            ) : (
                <table
                    border="1"
                    cellPadding="8"
                    cellSpacing="0"
                    style={{ width: "100%", borderCollapse: "collapse" }}
                >
                    <thead>
                        <tr>
                            <th>Kode</th>
                            <th>Nama</th>
                            <th>Jabatan</th>
                            <th>Divisi</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td>{item.kode}</td>
                                <td>{item.nama}</td>
                                <td>{item.jabatan}</td>
                                <td>{item.divisi?.nama ?? "-"}</td>
                                <td>
                                    <button onClick={() => onEdit(item)}>Edit</button>
                                    <button onClick={() => onDelete(item.id)}>Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
