import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Doctor } from "./types";
import { useState } from "react";

interface AppointmentModalProps {
  isOpen: boolean;
  doctor: Doctor | null;
  onClose: () => void;
}

export default function AppointmentModal({ isOpen, doctor, onClose }: AppointmentModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [reason, setReason] = useState("");

  const handleBooking = () => {
    if (selectedDate && reason) {
      alert(`Appointment booked with ${doctor?.name} on ${selectedDate.toDateString()} for: ${reason}`);
      onClose();
    }
  };

  if (!doctor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Select a date:</p>
          <Calendar selected={selectedDate} onSelect={setSelectedDate} />
          <Input
            placeholder="Reason for visit"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleBooking} disabled={!selectedDate || !reason}>Book Now</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
