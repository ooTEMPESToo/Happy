import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Doctor } from "./types/index";

interface ChatPaymentModalProps {
  isOpen: boolean;
  doctor: Doctor | null;
  onClose: () => void;
}

export default function ChatPaymentModal({ isOpen, doctor, onClose }: ChatPaymentModalProps) {
  if (!doctor) return null;

  const handlePayment = () => {
    // Placeholder logic
    alert("Payment successful! Chat session starting...");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Chat Payment</DialogTitle>
        </DialogHeader>
        <div className="text-sm">
          You are about to initiate a chat with <strong>{doctor.name}</strong> (₹{doctor.consultation_fee}).
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handlePayment}>Pay & Start Chat</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}