import { useEffect } from "react";
import { karyawanApi } from "./api";
export default function App() {
 useEffect(() => {
 karyawanApi.list().then((b) => console.log(b)).catch((e) => console.log("ERR", e));
 }, []);
 return <h1>Karyawan</h1>;
}
