import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import React, {Dispatch, SetStateAction, useState} from "react";
import {useSelectorStyles} from "../../../styles/selector-styles";

interface SelectorProps {
    collaboratorNames: string[],
    setSelected: Dispatch<SetStateAction<string>>
}

export default function CollaboratorSelector(props: SelectorProps) {
    const {collaboratorNames, setSelected} = props
    const [currentValue, setCurrentValue] = useState(collaboratorNames[0])


    function handleChange(e: any) {
        setCurrentValue(e.target.value)
        setSelected(e.target.value)
    }

    const classes = useSelectorStyles();
    return <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="select-collaborator-label">Perspective</InputLabel>
        <Select
            labelId="select-collaborator-label"
            id="select-collaborator"
            value={currentValue}
            onChange={handleChange}
            label="Collaborator"
        >
            {collaboratorNames.map((collaborator) =>
                <MenuItem key={collaborator} value={collaborator}>{collaborator}</MenuItem>)
            }
        </Select>
    </FormControl>
}