'use client';
import { useState, useCallback } from 'react';
import Alert from '../components/Alert';

export function useAlert() {
  const [alert, setAlert] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const showAlert = useCallback((message, type = 'info', callback = null) => {
    setAlert({ message, type, callback });
  }, []);

  const showConfirm = useCallback((message, onConfirm) => {
    setConfirm({ message, onConfirm, isLogout: false });
  }, []);

  const showLogoutConfirm = useCallback((message, onConfirm) => {
    setConfirm({ message, onConfirm, isLogout: true });
  }, []);

  const closeAlert = useCallback(() => {
    if (alert?.callback) {
      alert.callback();
    }
    setAlert(null);
  }, [alert]);

  const AlertComponent = () => (
    <>
      {alert && (
        <Alert 
          message={alert.message} 
          type={alert.type} 
          onConfirm={closeAlert}
          onCancel={closeAlert}
        />
      )}
      {confirm && (
        <Alert 
          message={confirm.message} 
          type="warning" 
          isConfirm={true}
          isLogout={confirm.isLogout}
          onConfirm={() => {
            confirm.onConfirm();
            setConfirm(null);
          }}
          onCancel={() => setConfirm(null)}
        />
      )}
    </>
  );

  return { showAlert, showConfirm, showLogoutConfirm, AlertComponent };
}