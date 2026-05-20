import { FormEvent, useEffect, useState } from "react";
import { createTable, getTableQrCode, getTables } from "../../services/adminService";
import { TableItem, TableQrCode } from "../../types/api";

export default function AdminTablesPage() {
  const [tables, setTables] = useState<TableItem[]>([]);
  const [codigo, setCodigo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [qrCode, setQrCode] = useState<TableQrCode | null>(null);

  async function load() {
    setTables(await getTables());
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await createTable({ barId: 1, codigo, descricao });
    setCodigo("");
    setDescricao("");
    await load();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <form className="glass-panel space-y-4 p-5" onSubmit={onSubmit}>
        <h2 className="font-display text-2xl font-semibold">Nova mesa</h2>
        <input className="input" placeholder="Codigo" value={codigo} onChange={(event) => setCodigo(event.target.value)} />
        <input
          className="input"
          placeholder="Descricao"
          value={descricao}
          onChange={(event) => setDescricao(event.target.value)}
        />
        <button className="btn-primary" type="submit">Criar mesa</button>
      </form>
      <div className="grid gap-4 md:grid-cols-2">
        {tables.map((table) => (
          <div key={table.id} className="glass-panel p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-white/45">{table.codigo}</p>
            <h3 className="mt-2 font-display text-2xl font-semibold">{table.descricao}</h3>
            <p className="mt-2 break-all text-sm text-white/60">{table.qrCodeUrl}</p>
            <button className="btn-secondary mt-4" type="button" onClick={() => getTableQrCode(table.id).then(setQrCode)}>
              Ver QR Code
            </button>
          </div>
        ))}
      </div>
      {qrCode && (
        <div className="glass-panel lg:col-span-2 p-5">
          <h3 className="font-display text-2xl font-semibold">QR Code {qrCode.codigo}</h3>
          <div className="mt-4 flex flex-col items-start gap-4 md:flex-row md:items-center">
            <img alt={`QR ${qrCode.codigo}`} className="w-56 rounded-3xl bg-white p-3" src={qrCode.qrCodeDataUrl} />
            <p className="max-w-lg break-all text-sm text-white/65">{qrCode.targetUrl}</p>
          </div>
        </div>
      )}
    </div>
  );
}
