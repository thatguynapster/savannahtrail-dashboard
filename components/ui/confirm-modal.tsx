"use client";

import React, { ReactNode, useState } from "react";
import clsx from "clsx";

import { useModal } from "@/providers/modal-provider";
import CustomModal from "./custom-modal";
import { Button } from "./button";

type Variant = 'success' | 'error' | 'warning' | 'info';

type Props = {
    confirmText?: string | ReactNode;
    cancel: {
        text: string
        action?: () => void
    }
    confirm: {
        text: string
        action: () => void
        variant: Variant
    }
};

const ConfirmModal = ({
    cancel,
    confirm,
    confirmText,
}: Props) => {
    const { setClose } = useModal();

    const getVariantClass = (variant: Variant) => {
        const variants = {
            success: '!border-green-600 !bg-green-600 !text-white',
            error: '!border-red-600 !bg-red-600 !text-white',
            warning: '!border-yellow-600 !bg-yellow-600 !text-white',
            info: '!border-blue-600 !bg-blue-600 !text-white',
        };
        return variants[variant];
    }

    return (
        <CustomModal title="Delete Product?" className="max-w-lg">
            <div className="flex flex-col gap-8">
                <div className="text-center">
                    {confirmText}
                </div>

                <div className="flex gap-4 justify-around">
                    <Button
                        className="w-max"
                        variant="outline"
                        type="button"
                        onClick={cancel.action ?? setClose}
                    >
                        {cancel.text}
                    </Button>

                    <Button
                        className={clsx("w-max", getVariantClass(confirm.variant))}
                        type="submit"
                        onClick={confirm.action}
                    >
                        {confirm.text}
                    </Button>
                </div>
            </div>
        </CustomModal>
    );
};

export default ConfirmModal;
