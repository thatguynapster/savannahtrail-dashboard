"use client";

import React, { useState, useEffect } from "react";
import clsx from "clsx";

import { useModal } from "@/providers/modal-provider";
import CustomModal from "../ui/custom-modal";
import { Button } from "../ui/button";
import { guidesApi } from "@/lib/api/guides";
import { Guide } from "@/types/guide";
import { LoaderCircle } from "lucide-react";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { bookingsApi } from "@/lib/api/bookings";
import { toast } from "sonner";

type Props = {
    booking_id: string
};

const AssignGuideModal = ({ booking_id }: Props) => {
    const { setClose } = useModal();
    const [guides, setGuides] = useState<Guide[]>([]);
    const [selectedGuide, setSelectedGuide] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGuides = async () => {
            try {
                const response = await guidesApi.getGuides(1, 10, { status: 'active' });
                setGuides(response.responses.docs.filter(guide => guide.status === 'active'));
            } catch (error) {
                console.error("Failed to fetch guides:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGuides();

        return () => {
            setGuides([]) // cleanup on unmount
        }
    }, []);

    const handleSubmit = async () => {
        setLoading(true)
        console.log('selected guide:', selectedGuide);
        const reassigned = await bookingsApi.reassignGuide(booking_id, selectedGuide!);
        console.log('reassigned response:', reassigned);
        toast.success("Guide reassigned successfully");

        setLoading(false)
        setClose()
    }

    return (
        <CustomModal title="Reassign Guide" className="max-w-lg">
            <div className="flex flex-col gap-8">
                {loading ? (
                    <div className="text-center flex items-center justify-center">
                        <LoaderCircle className="animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Select onValueChange={(value) => setSelectedGuide(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a guide" />
                            </SelectTrigger>
                            <SelectContent>
                                {guides?.filter(g => g.status === 'active').map((guide) => (
                                    <SelectItem key={guide._id} value={guide._id}>
                                        <div className="flex flex-col items-start">
                                            <span>{guide.name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {guide.specialties.slice(0, 2).join(', ')}
                                            </span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                <div className="flex gap-4 justify-around">
                    <Button
                        className="w-max"
                        variant="outline"
                        type="button"
                        onClick={setClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        className={clsx("w-max", "!border-green-600 !bg-green-600 !text-white")}
                        type="submit"
                        disabled={loading}
                        onClick={handleSubmit}
                    >
                        Assign Guide
                    </Button>
                </div>
            </div>
        </CustomModal>
    );
};

export default AssignGuideModal;
