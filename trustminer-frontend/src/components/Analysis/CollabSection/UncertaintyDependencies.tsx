import React from "react";
import {Card, CardContent, Typography} from "@material-ui/core";

interface DependenciesProps {
    dd: number,
    di: number,
    md: number,
    mi: number
}

export default function UncertaintyDependencies(props: DependenciesProps) {
    const {dd, di, md, mi} = props
    return <Card style={{height: '100%'}}>
        <CardContent>
            <Typography variant="h5" component="h2">
                Uncertainty Dependencies
            </Typography>
            <Typography variant="h6" component="h6">
                Data Influence: {di}
            </Typography>
            <Typography variant="h6" component="h6">
                Data Dependency: {dd}
            </Typography>
            <Typography variant="h6" component="h6">
                Message Influence: {mi}
            </Typography>
            <Typography variant="h6" component="h6">
                Message Dependency: {md}
            </Typography>
        </CardContent>
    </Card>
}