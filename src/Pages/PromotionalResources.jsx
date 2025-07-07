import React from "react";
import { FiDownload, FiCopy, FiShare2, FiLink } from "react-icons/fi";

const PromotionalResources = () => {
  const featured = {
    title: "Hero Promo Banner",
    description: "Our signature high-resolution banner. Ideal for landing pages, ads, and hero sections.",
    image: "https://picsum.photos/seed/featured-banner/1200/400",
    downloadLink: "/downloads/hero-banner.jpg",
    shareLink: "https://example.com/share/hero-banner"
  };

  const kits = [
    {
      id: 1,
      title: "Social Media Kit",
      description: "Instagram, Facebook & X-ready assets.",
      image: "https://picsum.photos/seed/socialkit/600/400",
      downloadLink: "/downloads/social-kit.zip",
      shareLink: "https://example.com/share/social"
    },
    {
      id: 2,
      title: "Email Template",
      description: "Responsive email HTML template.",
      image: "https://picsum.photos/seed/emailkit/600/400",
      downloadLink: "/downloads/email-template.zip",
      shareLink: "https://example.com/share/email"
    },
    {
      id: 3,
      title: "Video Promo",
      description: "30-second commercial spot.",
      image: "https://picsum.photos/seed/video/600/400",
      downloadLink: "/downloads/video-promo.mp4",
      shareLink: "https://example.com/share/video"
    },
    {
      id: 4,
      title: "Brand Guide",
      description: "Logo usage, colors, typography & tone.",
      image: "https://picsum.photos/seed/brandguide/600/400",
      downloadLink: "/downloads/brand-guide.pdf",
      shareLink: "https://example.com/share/brandguide"
    }
  ];

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Promotional Assets
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Everything you need to promote our brand effectively.
          </p>
        </div>

        {/* Featured Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Featured Asset</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
            <img
              src={featured.image}
              alt={featured.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{featured.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{featured.description}</p>
              <div className="flex space-x-4">
                <a
                  href={featured.downloadLink}
                  download
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                >
                  <FiDownload className="inline mr-2" /> Download
                </a>
                <button
                  onClick={() => handleCopyLink(featured.shareLink)}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  <FiCopy className="inline mr-2" /> Copy Link
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Marketing Kits */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Marketing Kits</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {kits.map((kit) => (
              <div
                key={kit.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition hover:shadow-lg hover:-translate-y-1"
              >
                <img
                  src={kit.image}
                  alt={kit.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{kit.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{kit.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <a
                        href={kit.downloadLink}
                        download
                        className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800"
                        title="Download"
                      >
                        <FiDownload className="h-5 w-5" />
                      </a>
                      <button
                        onClick={() => handleCopyLink(kit.shareLink)}
                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        title="Copy Link"
                      >
                        <FiCopy className="h-5 w-5" />
                      </button>
                      <a
                        href={`mailto:?body=Check this out: ${kit.shareLink}`}
                        className="p-2 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800"
                        title="Share via Email"
                      >
                        <FiShare2 className="h-5 w-5" />
                      </a>
                    </div>
                    <a
                      href={kit.shareLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                    >
                      <FiLink className="mr-1" /> Preview
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Quick Access</h2>
          <ul className="space-y-3">
            {kits.map((kit) => (
              <li key={kit.id} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {kit.title}
                </div>
                <div className="flex items-center space-x-3">
                  <a href={kit.downloadLink} download className="text-blue-600 dark:text-blue-300 hover:underline text-sm">
                    Download
                  </a>
                  <button
                    onClick={() => handleCopyLink(kit.shareLink)}
                    className="text-sm text-gray-600 dark:text-gray-300 hover:underline"
                  >
                    Copy Link
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default PromotionalResources;
