import React, { useState } from 'react';

const Support = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const resetForm = () => {
        setSubmitted(false);
        setForm({ name: '', email: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                        <svg className="w-8 h-8" style={{ color: '#3390d5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Need Help?</h1>
                    <p className="text-lg text-gray-600 max-w-md mx-auto">
                        We're here to support you. Contact us through any of the options below.
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6" style={{ background: `linear-gradient(135deg, #3390d5, #2980c9)` }}>
                        <h2 className="text-xl font-semibold text-white">Contact Support</h2>
                        <p className="text-blue-100 mt-1">Choose one of the options below to reach us</p>
                    </div>

                    <div className="p-8 sm:p-12 space-y-6">
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter your full name"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 transition-all duration-200 outline-none text-gray-900 placeholder-gray-500"
                                style={{
                                    '--tw-ring-color': '#3390d5',
                                    '--focus-border-color': '#3390d5'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#3390d5'}
                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                placeholder="your.email@example.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 transition-all duration-200 outline-none text-gray-900 placeholder-gray-500"
                                style={{
                                    '--tw-ring-color': '#3390d5',
                                    '--focus-border-color': '#3390d5'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#3390d5'}
                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                        </div>

                        {/* Message Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Message *
                            </label>
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                required
                                rows={5}
                                placeholder="Describe your issue or question in detail..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 transition-all duration-200 outline-none text-gray-900 placeholder-gray-500 resize-vertical"
                                style={{
                                    '--tw-ring-color': '#3390d5',
                                    '--focus-border-color': '#3390d5'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#3390d5'}
                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Please provide as much detail as possible to help us assist you better.
                            </p>
                        </div>

                        {/* Replaced Submit Button with Contact Options */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="mailto:support@onemai.com"
                                className="flex-1 inline-flex items-center justify-center px-6 py-3 text-white font-medium rounded-lg transition duration-200"
                                style={{ backgroundColor: '#3390d5' }}
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12l-4-4-4 4m0 0l4 4 4-4m-4-4v8" />
                                </svg>
                                Email Us
                            </a>

                            <a
                                href="https://wa.me/2349012345678"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 inline-flex items-center justify-center px-6 py-3 text-white font-medium rounded-lg transition duration-200"
                                style={{ backgroundColor: '#25D366' }}
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.862 15.23l-1.403-.317a1.234 1.234 0 00-1.28.422l-.294.295a8.021 8.021 0 01-3.806-3.806l.295-.294a1.234 1.234 0 00.422-1.28l-.317-1.403A1.235 1.235 0 009.478 7H8.24c-.667 0-1.207.54-1.207 1.207 0 5.404 4.38 9.784 9.784 9.784.667 0 1.207-.54 1.207-1.207v-1.238a1.235 1.235 0 00-.894-1.116z" />
                                </svg>
                                WhatsApp
                            </a>

                            <a
                                href="https://facebook.com/onemaisupport"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 inline-flex items-center justify-center px-6 py-3 text-white font-medium rounded-lg transition duration-200"
                                style={{ backgroundColor: '#4267B2' }}
                            >
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.2 1.8.2v2h-1c-1 0-1.3.6-1.3 1.2V12h2.2l-.4 3H14v7A10 10 0 0022 12z" />
                                </svg>
                                Facebook
                            </a>
                        </div>
                    </div>
                </div>

                {/* Additional Help Section */}
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="bg-white rounded-lg p-6 shadow-md text-center">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6" style={{ color: '#3390d5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
                        <p className="text-sm text-gray-600">support@onemai.com</p>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-md text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Response Time</h3>
                        <p className="text-sm text-gray-600">Within 24 hours</p>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-md text-center sm:col-span-2 lg:col-span-1">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">24/7 Available</h3>
                        <p className="text-sm text-gray-600">Always here to help</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Support;
