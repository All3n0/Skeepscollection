'use client';

import { useState } from "react";
import { Mail, Phone, Clock, Send } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    project: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const response = await fetch('http://localhost:5555/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Submission failed');
    }

    setPopupMessage(data.message || "Message sent successfully! We'll get back to you within 24 hours.");
    setShowPopup(true);
    setFormData({ name: "", email: "", phone: "", project: "", message: "" });
  } catch (error) {
    setPopupMessage(error instanceof Error ? error.message : "Failed to send message. Try again later.");
    setShowPopup(true);
  } finally {
    setLoading(false);
  }
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+254 796078921", "Mon-Fri 9AM-6PM EST"]
    },
    {
      icon: Mail,
      title: "Email",
      details: ["skeepscollection@gmail.com"]
    },
    {
      icon: Clock,
      title: "Hours",
      details: ["Monday - Friday: 9AM - 6PM", "Saturday: 10AM - 4PM"]
    }
  ];

  return (
    <section id="contact" className="py-20 bg-white text-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Let's Create Together
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to bring your custom apparel vision to life? Get in touch for a free quote 
            and let's discuss your project.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Get Your Custom Quote</h3>
              <p className="text-gray-600 mb-6">
                Fill out the form below and we'll get back to you with a detailed quote within 24 hours.
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      required
                      className="w-full px-3 py-2 border border-red-300 outline-none rounded-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      className="w-full px-3 py-2 border border-red-300 outline-none rounded-md"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(555) 123-4567"
                      className="w-full px-3 py-2 border border-red-300 outline-none rounded-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="project" className="block text-sm font-semibold text-gray-700 mb-2">
                      Project Type *
                    </label>
                    <select
                      id="project"
                      name="project"
                      value={formData.project}
                      onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-red-300 outline-none rounded-md"
                    >
                      <option value="">Select project type</option>
                      <option value="tshirts">Custom T-Shirts</option>
                      <option value="hoodies">Custom Hoodies</option>
                      <option value="bags">Custom Bags</option>
                      <option value="mixed">Mixed Order</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Project Details *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    required
                    className="w-full px-3 py-2 border border-red-300 outline-none rounded-md"
                    placeholder="Tell us about your project: quantity, design ideas, timeline, etc."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-md font-semibold transition flex items-center justify-center ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  <Send className="mr-2 h-5 w-5" />
                  {loading ? "Sending..." : "Send Message & Get Quote"}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white border border-gray-200 shadow-md rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <info.icon className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">{info.title}</h4>
                    {info.details.map((d, i) => (
                      <p key={i} className="text-sm text-gray-600">{d}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* CTA Card */}
            <div className="bg-red-50 border border-red-100 p-6 text-center rounded-xl">
              <h3 className="font-bold text-gray-800 mb-2">Need Urgent Help?</h3>
              <p className="text-sm text-gray-600 mb-4">For rush orders or immediate assistance, call us directly.</p>
              <button className="w-full bg-red-600 text-white py-2 rounded-md font-semibold hover:bg-red-700 flex items-center justify-center">
                <Phone className="mr-2 h-4 w-4" />
                Call Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-xl max-w-md w-full text-center">
            <p className="text-gray-800 mb-4">{popupMessage}</p>
            <button
              onClick={() => setShowPopup(false)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Contact;
