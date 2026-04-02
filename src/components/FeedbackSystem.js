import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import '../styles/feedbackSystem.css';
import axios from "../axios/axios";

import { flash } from "react-universal-flash";
import { AuthContext } from '../auth/AuthProvider';
import { formatDate } from '../utils/general';
import Swal from 'sweetalert2';

const getStatusConfig = (isApprove) => {
    if (isApprove === null) return { label: 'Pending', class: 'pending', icon: '⏳' };
    if (isApprove) return { label: 'Approved', class: 'approved', icon: '✅' };
    return { label: 'Rejected', class: 'rejected', icon: '❌' };
};

const FeedbackSystem = ({ show, handleClose }) => {
    const { value } = useContext(AuthContext);

    const [step, setStep] = useState(2);
    const [isImportant, setIsImportant] = useState(false);
    const [complaintText, setComplaintText] = useState('');
    const [loading, setLoading] = useState(false)

    const [listAduanSistem, setListAduanSistem] = useState([])

    const handleNext = () => setStep(2);

    const handleSubmit = async () => {
        if (loading) return
        const now = new Date();
        const day = now.getDay(); 
        const hour = now.getHours();

        if ((day === 0) || (hour < 8) || (hour >= 17)) {
            await Swal.fire({
                title: "Di luar jam operasional IT",
                text: 'IT Standby pukul 08.00 - 17.00 WIB. Jika di luar jam ini respon mungkin sedikit lama, tapi tenang aja-kamu tetap bisa mengirim aduan kapan pun!',
                icon: "info",
                showCancelButton: false,
                confirmButtonColor: "#3085d6",
                confirmButtonText: 'Oke, lanjut..'
            })
        }

        setLoading(true)
        try {
            await axios.post(`/system/feedback-system`, {
                APP_NAME: "END-LINE",
                PICTURE_URL: "",
                BUILDING: value?.siteName,
                LOCATION: value?.lineName,
                BODY: complaintText,
                IS_IMPORTANT: isImportant,
                LEVEL: 0,
                USER_ID: value?.userId
            })

            flash("Feedback kamu udah terkirim \n Tunggu ya... team teknis bakal segera tanganin aduan kamu", 3000, "success")
            handleClose();
            setComplaintText('');
            setIsImportant(false);
            setLoading(false)
        } catch (err) {
            setLoading(false)
            flash(err?.response?.data?.message || "Gagal mengirimkan aduan", 3000, "danger")
        }
    };

    const fetchFeedbackHistory = async () => {
        try {
            const { data } = await axios.post(`/system/feedback-system/history`, {
                USER_ID: value?.userId, APP_NAME: "END-LINE"
            })
            setListAduanSistem(data.data)
        } catch (err) {
            flash(err?.response?.data?.message || "Gagal Melihat Riwaray aduan", 3000, "danger")
        }
    }

    useEffect(() => {
        const firstUi = sessionStorage.getItem("first_log")
        fetchFeedbackHistory()
        setStep(2)
        if (!firstUi) {
            sessionStorage.setItem("first_log", "true")
            setStep(1)
        }
        // eslint-disable-next-line
    }, [])

    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                size="xl"
                centered
                className="aduan-modal-wrapper"
                contentClassName="aduan-modal-content"
            >
                <Modal.Header closeButton className="aduan-modal-header">
                    <Modal.Title className="aduan-modal-title">
                        {step === 1 ? 'Layanan Aduan Sistem' : 'Formulir Aduan Sistem'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="aduan-modal-body">
                    {step === 1 && (
                        <div className="aduan-modal-slide-intro">
                            <div className="aduan-modal-icon-wrapper">
                                🛡️
                            </div>
                            <h3>Aduan Sistem Summit</h3>
                            <p className="text-muted">
                                Gunakan fitur ini untuk <b>melaporkan masalah pada sistem</b>.
                            </p>

                            <ul className="aduan-modal-feature-list">
                                <li className="aduan-modal-feature-item">
                                    <span className="aduan-modal-feature-icon">✔</span>
                                    <strong style={{ width: 170 }}>100% Rahasia</strong> Identitas pelapor dijaga kerahasiaannya
                                </li>
                                <li className="aduan-modal-feature-item">
                                    <span className="aduan-modal-feature-icon">✔</span>
                                    <strong style={{ width: 170 }}>Langsung ke IT</strong> Laporan langsung masuk ke tim teknis inti
                                </li>
                                <li className="aduan-modal-feature-item">
                                    <span className="aduan-modal-feature-icon">✔</span>
                                    <strong style={{ width: 170 }}>Respon Cepat</strong> Prioritas penanganan berdasarkan urgensi
                                </li>
                            </ul>

                            <div className="my-4">
                                <Button variant="primary" size="md" onClick={handleNext} className="px-5">
                                    Buat Aduan Sekarang
                                </Button>
                            </div>
                        </div>
                    )}
                    {step === 2 && (
                        <div className="aduan-modal-form-container" style={{ animation: 'aduan-modal-fade-in 0.5s ease' }}>
                            <Form>
                                <Form.Group className="aduan-modal-form-group" controlId="formComplaint">
                                    <Form.Label>Silakan jelaskan masalah sistem yang kamu alami:</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        className="aduan-modal-textarea"
                                        placeholder="Contoh: Salah tab output untuk sytle ..., tolong di undo qty sekian ..."
                                        value={complaintText}
                                        onChange={(e) => setComplaintText(e.target.value)}
                                    />
                                </Form.Group>
                                <div className='d-flex justify-content-between'>
                                    <div>
                                        <Form.Group className="d-flex align-items-center">
                                            <Form.Switch
                                                id="custom-switch"
                                                size="md"
                                                checked={isImportant}
                                                onChange={(e) => setIsImportant(e.target.checked)}
                                                label={
                                                    <span className="aduan-modal-switch-label">
                                                        {isImportant ? "PENTING / MENDESAK" : "Tandai sebagai Penting"}
                                                    </span>
                                                }
                                            />
                                        </Form.Group>
                                        {isImportant && <small className="text-danger mt-1 d-block">
                                            * Laporan ini akan diprioritaskan oleh tim IT.
                                        </small>}
                                    </div>
                                    <div>
                                        <Button variant="primary" size='sm' onClick={handleSubmit} disabled={!complaintText}>
                                            {loading ? 'Loading' : 'Kirim aduan'}
                                        </Button>
                                    </div>
                                </div>
                            </Form>

                            <div className="history-list my-3">
                                {!listAduanSistem.length && <div className="history-list">
                                    <div className="empty-state">
                                        <div className="empty-state-icon">📭</div>
                                        <p className="mb-0">Wah, Kayaknya semua lagi berjalan mulus nih! 🎉</p>
                                        <small>List aduan bakal muncul di sini, terus kamu juga bisa lihat <b>respon dari tim teknis</b> langsung loh</small>
                                    </div></div>}
                                {listAduanSistem.map((item, index) => {
                                    const status = getStatusConfig(item.IS_APPROVE);

                                    return (
                                        <div
                                            key={item.ID || index}
                                            className={`history-item ${status.class}`}
                                            role="button"
                                            tabIndex={0}
                                        >

                                            <div className="history-header">
                                                <div className="history-meta">
                                                    <span>🕐 {formatDate(item.CREATED_AT)}</span>
                                                </div>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className={`status-badge ${status.class}`}>
                                                        {status.icon} {status.label}
                                                    </div>

                                                    {item.IS_IMPORTANT && (
                                                        <span className="important-flag">
                                                            ⚠️ Important
                                                        </span>
                                                    )}
                                                </div>

                                            </div>
                                            <div className="history-body">
                                                <p title={item.BODY} style={{ whiteSpace: 'pre-wrap' }}>{item.BODY}</p>
                                            </div>
                                            {item.IS_APPROVE !== null ? (
                                                <div className="history-footer">
                                                    {item.RESPONSE_FEEDBACK && (
                                                        <span className="feedback-preview" title={item.RESPONSE_FEEDBACK} style={{ whiteSpace: 'pre-wrap' }}>{item.RESPONSE_FEEDBACK}</span>
                                                    )}
                                                    <div className='history-header'>
                                                        <div className="response-info">
                                                            <span>Responded by: </span>
                                                            <span className="responder">
                                                                IT | {item.RESPONSE_USER?.USER_INISIAL || `User ${item.RESPONSE_USER_ID}`}
                                                            </span>
                                                        </div>
                                                        <div className="history-meta">
                                                            <span>🕐 {formatDate(item.RESPONSE_AT)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : <div className="history-footer"><div className="response-info"> <i>Menunggu tim teknis memberikan response</i></div></div>}
                                        </div>
                                    );
                                })}
                                {!!listAduanSistem.length && <span style={{fontSize: 12, fontStyle: 'italic', color: 'red'}}>*Aduan yang tampil cuman sampai minggu kemarin</span>}
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default FeedbackSystem;