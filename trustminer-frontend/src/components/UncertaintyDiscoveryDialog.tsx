import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";
import React, {Dispatch, SetStateAction} from "react";

interface DiscoveryDialogProps {
    dialogOpen: boolean,
    setDialogOpen: Dispatch<SetStateAction<boolean>>,
    callWithUncertaintyGeneration(generate: boolean, isUpload: boolean): void
}

export default function UncertaintyDiscoveryDialog(props: DiscoveryDialogProps) {
    const {dialogOpen, setDialogOpen, callWithUncertaintyGeneration} = props

    const handleClose = () => setDialogOpen(false)

    function handleAccept() {
        handleClose()
        callWithUncertaintyGeneration(true, true)
    }

    function handleDecline() {
        handleClose()
        callWithUncertaintyGeneration(false, true)
    }

    return (
        <Dialog
            open={dialogOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">Uncertainties discovered</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    It looks like your BPMN file already contains some uncertainties. <br/>
                    Do you want us to try and discover more?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDecline} color="primary">
                    No
                </Button>
                <Button onClick={handleAccept} color="primary" autoFocus>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    )
}