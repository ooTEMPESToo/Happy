import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Doctor } from "./types";

interface ConsultationOptionsModalProps {
  isOpen: boolean;
  doctor: Doctor | null;
  onClose: () => void;
  onSelect: (type: "chat" | "appointment") => void;
}

export default function ConsultationOptionsModal({ isOpen, doctor, onClose, onSelect }: ConsultationOptionsModalProps) {
  if (!doctor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Consultation Type</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Dr. {doctor.name} ({doctor.specialty})</p>
          <Button onClick={() => onSelect("chat")} className="w-full">Chat (₹{doctor.consultation_fee})</Button>
          <Button onClick={() => onSelect("appointment")} className="w-full" variant="outline">Book Appointment</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}