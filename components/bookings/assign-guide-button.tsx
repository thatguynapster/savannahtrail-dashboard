'use client'

import React from 'react'
import { Button } from "../ui/button"
import AssignGuideModal from "./assign-guide";
import { UserCheck } from "lucide-react";
import { useModal } from "@/providers/modal-provider";

type Props = {
    booking_id: string
}

const AssignGuideButton = ({ booking_id }: Props) => {
    const { setOpen } = useModal();

    return (
        <Button
            variant="outline"
            onClick={() => {
                setOpen(
                    <AssignGuideModal booking_id={booking_id} />
                )
            }}>
            <UserCheck className="mr-2 h-4 w-4" />
            Reassign Guide
        </Button>
    )
}

export default AssignGuideButton