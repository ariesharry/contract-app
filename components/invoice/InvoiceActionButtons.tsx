"use client";

import Button from "../shared/Button";

import { useAppDispatch, useInvoice } from "@/libs/redux/hooks";
import { onEdit, updateStatus } from "@/libs/redux/features/invoice-slice";
import { useRouter } from "next/navigation";
import { unwrapResult } from "@reduxjs/toolkit";
import { SafeInvoice } from "@/types";
import {
  onOpen,
  setInvoiceId,
} from "@/libs/redux/features/modals/delete-modal-slice";
import { useCallback } from "react";

interface InvoiceActionButtonsProps {
  invoice: SafeInvoice;
  status: string;
}

const InvoiceActionButtons: React.FC<InvoiceActionButtonsProps> = ({
  invoice,
  status,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isLoading] = useInvoice();

  const handleEdit = () => {
    dispatch(onEdit(invoice));
  };

  const handleDeleteModal = useCallback(() => {
    dispatch(setInvoiceId(invoice.id));
    dispatch(onOpen());
  }, [dispatch, invoice.id]);

  const handleStatusUpdate = useCallback(() => {
    // Dispatch with both invoiceId and the current status (either ACTIVE or REJECTED)
    dispatch(updateStatus({ invoiceId: invoice.id, status: "ACTIVE" }))
      .then(unwrapResult)
      .then(() => {
        router.refresh();
      })
      .catch((error) => {
        console.error("Failed to update status:", error);
      });
  }, [dispatch, invoice.id, router]);

  console.log("Role sekarang:", invoice.currentRole);

  const handleStatusReject = useCallback(() => {
    // Dispatch with both invoiceId and the current status (either ACTIVE or REJECTED)
    dispatch(updateStatus({ invoiceId: invoice.id, status: "REJECTED" }))
      .then(unwrapResult)
      .then(() => {
        router.refresh();
      })
      .catch((error) => {
        console.error("Failed to update status:", error);
      });
  }, [dispatch, invoice.id, router]);

  return (
    <>
      <Button
        onClick={handleEdit}
        disabled={isLoading}
        color="grey"
        label="Edit"
      />
      <Button
        onClick={invoice.currentRole !=="Mudharib" ? handleStatusReject : handleDeleteModal}
        disabled={isLoading}
        color="red"
        label={invoice.currentRole !=="Mudharib" ? "Reject" : "Delete"}
      />

      <Button
        onClick={handleStatusUpdate}
        disabled={isLoading || status === "paid"}
        color="purple"
        label="Accept"
      />
    </>
  );
};

export default InvoiceActionButtons;
