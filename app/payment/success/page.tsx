"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionId) {
      // Verify the payment was successful
      fetch(`/api/verify-payment?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setVerified(true);
            
            // If user data exists in localStorage, update it with paid status
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              try {
                const user = JSON.parse(storedUser);
                // Update user data with payment info
                user.planType = data.plan || user.planType;
                user.paymentStatus = data.subscription ? 'subscription' : 'paid';
                user.status = 'approved';
                localStorage.setItem('user', JSON.stringify(user));
              } catch (err) {
                console.error('Error updating user data:', err);
              }
            }
          } else {
            setError(data.error || "Payment verification failed");
          }
        })
        .catch(err => {
          setError("Failed to verify payment");
          console.error("Payment verification error:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError("No session ID provided");
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-400 mx-auto mb-4" />
          <p className="text-white">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-6 mb-6">
            <h1 className="text-2xl font-bold text-red-400 mb-2">Payment Error</h1>
            <p className="text-red-300">{error}</p>
          </div>
          <Link href="/">
            <Button className="bg-white text-black hover:bg-gray-200">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="bg-green-500/10 border border-green-500 rounded-lg p-6 mb-6">
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
          <p className="text-green-300 mb-4">
            Welcome to BallersPak! Your payment has been processed and you now have access to your plan.
          </p>
          <p className="text-gray-400 text-sm">
            You&apos;ll receive a confirmation email shortly with your access details.
          </p>
        </div>
        
        <div className="space-y-3">
          <Link href="/player">
            <Button className="w-full bg-gradient-to-r from-green-500 to-green-400 hover:opacity-90 text-black font-semibold">
              Access Your Dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-400 mx-auto mb-4" />
          <p className="text-white">Loading...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}