'use client';

import { useState, useEffect } from 'react';
import styles from './privacyPolicy.module.css';

interface PrivacyPolicyProps {
  isOpen?: boolean;
  onClose?: () => void;
  onAccept?: () => void;
}

export default function PrivacyPolicy({ isOpen = false, onClose, onAccept }: PrivacyPolicyProps) {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  const handleAccept = () => {
    localStorage.setItem('privacyPolicyAccepted', 'true');
    setIsVisible(false);
    if (onAccept) {
      onAccept();
    }
    if (onClose) {
      onClose();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.header}>
          <h2 className={styles.title}>Privacy Policy</h2>
          <button 
            className={styles.closeButton} 
            onClick={handleClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Information We Collect</h3>
            <p className={styles.sectionText}>
              We collect personal information such as your name, email address, 
              and phone number when you create an account or make a booking. 
              We also collect usage data to improve our services.
            </p>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>How We Use Your Information</h3>
            <p className={styles.sectionText}>
              Your information is used to provide and improve our services, 
              process your bookings, communicate with you about your reservations, 
              and send you relevant updates and promotional materials.
            </p>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Data Protection</h3>
            <p className={styles.sectionText}>
              We implement appropriate security measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or 
              destruction. Your data is stored securely and only accessible by 
              authorized personnel.
            </p>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Third-Party Sharing</h3>
            <p className={styles.sectionText}>
              We do not sell, trade, or otherwise transfer your personal information 
              to outside parties. We may share information with trusted third parties 
              who assist us in operating our website, conducting our business, or 
              servicing you, as long as those parties agree to keep this information 
              confidential.
            </p>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Your Rights</h3>
            <p className={styles.sectionText}>
              You have the right to access, correct, or delete your personal information. 
              You may also opt-out of receiving promotional communications at any time 
              by contacting us or using the unsubscribe link in our emails.
            </p>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Contact Us</h3>
            <p className={styles.sectionText}>
              If you have any questions about this Privacy Policy, please contact us 
              at support@tungtung.com or through our customer service channels.
            </p>
          </div>
        </div>

        <button className={styles.acceptButton} onClick={handleAccept}>
          I Accept
        </button>
      </div>
    </div>
  );
}