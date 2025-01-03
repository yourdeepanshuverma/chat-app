import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'

const ConfirmDelete = ({ handleClose, confirmDelete, disabled }) => {
    const { isDeleteChat } = useSelector(state => state.misc)
    return (
        <Dialog open={isDeleteChat} onClose={handleClose}>
            <DialogTitle> Are you sure you want to delete?</DialogTitle>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={confirmDelete} disabled={disabled}>Delete</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmDelete