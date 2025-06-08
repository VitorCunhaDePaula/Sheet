"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import {
  X,
  Upload,
  ChevronDown,
  AlertTriangle,
  ImageIcon,
  Video,
  Trash2,
  Edit3,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Plus,
} from "lucide-react";
import Link from "next/link";

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
  const [isPaid, setIsPaid] = useState(true);
  const [price, setPrice] = useState("0.00");
  const [currency, setCurrency] = useState("USD");
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [enableOrderBump, setEnableOrderBump] = useState(false);

  const [title, setTitle] = useState("Supply");
  const [subtitle, setSubtitle] = useState("Lemonsqueezy - Template");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [description, setDescription] = useState("");
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [orderBumps, setOrderBumps] = useState<OrderBump[]>([]);
  const [showOrderBumpButton, setShowOrderBumpButton] = useState(true);
  const [hoveredPhoto, setHoveredPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const productFileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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
    const baseComplete =
      bump.productName.trim() !== "" &&
      bump.productDescription.trim() !== "" &&
      bump.price.trim() !== "" &&
      Number.parseFloat(bump.price) > 0 &&
      bump.productPhoto !== null &&
      bump.productFile !== null;

    if (bump.hasDiscount) {
      return (
        baseComplete &&
        bump.discountPrice.trim() !== "" &&
        Number.parseFloat(bump.discountPrice) > 0
      );
    }

    return baseComplete;
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

  const applyFormatting = (command: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = description.substring(start, end);

    if (selectedText) {
      let formattedText = selectedText;
      let newDescription = description;

      switch (command) {
        case "bold":
          formattedText = `**${selectedText}**`;
          setIsBold(!isBold);
          break;
        case "italic":
          formattedText = `*${selectedText}*`;
          setIsItalic(!isItalic);
          break;
        case "underline":
          formattedText = `<u>${selectedText}</u>`;
          setIsUnderline(!isUnderline);
          break;
        case "strikethrough":
          formattedText = `~~${selectedText}~~`;
          setIsStrikethrough(!isStrikethrough);
          break;
        case "bulletList":
          formattedText = `• ${selectedText}`;
          break;
        case "numberedList":
          formattedText = `1. ${selectedText}`;
          break;
      }

      newDescription =
        description.substring(0, start) +
        formattedText +
        description.substring(end);
      setDescription(newDescription);
    }
  };

  const handleProductFileUpload = (
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
      setUploadedFile(newFile);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
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
    if (!enableOrderBump && areMainFieldsFilled()) {
      setEnableOrderBump(true);
      addNewOrderBump();
    } else if (!areMainFieldsFilled()) {
      setEnableOrderBump(!enableOrderBump);
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
        className={`fixed right-0 top-0 bottom-0 w-full max-w-[580px] bg-white shadow-xl z-50 overflow-y-auto rounded-l-2xl my-1 mr-1/2 transition-transform duration-300 ease-out transform ${
          isAnimating ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="sticky top-0 z-10 bg-white flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Digital Product
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          <div
            className="border border-dashed border-gray-300 rounded-xl h-[200px] flex items-center justify-center bg-white cursor-pointer hover:border-gray-400 transition-colors relative overflow-hidden"
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
              <div className="text-gray-300">
                <ImageIcon className="w-12 h-12 mx-auto" />
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

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex-1 space-y-1">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="font-medium text-black text-[15px] bg-transparent border-none outline-none focus:bg-gray-50 rounded px-1 py-0.5 w-full"
                placeholder="Product title"
              />
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="text-[14px] font-normal text-[#6A7282] bg-transparent border-none outline-none focus:bg-gray-50 rounded px-1 py-0.5 w-full"
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
                  ? "CA$"
                  : currency === "EUR"
                  ? "€"
                  : "$"}{" "}
                {Number.parseFloat(price || "0").toFixed(2)}
              </p>
            </div>
          </div>

          <div className="bg-[#F3F4F6] border border-[#E5E6E7] rounded-lg p-4 sm:p-6">
            <div className="mb-3">
              <h3 className="text-sm font-medium text-[14px]">
                Product description
              </h3>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <div className="border-b border-gray-200 p-2 flex items-center justify-between">
                <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
                  <button
                    onClick={() => applyFormatting("bold")}
                    className={`w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded ${
                      isBold ? "bg-gray-200" : ""
                    }`}
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => applyFormatting("italic")}
                    className={`w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded ${
                      isItalic ? "bg-gray-200" : ""
                    }`}
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => applyFormatting("underline")}
                    className={`w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded ${
                      isUnderline ? "bg-gray-200" : ""
                    }`}
                  >
                    <Underline className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => applyFormatting("strikethrough")}
                    className={`w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded ${
                      isStrikethrough ? "bg-gray-200" : ""
                    }`}
                  >
                    <Strikethrough className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => applyFormatting("bulletList")}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => applyFormatting("numberedList")}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
                  >
                    <ListOrdered className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded opacity-50 cursor-not-allowed">
                    <ImageIcon className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded opacity-50 cursor-not-allowed">
                    <Video className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 min-h-[120px] bg-white">
                <textarea
                  ref={textareaRef}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-full resize-none border-none outline-none text-sm"
                  placeholder="Add a description..."
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div
              className={`border rounded-lg p-4 cursor-pointer ${
                isPaid
                  ? "border-[#2563EB] bg-white"
                  : "border-gray-200 bg-white"
              }`}
              onClick={() => setIsPaid(true)}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <input
                    type="checkbox"
                    checked={isPaid}
                    onChange={() => setIsPaid(true)}
                    className="w-4 h-4 text-blue-600 rounded-sm"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-[14px]">
                    Paid
                  </h4>
                  <p className="text-normal text-[14px] text-gray-600">
                    Charge for access to your product.
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`border rounded-lg p-4 cursor-pointer ${
                !isPaid
                  ? "border-[#2563EB] bg-white"
                  : "border-gray-200 bg-white"
              }`}
              onClick={() => setIsPaid(false)}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <input
                    type="checkbox"
                    checked={!isPaid}
                    onChange={() => setIsPaid(false)}
                    className="w-4 h-4 text-blue-600 rounded-sm"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-[14px]">
                    Free
                  </h4>
                  <p className="text-sm text-gray-500 text-[14px]">
                    Offering free access to your product.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
              <div className="flex-shrink-0 text-amber-700">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-amber-800">
                  No Payment Method Connected
                </h4>
                <p className="text-sm text-amber-700">
                  Set up a payment method to start selling your product
                </p>
              </div>
              <Link href={"https://www.google.com/"} className="cursor-pointer">
                <button className="px-4 py-2 bg-amber-100 text-amber-800 rounded text-sm font-normal text-[13px] cursor-pointer">
                  Setup
                </button>
              </Link>
            </div>
          </div>

          {isPaid && (
            <div className="bg-[#F3F4F6] border border-[#E5E6E7] rounded-lg p-4 sm:p-6">
              <div className="space-y-2">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-[14px] text-gray-900"
                >
                  Price
                </label>
                <div className="mt-2">
                  <div className="flex items-center rounded-md bg-white pl-3 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                    <div className="shrink-0 text-base text-gray-500 select-none font-normal text-[14px]">
                      {currency === "BRL"
                        ? "R$"
                        : currency === "USD"
                        ? "US$"
                        : currency === "CAD"
                        ? "CA$"
                        : currency === "EUR"
                        ? "€"
                        : "$"}
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      id="price"
                      name="price"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                    />
                    <div className="grid shrink-0 grid-cols-1 focus-within:relative ml-2">
                      <select
                        id="currency"
                        name="currency"
                        value={currency}
                        onChange={(e) => handleCurrencyChange(e.target.value)}
                        aria-label="Currency"
                        className="col-start-1 row-start-1 w-full appearance-none rounded-md py-1.5 pr-7 pl-3 text-base text-gray-500 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                      >
                        <option value="USD">USD</option>
                        <option value="CAD">CAD</option>
                        <option value="EUR">EUR</option>
                        <option value="BRL">BRL</option>
                      </select>
                      <svg
                        className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        aria-hidden="true"
                        data-slot="icon"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-[13px] text-[#6A7282] mt-2">
                Specify the product price and accepted payment currency.
              </p>
            </div>
          )}

          <div className="bg-[#F3F4F6] border border-[#E5E6E7] rounded-lg p-4 sm:p-6">
            <div className="mb-3">
              <h4 className="text-[14px] font-medium text-gray-700">Product</h4>
            </div>

            <div
              className="border border-dashed border-gray-300 rounded-lg p-6 sm:p-10 text-center bg-white cursor-pointer hover:border-gray-400 transition-colors"
              onClick={() => productFileInputRef.current?.click()}
            >
              <Upload className="w-6 h-6 text-gray-400 mx-auto mb-4" />
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1 text-sm">
                  <button className="text-blue-600 font-medium">
                    Upload a file
                  </button>
                  <span className="text-gray-500">or drag and drop</span>
                </div>
                <p className="text-xs text-gray-500">
                  pdf, docx, xls, word or excel up to 50mb
                </p>
              </div>
            </div>

            <input
              ref={productFileInputRef}
              type="file"
              accept=".pdf,.docx,.xls,.xlsx,.doc"
              onChange={handleProductFileUpload}
              className="hidden"
            />

            {uploadedFile && (
              <div className="mt-4">
                <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(uploadedFile.size)}
                    </p>
                  </div>
                  <button
                    onClick={removeFile}
                    className="p-1 text-black hover:bg-red-50 rounded ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-2">
              on.link will automatically send these files to your customer after
              purchase.
            </p>
          </div>

          {orderBumps.length === 0 && (
            <div className="bg-[#F3F4F6] border border-[#E5E6E7] rounded-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleToggleOrderBump}
                    disabled={!areMainFieldsFilled()}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      enableOrderBump ? "bg-[#2563EB]" : "bg-gray-300"
                    } ${
                      !areMainFieldsFilled()
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
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
              </div>
              <p className="text-sm text-gray-600">
                Boost your sales by encouraging customers to increase their
                purchases with a one-time offer integrated into your checkout
                flow.
              </p>
              {!areMainFieldsFilled() && (
                <p className="text-xs text-red-500 mt-2">
                  Please fill all main product fields first (title, subtitle,
                  description, image
                  {isPaid ? ", and price" : ""})
                </p>
              )}
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
                        Order Bump {index + 1}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeOrderBump(bump.id)}
                        className="p-1 text-black hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                          placeholder="Order bump product name"
                          maxLength={productNameMaxLength}
                        />
                        <div className="absolute -bottom-5 right-2 text-xs text-gray-400">
                          {bump.productName.length}/{productNameMaxLength}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
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

                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="sm:grow-[3] sm:basis-0">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={bump.price}
                          onChange={(e) =>
                            updateOrderBump(bump.id, "price", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                          placeholder="0.00"
                        />
                      </div>

                      <div className="sm:grow-[2] sm:basis-0">
                        <div className="flex items-center gap-2 mb-1">
                          <button
                            onClick={() =>
                              updateOrderBump(
                                bump.id,
                                "hasDiscount",
                                !bump.hasDiscount
                              )
                            }
                            className={`relative w-8 h-4 rounded-full transition-colors ${
                              bump.hasDiscount ? "bg-[#2563EB]" : "bg-gray-300"
                            }`}
                          >
                            <div
                              className={`absolute w-3 h-3 bg-white rounded-full shadow transform transition-transform ${
                                bump.hasDiscount
                                  ? "translate-x-4"
                                  : "translate-x-0.5"
                              } top-0.5`}
                            />
                          </button>
                          <label className="block text-sm font-medium text-gray-700">
                            Discount Price
                          </label>
                        </div>
                        <div className="flex">
                          <input
                            type="number"
                            step="0.01"
                            value={bump.discountPrice}
                            onChange={(e) =>
                              updateOrderBump(
                                bump.id,
                                "discountPrice",
                                e.target.value
                              )
                            }
                            disabled={!bump.hasDiscount}
                            className={`flex-1 px-3 py-2 border border-gray-300 rounded-md ${
                              bump.hasDiscount ? "bg-white" : "bg-gray-100"
                            }`}
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Photo
                      </label>
                      <div
                        className="w-32 h-32 border border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white cursor-pointer hover:border-gray-400 transition-colors relative overflow-hidden"
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
                          <ImageIcon className="w-8 h-8 text-gray-400" />
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product
                      </label>
                      <div
                        className="border border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center bg-white cursor-pointer hover:border-gray-400 transition-colors"
                        onClick={() => {
                          const input = document.getElementById(
                            `file-${bump.id}`
                          ) as HTMLInputElement;
                          input?.click();
                        }}
                      >
                        <Upload className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                        <div className="text-sm">
                          <span className="text-blue-600 font-medium">
                            Upload a file
                          </span>
                          <span className="text-gray-500">
                            {" "}
                            or drag and drop
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          pdf, docx, xls, word or excel up to 50mb
                        </p>
                      </div>
                      <input
                        id={`file-${bump.id}`}
                        type="file"
                        accept=".pdf,.docx,.xls,.xlsx,.doc"
                        onChange={(e) => handleOrderBumpFileUpload(bump.id, e)}
                        className="hidden"
                      />

                      {bump.productFile && (
                        <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {bump.productFile.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(bump.productFile.size)}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              updateOrderBump(bump.id, "productFile", null)
                            }
                            className="p-1 text-black hover:bg-red-50 rounded ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-4">
                    Boost your sales by encouraging customers to increase their
                    purchases with a one-time offer integrated into your
                    checkout flow.
                  </p>
                </div>
              ))}
            </div>
          )}

          {orderBumps.length > 0 && orderBumps.length < MAX_ORDER_BUMPS && (
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
                  Please complete all fields in the current Order Bump before
                  adding a new one
                </p>
              )}
            </div>
          )}
        </div>

        <div className="z-10 bg-white border-t border-gray-200 p-4 sm:p-6">
          <button className="w-full bg-[#2563EB] text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Save
          </button>
        </div>
      </div>
    </>
  );
}
