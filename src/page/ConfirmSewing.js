import React, { useContext, useEffect, useRef, useState } from 'react';
import { Alert, Button, Card, Table, Form } from 'react-bootstrap';
import { MdCheck } from 'react-icons/md';
import { QcEndlineContex } from '../provider/QcEndProvider';
import axios from '../axios/axios';

const columns = [
  ['SCH_ID', 'SCH ID'], ['SCHD_ID', 'SCAN SCHD ID'],
  ['BUNDLE_SEQUENCE', 'BOX NO'], ['SCAN_DATE', 'SCAN IN DATE'],
  ['SCHEDULE_DATE', 'SCHEDULE DATE'],
  ['BARCODE_SERIAL', 'QR SERIAL'], ['ORDER_NO', 'ORDER NO'],
  ['ORDER_REFERENCE_PO_NO', 'ORDER REF NO'], ['BUYER_CODE', 'BUYER'],
  ['MO_NO', 'MO NO'], ['ORDER_COLOR', 'COLOR'],
  ['ORDER_SIZE', 'SIZE'], ['ORDER_QTY', 'QTY'],
];
const filterData = (data, filters) => data.filter((row) =>
  Object.entries(filters).every(([key, value]) =>
    String(row[key] ?? '').toLowerCase().includes(value.trim().toLowerCase())));
const totalQty = (rows, key = 'ORDER_QTY') => rows.reduce((total, row) => total + (Number(row[key]) || 0), 0);
const formatNumber = (value) => value.toLocaleString('id-ID');
const errorMessage = (error) => error.response?.data?.message || error.message || 'Terjadi kesalahan';

const ConfirmSewing = () => {
  const { state, siteName, lineName, userId } = useContext(QcEndlineContex);
  const [query, setQuery] = useState({});
  const [sewingInLoading, setSewingInLoading] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [notice, setNotice] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [loadedScope, setLoadedScope] = useState('');
  const requestVersion = useRef(0);
  const submitLock = useRef(false);
  const selectAllRef = useRef(null);
  const scope = JSON.stringify([state.schDate, siteName, lineName]);
  const currentScope = useRef(scope);
  currentScope.current = scope;

  useEffect(() => {
    const version = ++requestVersion.current;
    let active = true;
    setSelected([]);
    setSewingInLoading([]);
    setLoadedScope('');
    setLoading(false);
    if (!state.schDate || !siteName || !lineName) return;
    const getListSewingInConfirm = async () => {
      setLoading(true);
      try {
        const path = [state.schDate, siteName, lineName].map(encodeURIComponent).join('/');
        const res = await axios.get(`/qc-endline/qr-sewing-in-confirm/${path}`);
        if (res.data.success === false || !Array.isArray(res.data.data)) throw new Error(res.data.message || 'Respons daftar barcode tidak valid');
        if (!active || version !== requestVersion.current) return;
        setSewingInLoading(res.data.data);
        setLoadedScope(scope);
      } catch (error) {
        if (active && version === requestVersion.current) setNotice({ variant: 'danger', text: errorMessage(error) });
      } finally {
        if (active && version === requestVersion.current) setLoading(false);
      }
    };
    getListSewingInConfirm();
    return () => { active = false; };
  }, [state.schDate, siteName, lineName, refresh, scope]);

  const filteredData = filterData(sewingInLoading, query);
  const visibleSerials = [...new Set(filteredData.map((row) => row.BARCODE_SERIAL))];
  const selectedRows = filteredData.filter((row) => selected.includes(row.BARCODE_SERIAL));
  const selectedSerials = visibleSerials.filter((serial) => selected.includes(serial));
  const allSelected = visibleSerials.length > 0 && selectedSerials.length === visibleSerials.length;
  const busy = loading || confirming || loadedScope !== scope;
  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = selectedSerials.length > 0 && !allSelected;
  }, [selectedSerials.length, allSelected]);

  const handleFilter = (value, key) => {
    setQuery((previous) => ({ ...previous, [key]: value }));
    setSelected([]);
  };
  const toggleRow = (serial) => setSelected((previous) => previous.includes(serial)
    ? previous.filter((value) => value !== serial) : [...previous, serial]);

  const confirmRows = async (serials) => {
    if (submitLock.current || busy || !userId || serials.length === 0) return;
    submitLock.current = true;
    setConfirming(true);
    setNotice(null);
    const operationScope = scope;
    const confirmed = [];
    const failures = [];
    try {
      for (const serial of [...new Set(serials)]) {
        try {
          const res = await axios.post('/qc-endline/qr-sewing-in-confirm/', { BARCODE_SERIAL: serial, USER_ID: userId });
          if (res.data.success !== true) throw new Error(res.data.message || 'Konfirmasi gagal');
          confirmed.push(serial);
        } catch (error) {
          failures.push(`${serial}: ${errorMessage(error)}`);
        }
      }
      if (currentScope.current === operationScope) {
        setSewingInLoading((previous) => previous.filter((row) => !confirmed.includes(row.BARCODE_SERIAL)));
        setSelected((previous) => previous.filter((serial) => !confirmed.includes(serial)));
        setNotice({ variant: failures.length ? 'warning' : 'success', text: `${confirmed.length} barcode berhasil dikonfirmasi.${failures.length ? ` ${failures.length} gagal. ${failures.join('; ')}` : ''}` });
      }
    } finally {
      submitLock.current = false;
      setConfirming(false);
    }
  };

  return (
    <div className="mt-5 pt-3 mx-3">
      <div className="fw-bold fs-5 mb-2 text-center text-dark">Confirm Sewing IN</div>
      <div className="mb-2">Schedule: {state.schDate} | Site: {siteName} | Line: {lineName}</div>
      {notice && <Alert variant={notice.variant} dismissible onClose={() => setNotice(null)} style={{ whiteSpace: 'pre-wrap' }}>{notice.text}</Alert>}
      {!userId && <Alert variant="warning">User belum tersedia. Silakan login untuk konfirmasi.</Alert>}
      <Card><Card.Body>
        <div className="d-flex gap-2 mb-3 align-items-center flex-wrap">
          <Button size="sm" disabled={busy || !userId || !selectedSerials.length} onClick={() => confirmRows(selectedSerials)}>
            <MdCheck /> {confirming ? 'Mengkonfirmasi...' : `Confirm Selected (${selectedSerials.length})`}
          </Button>
          <Button size="sm" variant="outline-secondary" disabled={loading || confirming} onClick={() => { setNotice(null); setRefresh((previous) => previous + 1); }}>Refresh</Button>
          <Button size="sm" variant="outline-secondary" disabled={busy} onClick={() => { setQuery({}); setSelected([]); }}>Reset Filter</Button>
          <small className="text-muted">Pilih semua hanya berlaku untuk hasil filter.</small>
        </div>
        <div style={{ maxHeight: '70vh', overflow: 'auto' }}>
          <Table size="sm" bordered hover className="tbl-qc-detail">
            <thead>
              <tr className="table-light text-center">
                <th><input ref={selectAllRef} type="checkbox" aria-label="Pilih semua barcode hasil filter" checked={allSelected} disabled={busy || !visibleSerials.length} onChange={() => setSelected(allSelected ? [] : visibleSerials)} /></th>
                {columns.map(([key, label]) => <th key={key}>{label}</th>)}<th>CONFIRM</th>
              </tr>
              <tr className="table-light"><th />{columns.map(([key, label]) => <th key={key}>
                <Form.Control size="sm" type="text" aria-label={`Filter ${label}`} value={query[key] || ''} disabled={confirming} onChange={(event) => handleFilter(event.target.value, key)} style={{ minWidth: 75 }} />
              </th>)}<th /></tr>
            </thead>
            <tbody className="align-middle">
              {!loading && filteredData.map((bdl, index) => <tr key={`${bdl.BARCODE_SERIAL}-${index}`} className="text-center">
                <td><input type="checkbox" aria-label={`Pilih ${bdl.BARCODE_SERIAL}`} checked={selected.includes(bdl.BARCODE_SERIAL)} disabled={busy} onChange={() => toggleRow(bdl.BARCODE_SERIAL)} /></td>
                {columns.map(([key]) => <td key={key}>{bdl[key] ?? '-'}</td>)}
                <td><Button size="sm" aria-label={`Confirm ${bdl.BARCODE_SERIAL}`} disabled={busy || !userId} onClick={() => confirmRows([bdl.BARCODE_SERIAL])}><MdCheck size={16} /></Button></td>
              </tr>)}
              {(loading || !filteredData.length) && <tr><td colSpan={columns.length + 2} className="text-center fst-italic">{loading ? 'Memuat barcode...' : 'Tidak ada barcode untuk dikonfirmasi sesuai filter'}</td></tr>}
            </tbody>
          </Table>
        </div>
        <div className="mt-2 fw-bold">Count: {visibleSerials.length} | Total Order Qty: {formatNumber(totalQty(filteredData))}</div>
        <div>Selected: {selectedSerials.length} | Selected Order Qty: {formatNumber(totalQty(selectedRows))}</div>
        <small className="text-muted">Total seluruh barcode: {new Set(sewingInLoading.map((row) => row.BARCODE_SERIAL)).size} | Total Order Qty: {formatNumber(totalQty(sewingInLoading))}</small>
      </Card.Body></Card>
    </div>
  );
};

export default ConfirmSewing;
