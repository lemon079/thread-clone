"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from './dialog'
import { Button } from './button'
import { useModelContext } from '@/app/Context/ModelContext'
import { removeUserFromCommunity } from '@/lib/actions/community.actions'

const DeleteMemberModel = () => {
    const { isOpen, setIsOpen } = useModelContext();
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        if (loading) return;
        setIsOpen({
            state: false,
            payload: {
                userId: "",
                communityId: ""
            }
        });
    }

    const handleDelete = async () => {
        setLoading(true);
        try {
            await removeUserFromCommunity(
                isOpen.payload.userId,
                isOpen.payload.communityId,
                `/communities/${isOpen.payload.communityId}`
            );
        } finally {
            setLoading(false);
            handleClose();
        }
    }

    return (
        <Dialog open={isOpen.state} onOpenChange={(open) => {
            if (!open) handleClose();
        }}>
            <DialogContent className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl p-6 text-white">
                <DialogHeader>
                    <DialogTitle className="text-lg md:text-xl font-medium text-white">
                        Are you sure?
                    </DialogTitle>
                    <DialogDescription className="text-sm text-zinc-400 mt-1">
                        This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-6 flex justify-end gap-3">
                    <Button
                        className='user-card_btn !bg-inherit border border-neutral-600'
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        className='user-card_btn !bg-red-500'
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteMemberModel
