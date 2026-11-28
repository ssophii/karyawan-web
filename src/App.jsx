import { useEffect, useState } from "react";
import { karyawanApi } from "./api";
export default function App() {
    const[items, setItems] = useState([]);
    const[loading, setLoading] = useState(true);
    const[pesan, setPesan] = useState("");
    
    useEffect(() => {
        async function fetchData() {
            try{
                const body = await karyawanApi.list();
                setItems(body.data);
            } catch (error) {
                setPesan(error.message);
            } finally{
                setLoading(false);
            }
        }
        fetchData();
    }, []);
    if (loading) 
        return <p>Memuat...</p> 

    return (
        <div style={{ maxWidth:800, margin:"0 auto", padding:16 }}>
            <h1>Daftar Karyawan</h1>
            {pesan && <p style={{ color: "red" }}>{pesan}</p>}
            <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }} >
                <thead>
                    <tr>
                        <th>Kode</th>
                        <th>Nama</th>
                        <th>Jabatan</th>
                        <th>Divisi</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id}>
                            <td>{item.kode}</td>
                            <td>{item.nama}</td>
                            <td>{item.jabatan}</td>
                            <td>{item.divisi?.nama ?? "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
