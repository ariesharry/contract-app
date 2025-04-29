"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  FieldValues,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { ProfitRecord, Status } from "@prisma/client";
import toast from "react-hot-toast";

import Input from "../../inputs/Input";
import CountrySelect from "../../inputs/CountrySelect";
import Select from "../../inputs/Select";
import DatePickerInput from "../../inputs/DatePicker";
import Button from "../../shared/Button";
import ItemList from "./ItemList";
import ItemListItem from "./ItemListItem";

import { useAppDispatch, useInvoice } from "@/libs/redux/hooks";
import {
  createInvoice,
  onClose,
  updateInvoice,
} from "@/libs/redux/features/invoice-slice";

import useCountries from "@/hooks/useCountries";
import emailValidationPattern from "@/helpers/emailValidationPattern";
import getShortId from "@/helpers/getShortId";

import { TERM_VALUES } from "@/enums";
import { cn } from "@/utils/utils";

import { useRef } from "react";

interface CurrentUser {
  id: string;
  name: string;
  email: string;
}

const InvoiceModal = ({ currentUser }: { currentUser: CurrentUser }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [isOpen, isLoading, isEditing, invoiceToEdit] = useInvoice();
  const [showModal, setShowModal] = useState(isOpen);
  const { getByValue } = useCountries();

  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      managerId: currentUser?.name || "",
      emailMudharib: currentUser?.email || "",
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    name: "items",
    control,
  });

  const countryFrom = watch("countryFrom");
  const countryTo = watch("countryTo");
  const investorId = watch("investorId");
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setIsUploading(true);
  
    if (file) {
      try {
        // Periksa apakah file adalah PDF
        if (!file.name.endsWith('.pdf')) {
          toast.error("Only PDF files are allowed.");
          setIsUploading(false);
          return;
        }
  
        // Membuat FormData untuk mengirim file
        const formData = new FormData();
        formData.append("file", file);
        formData.append("file-name", file.name); // Pastikan file name dikirimkan di sini
  
        // Kirim permintaan ke server
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
  
        // Menangani response dari server
        const data = await response.json();
  
        if (!response.ok) {
          console.error('Error response from server:', data);
          throw new Error("Failed to upload file");
        }
  
        const fileUrl = data.name;
        console.log("File URL from server:", data.name); // Debug log
        setUploadedFileUrl(fileUrl);
        setValue("contractFileUrl", fileUrl);
        toast.success("File uploaded successfully");
      } catch (error) {
        console.error('Upload failed:', error);
        toast.error("Failed to upload file");
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Render logic
  useEffect(() => {
    console.log("Uploaded file URL changed:", uploadedFileUrl); // Confirm state update
  }, [uploadedFileUrl]);

  // Fill fields when in Editing Mode, Reset fields otherwise
  useEffect(() => {
    if (isEditing && invoiceToEdit) {
      const items = invoiceToEdit.items.map((item: ProfitRecord) => {
        return {
          name: item.contractId,
          quantity: item.profitAmount,
          price: item.investorShare,
          total: item.managerShare,
        };
      });
      // const paymentTerm = invoiceToEdit["paymentTerm"] as PaymentTerm;

      for (const key in invoiceToEdit) {
        if (key === "startDate") {
          setCustomValue(key, new Date(invoiceToEdit[key]));
        } else if (key === "investmentAmount") {
          setCustomValue(key, getByValue(invoiceToEdit["investmentAmount"]));
        } else if (key === "profitSharingRatio") {
          setCustomValue(key, getByValue(invoiceToEdit["profitSharingRatio"]));
        } else {
          setCustomValue(key, invoiceToEdit[key]);
        }
      }
    } else {
      reset();
    }
  }, [isEditing, invoiceToEdit]);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setShowModal(false);
    setTimeout(() => {
      reset();
      dispatch(onClose());
    }, 300);
  }, [onClose]);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (data.investorId.length === 0) {
      toast.error("You need to choose Shahibul Mal!");
    } else {
      dispatch(createInvoice(data))
        .then(unwrapResult)
        .then(() => {
          router.refresh();
          reset();
        });
    }
  };

  const onDraftSubmit: SubmitHandler<FieldValues> = (data) => {
    if (data.items.length === 0) {
      toast.error("You need to add at least 1 item!");
    } else {
      dispatch(createInvoice({ ...data, status: Status.CREATED }))
        .then(unwrapResult)
        .then(() => {
          router.refresh();
          reset();
        });
    }
  };

  const onEditSubmit: SubmitHandler<FieldValues> = (data) => {
    if (data.items.length === 0) {
      toast.error("You need to add at least 1 item!");
    } else {
      dispatch(updateInvoice({ ...data, status: Status.CREATED,invoiceId: invoiceToEdit.id }))
        .then(unwrapResult)
        .then(() => {
          router.refresh();
          reset();
        });
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        onClick={handleClose}
        className="fixed inset-0 z-20 flex items-center justify-center h-screen px-6 outline-none overlay focus:outline-none bg-black/50"
      >
        <form
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "translate duration-300 flex flex-col justify-between h-full overflow-y-hidden absolute left-0 top-0 w-full sm:w-[620px] md:w-[720px] p-6 pr-2 pb-0 pt-[98px] sm:p-14 sm:pr-8 sm:pb-0 sm:pt-[128px] md:pl-[140px] md:pt-14 z-50 bg-[#FFFFFF] dark:bg-[#141625] sm:rounded-tr-[20px] sm:rounded-br-[20px]",
            showModal
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0"
          )}
        >
          <h2 className="pb-6 text-2xl font-semibold sm:pb-12 text-primary">
            {isEditing
              ? `Edit #${getShortId(invoiceToEdit.id)}`
              : "New Contract"}
          </h2>
          {/* Bill from */}
          <div className="flex flex-col gap-12 pr-4 overflow-y-auto sm:pr-6">
            <div className="flex flex-col gap-6">
              <h3 className="text-xs font-bold text-[#7C5DFA]">Mudharib</h3>
              <Input
                id="managerId"
                label="Name"
                register={register}
                errors={errors}
                required
              />
              <Input
                id="emailMudharib"
                label="Email"
                register={register}
                errors={errors}
                required
              />
    
            </div>
            <div className="flex flex-col gap-6">
              <h3 className="text-xs font-bold text-[#7C5DFA]">Shahibul Mal</h3>
              <Select
                id="investorId"
                label="Name"
                value={investorId}
                register={register}
                onChange={(value) => setCustomValue("investorId", value)}
                errors={errors}
              />
              {/* <Input
                id="emailShahibulMal"
                label="Email"
                register={register}
                errors={errors}
                required
              /> */}
              
            </div>
            {/* Bill to */}
            <div className="flex flex-col gap-6">
              <h3 className="text-xs font-bold text-[#7C5DFA]">Mudharabah Details</h3>
              <Input
                id="name"
                label="Project Name"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
              />
              <div className="flex flex-col gap-6">
                <Input
                  id="description"
                  label="Project Description"
                  disabled={isLoading}
                  register={register}
                  errors={errors}
                  required
                />
                <div className="grid gap-2 sm:grid-cols-2">
                  <DatePickerInput
                    id="startDate"
                    label="Start Date"
                    value={startDate}
                    register={register}
                    onChange={(value) => setCustomValue("startDate", value)}
                    errors={errors}
                  />
                  <DatePickerInput
                    id="endDate"
                    label="End Date"
                    value={endDate}
                    register={register}
                    onChange={(value) => setCustomValue("endDate", value)}
                    errors={errors}
                  />
                </div>
              </div>
              <Input
                id="investmentAmount"
                label="Amount"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
              />
              <Input
                id="profitSharingRatio"
                label="Profit Sharing Ratio"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
              />
            </div>
            <div className="flex flex-col gap-4">
              {uploadedFileUrl ? (
                <Button
                  label={isUploading ? "Uploading..." : uploadedFileUrl || "Uploaded Document"}
                  stretch
                  color="purple"
                  onClick={() => window.open("/uploads/"+uploadedFileUrl, "_blank")}
                  disabled={isUploading}
                />
              ) : (
                <Button
                  label={isUploading ? "Uploading..." : "+ Upload Document"}
                  stretch
                  color="purple"
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  disabled={isUploading}
                />
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf"
              />
              {isUploading && (
                <p className="text-sm text-gray-600 animate-pulse">Uploading your file...</p>
              )}

            </div>
          </div>
          {/* Form buttons */}
          <div
            className={`flex py-6 pl-0 pr-5 gap-2
                        ${isEditing ? "justify-end" : "justify-between"}`}
          >
            <Button
              disabled={isLoading}
              onClick={handleClose}
              label={isEditing ? "Cancel" : "Discard"}
            />
            <div className="flex gap-2">
              {!isEditing && (
                <Button
                  disabled={isLoading}
                  color="darkGrey"
                  label="Save as Draft"
                  onClick={handleSubmit(onDraftSubmit)}
                />
              )}
              <Button
                disabled={isLoading}
                color="purple"
                label={isLoading ? "Save changes" : "Save & Send"}
                onClick={
                  isEditing
                    ? handleSubmit(onEditSubmit)
                    : handleSubmit(onSubmit)
                }
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default InvoiceModal;
