'use client';

import { useState, useRef, useEffect } from "react";
import { Mail, Phone, Clock, Send, FileText, ClipboardList, User, Image as ImageIcon, X, Upload, CheckCircle } from "lucide-react";

// Counter Component
interface CounterProps {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

const Counter = ({ target, duration = 2000, suffix = "", prefix = "", className = "" }: CounterProps) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true);
            
            let start = 0;
            const increment = target / (duration / 16);
            
            const timer = setInterval(() => {
              start += increment;
              if (start >= target) {
                setCount(target);
                clearInterval(timer);
              } else {
                setCount(Math.floor(start));
              }
            }, 16);
            
            return () => clearInterval(timer);
          }
        });
      },
      { threshold: 0.5, rootMargin: "0px 0px -50px 0px" }
    );
    
    if (counterRef.current) {
      observer.observe(counterRef.current);
    }
    
    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [target, duration, hasStarted]);

  return (
    <div ref={counterRef} className={className}>
      {prefix}{count}{suffix}
    </div>
  );
};

type ContactProps = {
  id?: string;
  onSubmitForm?: () => void;
};

const Contact = ({ id, onSubmitForm }: ContactProps = {}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "+254 ",
    project: "",
    message: ""
  });

  const [errors, setErrors] = useState({
    email: "",
    phone: "",
    name: "",
    project: "",
    message: ""
  });

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error">("success");
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  
  // Cloudinary Configuration
  const CLOUDINARY_UPLOAD_PRESET = "skeeps_collection";
  const CLOUDINARY_CLOUD_NAME = "dlqivwm9d";
  const CLOUDINARY_API_KEY = "369713747235896";
  const WEB3FORMS_ACCESS_KEY = "99101f62-b138-4e41-ae71-4eaf78b5434f";

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation function
  const validatePhone = (phone: string): boolean => {
    // Remove spaces and check if it's +254 followed by 9 digits
    const cleaned = phone.replace(/\s/g, '');
    const phoneRegex = /^\+254\d{9}$/;
    return phoneRegex.test(cleaned);
  };

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        return "";
      case 'email':
        if (!value.trim()) return "Email is required";
        if (!validateEmail(value)) return "Please enter a valid email address";
        return "";
      case 'phone':
        if (value.trim() && !validatePhone(value)) return "Phone must be +254 followed by 9 digits";
        return "";
      case 'project':
        if (!value.trim()) return "Project type is required";
        return "";
      case 'message':
        if (value.trim().length < 20) return "Message must be at least 20 characters";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special handling for phone input
    if (name === 'phone') {
      let newValue = value;
      
      // Ensure it starts with +254
      if (!newValue.startsWith('+254')) {
        newValue = '+254 ';
      }
      
      // Remove any non-digit characters except + and spaces
      let digits = newValue.replace(/[^\d\+]/g, '');
      
      // Ensure it starts with +254
      if (!digits.startsWith('+254')) {
        digits = '+254' + digits.replace('+254', '');
      }
      
      // Limit to +254 + 9 digits = 13 characters total
      if (digits.length > 13) {
        digits = digits.substring(0, 13);
      }
      
      // Format as +254 XXX XXX XXX
      let formatted = '+254';
      if (digits.length > 4) {
        formatted += ' ' + digits.substring(4, 7);
      }
      if (digits.length > 7) {
        formatted += ' ' + digits.substring(7, 10);
      }
      if (digits.length > 10) {
        formatted += ' ' + digits.substring(10, 13);
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: formatted
      }));
      
      // Clear error when user types
      setErrors(prev => ({
        ...prev,
        phone: ""
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Clear error when user types
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = (): boolean => {
    const newErrors = {
      email: validateField('email', formData.email),
      phone: formData.phone.trim() ? validateField('phone', formData.phone) : "",
      name: validateField('name', formData.name),
      project: validateField('project', formData.project),
      message: validateField('message', formData.message)
    };
    
    setErrors(newErrors);
    
    return !Object.values(newErrors).some(error => error !== "");
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("cloud_name", CLOUDINARY_CLOUD_NAME);
    formData.append("api_key", CLOUDINARY_API_KEY);
    formData.append("folder", "skeeps_designs");
    formData.append("tags", "custom_apparel,design_submission");
    
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Cloudinary upload failed:", errorText);
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.secure_url) {
        throw new Error("No secure URL returned from Cloudinary");
      }
      
      console.log("Upload successful:", data.secure_url);
      return data.secure_url;
      
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      setPopupType("error");
      setPopupMessage("❌ Please fix the errors in the form before submitting.");
      setShowPopup(true);
      return;
    }
    
    setLoading(true);
    setUploadProgress(0);

    try {
      // Upload files to Cloudinary first
      let imageUrls: string[] = [];
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          try {
            const url = await uploadToCloudinary(file);
            imageUrls.push(url);
            
            // Update progress
            const progress = Math.round(((i + 1) / files.length) * 100);
            setUploadProgress(progress);
          } catch (error) {
            throw new Error(`Failed to upload "${file.name}". Please try again.`);
          }
        }
      }

      // Prepare data for Web3Forms
      const payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `🎨 New Custom Design Request: ${formData.project}`,
        from_name: formData.name,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "Not provided",
        project_type: formData.project,
        message: `
PROJECT DETAILS:
${formData.message}

DESIGN IMAGES (${imageUrls.length}):
${imageUrls.length > 0 
  ? imageUrls.map((url, i) => `Image ${i + 1}: ${url}`).join('\n')
  : "No images provided"}

CUSTOMER INFORMATION:
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || "Not provided"}
Project Type: ${formData.project}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}
        `.trim(),
        botcheck: ""
      };

      // Send to Web3Forms
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        if (onSubmitForm) {
          onSubmitForm();
        }

        setPopupType("success");
        const fileMessage = files.length > 0 
          ? `✅ Perfect! Your design request has been submitted successfully!\n\n📸 We received ${files.length} design image(s)\n\n📧 You'll receive a confirmation email shortly\n\n⏱️ We'll review your designs and send you a quote within 24 hours\n\n📱 Need immediate help? WhatsApp us at +254 775 976640`
          : "✅ Message sent successfully! We'll review your request and get back to you within 24 hours.";
        setPopupMessage(fileMessage);
        setShowPopup(true);
        
        // Reset form
        setFormData({ name: "", email: "", phone: "+254 ", project: "", message: "" });
        setFiles([]);
        setUploadProgress(0);
        setErrors({ email: "", phone: "", name: "", project: "", message: "" });
      } else {
        throw new Error(data.message || "Submission failed. Please try again.");
      }
    } catch (error) {
      setPopupType("error");
      setPopupMessage(
        error instanceof Error 
          ? `❌ ${error.message}\n\nPlease try again or contact us directly at skeepscollection@gmail.com`
          : "❌ Failed to send message. Please try again later or email us directly at skeepscollection@gmail.com"
      );
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles);
    
    // File type validation
    const allowedTypes = [
      'image/jpeg', 
      'image/jpg', 
      'image/png', 
      'image/gif', 
      'image/webp', 
      'image/svg+xml'
    ];
    const validFiles = newFiles.filter(file => allowedTypes.includes(file.type));
    
    if (validFiles.length !== newFiles.length) {
      setPopupType("error");
      setPopupMessage("⚠️ Only image files (JPG, PNG, GIF, WebP, SVG) are allowed. Other files were ignored.");
      setShowPopup(true);
    }

    // File size validation (5MB)
    const maxSize = 5 * 1024 * 1024;
    const sizeValidFiles = validFiles.filter(file => file.size <= maxSize);
    
    if (sizeValidFiles.length !== validFiles.length) {
      setPopupType("error");
      setPopupMessage("⚠️ Some files exceed the 5MB size limit and were ignored.");
      setShowPopup(true);
    }

    const totalFiles = [...files, ...sizeValidFiles];
    if (totalFiles.length > 5) {
      setPopupType("error");
      setPopupMessage("⚠️ Maximum 5 files allowed. Only the first 5 files will be kept.");
      setShowPopup(true);
      setFiles(totalFiles.slice(0, 5));
    } else {
      setFiles(totalFiles);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add("border-red-500", "bg-red-50");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("border-red-500", "bg-red-50");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("border-red-500", "bg-red-50");
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const mockEvent = {
        target: {
          files: droppedFiles
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleFileSelect(mockEvent);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "WhatsApp",
      details: ["+254 775 976640", "Mon-Fri 9AM-6PM EST"],
      action: "https://wa.me/254775976640"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["skeepscollection@gmail.com"],
      action: "mailto:skeepscollection@gmail.com"
    },
    {
      icon: Clock,
      title: "Hours",
      details: ["Monday - Friday: 9AM - 6PM", "Saturday: 10AM - 4PM"]
    }
  ];

  const projectTypes = [
    "Custom T-Shirts",
    "Custom Hoodies",
    "Custom Bags",
    "Mixed Order",
    "Bulk/Corporate Order",
    "Event Merchandise",
    "Sports Team Apparel",
    "School/University",
    "Branded Merchandise",
    "Other"
  ];

  return (
    <section id={id} className="py-20 bg-gradient-to-b from-white to-gray-50 text-black relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Design Your Vision With Us
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Upload your design ideas and get a custom quote within 24 hours
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-medium">
              <CheckCircle className="inline w-4 h-4 mr-1" /> Secure Uploads
            </span>
            <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-medium">
              <CheckCircle className="inline w-4 h-4 mr-1" /> 24-Hour Response
            </span>
            <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-medium">
              <CheckCircle className="inline w-4 h-4 mr-1" /> Free Quote
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border-2 border-gray-100 shadow-2xl rounded-2xl p-8 hover:shadow-3xl transition-shadow duration-500">
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="bg-red-100 p-2 rounded-lg mr-3">
                    <Send className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Get Your Custom Quote</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Share your vision with us. Upload design images for the most accurate pricing and fastest turnaround.
                </p>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <p className="text-sm text-gray-700">
                    <span className="font-bold">💡 Pro Tip:</span> Include multiple design angles, color references, and quantity estimates for the best quote.
                  </p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Honeypot field */}
                <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="flex items-center text-sm font-bold text-gray-800">
                      <User className="h-4 w-4 mr-2 text-red-600" />
                      Full Name *
                    </label>
                    <div className="relative">
                      <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="John Doe"
                        required
                        minLength={2}
                        className={`w-full pl-12 pr-4 py-3 border-2 outline-none rounded-xl focus:ring-2 focus:ring-red-200 transition-all duration-300 ${
                          errors.name ? 'border-red-500' : 'border-gray-200 focus:border-red-500'
                        }`}
                      />
                      <User className={`absolute left-4 top-3.5 h-5 w-5 ${errors.name ? 'text-red-500' : 'text-gray-400'}`} />
                    </div>
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <X className="h-3 w-3 mr-1" /> {errors.name}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="flex items-center text-sm font-bold text-gray-800">
                      <Mail className="h-4 w-4 mr-2 text-red-600" />
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="john@example.com"
                        required
                        className={`w-full pl-12 pr-4 py-3 border-2 outline-none rounded-xl focus:ring-2 focus:ring-red-200 transition-all duration-300 ${
                          errors.email ? 'border-red-500' : 'border-gray-200 focus:border-red-500'
                        }`}
                      />
                      <Mail className={`absolute left-4 top-3.5 h-5 w-5 ${errors.email ? 'text-red-500' : 'text-gray-400'}`} />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <X className="h-3 w-3 mr-1" /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="flex items-center text-sm font-bold text-gray-800">
                      <Phone className="h-4 w-4 mr-2 text-red-600" />
                      WhatsApp Number
                    </label>
                    <div className="relative">
                      <input
                        id="phone"
                        name="phone"
                        ref={phoneInputRef}
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="+254 775 976640"
                        className={`w-full pl-12 pr-4 py-3 border-2 outline-none rounded-xl focus:ring-2 focus:ring-red-200 transition-all duration-300 ${
                          errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-red-500'
                        }`}
                      />
                      <Phone className={`absolute left-4 top-3.5 h-5 w-5 ${errors.phone ? 'text-red-500' : 'text-gray-400'}`} />
                    </div>
                    {errors.phone ? (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <X className="h-3 w-3 mr-1" /> {errors.phone}
                      </p>
                    ) : (
                      <p className="text-gray-500 text-xs mt-1">
                        Format: +254 XXX XXX XXX (9 digits after +254)
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="project" className="flex items-center text-sm font-bold text-gray-800">
                      <ClipboardList className="h-4 w-4 mr-2 text-red-600" />
                      Project Type *
                    </label>
                    <div className="relative">
                      <select
                        id="project"
                        name="project"
                        value={formData.project}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`w-full pl-12 pr-10 py-3 border-2 outline-none rounded-xl appearance-none focus:ring-2 focus:ring-red-200 transition-all duration-300 bg-white ${
                          errors.project ? 'border-red-500' : 'border-gray-200 focus:border-red-500'
                        }`}
                      >
                        <option value="" className="text-gray-400">What are you looking for?</option>
                        {projectTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <ClipboardList className={`absolute left-4 top-3.5 h-5 w-5 ${errors.project ? 'text-red-500' : 'text-gray-400'}`} />
                      <div className="absolute right-4 top-3.5 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {errors.project && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <X className="h-3 w-3 mr-1" /> {errors.project}
                      </p>
                    )}
                  </div>
                </div>

                {/* File Upload Section */}
                <div className="space-y-3">
                  <label className="flex items-center text-sm font-bold text-gray-800">
                    <ImageIcon className="h-4 w-4 mr-2 text-red-600" />
                    Design Images (Optional)
                    <span className="ml-2 text-xs font-normal text-gray-500">
                      Upload up to 5 images • 5MB each
                    </span>
                  </label>
                  
                  {/* Drag & Drop Area */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-3 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                      files.length > 0 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 hover:border-red-400 hover:bg-red-50'
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-16 w-16 text-red-400 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-gray-800 mb-2">
                      {files.length > 0 ? `${files.length} design image(s) ready` : 'Drop your design files here'}
                    </p>
                    <p className="text-gray-600 mb-4">
                      or click to browse your computer
                    </p>
                    <div className="flex justify-center gap-3">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        JPG, PNG
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        GIF, WebP
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        SVG
                      </span>
                    </div>
                    
                    {/* Upload Progress Bar */}
                    {loading && uploadProgress > 0 && (
                      <div className="mt-6 max-w-md mx-auto">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-red-500 to-orange-500 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  {/* File list */}
                  {files.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-bold text-gray-700">Selected Files:</p>
                        <button
                          type="button"
                          onClick={() => setFiles([])}
                          className="text-sm text-red-600 hover:text-red-800 font-medium"
                        >
                          Clear All
                        </button>
                      </div>
                      <div className="space-y-3">
                        {files.map((file, index) => (
                          <div 
                            key={index} 
                            className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border hover:border-red-300 transition-all duration-300 hover:shadow-md"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="bg-red-100 p-2 rounded-lg">
                                <ImageIcon className="h-5 w-5 text-red-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">
                                  {file.name}
                                </p>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-xs text-gray-500">
                                    {formatFileSize(file.size)}
                                  </span>
                                  <span className="text-xs text-gray-500">•</span>
                                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">
                                    {file.type.split('/')[1].toUpperCase()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(index);
                              }}
                              className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <label htmlFor="message" className="flex items-center text-sm font-bold text-gray-800">
                    <FileText className="h-4 w-4 mr-2 text-red-600" />
                    Project Details *
                  </label>
                  <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows={6}
                      required
                      minLength={20}
                      className={`w-full pl-12 pr-4 py-4 border-2 outline-none rounded-xl focus:ring-2 focus:ring-red-200 transition-all duration-300 resize-none ${
                        errors.message ? 'border-red-500' : 'border-gray-200 focus:border-red-500'
                      }`}
                      placeholder="Please include:
• Desired quantity
• Design details and colors
• Timeline/deadline
• Any special requirements
• Size distribution (if known)"
                    ></textarea>
                    <FileText className={`absolute left-4 top-4 h-5 w-5 ${errors.message ? 'text-red-500' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex justify-between items-center">
                    {errors.message && (
                      <p className="text-red-500 text-xs flex items-center">
                        <X className="h-3 w-3 mr-1" /> {errors.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 ml-auto">
                      {formData.message.length > 0 && (
                        <span className={`ml-2 ${formData.message.length < 50 ? 'text-red-500' : formData.message.length < 100 ? 'text-orange-500' : 'text-green-500'}`}>
                          {formData.message.length}/20 characters
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center ${
                      loading 
                        ? "bg-gray-400 cursor-not-allowed" 
                        : "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        {files.length > 0 ? "Uploading Designs..." : "Processing Your Request..."}
                      </>
                    ) : (
                      <>
                        <Send className="mr-3 h-5 w-5" />
                        Submit Design Request
                      </>
                    )}
                  </button>
                  
                  <div className="mt-6 bg-gray-50 p-4 rounded-xl border">
                    <div className="flex items-start">
                      <div className="bg-orange-100 p-2 rounded-lg mr-3">
                        <CheckCircle className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-700 font-medium mb-1">What happens next?</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>✓ Images uploaded to secure Cloudinary storage</li>
                          <li>✓ You'll receive a confirmation email</li>
                          <li>✓ Our team reviews your designs</li>
                          <li>✓ You get a detailed quote within 24 hours</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-8">
            {contactInfo.map((info, index) => (
              <div 
                key={index} 
                className="bg-white border-2 border-gray-100 shadow-lg rounded-2xl p-6 hover:shadow-xl hover:border-red-100 transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-red-100 to-orange-100 p-4 rounded-xl">
                    <info.icon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 text-lg mb-2">{info.title}</h4>
                    {info.details.map((d, i) => (
                      <p key={i} className="text-gray-600 mb-1">{d}</p>
                    ))}
                    {info.action && (
                      <a
                        href={info.action}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 text-red-600 hover:text-red-800 font-medium text-sm"
                      >
                        Click to {info.title === "WhatsApp" ? "WhatsApp us" : "email us"} →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Design Tips Card */}
            <div className="bg-gradient-to-br from-yellow-50 to-cyan-50 border-2 border-yellow-100 p-6 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-100 p-3 rounded-xl mr-3">
                  <ImageIcon className="h-5 w-5 text-yellow-600" />
                </div>
                <h3 className="font-bold text-gray-800 text-lg">Design Guidelines</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="bg-white p-1 rounded mr-3 mt-0.5">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-700">High-resolution images (300+ DPI)</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-white p-1 rounded mr-3 mt-0.5">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-700">Separate files for front/back designs</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-white p-1 rounded mr-3 mt-0.5">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-700">Include Pantone or RGB color codes</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-white p-1 rounded mr-3 mt-0.5">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-700">Vector files (AI, EPS, SVG) preferred</span>
                </li>
              </ul>
            </div>

            {/* Urgent Help Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-100 p-6 rounded-2xl text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-7 w-7 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.5 17.25c0 .414-.336.75-.75.75H4.25c-.414 0-.75-.336-.75-.75v-10c0-.414.336-.75.75-.75h11.5c.414 0 .75.336.75.75v10z"/>
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 text-xl mb-2">Need Immediate Assistance?</h3>
              <p className="text-gray-600 text-sm mb-6">
                For rush orders or urgent inquiries, WhatsApp us directly
              </p>
              <a 
                href="https://wa.me/254775976640"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <svg className="inline h-5 w-5 mr-2 mb-0.5" fill="white" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.5 17.25c0 .414-.336.75-.75.75H4.25c-.414 0-.75-.336-.75-.75v-10c0-.414.336-.75.75-.75h11.5c.414 0 .75.336.75.75v10z"/>
                </svg>
                WhatsApp Now: +254 775 976640
              </a>
              <p className="text-xs text-gray-500 mt-3">
                Available Mon-Fri 9AM-6PM, Sat 10AM-4PM
              </p>
            </div>

            {/* Success Stats with Counter */}
            <div className="bg-gradient-to-br from-orange-50 to-emerald-50 border-2 border-orange-100 p-6 rounded-2xl">
              <h3 className="font-bold text-gray-800 text-lg mb-4">Why Choose Us?</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <Counter 
                    target={24} 
                    duration={2000} 
                    suffix="h" 
                    className="text-2xl font-bold text-orange-700"
                  />
                  <div className="text-xs text-gray-600">Response Time</div>
                </div>
                <div className="text-center">
                  <Counter 
                    target={100} 
                    duration={1500} 
                    suffix="%" 
                    className="text-2xl font-bold text-orange-700"
                  />
                  <div className="text-xs text-gray-600">Secure Uploads</div>
                </div>
                <div className="text-center">
                  <Counter 
                    target={500} 
                    duration={2500} 
                    suffix="+" 
                    className="text-2xl font-bold text-orange-700"
                  />
                  <div className="text-xs text-gray-600">Projects Delivered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-700">Free</div>
                  <div className="text-xs text-gray-600">Design Quotes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div 
            className={`bg-white p-6 rounded-xl shadow-xl max-w-sm w-full transform transition-all duration-300 animate-slideUp ${popupType === "success" ? "border-l-4 border-green-500" : "border-l-4 border-red-500"}`}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${popupType === "success" ? "bg-green-100" : "bg-red-100"}`}>
              {popupType === "success" ? (
                <CheckCircle className="h-7 w-7 text-green-600" />
              ) : (
                <X className="h-7 w-7 text-red-600" />
              )}
            </div>
            <h3 className={`text-lg font-bold text-center mb-3 ${popupType === "success" ? "text-green-700" : "text-red-700"}`}>
              {popupType === "success" ? "Request Submitted!" : "Submission Failed"}
            </h3>
            <p className="text-gray-700 text-sm mb-6 text-center leading-relaxed">
              {popupMessage}
            </p>
            <div className="flex gap-3">
              {popupType === "success" ? (
                <button
                  onClick={() => setShowPopup(false)}
                  className="flex-1 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-sm"
                >
                  Continue Browsing
                </button>
              ) : (
                <button
                  onClick={() => setShowPopup(false)}
                  className="flex-1 py-2.5 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-medium hover:from-red-700 hover:to-orange-700 transition-all duration-300 text-sm"
                >
                  Try Again
                </button>
              )}
              <button
                onClick={() => setShowPopup(false)}
                className="py-2.5 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Contact;