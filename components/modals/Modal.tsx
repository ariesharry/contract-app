"use client";

import { useCallback, useEffect, useState } from "react";
import Button from "../shared/Button";
import { cn } from "@/utils/utils";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  actionLabel: string;
  actionColor?: string;
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  footer,
  actionLabel,
  actionColor,
  disabled,
  secondaryAction,
  secondaryActionLabel,
}) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (disabled) {
      return;
    }

    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [disabled, onClose]);

  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }

    onSubmit();
  }, [disabled, onSubmit]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        onClick={handleClose}
        className="fixed inset-0 z-50 flex items-center justify-center px-6 overflow-x-hidden overflow-y-auto outline-none overlay focus:outline-none bg-black/50"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full mx-auto my-6 sm:w-[480px] lg:h-auto md:h-auto"
        >
          {/* CONTENT */}
          <form
            className={cn(
              "translate duration-300 flex flex-col w-full h-full p-8 rounded-lg outline-none sm:p-12 bg-modal shadow-modalShadow lg:h-auto md:h-auto focus:outline-none",
              showModal
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0"
            )}
          >
            {/* HEADER */}
            <div className="text-xl font-bold sm:text-2xl text-primary">
              {title}
            </div>
            {/* BODY */}
            <div className="pt-3 pb-4">{body}</div>
            {/* FOOTER */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-row items-center justify-end w-full gap-2">
                {secondaryAction && secondaryActionLabel && (
                  <Button
                    disabled={disabled}
                    color="grey"
                    label={secondaryActionLabel}
                    onClick={secondaryAction}
                  />
                )}
                <Button
                  disabled={disabled}
                  color={actionColor === "red" ? "red" : "purple"}
                  label={actionLabel}
                  onClick={handleSubmit}
                />
              </div>
              {footer}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Modal;
