import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material'
import React from 'react'

const ConfirmDelete = ({ open, handleClose, confirmDelete }) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle> Are you sure you want to delete?</DialogTitle>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={confirmDelete}>Delete</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmDelete