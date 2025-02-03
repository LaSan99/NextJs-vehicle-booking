export default function DownloadApp() {
  return (
    <div className="bg-blue-600 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Text Content */}
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <h2 className="text-4xl font-bold text-white mb-4">
              Download Our Mobile App
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Get exclusive deals, manage your bookings, and enjoy a seamless rental experience
              right from your phone.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors">
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.33-1.94 4.23-3.74 4.25z"/>
                </svg>
                App Store
              </button>
              <button className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors">
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.799-3.8l-2.301 2.301-8.635-8.635 10.936 6.334zm2.611 2.611a.999.999 0 01-.093 1.307l-2.412 2.412-2.302-2.302 2.301-2.301 2.412 2.412a1.001 1.001 0 01.094 1.472z"/>
                </svg>
                Google Play
              </button>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative w-72 h-[600px] bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl">
              {/* Phone Screen */}
              <div className="absolute inset-2 bg-blue-50 rounded-[2.5rem] overflow-hidden">
                {/* App Interface Mockup */}
                <div className="h-full flex items-center justify-center">
                  <svg 
                    className="w-24 h-24 text-blue-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" 
                    />
                  </svg>
                </div>
              </div>
              {/* Phone Notch */}
              <div className="absolute top-0 inset-x-0 h-6 flex justify-center">
                <div className="w-40 h-full bg-gray-800 rounded-b-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 