"use client";

import { DialogTitle } from "@radix-ui/react-dialog";
import React from "react";
import clsx from "clsx";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
} from "../ui/dialog";
import { useModal } from "@/providers/modal-provider";

type Props = {
    title: string;
    subheading?: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    className?: string;
};

const CustomModal = ({
    children,
    className,
    defaultOpen,
    subheading,
    title,
}: Props) => {
    const { isOpen, setClose } = useModal();
    return (
        <Dialog open={isOpen || defaultOpen} onOpenChange={setClose}>
            <DialogContent className={clsx("md:max-h-[700px]", className)}>
                <DialogHeader className="text-left">
                    <DialogTitle className="text-xl text-center font-bold">
                        {title}
                    </DialogTitle>
                    {subheading && <DialogDescription>{subheading}</DialogDescription>}
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
};

export default CustomModal;
