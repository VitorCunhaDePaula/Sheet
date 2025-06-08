"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import {
  X,
  Upload,
  ChevronDown,
  AlertTriangle,
  Trash2,
  Edit3,
  Plus,
  Trash,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { RichTextEditor } from "./rich-text-editor";

interface CustomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OrderBump {
  id: string;
  productName: string;
  productDescription: string;
  price: string;
  discountPrice: string;
  discountType: "percentage" | "fixed";
  productPhoto: string | null;
  productFile: UploadedFile | null;
  enabled: boolean;
  hasDiscount: boolean;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export default function CustomSheet({ isOpen, onClose }: CustomSheetProps) {
  // Adicione o estilo aqui, logo após a declaração da função

  const [isPaid, setIsPaid] = useState(true);
  const [price, setPrice] = useState("0.00");
  const [currency, setCurrency] = useState("USD");
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [enableOrderBump, setEnableOrderBump] = useState(false);
  const [expandedOrderBumps, setExpandedOrderBumps] = useState<Set<string>>(
    new Set()
  );

  const [title, setTitle] = useState("Supply");
  const [subtitle, setSubtitle] = useState("Lemonsqueezy - Template");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [description, setDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [orderBumps, setOrderBumps] = useState<OrderBump[]>([]);
  const [showOrderBumpButton, setShowOrderBumpButton] = useState(true);
  const [hoveredPhoto, setHoveredPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const productFileInputRef = useRef<HTMLInputElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const MAX_ORDER_BUMPS = 3;

  const [productNameMaxLength] = useState(30);
  const [productDescriptionMaxLength] = useState(160);

  const areMainFieldsFilled = () => {
    const baseFields =
      title.trim() !== "" &&
      subtitle.trim() !== "" &&
      description.trim() !== "" &&
      selectedImage !== null;

    if (isPaid) {
      return baseFields && price.trim() !== "" && Number.parseFloat(price) > 0;
    } else {
      return baseFields;
    }
  };

  const isOrderBumpComplete = (bump: OrderBump) => {
    return (
      bump.productName.trim() !== "" &&
      bump.productDescription.trim() !== "" &&
      bump.productPhoto !== null &&
      bump.productFile !== null
    );
  };

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => {
        setIsAnimating(true);
      }, 10);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEditImage = () => {
    fileInputRef.current?.click();
  };

  const handleProductFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      }));
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
    if (productFileInputRef.current) {
      productFileInputRef.current.value = "";
    }
  };

  const updateOrderBump = (
    id: string,
    field: keyof OrderBump,
    value: string | boolean | UploadedFile | null
  ) => {
    if (
      field === "productName" &&
      typeof value === "string" &&
      value.length > productNameMaxLength
    ) {
      value = value.slice(0, productNameMaxLength);
    }
    if (
      field === "productDescription" &&
      typeof value === "string" &&
      value.length > productDescriptionMaxLength
    ) {
      value = value.slice(0, productDescriptionMaxLength);
    }
    setOrderBumps((prev) =>
      prev.map((bump) => (bump.id === id ? { ...bump, [field]: value } : bump))
    );
  };

  const addNewOrderBump = () => {
    if (orderBumps.length < MAX_ORDER_BUMPS) {
      const newBump: OrderBump = {
        id: Date.now().toString(),
        productName: "",
        productDescription: "",
        price: "",
        discountPrice: "",
        discountType: "percentage",
        productPhoto: null,
        productFile: null,
        enabled: true,
        hasDiscount: false,
      };
      setOrderBumps((prev) => [...prev, newBump]);

      if (orderBumps.length + 1 >= MAX_ORDER_BUMPS) {
        setShowOrderBumpButton(false);
      }
    }
  };

  const handleToggleOrderBump = () => {
    if (!enableOrderBump) {
      setEnableOrderBump(true);
      addNewOrderBump();
    } else {
      setEnableOrderBump(false);
      setOrderBumps([]);
    }
  };

  const removeOrderBump = (id: string) => {
    setOrderBumps((prev) => {
      const filtered = prev.filter((bump) => bump.id !== id);

      if (filtered.length === 0) {
        setEnableOrderBump(false);
      }
      return filtered;
    });
    setShowOrderBumpButton(true);
  };

  const handleOrderBumpPhotoUpload = (
    bumpId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateOrderBump(bumpId, "productPhoto", e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteOrderBumpPhoto = (bumpId: string) => {
    updateOrderBump(bumpId, "productPhoto", null);
    const input = document.getElementById(
      `photo-${bumpId}`
    ) as HTMLInputElement;
    if (input) {
      input.value = "";
    }
  };

  const handleOrderBumpFileUpload = (
    bumpId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const newFile: UploadedFile = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      };
      updateOrderBump(bumpId, "productFile", newFile);
    }
  };

  const canAddNewOrderBump = () => {
    if (orderBumps.length === 0) {
      return areMainFieldsFilled();
    }

    const lastBump = orderBumps[orderBumps.length - 1];
    return isOrderBumpComplete(lastBump);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showCurrencyDropdown && !event.target) {
        setShowCurrencyDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCurrencyDropdown]);

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    setShowCurrencyDropdown(false);
    setOrderBumps((prev) =>
      prev.map((bump) => ({
        ...bump,
        discountType: "fixed",
      }))
    );
  };

  const toggleOrderBumpExpanded = (bumpId: string) => {
    setExpandedOrderBumps((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(bumpId)) {
        newSet.delete(bumpId);
      } else {
        newSet.add(bumpId);
      }
      return newSet;
    });
  };

  if (!isVisible) return null;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        ref={sheetRef}
        className={`fixed right-0 top-0 bottom-0 w-full max-w-[580px] bg-white shadow-xl z-50 rounded-2xl my-1 mr-4 transition-transform duration-300 ease-out transform ${
          isAnimating ? "translate-x-0" : "translate-x-full"
        } overflow-hidden`}
      >
        <div className="h-full overflow-y-auto scrollbar-container">
          <div className="sticky top-0 z-10 bg-white flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Digital Product
            </h2>

            <button
              onClick={onClose}
              className="w-12 h-12  bg-[#F3F4F6] flex items-center justify-center cursor-pointer"
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <X className="w-6 h-6 text-gray-700" />
              </div>
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            <div
              className={`border ${
                selectedImage ? "border-solid" : "border-dashed"
              } border-gray-300 rounded-xl h-[200px] flex items-center justify-center bg-white cursor-pointer hover:border-gray-400 transition-colors relative overflow-hidden`}
              onClick={handleImageClick}
              onMouseEnter={() => setIsImageHovered(true)}
              onMouseLeave={() => setIsImageHovered(false)}
            >
              {selectedImage ? (
                <div className="absolute inset-0 w-full h-full">
                  <img
                    src={selectedImage || "/placeholder.svg"}
                    alt="Selected"
                    className="w-full h-full object-cover"
                  />
                  {isImageHovered && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditImage();
                        }}
                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Edit3 className="w-4 h-4 text-gray-700" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteImage();
                        }}
                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-black" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mx-auto"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M2.99939 11.9975C2.99939 10.8043 3.4734 9.65992 4.31713 8.81618C5.16087 7.97244 6.30523 7.49844 7.49845 7.49844H40.4916C41.6848 7.49844 42.8292 7.97244 43.6729 8.81618C44.5166 9.65992 44.9906 10.8043 44.9906 11.9975V35.9925C44.9906 37.1857 44.5166 38.3301 43.6729 39.1738C42.8292 40.0176 41.6848 40.4916 40.4916 40.4916H7.49845C6.30523 40.4916 5.16087 40.0176 4.31713 39.1738C3.4734 38.3301 2.99939 37.1857 2.99939 35.9925V11.9975ZM5.99876 32.1133V35.9925C5.99876 36.8203 6.67062 37.4922 7.49845 37.4922H40.4916C40.8893 37.4922 41.2708 37.3342 41.552 37.0529C41.8333 36.7717 41.9913 36.3902 41.9913 35.9925V32.1133L36.6124 26.7364C36.05 26.1747 35.2877 25.8592 34.4928 25.8592C33.698 25.8592 32.9357 26.1747 32.3733 26.7364L30.6136 28.4941L32.5532 30.4337C32.7006 30.5709 32.8188 30.7365 32.9007 30.9205C32.9827 31.1044 33.0268 31.303 33.0303 31.5044C33.0339 31.7058 32.9968 31.9058 32.9214 32.0925C32.846 32.2792 32.7337 32.4489 32.5913 32.5913C32.4489 32.7337 32.2793 32.846 32.0925 32.9214C31.9058 32.9968 31.7058 33.0338 31.5044 33.0303C31.303 33.0267 31.1045 32.9827 30.9205 32.9007C30.7365 32.8187 30.571 32.7006 30.4337 32.5532L20.1158 22.2374C19.5534 21.6757 18.7911 21.3602 17.9963 21.3602C17.2014 21.3602 16.4391 21.6757 15.8767 22.2374L5.99876 32.1153V32.1133ZM26.2445 16.4966C26.2445 15.8999 26.4815 15.3278 26.9034 14.9059C27.3253 14.484 27.8975 14.247 28.4941 14.247C29.0907 14.247 29.6629 14.484 30.0847 14.9059C30.5066 15.3278 30.7436 15.8999 30.7436 16.4966C30.7436 17.0932 30.5066 17.6653 30.0847 18.0872C29.6629 18.5091 29.0907 18.7461 28.4941 18.7461C27.8975 18.7461 27.3253 18.5091 26.9034 18.0872C26.4815 17.6653 26.2445 17.0932 26.2445 16.4966Z"
                      fill="#D1D5DC"
                    />
                  </svg>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center ">
              <div className="flex-1  pt-[15px]">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="font-medium text-black text-[15px]  bg-transparent border-none outline-none focus:bg-gray-50 rounded px-1 py-0.5 w-full"
                  placeholder="Product title"
                />
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="text-[14px] pb-[15px] font-normal text-[#6A7282] bg-transparent border-none outline-none focus:bg-gray-50 rounded px-1 py-0.5 w-full"
                  placeholder="Product subtitle"
                />
              </div>
              <div className="sm:ml-4">
                <p className="font-semibold text-[16px]">
                  {currency === "BRL"
                    ? "R$"
                    : currency === "USD"
                    ? "US$"
                    : currency === "CAD"
                    ? "C$"
                    : currency === "EUR"
                    ? "€"
                    : "$"}{" "}
                  {Number.parseFloat(price || "0").toFixed(2)}
                </p>
              </div>
            </div>

            <div className="bg-[#F3F4F6] border border-[#E5E6E7] rounded-lg p-4 sm:p-6">
              <div className="mb-3">
                <h3 className="text-sm font-medium text-[14px] pb-[8px]">
                  Product description
                </h3>
              </div>

              <RichTextEditor
                content={description}
                onChange={setDescription}
                placeholder="Add a description..."
              />
            </div>

            <div className="space-y-4 md:grid md:grid-cols-2 gap-x-4">
              <div
                className={`border rounded-lg p-4 cursor-pointer ${
                  isPaid
                    ? "border-[#2563EB] border-2 bg-white"
                    : "border-[#D1D5DC] bg-white"
                }`}
                onClick={() => setIsPaid(true)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-[14px]">
                      Paid
                    </h4>
                    <p className="text-normal text-[14px] text-gray-600">
                      Charge for access to your product.
                    </p>
                  </div>
                  <div className="mt-1">
                    <input
                      type="checkbox"
                      checked={isPaid}
                      onChange={() => setIsPaid(true)}
                      className="w-4 h-4 text-blue-600 rounded-sm"
                    />
                  </div>
                </div>
              </div>

              <div
                className={`border rounded-lg p-4 cursor-pointer ${
                  !isPaid
                    ? "border-[#2563EB] border-2 bg-white"
                    : "border-[#D1D5DC] bg-white"
                }`}
                onClick={() => setIsPaid(false)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-[14px]">
                      Free
                    </h4>
                    <p className="text-sm text-gray-500 text-[14px]">
                      Offering free access to your product.
                    </p>
                  </div>
                  <div className="mt-1">
                    <input
                      type="checkbox"
                      checked={!isPaid}
                      onChange={() => setIsPaid(false)}
                      className="w-4 h-4 text-blue-600 rounded-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-yellow-100 border border-[#F9C97C] rounded-lg p-4 flex items-start gap-3 col-span-2">
                <div className="flex-shrink-0 text-amber-700 ">
                  <ShieldAlert className="w-5 h-5 mt-2" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-[#894B00] text-[14px]">
                    No Payment Method Connected
                  </h4>
                  <p className="text-normal text-[#A65F00] text-[14px]">
                    Set up a payment method to start selling your product
                  </p>
                </div>
                <Link
                  href={"https://www.google.com/"}
                  className="cursor-pointer"
                >
                  <button className="px-4 py-2 bg-[#FCEBC1] text-amber-800 rounded text-sm font-normal text-[13px] cursor-pointer h-[32px]">
                    Setup
                  </button>
                </Link>
              </div>
            </div>

            {isPaid && (
              <div className="bg-[#F3F4F6] border border-[#E5E6E7] rounded-lg p-4 sm:p-6">
                <div className="">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-[14px] text-gray-900 pb-[8px]"
                  >
                    Price
                  </label>

                  <div className="mt-2 flex w-full pb-[8px]">
                    <div className="flex w-full  items-center rounded-md border border-gray-300 bg-white px-3 h-9 focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB]">
                      <span className="text-gray-500 text-[14px] mr-1 select-none">
                        {currency === "BRL"
                          ? "R$"
                          : currency === "USD"
                          ? "US$"
                          : currency === "CAD"
                          ? "C$"
                          : currency === "EUR"
                          ? "€"
                          : "$"}
                      </span>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="0.00"
                        onChange={(e) => setPrice(e.target.value)}
                        className="block w-full border-0 p-0 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm "
                      />
                    </div>

                    <div className="relative w-32">
                      <select
                        id="currency"
                        name="currency"
                        value={currency}
                        onChange={(e) => handleCurrencyChange(e.target.value)}
                        aria-label="Currency"
                        className="appearance-none w-full rounded-md border border-gray-300 bg-white h-9 pl-3 pr-8 text-base text-gray-900 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none sm:text-sm"
                      >
                        <option value="USD">USD</option>
                        <option value="CAD">CAD</option>
                        <option value="EUR">EUR</option>
                        <option value="BRL">BRL</option>
                      </select>
                      <svg
                        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-4 text-gray-500"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  <p className="text-[13px] text-[#6A7282] mt-2">
                    Specify the product price and accepted payment currency.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-[#F3F4F6] border border-[#E5E6E7] rounded-lg p-4 sm:p-6">
              <div className="pb-[8px]">
                <h4 className="text-[14px] font-medium text-gray-700">
                  Product
                </h4>
              </div>

              <div
                onClick={() => productFileInputRef.current?.click()}
                className="mt-2 flex justify-center rounded-lg border z-100 border-dashed border-gray-900/25 px-6 py-10 cursor-pointer"
              >
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-300" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label className="relative cursor-pointer rounded-md ">
                      <span className="text-[#2563EB] text-[14px] font-medium">
                        Upload files
                      </span>
                    </label>
                    <p className="pl-1 font-normal text-[14px]">
                      or drag and drop
                    </p>
                  </div>
                  <p className="text-[13px] font-normal leading-5 text-gray-600">
                    PDF, DOCX, XLS up to 50MB each
                  </p>
                </div>
              </div>

              <input
                ref={productFileInputRef}
                type="file"
                accept=".pdf,.docx,.xls,.xlsx,.doc"
                onChange={handleProductFileUpload}
                className="hidden"
                multiple
              />

              {uploadedFiles && (
                <div className="pb-[8px]">
                  <div className="w-full">
                    <ul className="w-full">
                      {uploadedFiles.map((file) => (
                        <li
                          key={file.id}
                          className="w-full flex items-center justify-between py-4 px-4 text-sm border-b divide-y divide-gray-100 rounded-md border border-gray-200"
                        >
                          <div className="flex items-center flex-1 min-w-0">
                            <svg
                              className="size-5 shrink-0 text-gray-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M15.621 4.379a3 3 0 0 0-4.242 0l-7 7a3 3 0 0 0 4.241 4.243h.001l.497-.5a.75.75 0 0 1 1.064 1.057l-.498.501-.002.002a4.5 4.5 0 0 1-6.364-6.364l7-7a4.5 4.5 0 0 1 6.368 6.36l-3.455 3.553A2.625 2.625 0 1 1 9.52 9.52l3.45-3.451a.75.75 0 1 1 1.061 1.06l-3.45 3.451a1.125 1.125 0 0 0 1.587 1.595l3.454-3.553a3 3 0 0 0 0-4.242Z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <div className="ml-4 min-w-0 flex items-center gap-4">
                              <p className="truncate font-medium">
                                {file.name}
                              </p>
                              <p className="text-gray-400 text-sm truncate">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 pl-4">
                            <a
                              href={file.url}
                              download={file.name}
                              className="font-medium text-[#2563EB]"
                            >
                              Download
                            </a>
                            <button
                              onClick={() => removeFile(file.id)}
                              className="w-8 h-8 flex items-center justify-center font-medium hover:bg-red-200 rounded"
                            >
                              <Trash2 className="h-[18px] w-[18px] text-black hover:text-red-500" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-2">
                on.link will automatically send these files to your customer
                after purchase.
              </p>
            </div>

            {orderBumps.length === 0 && (
              <div className="bg-[#F3F4F6] border border-[#E5E6E7] rounded-lg p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleToggleOrderBump}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        enableOrderBump ? "bg-[#2563EB]" : "bg-gray-300"
                      } cursor-pointer`}
                    >
                      <div
                        className={`absolute w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          enableOrderBump ? "translate-x-5" : "translate-x-1"
                        } top-0.5`}
                      />
                    </button>
                    <span className="text-[14px] font-medium text-gray-900">
                      Order Bump
                    </span>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded ">
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 pt-[8px]">
                  Boost your sales by encouraging customers to increase their
                  purchases with a one-time offer integrated into your checkout
                  flow.
                </p>
              </div>
            )}

            {orderBumps.length > 0 && (
              <div className="space-y-4">
                {orderBumps.map((bump, index) => (
                  <div
                    key={bump.id}
                    className="bg-[#F3F4F6] border border-[#E5E6E7] rounded-lg p-4 sm:p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            updateOrderBump(bump.id, "enabled", !bump.enabled)
                          }
                          className={`relative w-11 h-6 rounded-full transition-colors ${
                            bump.enabled ? "bg-[#2563EB]" : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`absolute w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                              bump.enabled ? "translate-x-5" : "translate-x-1"
                            } top-0.5`}
                          />
                        </button>
                        <span className="text-sm font-medium text-gray-900">
                          Order Bump
                        </span>
                      </div>
                      <button
                        onClick={() => toggleOrderBumpExpanded(bump.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <ChevronDown
                          className={`w-4 h-4 text-gray-500 transition-transform ${
                            expandedOrderBumps.has(bump.id) ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">
                      Boost your sales by encouraging customers to increase
                      their purchases with a one-time offer integrated into your
                      checkout flow.
                    </p>

                    {expandedOrderBumps.has(bump.id) && (
                      <div className="">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 pb-[8px]">
                            Product Name
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={bump.productName}
                              onChange={(e) =>
                                updateOrderBump(
                                  bump.id,
                                  "productName",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 h-9 border border-gray-300 rounded-md bg-white focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none"
                              placeholder="Order bump product name"
                              maxLength={productNameMaxLength}
                            />
                            <div className="absolute -bottom-5 right-2 text-xs text-gray-400">
                              {bump.productName.length}/{productNameMaxLength}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 py-[8px] ">
                            Product Description
                          </label>
                          <div className="relative">
                            <textarea
                              value={bump.productDescription}
                              onChange={(e) =>
                                updateOrderBump(
                                  bump.id,
                                  "productDescription",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none"
                              placeholder="Order bump product description"
                              rows={3}
                              maxLength={productDescriptionMaxLength}
                            />
                            <div className="absolute -bottom-3 right-2 text-xs text-gray-400">
                              {bump.productDescription.length}/
                              {productDescriptionMaxLength}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 py-[8px]">
                            Product Photo
                          </label>
                          <div
                            className={`w-32 h-32 border ${
                              bump.productPhoto
                                ? "border-solid"
                                : "border-dashed"
                            } border-gray-300 rounded-lg flex items-center justify-center bg-white cursor-pointer hover:border-gray-400 transition-colors relative overflow-hidden`}
                            onClick={() => {
                              const input = document.getElementById(
                                `photo-${bump.id}`
                              ) as HTMLInputElement;
                              input?.click();
                            }}
                            onMouseEnter={() => setHoveredPhoto(bump.id)}
                            onMouseLeave={() => setHoveredPhoto(null)}
                          >
                            {bump.productPhoto ? (
                              <div className="absolute inset-0 w-full h-full">
                                <img
                                  src={bump.productPhoto || "/placeholder.svg"}
                                  alt="Product"
                                  className="w-full h-full object-cover"
                                />
                                {hoveredPhoto === bump.id && (
                                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const input = document.getElementById(
                                          `photo-${bump.id}`
                                        ) as HTMLInputElement;
                                        input?.click();
                                      }}
                                      className="p-1.5 bg-white rounded-full hover:bg-gray-100 transition-colors"
                                    >
                                      <Edit3 className="w-3 h-3 text-gray-700" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteOrderBumpPhoto(bump.id);
                                      }}
                                      className="p-1.5 bg-white rounded-full hover:bg-gray-100 transition-colors"
                                    >
                                      <Trash2 className="w-3 h-3 text-black" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <svg
                                width="32"
                                height="32"
                                viewBox="0 0 48 48"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M2.99939 11.9975C2.99939 10.8043 3.4734 9.65992 4.31713 8.81618C5.16087 7.97244 6.30523 7.49844 7.49845 7.49844H40.4916C41.6848 7.49844 42.8292 7.97244 43.6729 8.81618C44.5166 9.65992 44.9906 10.8043 44.9906 11.9975V35.9925C44.9906 37.1857 44.5166 38.3301 43.6729 39.1738C42.8292 40.0176 41.6848 40.4916 40.4916 40.4916H7.49845C6.30523 40.4916 5.16087 40.0176 4.31713 39.1738C3.4734 38.3301 2.99939 37.1857 2.99939 35.9925V11.9975ZM5.99876 32.1133V35.9925C5.99876 36.8203 6.67062 37.4922 7.49845 37.4922H40.4916C40.8893 37.4922 41.2708 37.3342 41.552 37.0529C41.8333 36.7717 41.9913 36.3902 41.9913 35.9925V32.1133L36.6124 26.7364C36.05 26.1747 35.2877 25.8592 34.4928 25.8592C33.698 25.8592 32.9357 26.1747 32.3733 26.7364L30.6136 28.4941L32.5532 30.4337C32.7006 30.5709 32.8188 30.7365 32.9007 30.9205C32.9827 31.1044 33.0268 31.303 33.0303 31.5044C33.0339 31.7058 32.9968 31.9058 32.9214 32.0925C32.846 32.2792 32.7337 32.4489 32.5913 32.5913C32.4489 32.7337 32.2793 32.846 32.0925 32.9214C31.9058 32.9968 31.7058 33.0338 31.5044 33.0303C31.303 33.0267 31.1045 32.9827 30.9205 32.9007C30.7365 32.8187 30.571 32.7006 30.4337 32.5532L20.1158 22.2374C19.5534 21.6757 18.7911 21.3602 17.9963 21.3602C17.2014 21.3602 16.4391 21.6757 15.8767 22.2374L5.99876 32.1153V32.1133ZM26.2445 16.4966C26.2445 15.8999 26.4815 15.3278 26.9034 14.9059C27.3253 14.484 27.8975 14.247 28.4941 14.247C29.0907 14.247 29.6629 14.484 30.0847 14.9059C30.5066 15.3278 30.7436 15.8999 30.7436 16.4966C30.7436 17.0932 30.5066 17.6653 30.0847 18.0872C29.6629 18.5091 29.0907 18.7461 28.4941 18.7461C27.8975 18.7461 27.3253 18.5091 26.9034 18.0872C26.4815 17.6653 26.2445 17.0932 26.2445 16.4966Z"
                                  fill="#D1D5DC"
                                />
                              </svg>
                            )}
                            <input
                              id={`photo-${bump.id}`}
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleOrderBumpPhotoUpload(bump.id, e)
                              }
                              className="hidden"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 py-[8px]">
                            Product
                          </label>
                          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                            <div className="text-center">
                              <Upload className="mx-auto h-8 w-8 text-gray-300" />
                              <div className="mt-2 flex text-sm leading-6 text-gray-600">
                                <label
                                  className="relative cursor-pointer rounded-md  focus-within:outline-none "
                                  onClick={() => {
                                    const input = document.getElementById(
                                      `file-${bump.id}`
                                    ) as HTMLInputElement;
                                    input?.click();
                                  }}
                                >
                                  <span className="font-medium text-[14px] text-[#2563EB]">
                                    Upload a file
                                  </span>
                                </label>
                                <p className="pl-1 font-normal text-[14px]">
                                  or drag and drop
                                </p>
                              </div>
                              <p className="text-xs leading-5 text-gray-600 font-normal text-[13px]">
                                PDF, DOCX, XLS up to 50MB
                              </p>
                            </div>
                          </div>
                          <input
                            id={`file-${bump.id}`}
                            type="file"
                            accept=".pdf,.docx,.xls,.xlsx,.doc"
                            onChange={(e) =>
                              handleOrderBumpFileUpload(bump.id, e)
                            }
                            className="hidden"
                          />

                          {bump.productFile && (
                            <div className="mt-4">
                              <ul
                                role="list"
                                className="divide-y divide-gray-100 rounded-md border border-gray-200"
                              >
                                <li className="flex items-center justify-between py-4 pr-5 pl-4 text-sm/6">
                                  <div className="flex w-0 flex-1 items-center">
                                    <svg
                                      className="size-5 shrink-0 text-gray-400"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      aria-hidden="true"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M15.621 4.379a3 3 0 0 0-4.242 0l-7 7a3 3 0 0 0 4.241 4.243h.001l.497-.5a.75.75 0 0 1 1.064 1.057l-.498.501-.002.002a4.5 4.5 0 0 1-6.364-6.364l7-7a4.5 4.5 0 0 1 6.368 6.36l-3.455 3.553A2.625 2.625 0 1 1 9.52 9.52l3.45-3.451a.75.75 0 1 1 1.061 1.06l-3.45 3.451a1.125 1.125 0 0 0 1.587 1.595l3.454-3.553a3 3 0 0 0 0-4.242Z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                      <span className="truncate font-medium">
                                        {bump.productFile.name}
                                      </span>
                                      <span className="shrink-0 text-gray-400">
                                        {formatFileSize(bump.productFile.size)}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="ml-4 shrink-0 flex gap-2 items-center">
                                    <a
                                      href={bump.productFile.url}
                                      download={bump.productFile.name}
                                      className="font-medium text-[#2563EB]"
                                    >
                                      Download
                                    </a>
                                    <button
                                      onClick={() =>
                                        updateOrderBump(
                                          bump.id,
                                          "productFile",
                                          null
                                        )
                                      }
                                      className="w-8 h-8 flex items-center justify-center font-medium hover:bg-red-200 rounded"
                                    >
                                      <Trash2 className="h-[18px] w-[18px] text-black hover:text-red-500" />
                                    </button>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          )}

                          <p className="text-xs text-gray-500 pt-[8px]">
                            on.link will automatically send these files to your
                            customer after purchase.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {orderBumps.length > 0 &&
              orderBumps.length < MAX_ORDER_BUMPS &&
              expandedOrderBumps.has(orderBumps[orderBumps.length - 1].id) && (
                <div className="space-y-2">
                  <button
                    onClick={addNewOrderBump}
                    disabled={!canAddNewOrderBump()}
                    className={`w-full p-4 border-2  rounded-lg flex items-center justify-center gap-2 transition-colors ${
                      canAddNewOrderBump()
                        ? "border-[#2563EB] hover:border-gray-400 text-gray-600"
                        : "border-[#2563EB] text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <Plus className="w-5 h-5 text-[#2563EB]" />
                    <span className="text-[#2563EB]">Add Order Bump</span>
                  </button>

                  {!canAddNewOrderBump() && (
                    <p className="text-xs text-red-500 text-center">
                      Please complete all fields in the current Order Bump
                      before adding a new one
                    </p>
                  )}
                </div>
              )}
          </div>

          <div className="z-10 bg-white border-t border-[#D1D5DC] p-4 sm:p-6">
            <button className="w-full bg-[#2563EB] text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Save
            </button>
          </div>
        </div>
      </div>
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        ::-webkit-scrollbar-button {
          display: none;
        }
      `}</style>
    </>
  );
}
