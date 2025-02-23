import React from 'react';
import { CheckCircle, Copy, ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
function PaymentSuccess() {
  const searchQuery = useSearchParams()[0]
  const referenceNum = searchQuery.get("reference")
  const copyReferenceId = () => {
    navigator.clipboard.writeText(referenceNum);
    toast.success("Copy to clipboard")
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Your transaction has been processed successfully
          </p>

          <div className="w-full bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Reference ID</p>
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono text-lg font-semibold text-gray-800">
                {referenceNum}
              </span>
              <button
                onClick={copyReferenceId}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                title="Copy reference ID"
              >
                <Copy className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* <div className="space-y-4 w-full">
            <button className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-600 transition-colors">
              Download Receipt
            </button>
          </div> */}
        </div>
      </div>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
    </div>
  );
}

export default PaymentSuccess;