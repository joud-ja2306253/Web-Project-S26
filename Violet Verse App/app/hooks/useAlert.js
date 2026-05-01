// app/hooks/useAlert.js
'use client';
import { useState } from 'react';
import Alert from '../components/Alert';

export function useAlert() {
  const [alert, setAlert] = useState({ show: false, message: '', type: 'info', callback: null });
  const [confirm, setConfirm] = useState({ show: false, message: '', onConfirm: null });

  const showAlert = (message, type = 'info', callback = null) => {
    setAlert({ show: true, message, type, callback });
  };

  const closeAlert = () => {
    if (alert.callback) {
      alert.callback();
    }
    setAlert({ show: false, message: '', type: 'info', callback: null });
  };

  const showConfirm = (message, onConfirm) => {
    setConfirm({ show: true, message, onConfirm });
  };

  const AlertComponent = () => (
    <>
      {alert.show && (
        <Alert 
          message={alert.message} 
          type={alert.type} 
          onConfirm={closeAlert}
          onCancel={closeAlert}
        />
      )}
      {confirm.show && (
        <Alert 
          message={confirm.message} 
          type="warning" 
          isConfirm={true}
          onConfirm={() => {
            setConfirm({ show: false, message: '', onConfirm: null });
            confirm.onConfirm();
          }}
          onCancel={() => setConfirm({ show: false, message: '', onConfirm: null })}
        />
      )}
    </>
  );

  return { showAlert, showConfirm, AlertComponent };
}