import { FC, ReactNode, useState } from 'react';
import { toast } from 'react-toastify';
import './Modal.scss';
import { useDisableScroll } from '../../../hooks/useDisableScroll';

type ModalProps = {
  title?: string;
  children: ReactNode;
  maxWidth?: string;
  className?: string;
  closeClick: () => void;
  wrapperClassName?: string;
  closeOutside?: boolean;
};

const Modal: FC<ModalProps> = ({
  title = '',
  children,
  maxWidth,
  closeClick,
  className,
  wrapperClassName,
  closeOutside,
}) => {
  useDisableScroll();

  const handleClose = () => {
    closeClick();
  };

  const handleAdjustClick = (e) => {
    closeOutside && e.stopPropagation();
  };

  const handleCloseOutside = () => {
    closeOutside && handleClose();
  };

  return (
    <div
      className={`modal ${wrapperClassName ?? ''}`}
      onClick={handleCloseOutside}
    >
      <div
        className={`modal__container ${className}`}
        style={{ maxWidth: maxWidth || '1018px' }}
        onClick={handleAdjustClick}
      >
        <div className="modal__header">
          <h2>{title}</h2>
          <div
            className="close-btn"
            onClick={() => {
              toast.dismiss();
              handleClose();
            }}
          >
            X
          </div>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
